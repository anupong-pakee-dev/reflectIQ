"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type LoginState } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";
import { LANG_OPTIONS } from "@/lib/i18n";

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

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      <div className="w-full max-w-md relative z-10">
        <LangSwitcher />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-[10px] tracking-[0.5em] mb-3 text-[#1c1c2e]">◈ ◉ ◎ ◆ ◇ ◐</div>
          <div className="text-[11px] tracking-[0.4em] mb-2 text-[#374151]">
            ADVANCED NURTURING HIGH SCHOOL
          </div>
          <div
            className="text-5xl font-bold tracking-[0.15em]"
            style={{ color: "#00d4ff", textShadow: "0 0 30px #00d4ff, 0 0 60px #00d4ff44" }}
          >
            ReflectIQ
          </div>
          <div className="text-[10px] tracking-[0.4em] mt-2 text-[#374151]">
            SELF-MONITORING SYSTEM v0.0.1
          </div>
        </div>

        <div
          className="cote-card p-8 space-y-6"
          style={{ borderColor: "#1c1c2e", boxShadow: "0 0 40px #00d4ff08" }}
        >
          <div>
            <div className="text-[10px] tracking-[0.3em] mb-1 text-[#374151]">
              {t.authRequired}
            </div>
            <div className="text-xs text-[#4b5563]">{t.authSub}</div>
          </div>

          {state?.errors?.general && (
            <div
              className="px-4 py-3 border text-xs"
              style={{ borderColor: "#ef444444", background: "#ef444408", color: "#ef4444" }}
            >
              {state.errors.general[0]}
            </div>
          )}

          <form action={action} className="space-y-4">
            <input type="hidden" name="lang" value={lang} />
            <div>
              <label className="block text-[10px] tracking-[0.3em] mb-2 text-[#4b5563]">
                {t.emailLabel}
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: state?.errors?.email ? "#ef444488" : "#2a2a42",
                  color: "#e8e8f0",
                  fontFamily: "monospace",
                }}
              />
              {state?.errors?.email && (
                <div className="mt-1 text-[10px] text-[#ef4444]">{state.errors.email[0]}</div>
              )}
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] mb-2 text-[#4b5563]">
                {t.passwordLabel}
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: state?.errors?.password ? "#ef444488" : "#2a2a42",
                  color: "#e8e8f0",
                  fontFamily: "monospace",
                }}
              />
              {state?.errors?.password && (
                <div className="mt-1 text-[10px] text-[#ef4444]">{state.errors.password[0]}</div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  name="rememberMe"
                  type="checkbox"
                  className="w-3 h-3 accent-[#00d4ff]"
                />
                <span className="text-[10px] tracking-[0.1em] text-[#4b5563]">
                  {t.rememberMe}
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] tracking-[0.1em] transition-colors"
                style={{ color: "#374151" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
              >
                {t.forgotPwdLink}
              </Link>
            </div>

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
              {pending ? t.loginBtnLoading : t.loginBtn}
            </button>
          </form>

          <div className="pt-2 border-t border-[#1c1c2e]">
            <div className="text-[10px] tracking-[0.1em] text-center text-[#374151]">
              {t.noAccountText}{" "}
              <Link
                href="/register"
                className="transition-colors"
                style={{ color: "#4b5563" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00d4ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#4b5563")}
              >
                {t.registerLinkText}
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="text-[10px] tracking-[0.3em] text-[#1c1c2e]">
            起動シーケンス完了 / BOOT SEQUENCE COMPLETE
          </div>
        </div>
      </div>
    </div>
  );
}
