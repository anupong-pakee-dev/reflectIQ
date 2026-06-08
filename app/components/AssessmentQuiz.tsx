"use client";

import { useState, useEffect, useTransition } from "react";
import { QUIZ_QUESTIONS, DISPLAY_ORDER, STAT_META, calcAssessmentScores, calcInitialStats } from "@/lib/quiz";
import type { StatId } from "@/lib/constants";
import { submitAssessment } from "@/app/actions/assessment";
import { logout } from "@/app/actions/auth";
import { useLanguage } from "@/app/components/LanguageContext";

type Phase = "intro" | "quiz" | "calculating" | "done" | "error";

const TOTAL = DISPLAY_ORDER.length; // 30

export default function AssessmentQuiz() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [calcProgress, setCalcProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Progress animation → then submit to server
  useEffect(() => {
    if (phase !== "calculating") return;
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 12 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        setCalcProgress(100);
        setTimeout(() => {
          setPhase("done");
          // ✅ must be async so React 19 properly tracks the server action Promise
          startTransition(async () => {
            try {
              await submitAssessment(answers);
              // redirect() in submitAssessment navigates away — this line rarely runs
            } catch (err: unknown) {
              // Next.js redirect() throws internally — re-throw so the router can handle it
              const e = err as { digest?: string };
              if (typeof e?.digest === "string" && e.digest.startsWith("NEXT_REDIRECT")) {
                throw err;
              }
              console.error("[assessment] submitAssessment error:", err);
              setPhase("error");
            }
          });
        }, 600);
      }
      setCalcProgress(Math.min(100, p));
    }, 120);
    return () => clearInterval(tick);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const questionId = DISPLAY_ORDER[current];
  const question = QUIZ_QUESTIONS.find((q) => q.id === questionId)!;
  const meta = question ? STAT_META[question.stat] : null;

  const handleSelect = (optIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optIdx);

    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: optIdx };
      setAnswers(newAnswers);

      if (current + 1 >= TOTAL) {
        setPhase("calculating");
      } else {
        setCurrent((c) => c + 1);
        setSelectedIdx(null);
      }
    }, 500);
  };

  // Visual preview during quiz (0-100, bars only)
  const partialScores = calcAssessmentScores(answers);
  // Actual values that will be stored (0-2 cap)
  const finalStats = calcInitialStats(answers);

  // ── INTRO ──────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />
        <div className="w-full max-w-lg relative z-10">
          <div className="text-center mb-10">
            <div className="text-[10px] tracking-[0.5em] mb-3" style={{ color: "#1c1c2e" }}>◈ ◉ ◎ ◆ ◇ ◐</div>
            <div className="text-[11px] tracking-[0.4em] mb-2" style={{ color: "#374151" }}>
              ADVANCED NURTURING HIGH SCHOOL
            </div>
            <div className="text-4xl font-bold tracking-[0.15em]"
              style={{ color: "#ffd700", textShadow: "0 0 30px #ffd700, 0 0 60px #ffd70044" }}>
              ReflectIQ
            </div>
            <div className="text-[10px] tracking-[0.3em] mt-2" style={{ color: "#374151" }}>
              {t.assessPageSub}
            </div>
          </div>

          <div className="cote-card p-8 space-y-6"
            style={{ borderColor: "#ffd70033", boxShadow: "0 0 40px #ffd70008" }}>
            <div>
              <div className="text-[10px] tracking-[0.3em] mb-1" style={{ color: "#374151" }}>
                {t.assessProtocolLabel}
              </div>
              <div className="text-lg font-bold" style={{ color: "#ffd700" }}>
                {t.assessMainTitle}
              </div>
            </div>

            <div className="p-4 border text-xs space-y-2 leading-relaxed"
              style={{ borderColor: "#ffd70022", background: "#ffd70008", color: "#6b7280" }}>
              <div style={{ color: "#ffd700" }}>{t.assessDescNote}</div>
              <div>{t.assessDesc1}</div>
              <div>{t.assessDesc2}</div>
              <div style={{ color: "#ef4444" }}>{t.assessDescWarning}</div>
            </div>

            {/* Stat grid — localized names */}
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(STAT_META).map(([id, m]) => (
                <div key={id} className="flex items-center gap-2 px-3 py-2 border"
                  style={{ borderColor: `${m.color}33`, background: `${m.color}08` }}>
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <div className="text-[10px] font-bold" style={{ color: m.color }}>
                    {t.stats[id]?.name ?? m.name}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setPhase("quiz")}
              className="w-full py-3 text-sm font-bold tracking-[0.25em] border transition-all"
              style={{ background: "#ffd70011", borderColor: "#ffd700", color: "#ffd700",
                boxShadow: "0 0 24px #ffd70022" }}>
              {t.assessBeginBtn}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <form action={logout}>
              <button type="submit"
                className="text-[10px] tracking-[0.2em] transition-colors"
                style={{ color: "#1c1c2e" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#1c1c2e")}>
                LOGOUT
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── CALCULATING / DONE ─────────────────────────────────────
  if (phase === "calculating" || phase === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />
        <div className="w-full max-w-md relative z-10 text-center space-y-8">
          <div>
            <div className="text-[10px] tracking-[0.4em] mb-2" style={{ color: "#374151" }}>
              {t.assessCalcTag}
            </div>
            <div className="text-2xl font-bold" style={{ color: "#ffd700" }}>
              {t.assessCalcTitle}
            </div>
          </div>

          {/* ค่า 0-2 ที่จะบันทึกจริง — localized stat names */}
          <div className="space-y-3">
            {Object.entries(STAT_META).map(([id, m]) => {
              const stored = finalStats[id as StatId] ?? 0;
              const barPct = (stored / 2) * 100;
              return (
                <div key={id} className="flex items-center gap-3">
                  <span style={{ color: m.color }} className="w-4 text-xs">{m.icon}</span>
                  <span className="text-[10px] w-16 text-left" style={{ color: m.color }}>
                    {t.stats[id]?.name ?? m.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-[#1c1c2e] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${barPct}%`, background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                  </div>
                  <span className="text-[10px] tabular-nums text-right font-bold"
                    style={{ color: m.color }}>
                    {stored}<span style={{ color: "#374151", fontSize: "8px" }}>/2</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[9px] tracking-[0.15em] text-center" style={{ color: "#374151" }}>
            {t.assessBaselineTag}
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-2">
              <span style={{ color: "#374151" }}>{t.assessCalcLabel}</span>
              <span style={{ color: "#ffd700" }}>{Math.round(calcProgress)}%</span>
            </div>
            <div className="h-2 bg-[#1c1c2e] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${calcProgress}%`,
                  background: "linear-gradient(90deg, #ffd700, #00d4ff)",
                  boxShadow: "0 0 10px #ffd70066" }} />
            </div>
          </div>

          {isPending && (
            <div className="text-[10px] tracking-[0.3em] animate-pulse" style={{ color: "#374151" }}>
              {t.assessSavingMsg}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── ERROR ──────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#050508]">
        <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />
        <div className="w-full max-w-md relative z-10 text-center space-y-6">
          <div
            className="cote-card p-8 space-y-4"
            style={{ borderColor: "#ef444444", boxShadow: "0 0 30px #ef444411" }}
          >
            <div className="text-[10px] tracking-[0.3em] text-[#ef4444]">✗ {t.assessErrorTag}</div>
            <div className="text-sm text-[#e8e8f0]">{t.assessErrorDefault}</div>
            <button
              onClick={() => {
                setPhase("calculating");
                setCalcProgress(0);
              }}
              className="w-full py-2 text-[10px] tracking-[0.25em] border transition-all"
              style={{ borderColor: "#ef4444", color: "#ef4444", background: "#ef444411" }}
            >
              {t.assessRetryBtn}
            </button>
          </div>
          <form action={logout}>
            <button type="submit"
              className="text-[10px] tracking-[0.2em] transition-colors"
              style={{ color: "#374151" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}>
              LOGOUT
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── QUIZ ───────────────────────────────────────────────────
  const progress = (current / TOTAL) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-[#e8e8f0]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      {/* Header bar */}
      <div className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: "#1c1c2e", background: "#050508ee" }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm font-bold tracking-[0.15em]" style={{ color: "#ffd700" }}>
            OAA ASSESSMENT
          </div>
          <div className="text-[10px] tracking-widest" style={{ color: "#374151" }}>
            {current + 1} / {TOTAL}
          </div>
        </div>
        <div className="h-0.5 bg-[#1c1c2e]">
          <div className="h-full transition-all duration-300"
            style={{ width: `${progress}%`,
              background: "linear-gradient(90deg, #ffd700aa, #ffd700)",
              boxShadow: "0 0 8px #ffd70066" }} />
        </div>
      </div>

      {/* Question area */}
      <main className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-2xl space-y-6 relative z-10">

          {/* Stat badge — localized name */}
          {meta && (
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: meta.color }}>{meta.icon}</span>
              <span className="text-[10px] tracking-[0.3em] font-bold" style={{ color: meta.color }}>
                {t.stats[question.stat]?.name ?? meta.name}
              </span>
              <div className="flex-1 h-px" style={{ background: `${meta.color}33` }} />
              <span className="text-[10px]" style={{ color: "#1c1c2e" }}>Q{current + 1}</span>
            </div>
          )}

          {/* Question */}
          <div className="cote-card p-6"
            style={{ borderColor: meta ? `${meta.color}33` : "#2a2a42" }}>
            <div className="text-[10px] tracking-[0.2em] mb-3" style={{ color: "#374151" }}>
              QUESTION {current + 1}
            </div>
            <div className="text-base leading-relaxed font-medium" style={{ color: "#e8e8f0" }}>
              {question?.question}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question?.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const isDisabled = selectedIdx !== null;
              const baseColor = meta?.color ?? "#00d4ff";
              return (
                <button key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isDisabled}
                  className="w-full text-left p-4 border transition-all duration-200"
                  style={{
                    borderColor: isSelected ? baseColor : "#2a2a42",
                    background: isSelected ? `${baseColor}18` : "#0b0b14",
                    color: isSelected ? "#e8e8f0" : "#6b7280",
                    cursor: isDisabled ? "default" : "pointer",
                    transform: isSelected ? "translateX(4px)" : "none",
                    boxShadow: isSelected ? `0 0 16px ${baseColor}22` : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.borderColor = `${baseColor}66`;
                      e.currentTarget.style.color = "#e8e8f0";
                      e.currentTarget.style.background = `${baseColor}0a`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDisabled && !isSelected) {
                      e.currentTarget.style.borderColor = "#2a2a42";
                      e.currentTarget.style.color = "#6b7280";
                      e.currentTarget.style.background = "#0b0b14";
                    }
                  }}>
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] mt-0.5 shrink-0 font-bold"
                      style={{ color: isSelected ? baseColor : "#374151" }}>
                      {["A", "B", "C", "D"][idx]}
                    </span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mini stat bars — icon only */}
          <div className="cote-card p-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Object.entries(STAT_META).map(([id, m]) => {
              const score = partialScores[id as keyof typeof partialScores] ?? 0;
              const answeredCount = QUIZ_QUESTIONS.filter(
                (q) => q.stat === id && answers[q.id] !== undefined
              ).length;
              return (
                <div key={id} className="text-center">
                  <span className="text-xs" style={{ color: answeredCount > 0 ? m.color : "#1c1c2e" }}>
                    {m.icon}
                  </span>
                  <div className="h-1 bg-[#1c1c2e] rounded-full overflow-hidden mt-1 mb-0.5">
                    <div className="h-full rounded-full"
                      style={{ width: `${score}%`, background: m.color, transition: "width 0.5s ease" }} />
                  </div>
                  <div className="text-[9px] tabular-nums"
                    style={{ color: answeredCount > 0 ? m.color : "#1c1c2e" }}>
                    {answeredCount > 0 ? score : "—"}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}
