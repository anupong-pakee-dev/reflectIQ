"use client";

import { useActionState } from "react";
import Link from "next/link";
import { use } from "react";
import { resetPassword, type ResetState } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { t, lang } = useLanguage();
  const { token } = use(params);

  const boundAction = resetPassword.bind(null, token);
  const [state, action, pending] = useActionState<ResetState, FormData>(
    boundAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />
        <div className="w-full max-w-md relative z-10 text-center space-y-8">
          <div
            className="text-4xl font-bold tracking-[0.15em]"
            style={{ color: "#00d4ff", textShadow: "0 0 30px #00d4ff" }}
          >
            ReflectIQ
          </div>
          <div
            className="cote-card p-8 space-y-4"
            style={{ borderColor: "#22c55e44", boxShadow: "0 0 30px #22c55e11" }}
          >
            <div className="text-[10px] tracking-[0.3em] text-[#22c55e]">◉ PASSWORD UPDATED</div>
            <div className="text-sm text-[#e8e8f0]">{t.resetDoneTitle}</div>
            <div className="text-xs text-[#6b7280]">{t.resetDoneDesc}</div>
          </div>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-[10px] tracking-[0.25em] border transition-all"
            style={{ borderColor: "#00d4ff", color: "#00d4ff", background: "#00d4ff11" }}
          >
            LOGIN →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="text-[11px] tracking-[0.4em] mb-2 text-[#374151]">
            ADVANCED NURTURING HIGH SCHOOL
          </div>
          <div
            className="text-4xl font-bold tracking-[0.15em]"
            style={{ color: "#00d4ff", textShadow: "0 0 30px #00d4ff" }}
          >
            ReflectIQ
          </div>
          <div className="text-[10px] tracking-[0.4em] mt-2 text-[#374151]">
            {t.resetPageSub}
          </div>
        </div>

        <div
          className="cote-card p-8 space-y-6"
          style={{ borderColor: "#1c1c2e", boxShadow: "0 0 40px #a855f708" }}
        >
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
                {t.newPasswordLabel}
              </label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="≥8 chars, letter+number"
                autoFocus
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: state?.errors?.password ? "#ef444488" : "#2a2a42",
                  color: "#e8e8f0",
                  fontFamily: "monospace",
                }}
              />
              {state?.errors?.password && (
                <div className="mt-1 text-[10px] text-[#ef4444]">
                  {state.errors.password[0]}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.3em] mb-2 text-[#4b5563]">
                {t.confirmNewPasswordLabel}
              </label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="w-full bg-transparent border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  borderColor: state?.errors?.confirmPassword ? "#ef444488" : "#2a2a42",
                  color: "#e8e8f0",
                  fontFamily: "monospace",
                }}
              />
              {state?.errors?.confirmPassword && (
                <div className="mt-1 text-[10px] text-[#ef4444]">
                  {state.errors.confirmPassword[0]}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 text-sm font-bold tracking-[0.25em] border transition-all duration-300"
              style={{
                background: "#a855f711",
                borderColor: "#a855f7",
                color: "#a855f7",
                boxShadow: "0 0 24px #a855f722",
                opacity: pending ? 0.6 : 1,
                cursor: pending ? "not-allowed" : "pointer",
              }}
            >
              {pending ? t.resetBtnLoading : t.resetBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
