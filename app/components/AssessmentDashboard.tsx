"use client";

import { useState, useTransition, useCallback } from "react";
import RadarChart from "./RadarChart";
import {
  STATS_CONFIG, CLASS_CONFIG, calcOAA, getClassRank, oaaToProgress,
  TOTAL_WEIGHT, SPECIAL_EXAMS, NPC_STUDENTS,
  type StatId, type ClassRank,
} from "@/lib/constants";
import {
  ACHIEVEMENT_DEFS, ACHIEVEMENT_MAP, RARITY_COLOR, RARITY_LABEL,
  type Rarity,
} from "@/lib/achievements";
import {
  addNote,
  adjustPrivatePoints, runSpecialExam, resetStudent,
} from "@/app/actions/student";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";
import { LANG_OPTIONS, type Lang } from "@/lib/i18n";
import ChallengeModal from "@/app/components/ChallengeModal";
import ExamQuizModal from "@/app/components/ExamQuizModal";

// ─── Types ───────────────────────────────────────────────────

type Student = {
  id: string; name: string; studentId: string; createdAt: Date;
  academic: number; physical: number; social: number;
  mental: number; leadership: number; adaptability: number;
  privatePoints: number; classPoints: number;
  checkinStreak: number; lastCheckin: Date | null;
  logs:         { id: string; type: string; message: string; color: string | null; createdAt: Date }[];
  achievements: { id: string; code: string; unlockedAt: Date }[];
  exams:        { id: string; subject: string; score: number; maxScore: number; passed: boolean; examDate: Date }[];
  transactions: { id: string; type: string; amount: number; balance: number; reason: string; createdAt: Date }[];
};

type Tab = "status" | "params" | "points" | "exams" | "achievements";

// ─── Utils ───────────────────────────────────────────────────

function fmtTime(d: Date | string, locale = "th-TH") {
  return new Date(d).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}
function fmtDate(d: Date | string, locale = "th-TH") {
  return new Date(d).toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// ─── Toaster ─────────────────────────────────────────────────

type Toast = { id: string; msg: string; color: string; icon: string };

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, color = "#00d4ff", icon = "◈") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, color, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return { toasts, push };
}

function ToastLayer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-16 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="animate-fade-in-up px-4 py-3 border text-xs max-w-xs"
          style={{ background: "#0b0b14", borderColor: t.color, color: t.color,
            boxShadow: `0 0 12px ${t.color}44` }}>
          <span className="mr-2">{t.icon}</span>{t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── OAA Card ────────────────────────────────────────────────

function OAACard({ oaa, rank, stats, classPoints }:
  { oaa: number; rank: ClassRank; stats: Record<string, number>; classPoints: number }) {
  const { t } = useLanguage();
  const cfg = CLASS_CONFIG[rank];
  const progress = oaaToProgress(oaa, rank);
  const nextRank = rank === "S" ? null :
    (["S","A","B","C","D"] as ClassRank[])[(["S","A","B","C","D"] as ClassRank[]).indexOf(rank) - 1];
  const cl = t.classLabels[rank];

  return (
    <div className="cote-card p-5 relative overflow-hidden"
      style={{ borderColor: `${cfg.color}44`, boxShadow: `0 0 30px ${cfg.glow}, inset 0 0 30px ${cfg.glow}55` }}>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[120px] font-bold select-none pointer-events-none"
        style={{ color: `${cfg.color}08`, lineHeight: 1 }}>{rank}</div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-1">
          <div className="text-[10px] tracking-[0.35em] mb-1" style={{ color: "#4b5563" }}>
            {t.oaaTitle}
          </div>
          <div className="text-8xl font-bold tabular-nums animate-oaa"
            style={{ color: cfg.color, lineHeight: 1, "--glow-color": cfg.color } as React.CSSProperties}>
            {String(oaa).padStart(3, "0")}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="text-xs" style={{ color: "#4b5563" }}> / 100 pts</div>
            <div className="text-xs" style={{ color: "#4b5563" }}>
              CP: <span style={{ color: "#ffd700" }}>{classPoints.toLocaleString()}</span>
            </div>
          </div>

          {nextRank && (
            <div className="mt-3">
              <div className="flex justify-between text-[10px] mb-1">
                <span style={{ color: "#374151" }}>{t.toNextRank} {nextRank}</span>
                <span style={{ color: cfg.color }}>{progress}%</span>
              </div>
              <div className="h-1 bg-[#1c1c2e] rounded-full overflow-hidden w-48">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
              </div>
              <div className="text-[9px] mt-1" style={{ color: "#374151" }}>
                {t.needsPts} {CLASS_CONFIG[nextRank].min} pts
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] tracking-[0.3em]" style={{ color: "#4b5563" }}>{t.labelClass}</div>
          <div className="animate-rank w-24 h-24 flex items-center justify-center border-2"
            style={{ borderColor: cfg.color,
              boxShadow: `0 0 24px ${cfg.color}66, inset 0 0 24px ${cfg.glow}`,
              background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)` }}>
            <span className="text-5xl font-bold"
              style={{ color: cfg.color, textShadow: `0 0 20px ${cfg.color}` }}>{rank}</span>
          </div>
          <div className="text-[10px] tracking-[0.15em]" style={{ color: cfg.color }}>{cl.sub}</div>
          <div className="text-[9px]" style={{ color: "#374151" }}>{cl.label}</div>
        </div>

        <div className="hidden lg:flex flex-col gap-1">
          {(["S","A","B","C","D"] as ClassRank[]).map((r) => {
            const c = CLASS_CONFIG[r];
            const cl2 = t.classLabels[r];
            const maxPts: Record<ClassRank, number> = { S: 100, A: 89, B: 74, C: 54, D: 34 };
            return (
              <div key={r} className="flex items-center gap-2 px-2 py-0.5 text-[10px]"
                style={{ background: r === rank ? `${c.color}18` : "transparent",
                  border: r === rank ? `1px solid ${c.color}44` : "1px solid transparent" }}>
                <span className="font-bold w-3" style={{ color: c.color }}>{r}</span>
                <span style={{ color: "#4b5563" }}>{c.min}–{maxPts[r]}</span>
                <span style={{ color: "#374151" }}>{cl2.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Student ID Card ─────────────────────────────────────────

function StudentIDCard({ student, oaa, rank }:
  { student: Student; oaa: number; rank: ClassRank }) {
  const { t } = useLanguage();
  const cfg = CLASS_CONFIG[rank];
  const streak = student.checkinStreak;

  return (
    <div className="cote-card p-5 relative overflow-hidden"
      style={{ borderColor: "#2a2a42", background: "linear-gradient(135deg, #0b0b14 0%, #0f0f1e 100%)" }}>
      <div className="absolute top-0 left-0 w-full h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}88, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}44, transparent)` }} />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="shrink-0 w-20 h-24 border-2 flex items-center justify-center relative"
          style={{ borderColor: cfg.color, boxShadow: `0 0 12px ${cfg.color}44`,
            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 80%)` }}>
          <div className="text-3xl font-bold" style={{ color: cfg.color }}>{student.name[0]}</div>
          <div className="absolute bottom-0 left-0 right-0 text-center text-[9px] py-0.5"
            style={{ background: `${cfg.color}22`, color: cfg.color, borderTop: `1px solid ${cfg.color}44` }}>
            {rank} {t.labelClass}
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div>
            <div className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>{t.labelStudentName}</div>
            <div className="text-xl font-bold" style={{ color: "#e8e8f0" }}>{student.name}</div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
            <div>
              <span style={{ color: "#374151" }}>ID › </span>
              <span style={{ color: "#e8e8f0" }}>{student.studentId}</span>
            </div>
            <div>
              <span style={{ color: "#374151" }}>OAA › </span>
              <span style={{ color: cfg.color }} className="font-bold">{oaa}</span>
            </div>
            <div>
              <span style={{ color: "#374151" }}>{t.labelEnrollDate} › </span>
              <span style={{ color: "#e8e8f0" }}>{fmtDate(student.createdAt, t.dateLocale)}</span>
            </div>
            <div>
              <span style={{ color: "#374151" }}>{t.labelStreak} › </span>
              <span style={{ color: streak >= 7 ? "#ffd700" : "#e8e8f0" }}>{streak}{t.streakUnit}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: "#374151" }}>{t.labelPrivatePoints}</div>
          <div className="text-3xl font-bold tabular-nums"
            style={{ color: "#ffd700", textShadow: "0 0 12px #ffd70088" }}>
            {student.privatePoints.toLocaleString()}
          </div>
          <div className="text-[10px]" style={{ color: "#374151" }}>P</div>
          <div className="mt-2 text-[10px]" style={{ color: "#374151" }}>{t.labelClassPoints}</div>
          <div className="text-lg font-bold" style={{ color: "#00d4ff" }}>
            {student.classPoints.toLocaleString()} CP
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card (read-only) ────────────────────────────────────

function StatCard({ config, value, onPractice }:
  { config: (typeof STATS_CONFIG)[0]; value: number; onPractice?: () => void }) {
  const { t } = useLanguage();
  const ts = t.stats[config.id];

  return (
    <div className="cote-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span style={{ color: config.color }} className="text-sm">{config.icon}</span>
            <span style={{ color: config.color }} className="text-sm font-bold tracking-wider">{ts.name}</span>
            {ts.nameSub && (
              <span className="text-xs" style={{ color: "#4b5563" }}>{ts.nameSub}</span>
            )}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: "#374151" }}>{ts.desc}</div>
        </div>
        <div className="text-2xl font-bold tabular-nums"
          style={{ color: config.color, textShadow: `0 0 10px ${config.color}88`, minWidth: "2.5rem", textAlign: "right" }}>
          {value}
        </div>
      </div>
      <div className="relative h-2 bg-[#1c1c2e] rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${value}%`,
            background: `linear-gradient(90deg, ${config.color}66, ${config.color})`,
            boxShadow: `0 0 8px ${config.color}55`, transition: "width 0.5s ease" }} />
      </div>
      <div className="flex justify-between mt-1.5">
        {[0, 25, 50, 75, 100].map((tick) => (
          <span key={tick} className="text-[9px]" style={{ color: "#1c1c2e" }}>{tick}</span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[9px]" style={{ color: "#374151" }}>WEIGHT</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-2 h-1 rounded-sm"
                style={{ background: i < Math.round(config.weight * 2) ? `${config.color}88` : "#1c1c2e" }} />
            ))}
          </div>
          <span className="text-[9px]" style={{ color: "#374151" }}>×{config.weight}</span>
        </div>
        <span className="text-[9px] tracking-wide" style={{ color: "#1c1c2e" }}>SYSTEM ASSESSED</span>
      </div>
      {onPractice && (
        <button onClick={onPractice}
          className="mt-3 w-full py-2 text-[10px] font-bold tracking-[0.25em] border transition-all"
          style={{ borderColor: `${config.color}55`, color: config.color, background: `${config.color}08` }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${config.color}18`; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${config.color}08`; }}>
          {t.challengePracticeBtn}
        </button>
      )}
    </div>
  );
}

// ─── Points Panel ─────────────────────────────────────────────

function PointsPanel({ student, onAdjust }:
  { student: Student; onAdjust: (delta: number, reason: string) => void }) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleAdjust = (sign: 1 | -1) => {
    const n = parseInt(amount);
    if (!n || n <= 0 || !reason.trim()) return;
    onAdjust(sign * n, reason.trim());
    setAmount("");
    setReason("");
  };

  const valid = parseInt(amount) > 0 && reason.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="cote-card p-5">
        <div className="text-[10px] tracking-[0.3em] mb-3" style={{ color: "#374151" }}>{t.balanceTitle}</div>
        <div className="text-5xl font-bold tabular-nums"
          style={{ color: "#ffd700", textShadow: "0 0 20px #ffd70066" }}>
          {student.privatePoints.toLocaleString()}
        </div>
        <div className="text-sm mt-1" style={{ color: "#374151" }}>P</div>
        <div className="mt-2 text-xs" style={{ color: "#4b5563" }}>
          {t.labelClassPoints}: <span style={{ color: "#00d4ff" }}>{student.classPoints.toLocaleString()} CP</span>
          &nbsp;&nbsp;|&nbsp;&nbsp;{t.labelStreak}: <span style={{ color: "#eab308" }}>{student.checkinStreak}{t.streakUnit}</span>
        </div>
      </div>

      <div className="cote-card p-5">
        <div className="text-[10px] tracking-[0.3em] mb-4" style={{ color: "#374151" }}>{t.adjustTitle}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[10px] tracking-[0.2em] mb-1 block" style={{ color: "#374151" }}>{t.amountLabel}</label>
            <input type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent border px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#2a2a42", color: "#e8e8f0" }} />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.2em] mb-1 block" style={{ color: "#374151" }}>{t.reasonLabel}</label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder={t.reasonPlaceholder}
              className="w-full bg-transparent border px-3 py-2 text-xs outline-none"
              style={{ borderColor: "#2a2a42", color: "#e8e8f0" }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleAdjust(1)} disabled={!valid}
            className="py-2.5 text-xs font-bold tracking-[0.2em] border transition-all"
            style={{ borderColor: valid ? "#22c55e44" : "#1c1c2e", color: valid ? "#22c55e" : "#374151",
              background: valid ? "#22c55e11" : "transparent", cursor: valid ? "pointer" : "not-allowed" }}>
            {t.btnAdd}
          </button>
          <button onClick={() => handleAdjust(-1)} disabled={!valid}
            className="py-2.5 text-xs font-bold tracking-[0.2em] border transition-all"
            style={{ borderColor: valid ? "#ef444444" : "#1c1c2e", color: valid ? "#ef4444" : "#374151",
              background: valid ? "#ef444411" : "transparent", cursor: valid ? "pointer" : "not-allowed" }}>
            {t.btnSubtract}
          </button>
        </div>
      </div>

      <div className="cote-card">
        <div className="px-4 py-2 border-b border-[#1c1c2e] text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>
          {t.txTitle}
        </div>
        <div className="max-h-48 overflow-y-auto">
          {student.transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-4 py-2 border-b border-[#0f0f18] text-[11px]">
              <div className="flex gap-3 items-center min-w-0">
                <span style={{ color: "#374151" }}>{fmtDate(tx.createdAt)}</span>
                <span className="truncate" style={{ color: "#6b7280" }}>{tx.reason}</span>
              </div>
              <span className="shrink-0 font-bold ml-3"
                style={{ color: tx.amount >= 0 ? "#22c55e" : "#ef4444" }}>
                {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString()}P
              </span>
            </div>
          ))}
          {student.transactions.length === 0 && (
            <div className="text-center py-6 text-[10px]" style={{ color: "#374151" }}>— {t.noTx} —</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Exams Panel ─────────────────────────────────────────────

function ExamsPanel({ student, onOpenQuiz }:
  { student: Student; onOpenQuiz: (subjectId: string, subjectLabel: string) => void }) {
  const { t } = useLanguage();

  // Build a set of quiz-completed subjects (maxScore=20 marks a quiz result)
  const doneSubjects = new Set(
    student.exams.filter((e) => e.maxScore === 20).map((e) => e.subject)
  );
  const quizResults: Record<string, typeof student.exams[0]> = {};
  student.exams.filter((e) => e.maxScore === 20).forEach((e) => {
    quizResults[e.subject] = e;
  });

  return (
    <div className="space-y-4">
      {/* Subject grid */}
      <div className="cote-card p-5">
        <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: "#374151" }}>
          {t.examRecordTitle}
        </div>
        <div className="text-xs mb-4" style={{ color: "#4b5563" }}>
          {t.examQuizDesc ?? "ข้อสอบ 20 ข้อต่อวิชา · ข้อละ 1 คะแนน · ทำได้ครั้งเดียว"}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {t.examSubjects.map((s) => {
            const done = doneSubjects.has(s.id);
            const res = quizResults[s.id];
            return (
              <div key={s.id}
                className="p-3 border text-xs flex flex-col gap-1"
                style={{
                  borderColor: done ? (res?.passed ? "#22c55e44" : "#ef444444") : "#2a2a42",
                  background: done ? (res?.passed ? "#22c55e08" : "#ef444408") : "transparent",
                }}>
                <div className="font-bold" style={{ color: done ? (res?.passed ? "#22c55e" : "#ef4444") : "#e8e8f0" }}>
                  {s.label}
                </div>
                {s.labelSub && (
                  <div className="text-[9px]" style={{ color: "#374151" }}>{s.labelSub}</div>
                )}
                {done && res ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold tabular-nums"
                      style={{ color: res.passed ? "#22c55e" : "#ef4444" }}>
                      {res.score}/{res.maxScore}
                    </span>
                    <span className="text-[10px]"
                      style={{ color: res.passed ? "#22c55e" : "#ef4444" }}>
                      {res.passed ? t.passLabel : t.failLabel}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenQuiz(s.id, s.label)}
                    className="mt-1 py-1.5 text-[10px] font-bold tracking-[0.15em] border transition-all"
                    style={{ borderColor: "#00d4ff", color: "#00d4ff", background: "#00d4ff08" }}>
                    {t.examQuizStart ?? "เริ่มสอบ ▶"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam history */}
      <div className="cote-card">
        <div className="px-4 py-2 border-b border-[#1c1c2e] text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>
          {t.examHistoryTitle}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {student.exams.map((ex) => {
            const p = Math.round((ex.score / ex.maxScore) * 100);
            const subLabel = t.examSubjects.find((s) => s.id === ex.subject)?.label ?? ex.subject;
            return (
              <div key={ex.id} className="flex items-center gap-4 px-4 py-2.5 border-b border-[#0f0f18]">
                <span className="text-[10px] w-12 shrink-0" style={{ color: "#374151" }}>{fmtDate(ex.examDate)}</span>
                <span className="text-xs flex-1" style={{ color: "#6b7280" }}>{subLabel}</span>
                <span className="text-xs tabular-nums" style={{ color: "#e8e8f0" }}>{ex.score}/{ex.maxScore}</span>
                <span className="text-xs tabular-nums w-10 text-right" style={{ color: ex.passed ? "#22c55e" : "#ef4444" }}>
                  {p}%
                </span>
                <span className="text-[10px] w-8 text-right font-bold"
                  style={{ color: ex.passed ? "#22c55e" : "#ef4444" }}>
                  {ex.passed ? t.passLabel[0] : t.failLabel[0]}
                </span>
              </div>
            );
          })}
          {student.exams.length === 0 && (
            <div className="text-center py-6 text-[10px]" style={{ color: "#374151" }}>— {t.noExams} —</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Achievements Panel ───────────────────────────────────────

function AchievementsPanel({ unlockedCodes }:
  { unlockedCodes: Set<string> }) {
  const { t, lang } = useLanguage();
  const grouped = (["legendary", "epic", "rare", "common"] as Rarity[]).map((r) => ({
    rarity: r,
    defs: ACHIEVEMENT_DEFS.filter((a) => a.rarity === r),
  }));

  return (
    <div className="space-y-6">
      {grouped.map(({ rarity, defs }) => (
        <div key={rarity}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] tracking-[0.3em] font-bold" style={{ color: RARITY_COLOR[rarity] }}>
              {RARITY_LABEL[rarity]}
            </span>
            <div className="flex-1 h-px" style={{ background: `${RARITY_COLOR[rarity]}33` }} />
            <span className="text-[10px]" style={{ color: "#374151" }}>
              {defs.filter((d) => unlockedCodes.has(d.code)).length}/{defs.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {defs.map((def) => {
              const unlocked = unlockedCodes.has(def.code);
              return (
                <div key={def.code} className="cote-card p-3 text-center"
                  style={{ borderColor: unlocked ? `${def.color}44` : "#1c1c2e",
                    background: unlocked ? `${def.color}08` : "#0b0b14",
                    opacity: unlocked ? 1 : 0.35 }}>
                  <div className="text-2xl mb-1" style={{ color: unlocked ? def.color : "#374151",
                    filter: unlocked ? `drop-shadow(0 0 6px ${def.color})` : "none" }}>
                    {def.icon}
                  </div>
                  <div className="text-xs font-bold" style={{ color: unlocked ? def.color : "#374151" }}>
                    {def.title}
                  </div>
                  {lang !== "jp" && (
                    <div className="text-[10px] mt-0.5" style={{ color: unlocked ? "#6b7280" : "#1c1c2e" }}>
                      {def.titleTh}
                    </div>
                  )}
                  <div className="text-[9px] mt-1" style={{ color: "#374151" }}>
                    {unlocked ? (lang === "jp" ? def.descJp : def.desc) : t.lockedDesc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Special Exam Modal ───────────────────────────────────────

function SpecialExamModal({ onClose, onRun, stats }:
  { onClose: () => void; onRun: (examId: string) => void; stats: Record<string, number> }) {
  const { t, lang } = useLanguage();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl cote-card p-6"
        style={{ borderColor: "#ffd70044", boxShadow: "0 0 40px #ffd70022" }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>ADVANCED NURTURING HS</div>
            <div className="text-lg font-bold" style={{ color: "#ffd700" }}>{t.specialExamTitle}</div>
          </div>
          <button onClick={onClose} className="text-xs px-3 py-1.5 border"
            style={{ borderColor: "#2a2a42", color: "#6b7280" }}>{t.specialExamClose}</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SPECIAL_EXAMS.map((exam) => {
            const current = stats[exam.targetStat] ?? 0;
            const canPass = current >= exam.requirement;
            const cfg = STATS_CONFIG.find((s) => s.id === exam.targetStat)!;
            const ts = t.stats[exam.targetStat];
            return (
              <button key={exam.id} onClick={() => onRun(exam.id)}
                className="text-left p-4 border transition-all hover:scale-[1.02]"
                style={{ borderColor: `${exam.color}44`, background: `${exam.color}08` }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs font-bold" style={{ color: exam.color }}>
                      {lang === "jp" ? exam.titleJp : exam.title}
                    </div>
                    {lang !== "jp" && (
                      <div className="text-[10px]" style={{ color: "#374151" }}>{exam.titleJp}</div>
                    )}
                  </div>
                  <div className="text-[10px] font-bold px-2 py-0.5 border"
                    style={{ borderColor: canPass ? "#22c55e44" : "#ef444444",
                      color: canPass ? "#22c55e" : "#ef4444",
                      background: canPass ? "#22c55e11" : "#ef444411" }}>
                    {canPass ? t.canPass : t.willFail}
                  </div>
                </div>
                <div className="text-[10px] mb-2" style={{ color: "#6b7280" }}>
                  {lang === "jp" ? exam.descJp : exam.desc}
                </div>
                <div className="flex justify-between text-[10px]">
                  <div>
                    <span style={{ color: "#374151" }}>{ts.name}: </span>
                    <span style={{ color: exam.color }}>{current}</span>
                    <span style={{ color: "#374151" }}> / {exam.requirement} {t.requiredLabel}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-[10px]">
                  <div><span style={{ color: "#22c55e" }}>✓ +{exam.passReward.classPoints}CP</span></div>
                  <div><span style={{ color: "#ef4444" }}>✗ -{exam.failPenalty.classPoints}CP</span></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Compare Panel ────────────────────────────────────────────

function ComparePanel({ oaa }: { oaa: number }) {
  const { t } = useLanguage();
  const sorted = [...NPC_STUDENTS, { name: t.youLabel, nameRomaji: "You", classRank: getClassRank(oaa), oaa }]
    .sort((a, b) => b.oaa - a.oaa);

  return (
    <div className="cote-card p-4">
      <div className="text-[10px] tracking-[0.3em] mb-4" style={{ color: "#374151" }}>
        {t.compareTitle}
      </div>
      <div className="space-y-2">
        {sorted.map((s, i) => {
          const isYou = s.nameRomaji === "You";
          const cfg = CLASS_CONFIG[s.classRank];
          return (
            <div key={s.name} className="flex items-center gap-3" style={{ opacity: isYou ? 1 : 0.65 }}>
              <span className="text-[10px] w-4 tabular-nums" style={{ color: "#374151" }}>#{i + 1}</span>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color }} />
              <span className="text-xs flex-1" style={{ color: isYou ? "#e8e8f0" : "#6b7280", fontWeight: isYou ? "bold" : "normal" }}>
                {s.name}
                {isYou && <span className="ml-1 text-[10px]" style={{ color: "#ffd700" }}>← {t.youLabel}</span>}
              </span>
              <span className="text-[10px] w-4 font-bold" style={{ color: cfg.color }}>{s.classRank}</span>
              <div className="w-24 h-1 bg-[#1c1c2e] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.oaa}%`, background: cfg.color }} />
              </div>
              <span className="text-[10px] tabular-nums w-6 text-right" style={{ color: cfg.color }}>{s.oaa}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function AssessmentDashboard({ initial }: { initial: Student }) {
  const { lang, setLang, t } = useLanguage();
  const [student, setStudent] = useState(initial);
  const [tab, setTab] = useState<Tab>("status");
  const [isPending, startTransition] = useTransition();
  const [showSpecialExam, setShowSpecialExam] = useState(false);
  const [challengeStat, setChallengeStat] = useState<StatId | null>(null);
  const [quizSubject, setQuizSubject] = useState<{ id: string; label: string } | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const { toasts, push: pushToast } = useToast();

  const stats = {
    academic: student.academic, physical: student.physical,
    social: student.social,     mental: student.mental,
    leadership: student.leadership, adaptability: student.adaptability,
  };
  const oaa = calcOAA(stats);
  const rank = getClassRank(oaa);

  const radarStats = STATS_CONFIG.map((s) => ({
    id: s.id, value: stats[s.id as keyof typeof stats], color: s.color,
  }));

  const unlockedCodes = new Set(student.achievements.map((a) => a.code));

  // ── Handlers ───────────────────────────────────────────────


  const handleNote = useCallback(() => {
    if (!noteInput.trim()) return;
    startTransition(async () => {
      await addNote(noteInput.trim());
      pushToast(t.noteBtn.replace(" ▶", ""), "#6b7280", "◆");
    });
    setNoteInput("");
  }, [noteInput, pushToast, t]);

  const handleOpenQuiz = useCallback((subjectId: string, subjectLabel: string) => {
    setQuizSubject({ id: subjectId, label: subjectLabel });
  }, []);

  const handleQuizResult = useCallback((score: number, total: number, passed: boolean) => {
    pushToast(
      `${passed ? t.passLabel : t.failLabel} ${score}/${total}`,
      passed ? "#22c55e" : "#ef4444",
      "◎"
    );
  }, [pushToast, t]);

  const handleAdjustPoints = useCallback((delta: number, reason: string) => {
    startTransition(async () => {
      const res = await adjustPrivatePoints(delta, reason);
      setStudent((s) => ({ ...s, privatePoints: res.newBalance }));
      pushToast(
        `${delta > 0 ? "+" : ""}${delta.toLocaleString()}P — ${reason}`,
        delta > 0 ? "#22c55e" : "#ef4444",
        delta > 0 ? "◉" : "◆"
      );
    });
  }, [pushToast]);

  const handleSpecialExam = useCallback((examId: string) => {
    setShowSpecialExam(false);
    startTransition(async () => {
      const res = await runSpecialExam(examId);
      setStudent((s) => ({ ...s, classPoints: res.newCP }));
      pushToast(
        res.passed ? `${t.canPass} +${res.cpDelta}CP` : `${t.willFail} -${Math.abs(res.cpDelta)}CP`,
        res.passed ? "#ffd700" : "#ef4444", res.passed ? "◈" : "✗"
      );
    });
  }, [pushToast, t]);

  const handleReset = useCallback(() => {
    if (confirm("รีเซ็ตทุกอย่าง? ข้อมูลจะถูกลบออกจาก database")) {
      startTransition(() => resetStudent());
    }
  }, []);

  const TABS = [
    { id: "status"       as Tab, label: t.tabStatus,       sub: t.tabStatusSub },
    { id: "params"       as Tab, label: t.tabParams,       sub: t.tabParamsSub },
    { id: "points"       as Tab, label: t.tabPoints,       sub: t.tabPointsSub },
    { id: "exams"        as Tab, label: t.tabExams,        sub: t.tabExamsSub },
    { id: "achievements" as Tab, label: t.tabAchievements, sub: t.tabAchievementsSub },
  ];

  return (
    <>
      <ToastLayer toasts={toasts} />
      {showSpecialExam && (
        <SpecialExamModal onClose={() => setShowSpecialExam(false)} onRun={handleSpecialExam} stats={stats} />
      )}
      {quizSubject && (
        <ExamQuizModal
          subject={quizSubject.id}
          subjectLabel={quizSubject.label}
          onClose={() => setQuizSubject(null)}
          onResult={handleQuizResult}
        />
      )}
      {challengeStat && (
        <ChallengeModal
          statId={challengeStat}
          onClose={(cpDelta) => {
            setChallengeStat(null);
            if (cpDelta !== 0) {
              setStudent(s => ({ ...s, classPoints: Math.round((s.classPoints + cpDelta) * 100) / 100 }));
              pushToast(
                `${cpDelta >= 0 ? "+" : ""}${cpDelta.toFixed(2)} CP`,
                cpDelta >= 0 ? "#22c55e" : "#ef4444",
                cpDelta >= 0 ? "◉" : "◆"
              );
            }
          }}
        />
      )}

      <div className="min-h-screen bg-[#050508] text-[#e8e8f0]">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.35 }} />

        {/* Header */}
        <header className="sticky top-0 z-40 border-b backdrop-blur-sm"
          style={{ borderColor: "#1c1c2e", background: "#050508ee" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-base font-bold tracking-[0.2em]"
                style={{ color: "#00d4ff", textShadow: "0 0 12px #00d4ff88" }}>ReflectIQ</div>
              <div className="text-[9px] tracking-[0.3em]" style={{ color: "#374151" }}>
                {t.systemTagline}
              </div>
            </div>

            <div className="flex items-center gap-5 text-[10px]">
              <span style={{ color: "#374151" }}>{t.labelStudent} › <span style={{ color: "#e8e8f0" }}>{student.name}</span></span>
              <span style={{ color: "#374151" }}>OAA › <span style={{ color: CLASS_CONFIG[rank].color }} className="font-bold">{oaa}</span></span>
              <span style={{ color: "#374151" }}>PP › <span style={{ color: "#ffd700" }}>{student.privatePoints.toLocaleString()}</span></span>
              {isPending && <span className="animate-glow-pulse text-[10px]" style={{ color: "#00d4ff" }}>●</span>}
            </div>

            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="flex items-center gap-1 border px-2 py-1" style={{ borderColor: "#1c1c2e" }}>
                <span className="text-[9px] mr-1" style={{ color: "#374151" }}>{t.langLabel}</span>
                {LANG_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setLang(opt.value)}
                    className="px-2 py-0.5 text-[9px] tracking-wide transition-all"
                    style={{
                      color: lang === opt.value ? "#00d4ff" : "#374151",
                      background: lang === opt.value ? "#00d4ff11" : "transparent",
                      borderBottom: lang === opt.value ? "1px solid #00d4ff" : "1px solid transparent",
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowSpecialExam(true)}
                className="px-3 py-1.5 text-[10px] tracking-widest border transition-all hover:bg-[#ffd70011]"
                style={{ borderColor: "#ffd70033", color: "#ffd700" }}>{t.btnSpecialExam}</button>
              <form action={logout} className="inline">
                <button type="submit"
                  className="px-3 py-1.5 text-[10px] tracking-widest border transition-all hover:bg-[#ef444411]"
                  style={{ borderColor: "#2a2a42", color: "#374151" }}>{t.btnLogout}</button>
              </form>
            </div>
          </div>

          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-4 flex gap-0 border-t" style={{ borderColor: "#1c1c2e" }}>
            {TABS.map((tb) => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className="px-4 py-2 text-[10px] tracking-[0.2em] transition-all relative"
                style={{ color: tab === tb.id ? "#00d4ff" : "#4b5563",
                  borderBottom: tab === tb.id ? "1px solid #00d4ff" : "1px solid transparent" }}>
                {tb.label}
                {tb.sub && <span className="ml-1 text-[9px]" style={{ color: "#374151" }}>{tb.sub}</span>}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">

          {/* STATUS tab */}
          {tab === "status" && (
            <div className="space-y-6">
              <StudentIDCard student={student} oaa={oaa} rank={rank} />
              <OAACard oaa={oaa} rank={rank} stats={stats} classPoints={student.classPoints} />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="cote-card p-4">
                  <div className="text-[10px] tracking-[0.3em] mb-4" style={{ color: "#374151" }}>{t.radarTitle}</div>
                  <div className="flex justify-center">
                    <RadarChart stats={radarStats} lang={lang} />
                  </div>
                </div>

                <div className="cote-card p-4">
                  <div className="text-[10px] tracking-[0.3em] mb-3" style={{ color: "#374151" }}>{t.paramRankTitle}</div>
                  <div className="space-y-2">
                    {[...STATS_CONFIG].sort((a, b) => stats[b.id as keyof typeof stats] - stats[a.id as keyof typeof stats]).map((cfg, i) => (
                      <div key={cfg.id} className="flex items-center gap-2">
                        <span className="text-[10px] w-4" style={{ color: "#374151" }}>#{i + 1}</span>
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }} />
                        <span className="text-[11px] w-14" style={{ color: cfg.color }}>{t.stats[cfg.id].name}</span>
                        <div className="flex-1 h-1 bg-[#1c1c2e] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-400"
                            style={{ width: `${stats[cfg.id as keyof typeof stats]}%`, background: cfg.color }} />
                        </div>
                        <span className="text-[11px] font-bold tabular-nums w-6 text-right" style={{ color: cfg.color }}>
                          {stats[cfg.id as keyof typeof stats]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t text-[10px]" style={{ borderColor: "#1c1c2e", color: "#374151" }}>
                    <div className="flex justify-between">
                      <span>Σ(stat × weight) / {TOTAL_WEIGHT}</span>
                      <span style={{ color: CLASS_CONFIG[rank].color }} className="font-bold">= {oaa}</span>
                    </div>
                  </div>
                </div>

                <ComparePanel oaa={oaa} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 cote-card flex flex-col" style={{ maxHeight: "320px" }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-[#1c1c2e]">
                    <span className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>{t.activityLogTitle}</span>
                    <span className="text-[10px]" style={{ color: "#374151" }}>{student.logs.length} {t.entriesLabel}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
                    {student.logs.map((log) => (
                      <div key={log.id} className="animate-log flex gap-3 items-start">
                        <span className="text-[10px] tabular-nums shrink-0" style={{ color: "#374151" }}>{fmtTime(log.createdAt, t.dateLocale)}</span>
                        <span className="text-[11px] leading-tight" style={{ color: log.color ?? "#6b7280" }}>{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cote-card p-4 flex flex-col gap-3">
                  <div className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>{t.noteTitle}</div>
                  <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)}
                    rows={4} placeholder={t.notePlaceholder}
                    className="flex-1 bg-transparent border px-3 py-2 text-xs outline-none resize-none"
                    style={{ borderColor: "#2a2a42", color: "#6b7280" }} />
                  <button onClick={handleNote} disabled={!noteInput.trim()}
                    className="w-full py-2 text-[10px] tracking-widest border transition-all"
                    style={{ borderColor: noteInput.trim() ? "#2a2a42" : "#1c1c2e",
                      color: noteInput.trim() ? "#6b7280" : "#374151",
                      cursor: noteInput.trim() ? "pointer" : "not-allowed" }}>
                    {t.noteBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PARAMETERS tab — read-only, set by system assessment */}
          {tab === "params" && (
            <div className="space-y-4">
              <div className="cote-card px-4 py-3 flex items-center gap-3"
                style={{ borderColor: "#ffd70033", background: "#ffd70008" }}>
                <span style={{ color: "#ffd700" }}>◈</span>
                <div className="text-[10px] leading-relaxed" style={{ color: "#6b7280" }}>
                  {t.paramsReadOnlyNote ?? "ค่าพารามิเตอร์ถูกกำหนดโดยระบบจากผลการประเมินเบื้องต้น ไม่สามารถแก้ไขด้วยตนเองได้"}
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {STATS_CONFIG.map((cfg) => (
                    <StatCard key={cfg.id} config={cfg}
                      value={stats[cfg.id as keyof typeof stats]}
                      onPractice={() => setChallengeStat(cfg.id as StatId)} />
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="cote-card p-4">
                    <div className="text-[10px] tracking-[0.3em] mb-4" style={{ color: "#374151" }}>ABILITY RADAR</div>
                    <RadarChart stats={radarStats} lang={lang} />
                  </div>
                  <OAACard oaa={oaa} rank={rank} stats={stats} classPoints={student.classPoints} />
                </div>
              </div>
            </div>
          )}

          {/* POINTS tab */}
          {tab === "points" && (
            <PointsPanel student={student} onAdjust={handleAdjustPoints} />
          )}

          {/* EXAMS tab */}
          {tab === "exams" && (
            <ExamsPanel student={student} onOpenQuiz={handleOpenQuiz} />
          )}

          {/* ACHIEVEMENTS tab */}
          {tab === "achievements" && (
            <div className="space-y-4">
              <div className="cote-card p-4 flex items-center gap-6">
                <div>
                  <div className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>{t.achievementTotal}</div>
                  <div className="text-4xl font-bold" style={{ color: "#ffd700" }}>
                    {unlockedCodes.size}<span className="text-lg" style={{ color: "#374151" }}>/{ACHIEVEMENT_DEFS.length}</span>
                  </div>
                </div>
                <div className="flex-1 h-2 bg-[#1c1c2e] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${(unlockedCodes.size / ACHIEVEMENT_DEFS.length) * 100}%`,
                      background: "linear-gradient(90deg, #6b7280, #00d4ff, #a855f7, #ffd700)" }} />
                </div>
                <div className="text-[10px]" style={{ color: "#374151" }}>
                  {Math.round((unlockedCodes.size / ACHIEVEMENT_DEFS.length) * 100)}%
                </div>
              </div>
              <AchievementsPanel unlockedCodes={unlockedCodes} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
