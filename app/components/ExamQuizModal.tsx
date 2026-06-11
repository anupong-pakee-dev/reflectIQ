"use client";

import { useState, useEffect, useCallback } from "react";
import { startExam, submitExam, type ClientQuestion } from "@/app/actions/exam";
import { useLanguage } from "@/app/components/LanguageContext";

type Phase = "loading" | "intro" | "quiz" | "submitting" | "result" | "already_done" | "error";

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
  const [error, setError] = useState("");

  // ── Load on mount (same pattern as ChallengeModal) ─────────────────────────
  useEffect(() => {
    startExam(subject)
      .then((res) => {
        if (res.alreadyAttempted) {
          setPhase("already_done");
          return;
        }
        setQuestions(res.questions);
        setSessionToken(res.sessionToken);
        setAnswers(new Array(res.questions.length).fill(null));
        setPhase("intro");
      })
      .catch((e) => {
        setError(String(e));
        setPhase("error");
      });
  }, [subject]);

  const select = useCallback((optIdx: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optIdx;
      return next;
    });
  }, [current]);

  const submit = useCallback(() => {
    setPhase("submitting");
    const finalAnswers = answers.map((a) => (a === null ? -1 : a));
    submitExam(sessionToken, finalAnswers)
      .then((res) => {
        setScore(res.score);
        setTotal(res.total);
        setPassed(res.passed);
        setPhase("result");
        onResult(res.score, res.total, res.passed);
      })
      .catch((e) => {
        setError(String(e));
        setPhase("error");
      });
  }, [answers, sessionToken, onResult]);

  const answered = answers.filter((a) => a !== null).length;
  const q = questions[current];
  const LETTERS = ["A", "B", "C", "D"];
  const ACCENT = "#00d4ff";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl cote-card"
        style={{ borderColor: `${ACCENT}44`, boxShadow: `0 0 60px ${ACCENT}18` }}>

        {/* ── Loading ────────────────────────────────────────────────────── */}
        {phase === "loading" && (
          <div className="p-8 text-center">
            <div className="text-[10px] tracking-[0.4em] animate-pulse" style={{ color: ACCENT }}>
              {t.examQuizLoading ?? "LOADING EXAM..."}
            </div>
          </div>
        )}

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <div className="p-8 text-center">
            <div className="text-[9px] tracking-[0.4em] mb-1" style={{ color: "#374151" }}>
              {t.examQuizTag ?? "ACADEMIC EXAM"}
            </div>
            <div className="text-2xl font-bold mb-1 tracking-wider" style={{ color: ACCENT }}>
              {subjectLabel}
            </div>
            <div className="text-[11px] mb-6" style={{ color: "#4b5563" }}>
              {t.examQuizDesc ?? "ข้อสอบ 20 ข้อ · ข้อละ 1 คะแนน · ทำได้ครั้งเดียว"}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: t.examQuizQCount ?? "ข้อ", value: String(questions.length), color: "#e8e8f0" },
                { label: t.examQuizPtEach ?? "คะแนน/ข้อ", value: "1", color: "#22c55e" },
                { label: t.examQuizAttempts ?? "ครั้ง", value: "1", color: "#eab308" },
              ].map((item) => (
                <div key={item.label} className="border p-3 text-center" style={{ borderColor: "#1c1c2e" }}>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className="text-[10px] mb-6 leading-relaxed px-2" style={{ color: "#eab308" }}>
              ⚠ {t.examQuizWarning ?? "การสอบนี้ทำได้ครั้งเดียวเท่านั้น ไม่มีการเฉลย และผลจะถูกบันทึกถาวร"}
            </div>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 text-xs tracking-widest border transition-all"
                style={{ borderColor: "#2a2a42", color: "#374151" }}>
                {t.examQuizClose ?? "ปิด"}
              </button>
              <button onClick={() => setPhase("quiz")}
                className="flex-1 py-2.5 text-sm font-bold tracking-widest border transition-all"
                style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}11` }}>
                {t.examQuizStart ?? "เริ่มสอบ ▶"}
              </button>
            </div>
          </div>
        )}

        {/* ── Quiz ───────────────────────────────────────────────────────── */}
        {phase === "quiz" && q && (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-bold tracking-wider" style={{ color: ACCENT }}>
                {subjectLabel}
              </div>
              <div className="text-[10px]" style={{ color: "#4b5563" }}>
                {t.examQuizAnswered ?? "ตอบแล้ว"}: {answered}/{questions.length}
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-1 bg-[#1c1c2e] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%`,
                    background: `linear-gradient(90deg, ${ACCENT}88, ${ACCENT})` }} />
              </div>
              <span className="text-[10px] tabular-nums shrink-0" style={{ color: "#374151" }}>
                {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question */}
            <div className="cote-card p-5 mb-4" style={{ borderColor: "#1c1c2e", minHeight: "72px" }}>
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
                  <button key={i} onClick={() => select(i)}
                    className="w-full text-left p-3 border text-sm transition-all"
                    style={{
                      borderColor: selected ? ACCENT : "#2a2a42",
                      background: selected ? `${ACCENT}11` : "transparent",
                      color: selected ? ACCENT : "#9ca3af",
                    }}>
                    <span className="font-bold mr-2" style={{ color: selected ? ACCENT : "#374151" }}>
                      {LETTERS[i]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Quick-nav dots */}
            <div className="flex gap-1 flex-wrap justify-center mb-5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className="w-6 h-6 text-[9px] border transition-all"
                  style={{
                    borderColor: i === current ? ACCENT : answers[i] !== null ? "#22c55e44" : "#1c1c2e",
                    background: i === current ? `${ACCENT}22` : answers[i] !== null ? "#22c55e11" : "transparent",
                    color: i === current ? ACCENT : answers[i] !== null ? "#22c55e" : "#374151",
                  }}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="px-4 py-2 text-xs border transition-all"
                style={{ borderColor: "#2a2a42", color: current === 0 ? "#1c1c2e" : "#6b7280" }}>
                ← {t.examQuizPrev ?? "ก่อนหน้า"}
              </button>

              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  className="px-4 py-2 text-xs border transition-all"
                  style={{ borderColor: "#2a2a42", color: "#6b7280" }}>
                  {t.examQuizNext ?? "ถัดไป"} →
                </button>
              ) : (
                <button onClick={submit}
                  className="px-5 py-2 text-xs font-bold border transition-all"
                  style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}11` }}>
                  {t.examQuizSubmit ?? "ส่งคำตอบ"} ({answered}/{questions.length})
                </button>
              )}
            </div>

            {/* Unanswered warning */}
            {current === questions.length - 1 && answered < questions.length && (
              <div className="mt-3 text-[10px] text-center" style={{ color: "#eab308" }}>
                ⚠ {t.examQuizUnanswered ?? "มีข้อที่ยังไม่ได้ตอบ"} ({questions.length - answered})
              </div>
            )}
          </div>
        )}

        {/* ── Submitting ─────────────────────────────────────────────────── */}
        {phase === "submitting" && (
          <div className="p-8 text-center">
            <div className="text-[10px] tracking-[0.4em] animate-pulse" style={{ color: ACCENT }}>
              {t.examQuizSubmitting ?? "กำลังตรวจ..."}
            </div>
          </div>
        )}

        {/* ── Result ─────────────────────────────────────────────────────── */}
        {phase === "result" && (
          <div className="p-8 text-center space-y-6">
            <div>
              <div className="text-[10px] tracking-[0.4em] mb-3"
                style={{ color: passed ? "#22c55e" : "#ef4444" }}>
                {passed ? (t.examQuizPass ?? "◉ PASS") : (t.examQuizFail ?? "✕ FAIL")}
              </div>
              <div className="text-5xl font-bold tabular-nums"
                style={{ color: passed ? "#22c55e" : "#ef4444",
                  textShadow: `0 0 20px ${passed ? "#22c55e" : "#ef4444"}` }}>
                {score}<span className="text-2xl" style={{ color: "#374151" }}>/{total}</span>
              </div>
              <div className="text-xl font-bold mt-2" style={{ color: "#e8e8f0" }}>
                {Math.round((score / total) * 100)}%
              </div>
              <div className="text-xs mt-3" style={{ color: "#4b5563" }}>
                {t.examQuizResultNote ?? "ผลการสอบถูกบันทึกแล้ว — ไม่สามารถสอบซ้ำได้"}
              </div>
            </div>
            <button onClick={onClose}
              className="w-full py-3 text-sm font-bold tracking-widest border transition-all"
              style={{ borderColor: ACCENT, color: ACCENT, background: `${ACCENT}11` }}>
              {t.examQuizClose ?? "ปิด"}
            </button>
          </div>
        )}

        {/* ── Already attempted ──────────────────────────────────────────── */}
        {phase === "already_done" && (
          <div className="p-8 text-center space-y-4">
            <div className="text-[9px] tracking-[0.4em]" style={{ color: "#374151" }}>
              {subjectLabel}
            </div>
            <div className="text-[10px] tracking-[0.3em]" style={{ color: "#ef4444" }}>
              {t.examQuizAlreadyDone ?? "ALREADY ATTEMPTED"}
            </div>
            <div className="text-sm" style={{ color: "#6b7280" }}>
              {t.examQuizOneAttemptNote ?? "การสอบนี้ทำได้ครั้งเดียวเท่านั้น"}
            </div>
            <button onClick={onClose}
              className="w-full py-3 text-xs tracking-widest border"
              style={{ borderColor: "#2a2a42", color: "#6b7280" }}>
              {t.examQuizClose ?? "ปิด"}
            </button>
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {phase === "error" && (
          <div className="p-8 text-center space-y-4">
            <div className="text-[10px] tracking-[0.3em]" style={{ color: "#ef4444" }}>ERROR</div>
            <div className="text-sm" style={{ color: "#ef4444" }}>{error}</div>
            <button onClick={onClose}
              className="w-full py-3 text-xs tracking-widest border"
              style={{ borderColor: "#2a2a42", color: "#6b7280" }}>
              {t.examQuizClose ?? "ปิด"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
