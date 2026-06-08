"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

// ─── Multilingual validation error helpers ─────────────────
// Forms pass a hidden "lang" field so server actions can reply
// in the user's selected language.

function getLang(formData: FormData): string {
  return (formData.get("lang") as string) || "th-jp";
}

const ERRS = {
  invalidEmail: {
    jp: "有効なメールアドレスを入力してください",
    en: "Please enter a valid email address",
    _:  "กรุณากรอก email ที่ถูกต้อง",
  },
  pwdShort: {
    jp: "パスワードは8文字以上必要です",
    en: "Password must be at least 8 characters",
    _:  "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
  },
  pwdWeak: {
    jp: "パスワードは英字と数字を含む必要があります",
    en: "Password must contain letters and numbers",
    _:  "รหัสผ่านต้องมีตัวอักษรและตัวเลขอย่างน้อย 1 ตัว",
  },
  pwdMismatch: {
    jp: "パスワードが一致しません",
    en: "Passwords do not match",
    _:  "รหัสผ่านไม่ตรงกัน",
  },
  nameShort: {
    jp: "名前は2文字以上必要です",
    en: "Name must be at least 2 characters",
    _:  "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร",
  },
  emailRequired: {
    jp: "メールアドレスを入力してください",
    en: "Email is required",
    _:  "กรุณากรอก email",
  },
  passwordRequired: {
    jp: "パスワードを入力してください",
    en: "Password is required",
    _:  "กรุณากรอกรหัสผ่าน",
  },
  wrongCredentials: {
    jp: "メールアドレスまたはパスワードが正しくありません",
    en: "Invalid email or password",
    _:  "Email หรือรหัสผ่านไม่ถูกต้อง",
  },
  emailTaken: {
    jp: "このメールアドレスはすでに使用されています",
    en: "This email is already taken",
    _:  "Email นี้ถูกใช้งานแล้ว",
  },
  checkinRequired: {
    jp: "チェックイン頻度を選択してください",
    en: "Please select a check-in frequency",
    _:  "กรุณาเลือกความถี่เช็คอิน",
  },
  expiredLink: {
    jp: "リセットリンクが期限切れか無効です",
    en: "Reset link has expired or is invalid",
    _:  "Link รีเซ็ตรหัสผ่านหมดอายุหรือไม่ถูกต้อง",
  },
} as const;

type ErrKey = keyof typeof ERRS;

function e(key: ErrKey, lang: string): string {
  const m = ERRS[key];
  if (lang === "jp") return m.jp;
  if (lang === "en") return m.en;
  return m._;
}

function motivationErr(lang: string, n: number): string {
  if (lang === "jp") return `参加動機は50文字以上必要です（現在: ${n}字）`;
  if (lang === "en") return `Motivation must be at least 50 characters (current: ${n})`;
  return `กรุณาอธิบายเหตุผลอย่างน้อย 50 ตัวอักษร (ขณะนี้: ${n})`;
}

function goalsErr(lang: string, n: number): string {
  if (lang === "jp") return `目標は30文字以上必要です（現在: ${n}字）`;
  if (lang === "en") return `Goals must be at least 30 characters (current: ${n})`;
  return `กรุณาระบุเป้าหมายอย่างน้อย 30 ตัวอักษร (ขณะนี้: ${n})`;
}

// ─────────────────────────────────────────────────────────
//  Register
// ─────────────────────────────────────────────────────────

export type RegisterState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    displayName?: string[];
    motivation?: string[];
    goals?: string[];
    checkinFreq?: string[];
  };
  message?: string;
} | undefined;

export async function register(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const lang = getLang(formData);
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const displayName = (formData.get("displayName") as string)?.trim();
  const motivation = (formData.get("motivation") as string)?.trim();
  const goals = (formData.get("goals") as string)?.trim();
  const checkinFreq = (formData.get("checkinFreq") as string)?.trim();

  const errors: NonNullable<RegisterState>["errors"] = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = [e("invalidEmail", lang)];
  }

  if (!password || password.length < 8) {
    errors.password = [e("pwdShort", lang)];
  } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = [e("pwdWeak", lang)];
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = [e("pwdMismatch", lang)];
  }

  if (!displayName || displayName.length < 2) {
    errors.displayName = [e("nameShort", lang)];
  }

  if (!motivation || motivation.length < 50) {
    errors.motivation = [motivationErr(lang, motivation?.length ?? 0)];
  }

  if (!goals || goals.length < 30) {
    errors.goals = [goalsErr(lang, goals?.length ?? 0)];
  }

  if (!checkinFreq) {
    errors.checkinFreq = [e("checkinRequired", lang)];
  }

  if (Object.keys(errors).length > 0) return { errors };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: [e("emailTaken", lang)] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName: displayName!,
      motivation: motivation!,
      goals: goals!,
      checkinFreq: checkinFreq!,
      role: "PENDING",
    },
  });

  redirect("/register-success");
}

// ─────────────────────────────────────────────────────────
//  Login
// ─────────────────────────────────────────────────────────

export type LoginState = {
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
} | undefined;

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const lang = getLang(formData);
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email) return { errors: { email: [e("emailRequired", lang)] } };
  if (!password) return { errors: { password: [e("passwordRequired", lang)] } };

  const user = await prisma.user.findUnique({
    where: { email },
    include: { student: { select: { id: true } } },
  });

  if (!user) {
    return { errors: { general: [e("wrongCredentials", lang)] } };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { errors: { general: [e("wrongCredentials", lang)] } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      studentId: user.student?.id ?? null,
    },
    rememberMe
  );

  if (user.role === "PENDING") redirect("/pending");
  if (user.role === "ADMIN") redirect("/admin");
  redirect("/");
}

// ─────────────────────────────────────────────────────────
//  Logout
// ─────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/login");
}

// ─────────────────────────────────────────────────────────
//  Forgot Password
// ─────────────────────────────────────────────────────────

export type ForgotState = {
  success?: boolean;
  error?: string;
} | undefined;

export async function forgotPassword(
  _prev: ForgotState,
  formData: FormData
): Promise<ForgotState> {
  const lang = getLang(formData);
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: e("emailRequired", lang) };

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to prevent email enumeration
  if (!user) return { success: true };

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpires: expires,
    },
  });

  try {
    await sendPasswordResetEmail(email, token);
  } catch (err) {
    console.error("[email] Failed to send reset email:", err);
  }

  return { success: true };
}

// ─────────────────────────────────────────────────────────
//  Reset Password
// ─────────────────────────────────────────────────────────

export type ResetState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
  success?: boolean;
} | undefined;

export async function resetPassword(
  token: string,
  _prev: ResetState,
  formData: FormData
): Promise<ResetState> {
  const lang = getLang(formData);
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { errors: { password: [e("pwdShort", lang)] } };
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { errors: { password: [e("pwdWeak", lang)] } };
  }
  if (password !== confirmPassword) {
    return { errors: { confirmPassword: [e("pwdMismatch", lang)] } };
  }

  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    return { errors: { general: [e("expiredLink", lang)] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { success: true };
}

// ─────────────────────────────────────────────────────────
//  Get current user (for server components)
// ─────────────────────────────────────────────────────────

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      student: { select: { id: true } },
    },
  });
}
