"use client";

import { useState, useEffect, useCallback } from "react";
import { QUESTIONS_BY_STAT } from "@/lib/daily-challenges";
import { getChallengeStatus, submitChallenge } from "@/app/actions/challenge";
import { useLanguage } from "@/app/components/LanguageContext";
import { STATS_CONFIG } from "@/lib/constants";
import type { StatId } from "@/lib/constants";

type Phase = "loading" | "intro" | "quiz" | "submitting" | "done" | "already_done";

type ShuffledQ = {
  id: number;
  q: string;
  opts: string[];          // shuffled
  correctIdx: number;      // index in shuffled opts
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareQuestions(statId: StatId): ShuffledQ[] {
  const pool = shuffle(QUESTIONS_BY_STAT[statId]);
  return pool.map(q => {
    const indexed = q.opts.map((opt, i) => ({ opt, isCorrect: i === q.correct }));
    const shuffled = shuffle(indexed);
    return {
      id: q.id,
      q: q.q,
      opts: shuffled.map(x => x.opt),
      correctIdx: shuffled.findIndex(x => x.isCorrect),
    };
  });
}

type Props = {
  statId: StatId;
  onClose: (cpDelta: number) => void;
};

export default function ChallengeModal({ statId, onClose }: Props) {
  const { t } = useLanguage();
  const cfg = STATS_CONFIG.find(s => s.id === statId)!;

  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<ShuffledQ[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [results, setResults] = useState<{ questionId: number; selectedIndex: number }[]>([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [cpDelta, setCpDelta] = useState(0);
  const [prevRecord, setPrevRecord] = useState({ correct: 0, wrong: 0 });

  useEffect(() => {
    getChallengeStatus(statId).then(status => {
      if (status.alreadyDone) {
        setPrevRecord({ correct: status.correct, wrong: status.wrong });
        setPhase("already_done");
      } else {
        setQuestions(prepareQuestions(statId));
        setPhase("intro");
      }
    });
  }, [statId]);

  const handleSelect = useCallback((optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);

    const q = questions[current];
    const isCorrect = optIdx === q.correctIdx;
    const newResults = [...results, { questionId: q.id, selectedIndex: optIdx }];
    setResults(newResults);
    if (isCorrect) setScore(s => ({ ...s, correct: s.correct + 1 }));
    else setScore(s => ({ ...s, wrong: s.wrong + 1 }));

    const isLast = current + 1 >= questions.length;

    setTimeout(() => {
      if (isLast) {
        setPhase("submitting");
        submitChallenge(statId, newResults).then(res => {
          setCpDelta(res.cpDelta);
          setScore({ correct: res.correct, wrong: res.wrong });
          setPhase("done");
        });
      } else {
        setSelected(null);
        setCurrent(c => c + 1);
      }
    }, 1100);
  }, [selected, current, questions, results, statId]);

  const q = questions[current];
  const progress = questions.length > 0 ? ((current) / questions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg cote-card"
        style={{ borderColor: `${cfg.color}44`, boxShadow: `0 0 60px ${cfg.color}18` }}>

        {/* Loading */}
        {phase === "loading" && (
          <div className="p-8 text-center">
            <div className="text-[10px] tracking-[0.4em] animate-pulse" style={{ color: cfg.color }}>
              LOADING...
            </div>
          </div>
        )}

        {/* Intro */}
        {phase === "intro" && (
          <div className="p-8 text-center">
            <div className="text-[9px] tracking-[0.4em] mb-1" style={{ color: "#374151" }}>
              DAILY CHALLENGE
            </div>
            <div className="text-xl font-bold mb-1 tracking-wider" style={{ color: cfg.color }}>
              {cfg.icon} {t.stats[statId].name}
            </div>
            <div className="text-[11px] mb-6" style={{ color: "#4b5563" }}>
              {t.stats[statId].desc}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: t.challengeQCount, value: "20", color: "#e8e8f0" },
                { label: t.challengeCorrectPts, value: "+0.25", color: "#22c55e" },
                { label: t.challengeWrongPts, value: "−0.50", color: "#ef4444" },
              ].map(item => (
                <div key={item.label} className="border p-3 text-center" style={{ borderColor: "#1c1c2e" }}>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => onClose(0)}
                className="flex-1 py-2.5 text-xs tracking-widest border transition-all"
                style={{ borderColor: "#2a2a42", color: "#374151" }}>
                {t.challengeCloseBtn}
              </button>
              <button onClick={() => setPhase("quiz")}
                className="flex-1 py-2.5 text-sm font-bold tracking-widest border transition-all"
                style={{ borderColor: cfg.color, color: cfg.color, background: `${cfg.color}11` }}>
                {t.challengeStartBtn}
              </button>
            </div>
          </div>
        )}

        {/* Quiz */}
        {phase === "quiz" && q && (
          <div className="p-6">
            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px]" style={{ color: "#374151" }}>
                {t.challengeQuestion} {current + 1} / {questions.length}
              </div>
              <div className="flex gap-3 text-[10px]">
                <span style={{ color: "#22c55e" }}>✓ {score.correct}</span>
                <span style={{ color: "#ef4444" }}>✗ {score.wrong}</span>
              </div>
            </div>
            <div className="h-1 bg-[#1c1c2e] rounded-full overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${cfg.color}88, ${cfg.color})` }} />
            </div>

            {/* Question */}
            <div className="text-sm font-bold leading-relaxed mb-5" style={{ color: "#e8e8f0" }}>
              {q.q}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {q.opts.map((opt, idx) => {
                let borderColor = "#2a2a42";
                let color = "#6b7280";
                let bg = "transparent";

                if (selected !== null) {
                  if (idx === q.correctIdx) {
                    borderColor = "#22c55e"; color = "#22c55e"; bg = "#22c55e11";
                  } else if (idx === selected && selected !== q.correctIdx) {
                    borderColor = "#ef4444"; color = "#ef4444"; bg = "#ef444411";
                  }
                } else if (selected === idx) {
                  borderColor = cfg.color; color = cfg.color; bg = `${cfg.color}11`;
                }

                return (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className="w-full text-left px-4 py-3 border text-xs transition-all duration-200"
                    style={{ borderColor, color, background: bg, cursor: selected !== null ? "default" : "pointer" }}>
                    <span className="text-[10px] mr-2 font-bold" style={{ color: "#374151" }}>
                      {["A", "B", "C", "D"][idx]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submitting */}
        {phase === "submitting" && (
          <div className="p-8 text-center">
            <div className="text-[10px] tracking-[0.4em] animate-pulse" style={{ color: cfg.color }}>
              CALCULATING RESULTS...
            </div>
          </div>
        )}

        {/* Done */}
        {phase === "done" && (
          <div className="p-8 text-center">
            <div className="text-[9px] tracking-[0.4em] mb-1" style={{ color: "#374151" }}>CHALLENGE COMPLETE</div>
            <div className="text-xl font-bold mb-6" style={{ color: cfg.color }}>
              {cfg.icon} {t.stats[statId].name}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="border p-3 text-center" style={{ borderColor: "#22c55e33" }}>
                <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{score.correct}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{t.challengeCorrectLabel}</div>
              </div>
              <div className="border p-3 text-center" style={{ borderColor: "#ef444433" }}>
                <div className="text-2xl font-bold" style={{ color: "#ef4444" }}>{score.wrong}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{t.challengeWrongLabel}</div>
              </div>
              <div className="border p-3 text-center"
                style={{ borderColor: cpDelta >= 0 ? "#22c55e33" : "#ef444433" }}>
                <div className="text-2xl font-bold"
                  style={{ color: cpDelta >= 0 ? "#22c55e" : "#ef4444" }}>
                  {cpDelta >= 0 ? "+" : ""}{cpDelta.toFixed(2)}
                </div>
                <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>CP</div>
              </div>
            </div>

            <button onClick={() => onClose(cpDelta)}
              className="w-full py-3 text-sm font-bold tracking-widest border transition-all"
              style={{ borderColor: cfg.color, color: cfg.color, background: `${cfg.color}11` }}>
              {t.challengeCloseBtn}
            </button>
          </div>
        )}

        {/* Already done today */}
        {phase === "already_done" && (
          <div className="p-8 text-center">
            <div className="text-[9px] tracking-[0.4em] mb-1" style={{ color: "#374151" }}>TODAY&apos;S RESULT</div>
            <div className="text-xl font-bold mb-1" style={{ color: cfg.color }}>
              {cfg.icon} {t.stats[statId].name}
            </div>
            <div className="text-[11px] mb-6" style={{ color: "#374151" }}>{t.challengeAlreadyDone}</div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="border p-3 text-center" style={{ borderColor: "#22c55e33" }}>
                <div className="text-2xl font-bold" style={{ color: "#22c55e" }}>{prevRecord.correct}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{t.challengeCorrectLabel}</div>
              </div>
              <div className="border p-3 text-center" style={{ borderColor: "#ef444433" }}>
                <div className="text-2xl font-bold" style={{ color: "#ef4444" }}>{prevRecord.wrong}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "#374151" }}>{t.challengeWrongLabel}</div>
              </div>
            </div>

            <div className="text-[10px] mb-4" style={{ color: "#374151" }}>{t.challengeAlreadyDoneSub}</div>

            <button onClick={() => onClose(0)}
              className="w-full py-3 text-sm font-bold tracking-widest border transition-all"
              style={{ borderColor: "#2a2a42", color: "#4b5563" }}>
              {t.challengeCloseBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
