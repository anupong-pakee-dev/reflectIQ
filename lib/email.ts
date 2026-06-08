/**
 * Email sending via nodemailer + Gmail SMTP.
 *
 * Required env vars:
 *   SMTP_USER  — your Gmail address (e.g. you@gmail.com)
 *   SMTP_PASS  — Gmail App Password  (Settings → Security → App Passwords)
 *   FROM_EMAIL — display address (can equal SMTP_USER)
 *   APP_URL    — base URL for links (e.g. http://localhost:3000)
 */
import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS via STARTTLS
    auth: {
      user: process.env.SMTP_USER ?? process.env.FROM_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });
}

const FROM = process.env.FROM_EMAIL ?? process.env.SMTP_USER ?? "noreply@reflectiq.app";
// On Vercel, VERCEL_URL is set automatically (without protocol).
// APP_URL in .env takes priority (set it in production for your custom domain).
const APP_URL =
  process.env.APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

// ─────────────────────────────────────────────────────────
//  Approval email
// ─────────────────────────────────────────────────────────

export async function sendApprovalEmail(
  to: string,
  displayName: string,
  note?: string
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#050508;color:#e8e8f0;font-family:monospace;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;letter-spacing:.4em;color:#374151;margin-bottom:8px;">ADVANCED NURTURING HIGH SCHOOL</div>
      <div style="font-size:28px;font-weight:bold;letter-spacing:.15em;color:#00d4ff;text-shadow:0 0 20px #00d4ff;">ReflectIQ</div>
      <div style="font-size:10px;letter-spacing:.3em;color:#374151;margin-top:4px;">SELF-MONITORING SYSTEM v3.0</div>
    </div>

    <div style="border:1px solid #22c55e44;background:#22c55e08;padding:24px;margin-bottom:24px;">
      <div style="font-size:10px;letter-spacing:.3em;color:#22c55e;margin-bottom:12px;">◉ APPLICATION APPROVED / 申請承認</div>
      <div style="font-size:14px;font-weight:bold;color:#e8e8f0;margin-bottom:8px;">สวัสดี ${displayName},</div>
      <div style="font-size:13px;color:#9ca3af;line-height:1.7;">
        ใบสมัครของคุณได้รับการ <strong style="color:#22c55e">อนุมัติ</strong> แล้ว
        คุณสามารถเข้าสู่ระบบ ReflectIQ ได้ทันที
      </div>
      ${note ? `<div style="margin-top:16px;padding:12px;border:1px solid #1c1c2e;background:#0b0b14;font-size:12px;color:#6b7280;">${note}</div>` : ""}
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${APP_URL}/login"
        style="display:inline-block;padding:12px 32px;border:1px solid #00d4ff;color:#00d4ff;text-decoration:none;font-size:11px;letter-spacing:.25em;background:#00d4ff11;">
        LOGIN → เข้าสู่ระบบ
      </a>
    </div>

    <div style="border-top:1px solid #1c1c2e;padding-top:16px;font-size:10px;color:#374151;text-align:center;">
      <div>ReflectIQ — Advanced Nurturing High School</div>
      <div style="margin-top:4px;">起動シーケンス完了 / BOOT SEQUENCE COMPLETE</div>
    </div>
  </div>
</body>
</html>`;

  await getTransporter().sendMail({
    from: `"ReflectIQ" <${FROM}>`,
    to,
    subject: "【ReflectIQ】ใบสมัครได้รับการอนุมัติแล้ว / Application Approved",
    html,
  });
}

// ─────────────────────────────────────────────────────────
//  Rejection email
// ─────────────────────────────────────────────────────────

export async function sendRejectionEmail(
  to: string,
  displayName: string,
  reason: string
): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#050508;color:#e8e8f0;font-family:monospace;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;letter-spacing:.4em;color:#374151;margin-bottom:8px;">ADVANCED NURTURING HIGH SCHOOL</div>
      <div style="font-size:28px;font-weight:bold;letter-spacing:.15em;color:#00d4ff;text-shadow:0 0 20px #00d4ff;">ReflectIQ</div>
    </div>

    <div style="border:1px solid #ef444444;background:#ef444408;padding:24px;margin-bottom:24px;">
      <div style="font-size:10px;letter-spacing:.3em;color:#ef4444;margin-bottom:12px;">✗ APPLICATION REVIEWED / 審査結果</div>
      <div style="font-size:14px;font-weight:bold;color:#e8e8f0;margin-bottom:8px;">สวัสดี ${displayName},</div>
      <div style="font-size:13px;color:#9ca3af;line-height:1.7;">
        ขออภัย ใบสมัครของคุณยังไม่ผ่านการพิจารณาในขณะนี้
      </div>
      <div style="margin-top:16px;padding:12px;border:1px solid #1c1c2e;background:#0b0b14;">
        <div style="font-size:10px;letter-spacing:.2em;color:#ef4444;margin-bottom:6px;">REASON / เหตุผล</div>
        <div style="font-size:12px;color:#9ca3af;line-height:1.6;">${reason}</div>
      </div>
      <div style="margin-top:16px;font-size:11px;color:#6b7280;">
        หากต้องการสมัครใหม่ กรุณารอ 7 วัน แล้วส่งใบสมัครอีกครั้งพร้อมข้อมูลที่ครบถ้วนกว่านี้
      </div>
    </div>

    <div style="border-top:1px solid #1c1c2e;padding-top:16px;font-size:10px;color:#374151;text-align:center;">
      <div>ReflectIQ — Advanced Nurturing High School</div>
    </div>
  </div>
</body>
</html>`;

  await getTransporter().sendMail({
    from: `"ReflectIQ" <${FROM}>`,
    to,
    subject: "【ReflectIQ】ผลการพิจารณาใบสมัคร / Application Review Result",
    html,
  });
}

// ─────────────────────────────────────────────────────────
//  Password reset email
// ─────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password/${token}`;
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#050508;color:#e8e8f0;font-family:monospace;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;letter-spacing:.4em;color:#374151;margin-bottom:8px;">ADVANCED NURTURING HIGH SCHOOL</div>
      <div style="font-size:28px;font-weight:bold;letter-spacing:.15em;color:#00d4ff;text-shadow:0 0 20px #00d4ff;">ReflectIQ</div>
    </div>

    <div style="border:1px solid #a855f744;background:#a855f708;padding:24px;margin-bottom:24px;">
      <div style="font-size:10px;letter-spacing:.3em;color:#a855f7;margin-bottom:12px;">◈ PASSWORD RESET / パスワードリセット</div>
      <div style="font-size:13px;color:#9ca3af;line-height:1.7;margin-bottom:16px;">
        กด link ด้านล่างเพื่อตั้งรหัสผ่านใหม่
        Link นี้จะหมดอายุใน <strong style="color:#e8e8f0">1 ชั่วโมง</strong>
      </div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:16px;">
        หากคุณไม่ได้ร้องขอ ให้เพิกเฉยต่ออีเมลนี้
      </div>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${resetUrl}"
        style="display:inline-block;padding:12px 32px;border:1px solid #a855f7;color:#a855f7;text-decoration:none;font-size:11px;letter-spacing:.25em;background:#a855f711;">
        RESET PASSWORD →
      </a>
    </div>

    <div style="border-top:1px solid #1c1c2e;padding-top:16px;font-size:10px;color:#374151;text-align:center;">
      <div>ReflectIQ — Advanced Nurturing High School</div>
    </div>
  </div>
</body>
</html>`;

  await getTransporter().sendMail({
    from: `"ReflectIQ" <${FROM}>`,
    to,
    subject: "【ReflectIQ】รีเซ็ตรหัสผ่าน / Password Reset",
    html,
  });
}
