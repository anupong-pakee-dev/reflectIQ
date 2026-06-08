"use client";

import Link from "next/link";
import { useLanguage } from "@/app/components/LanguageContext";

export default function RegisterSuccessPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      <div className="w-full max-w-md relative z-10 text-center space-y-8">
        <div>
          <div className="text-[11px] tracking-[0.4em] mb-2 text-[#374151]">
            ADVANCED NURTURING HIGH SCHOOL
          </div>
          <div
            className="text-4xl font-bold tracking-[0.15em]"
            style={{ color: "#00d4ff", textShadow: "0 0 30px #00d4ff" }}
          >
            ReflectIQ
          </div>
        </div>

        <div
          className="cote-card p-8 text-left space-y-5"
          style={{ borderColor: "#22c55e44", boxShadow: "0 0 30px #22c55e11" }}
        >
          <div className="text-[10px] tracking-[0.3em] text-[#22c55e]">
            ◉ APPLICATION SUBMITTED / 申請完了
          </div>
          <div className="text-xl font-bold text-[#e8e8f0]">{t.regSuccessTitle}</div>

          <div className="space-y-3 text-xs text-[#6b7280] leading-relaxed">
            <p>{t.regSuccessDesc1}</p>
            <p>{t.regSuccessDesc2}</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {[
              { icon: "◈", text: t.regSuccessStep1, color: "#ffd700" },
              { icon: "◉", text: t.regSuccessStep2, color: "#22c55e" },
              { icon: "◎", text: t.regSuccessStep3, color: "#00d4ff" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span style={{ color: step.color }}>{step.icon}</span>
                <span className="text-[#4b5563]">{step.text}</span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/login"
          className="inline-block px-8 py-3 text-[10px] tracking-[0.25em] border transition-all"
          style={{ borderColor: "#2a2a42", color: "#4b5563" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#00d4ff44";
            (e.currentTarget as HTMLAnchorElement).style.color = "#00d4ff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2a2a42";
            (e.currentTarget as HTMLAnchorElement).style.color = "#4b5563";
          }}
        >
          {t.regSuccessBackBtn}
        </Link>
      </div>
    </div>
  );
}
