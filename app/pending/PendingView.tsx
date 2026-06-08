"use client";

import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";

export interface PendingUser {
  displayName: string;
  email: string;
  checkinFreq: string;
  reviewNote: string | null;
  role: string;
  createdAt: string; // ISO string — serialized from server component
}

export default function PendingView({ user }: { user: PendingUser }) {
  const { t } = useLanguage();
  const isRejected = user.role === "REJECTED";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center">
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

        {/* Status card */}
        <div
          className="cote-card p-8 space-y-5"
          style={{
            borderColor: isRejected ? "#ef444444" : "#ffd70044",
            boxShadow: isRejected ? "0 0 30px #ef444411" : "0 0 30px #ffd70011",
          }}
        >
          {isRejected ? (
            <>
              <div className="text-[10px] tracking-[0.3em] text-[#ef4444]">
                {t.pendingRejectedTag}
              </div>
              <div className="text-lg font-bold text-[#e8e8f0]">
                {t.pendingRejectedGreeting} {user.displayName}
              </div>
              <div className="text-sm text-[#6b7280] leading-relaxed">
                {t.pendingRejectedDesc}
              </div>
              {user.reviewNote && (
                <div
                  className="p-4 border text-xs leading-relaxed"
                  style={{ borderColor: "#ef444422", background: "#ef444408", color: "#9ca3af" }}
                >
                  <div className="text-[10px] tracking-[0.2em] text-[#ef4444] mb-2">
                    {t.pendingReasonTag}
                  </div>
                  {user.reviewNote}
                </div>
              )}
              <div className="text-xs text-[#4b5563]">
                {t.pendingRetryNote}
              </div>
            </>
          ) : (
            <>
              <div className="text-[10px] tracking-[0.3em] text-[#ffd700]">
                {t.pendingWaitTag}
              </div>
              <div className="text-lg font-bold text-[#e8e8f0]">
                {t.pendingWaitGreeting} {user.displayName}
              </div>
              <div className="text-sm text-[#6b7280] leading-relaxed">
                {t.pendingWaitDesc}
              </div>

              {/* Application summary */}
              <div className="space-y-3 pt-2">
                <div className="text-[10px] tracking-[0.2em] text-[#374151]">
                  {t.pendingSummaryTitle}
                </div>
                {[
                  { label: "EMAIL", value: user.email },
                  {
                    label: t.checkinFreqLabel,
                    value: t.pendingCheckinOptions[user.checkinFreq] ?? user.checkinFreq,
                  },
                  {
                    label: "SUBMITTED",
                    value: new Date(user.createdAt).toLocaleDateString(t.dateLocale),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between text-xs border-b border-[#1c1c2e] pb-2"
                  >
                    <span className="text-[#4b5563] tracking-[0.1em]">{label}</span>
                    <span className="text-[#9ca3af] font-mono">{value}</span>
                  </div>
                ))}
              </div>

              {/* Pulse indicator */}
              <div className="flex items-center gap-3 pt-2">
                <div
                  className="w-2 h-2 rounded-full animate-glow-pulse"
                  style={{ background: "#ffd700", boxShadow: "0 0 8px #ffd700" }}
                />
                <div className="text-[10px] tracking-[0.2em] text-[#4b5563]">
                  {t.pendingWaitMsg}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Logout */}
        <form action={logout} className="text-center">
          <button
            type="submit"
            className="text-[10px] tracking-[0.2em] px-6 py-2 border transition-all"
            style={{ borderColor: "#2a2a42", color: "#374151" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#ef444444";
              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a42";
              (e.currentTarget as HTMLButtonElement).style.color = "#374151";
            }}
          >
            LOGOUT →
          </button>
        </form>
      </div>
    </div>
  );
}
