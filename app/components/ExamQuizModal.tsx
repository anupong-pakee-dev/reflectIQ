"use client";

import { useState, useEffect, useTransition } from "react";
import { startExam, submitExam, type ClientQuestion } from "@/app/actions/exam";
import { useLanguage } from "@/app/components/LanguageContext";

type Phase = "loading" | "quiz" | "result" | "done";

interface Props {
  subject: string;          // e.g. "math"
  subjectLabel: string;     // localised display name
  onClose: () => void;
  onResult: (score: number, total: number, passed: boolean) => void;
}

export default function ExamQuizModal({ subject, subjectLabel, onClose, onResult }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [sessionToken, setSessionToken] = useState("");
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [passed, setPassed] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submitPending, startSubmit] = useTransition();
  const [error, setError] = useState("");

  // Auto-load on mount
  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await startExam(subject);
        if (res.alreadyAttempted) {
          setAlreadyDone(true);
          setPhase("done");
          return;
        }
        setQuestions(res.questions);
        setSessionToken(res.sessionToken);
        setAnswers(new Array(res.questions.length).fill(null));
        setPhase("quiz");
      } catch (e) {
        setError(String(e));
        setPhase("done");
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  function select(optIdx: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optIdx;
      return next;
    });
  }

  function next() {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  }
  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function submit() {
    const filled = answers as number[];
    // Replace any null with 0 (unanswered → first option, still wrong)
    const finalAnswers = filled.map((a) => (a === null ? 0 : a));
    startSubmit(async () => {
      try {
        const res = await submitExam(sessionToken, finalAnswers);
        setScore(res.score);
        setTotal(res.total);
        setPassed(res.passed);
        setPhase("result");
        onResult(res.score, res.total, res.passed);
      } catch (e) {
        setError(String(e));
      }
    });
  }

  const answered = answers.filter((a) => a !== null).length;
  const q = questions[current];
  const LETTERS = ["A", "B", "C", "D"];

  // ─── Shared header ────────────────────────────────────────────────────────

  const Header = () => (
    <div className="flex justify-between items-start mb-6">
      <div>
        <div className="text-[10px] tracking-[0.3em]" style={{ color: "#374151" }}>
          {t.examQuizTag ?? "ACADEMIC EXAM"}
        </div>
        <div className="text-lg font-bold tracking-wider" style={{ color: "#00d4ff" }}>
          {subjectLabel}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-xs px-3 py-1.5 border transition-all"
        style={{ borderColor: "#2a2a42", color: "#6b7280" }}
      >
        ✕
      </button>
    </div>
  );

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (phase === "loading" || isPending) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-lg cote-card p-8" style={{ borderColor: "#00d4ff33" }}>
          <div className="text-center text-xs tracking-[0.3em]" style={{ color: "#374151" }}>
            {t.examQuizLoading ?? "LOADING EXAM..."}
          </div>
        </div>
      </div>
    );
  }

  // ─── Already attempted / error ────────────────────────────────────────────

  if (phase === "done") {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-lg cote-card p-8 text-center space-y-4"
          style={{ borderColor: "#ef444433" }}>
          <Header />
          {alreadyDone ? (
            <>
              <div className="text-[10px] tracking-[0.3em]" style={{ color: "#ef4444" }}>
                {t.examQuizAlreadyDone ?? "ALREADY ATTEMPTED"}
              </div>
              <div className="text-sm" style={{ color: "#6b7280" }}>
                {t.examQuizOneAttemptNote ?? "การสอบนี้ทำได้ครั้งเดียวเท่านั้น"}
              </div>
            </>
          ) : (
            <div className="text-sm" style={{ color: "#ef4444" }}>{error}</div>
          )}
          <button onClick={onClose}
            className="px-6 py-2 text-xs tracking-[0.2em] border"
            style={{ borderColor: "#2a2a42", color: "#6b7280" }}>
            {t.examQuizClose ?? "CLOSE"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Result ───────────────────────────────────────────────────────────────

  if (phase === "result") {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-lg cote-card p-8 space-y-6"
          style={{ borderColor: passed ? "#22c55e33" : "#ef444433",
            boxShadow: passed ? "0 0 40px #22c55e11" : "0 0 40px #ef444411" }}>
          <Header />
          <div className="text-center space-y-3">
            <div className="text-[10px] tracking-[0.4em]"
              style={{ color: passed ? "#22c55e" : "#ef4444" }}>
              {passed ? (t.examQuizPass ?? "◉ PASS") : (t.examQuizFail ?? "✕ FAIL")}
            </div>
            <div className="text-5xl font-bold tabular-nums"
              style={{ color: passed ? "#22c55e" : "#ef4444",
                textShadow: `0 0 20px ${passed ? "#22c55e" : "#ef4444"}` }}>
              {score}<span className="text-2xl" style={{ color: "#374151" }}>/{total}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: "#e8e8f0" }}>
              {pct}%
            </div>
            <div className="text-xs mt-2" style={{ color: "#4b5563" }}>
              {t.examQuizResultNote ?? "ผลการสอบถูกบันทึกแล้ว — ไม่สามารถสอบซ้ำได้"}
            </div>
          </div>
          <button onClick={onClose}
            className="w-full py-3 text-xs font-bold tracking-[0.2em] border transition-all"
            style={{ borderColor: "#00d4ff", color: "#00d4ff", background: "#00d4ff11" }}>
            {t.examQuizClose ?? "CLOSE"}
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl cote-card p-6"
        style={{ borderColor: "#00d4ff33", boxShadow: "0 0 40px #00d4ff11" }}>
        <Header />

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-1 bg-[#1c1c2e] rounded-full overflow-hidden">
            <div className="h-full bg-[#00d4ff] rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
          <span className="text-[10px] tabular-nums shrink-0" style={{ color: "#374151" }}>
            {current + 1} / {questions.length}
          </span>
          <span className="text-[10px] shrink-0" style={{ color: "#4b5563" }}>
            {t.examQuizAnswered ?? "ตอบแล้ว"}: {answered}/{questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="cote-card p-5 mb-4"
          style={{ borderColor: "#1c1c2e", minHeight: "80px" }}>
          <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: "#374151" }}>
            Q{current + 1}
          </div>
          <div className="text-sm leading-relaxed" style={{ color: "#e8e8f0" }}>
            {q.text}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-6">
          {q.options.map((opt, i) => {
            const selected = answers[current] === i;
            return (
              <button
                key={i}
                onClick={() => select(i)}
                className="w-full text-left p-3 border text-sm transition-all"
                style={{
                  borderColor: selected ? "#00d4ff" : "#2a2a42",
                  background: selected ? "#00d4ff11" : "transparent",
                  color: selected ? "#00d4ff" : "#9ca3af",
                }}
              >
                <span className="font-bold mr-2" style={{ color: selected ? "#00d4ff" : "#374151" }}>
                  {LETTERS[i]}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={prev}
            disabled={current === 0}
            className="px-4 py-2 text-xs border transition-all"
            style={{
              borderColor: "#2a2a42",
              color: current === 0 ? "#1c1c2e" : "#6b7280",
            }}
          >
            ← {t.examQuizPrev ?? "ก่อนหน้า"}
          </button>

          {/* Quick-nav dots */}
          <div className="flex gap-1 flex-wrap justify-center flex-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-5 h-5 text-[8px] border transition-all"
                style={{
                  borderColor: i === current ? "#00d4ff" : answers[i] !== null ? "#22c55e44" : "#1c1c2e",
                  background: i === current ? "#00d4ff22" : answers[i] !== null ? "#22c55e11" : "transparent",
                  color: i === current ? "#00d4ff" : "#374151",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button
              onClick={next}
              className="px-4 py-2 text-xs border transition-all"
              style={{ borderColor: "#2a2a42", color: "#6b7280" }}
            >
              {t.examQuizNext ?? "ถัดไป"} →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitPending}
              className="px-4 py-2 text-xs font-bold border transition-all"
              style={{
                borderColor: "#00d4ff",
                color: "#00d4ff",
                background: "#00d4ff11",
                opacity: submitPending ? 0.6 : 1,
              }}
            >
              {submitPending
                ? (t.examQuizSubmitting ?? "กำลังส่ง...")
                : (t.examQuizSubmit ?? `ส่งคำตอบ (${answered}/${questions.length})`)}
            </button>
          )}
        </div>

        {/* Unanswered warning */}
        {current === questions.length - 1 && answered < questions.length && (
          <div className="mt-3 text-[10px] text-center" style={{ color: "#eab308" }}>
            ⚠ {t.examQuizUnanswered ?? `ยังมี ${questions.length - answered} ข้อที่ยังไม่ได้ตอบ`}
          </div>
        )}

        {error && (
          <div className="mt-3 text-[10px] text-center" style={{ color: "#ef4444" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
