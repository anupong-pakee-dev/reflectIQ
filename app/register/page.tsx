"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register, type RegisterState } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";
import { LANG_OPTIONS } from "@/lib/i18n";

const CHECKIN_OPTIONS = [
  { value: "daily",   label: "毎日",  desc: "ทุกวัน" },
  { value: "3x_week", label: "週3回", desc: "3 วัน/สัปดาห์" },
  { value: "weekly",  label: "週1回", desc: "1 วัน/สัปดาห์" },
];

// ─── helper components — defined OUTSIDE the page component ───
// ⚠️ Must NOT be inside RegisterPage — defining components inside
//    another component causes React to remount them on every render,
//    which resets all uncontrolled inputs inside them.

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] mb-2 text-[#4b5563]">
        {label}
      </label>
      {children}
      {error && (
        <div className="mt-1 text-[10px] text-[#ef4444]">{error[0]}</div>
      )}
    </div>
  );
}

// Owns its own length-counter state so typing here does NOT
// trigger a re-render in the parent form.
function CharCountedTextarea({
  name,
  minChars,
  rows = 4,
  placeholder,
  hasError,
}: {
  name: string;
  minChars: number;
  rows?: number;
  placeholder?: string;
  hasError?: boolean;
}) {
  const [len, setLen] = useState(0);
  return (
    <>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all resize-none"
        style={{
          borderColor: hasError ? "#ef444488" : "#2a2a42",
          color: "#e8e8f0",
          fontFamily: "monospace",
        }}
        onChange={(e) => setLen(e.target.value.length)}
      />
      <div
        className="text-right text-[10px] mt-1"
        style={{ color: len >= minChars ? "#22c55e" : "#374151" }}
      >
        {len} / {minChars} min
      </div>
    </>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 justify-end mb-6">
      {LANG_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setLang(opt.value)}
          className="px-2 py-1 text-[9px] tracking-wide transition-all border"
          style={{
            color: lang === opt.value ? "#00d4ff" : "#374151",
            borderColor: lang === opt.value ? "#00d4ff44" : "#1c1c2e",
            background: lang === opt.value ? "#00d4ff11" : "transparent",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Page component ────────────────────────────────────────────

function inputStyle(hasError?: boolean) {
  return {
    borderColor: hasError ? "#ef444488" : "#2a2a42",
    color: "#e8e8f0",
    fontFamily: "monospace",
  } as React.CSSProperties;
}

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    register,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      <div className="w-full max-w-xl relative z-10">
        <LangSwitcher />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-[11px] tracking-[0.4em] mb-2 text-[#374151]">
            ADVANCED NURTURING HIGH SCHOOL
          </div>
          <div
            className="text-4xl font-bold tracking-[0.15em]"
            style={{ color: "#00d4ff", textShadow: "0 0 30px #00d4ff, 0 0 60px #00d4ff44" }}
          >
            ReflectIQ
          </div>
          <div className="text-[10px] tracking-[0.3em] mt-2 text-[#374151]">
            {t.registerPageTitle} / {t.registerPageSub}
          </div>
        </div>

        <div
          className="cote-card p-8 space-y-6"
          style={{ borderColor: "#1c1c2e", boxShadow: "0 0 40px #00d4ff08" }}
        >
          <div className="p-4 border border-[#1c1c2e] bg-[#0b0b14] text-[11px] text-[#4b5563] leading-relaxed">
            {t.adminNotice}
          </div>

          <form action={action} className="space-y-5">
            <input type="hidden" name="lang" value={lang} />
            {/* Email */}
            <Field label={t.emailLabel} error={state?.errors?.email}>
              <input
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={inputStyle(!!state?.errors?.email)}
              />
            </Field>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t.passwordLabel} error={state?.errors?.password}>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="≥8 chars, letter+number"
                  className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                  style={inputStyle(!!state?.errors?.password)}
                />
              </Field>
              <Field label={t.confirmPasswordLabel} error={state?.errors?.confirmPassword}>
                <input
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                  style={inputStyle(!!state?.errors?.confirmPassword)}
                />
              </Field>
            </div>

            {/* Display name */}
            <Field label={t.displayNameLabel} error={state?.errors?.displayName}>
              <input
                name="displayName"
                type="text"
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={inputStyle(!!state?.errors?.displayName)}
              />
            </Field>

            {/* Motivation */}
            <Field label={t.motivationLabel} error={state?.errors?.motivation}>
              <CharCountedTextarea
                name="motivation"
                minChars={50}
                rows={4}
                placeholder={t.motivationPh}
                hasError={!!state?.errors?.motivation}
              />
            </Field>

            {/* Goals */}
            <Field label={t.goalsLabel} error={state?.errors?.goals}>
              <CharCountedTextarea
                name="goals"
                minChars={30}
                rows={3}
                placeholder={t.goalsPh}
                hasError={!!state?.errors?.goals}
              />
            </Field>

            {/* Check-in frequency */}
            <Field label={t.checkinFreqLabel} error={state?.errors?.checkinFreq}>
              <div className="grid grid-cols-3 gap-2">
                {CHECKIN_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex flex-col gap-1 p-3 border cursor-pointer transition-all"
                    style={{ borderColor: "#2a2a42" }}
                  >
                    <input
                      type="radio"
                      name="checkinFreq"
                      value={opt.value}
                      className="sr-only"
                    />
                    <span className="text-[10px] font-bold text-[#e8e8f0]">{t.checkinOptionLabels[opt.value]?.label ?? opt.label}</span>
                    <span className="text-[9px] text-[#4b5563]">{t.checkinOptionLabels[opt.value]?.desc ?? opt.desc}</span>
                  </label>
                ))}
              </div>
              <style>{`
                input[type="radio"]:checked + span { color: #00d4ff !important; }
                label:has(input[type="radio"]:checked) {
                  border-color: #00d4ff44 !important;
                  background: #00d4ff08;
                }
              `}</style>
            </Field>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 text-sm font-bold tracking-[0.25em] border transition-all duration-300"
              style={{
                background: "#00d4ff11",
                borderColor: "#00d4ff",
                color: "#00d4ff",
                boxShadow: "0 0 24px #00d4ff22",
                opacity: pending ? 0.6 : 1,
                cursor: pending ? "not-allowed" : "pointer",
              }}
            >
              {pending ? t.registerBtnLoading : t.registerBtn}
            </button>
          </form>

          <div className="pt-2 border-t border-[#1c1c2e]">
            <div className="text-[10px] tracking-[0.1em] text-center text-[#374151]">
              {t.hasAccountText}{" "}
              <Link
                href="/login"
                className="transition-colors"
                style={{ color: "#4b5563" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
              >
                {t.loginLinkText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
