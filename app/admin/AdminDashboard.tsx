"use client";

import { useState, useTransition } from "react";
import { logout } from "@/app/actions/auth";
import { approveUser, rejectUser, deleteUser } from "@/app/actions/admin";
import { calcOAA, getClassRank, CLASS_CONFIG } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────

type PendingUser = {
  id: string;
  email: string;
  displayName: string;
  motivation: string;
  goals: string;
  checkinFreq: string;
  createdAt: Date;
  reviewNote: string | null;
};

type StudentUser = {
  id: string;
  email: string;
  displayName: string;
  reviewedAt: Date | null;
  student: {
    id: string;
    studentId: string;
    academic: number;
    physical: number;
    social: number;
    mental: number;
    leadership: number;
    adaptability: number;
    privatePoints: number;
    checkinStreak: number;
  } | null;
};

type InactiveUser = {
  id: string;
  email: string;
  displayName: string;
  reviewedAt: Date | null;
  lastLoginAt: Date | null;
  student: { studentId: string; checkinStreak: number } | null;
};

type Stats = { pending: number; students: number; rejected: number };

// ─── Helpers ─────────────────────────────────────────────

const CHECKIN_LABELS: Record<string, string> = {
  daily: "毎日 / ทุกวัน",
  "3x_week": "週3 / 3x/week",
  weekly: "週1 / weekly",
};

function fmtDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Application Card ────────────────────────────────────

function ApplicationCard({
  user,
  onApprove,
  onReject,
}: {
  user: PendingUser;
  onApprove: (id: string, note?: string) => void;
  onReject: (id: string, reason: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showApproveNote, setShowApproveNote] = useState(false);
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [approveNote, setApproveNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  return (
    <div
      className="border p-5 space-y-4 transition-all"
      style={{ borderColor: "#1c1c2e", background: "#07070f" }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#e8e8f0]">{user.displayName}</div>
          <div className="text-[10px] text-[#4b5563] mt-0.5 font-mono">{user.email}</div>
          <div className="flex gap-3 mt-1">
            <span className="text-[9px] text-[#374151]">
              {CHECKIN_LABELS[user.checkinFreq] ?? user.checkinFreq}
            </span>
            <span className="text-[9px] text-[#374151]">
              สมัคร {fmtDate(user.createdAt)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-[10px] px-3 py-1 border shrink-0 transition-all"
          style={{ borderColor: "#2a2a42", color: "#4b5563" }}
        >
          {expanded ? "COLLAPSE ▲" : "DETAILS ▼"}
        </button>
      </div>

      {/* Motivation preview */}
      {!expanded && (
        <div className="text-xs text-[#4b5563] leading-relaxed line-clamp-2">
          {user.motivation}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="space-y-3 border-t border-[#1c1c2e] pt-4">
          <div>
            <div className="text-[9px] tracking-[0.3em] text-[#374151] mb-1">
              MOTIVATION / เหตุผล
            </div>
            <div className="text-xs text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
              {user.motivation}
            </div>
          </div>
          <div>
            <div className="text-[9px] tracking-[0.3em] text-[#374151] mb-1">
              GOALS / เป้าหมาย
            </div>
            <div className="text-xs text-[#9ca3af] leading-relaxed whitespace-pre-wrap">
              {user.goals}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!showApproveNote && !showRejectReason && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setShowApproveNote(true)}
            className="flex-1 py-2 text-[10px] tracking-[0.2em] border transition-all"
            style={{
              borderColor: "#22c55e44",
              color: "#22c55e",
              background: "#22c55e08",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#22c55e18";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#22c55e08";
            }}
          >
            ✓ APPROVE
          </button>
          <button
            onClick={() => setShowRejectReason(true)}
            className="flex-1 py-2 text-[10px] tracking-[0.2em] border transition-all"
            style={{
              borderColor: "#ef444444",
              color: "#ef4444",
              background: "#ef444408",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ef444418";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ef444408";
            }}
          >
            ✗ REJECT
          </button>
        </div>
      )}

      {/* Approve note input */}
      {showApproveNote && (
        <div className="space-y-3 border-t border-[#22c55e22] pt-4">
          <div className="text-[10px] tracking-[0.2em] text-[#22c55e]">
            NOTE (optional) — ข้อความเพิ่มเติมสำหรับผู้สมัคร
          </div>
          <textarea
            rows={2}
            placeholder="ยินดีต้อนรับสู่ ReflectIQ... (เว้นว่างได้)"
            value={approveNote}
            onChange={(e) => setApproveNote(e.target.value)}
            className="w-full bg-transparent border px-3 py-2 text-xs outline-none resize-none"
            style={{ borderColor: "#22c55e33", color: "#9ca3af" }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(user.id, approveNote || undefined)}
              className="flex-1 py-2 text-[10px] tracking-[0.2em] border transition-all"
              style={{ borderColor: "#22c55e", color: "#22c55e", background: "#22c55e11" }}
            >
              ✓ CONFIRM APPROVAL
            </button>
            <button
              onClick={() => { setShowApproveNote(false); setApproveNote(""); }}
              className="px-4 py-2 text-[10px] border"
              style={{ borderColor: "#2a2a42", color: "#4b5563" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Reject reason input */}
      {showRejectReason && (
        <div className="space-y-3 border-t border-[#ef444422] pt-4">
          <div className="text-[10px] tracking-[0.2em] text-[#ef4444]">
            REASON — เหตุผลในการปฏิเสธ (จำเป็น)
          </div>
          <textarea
            rows={2}
            placeholder="กรุณาระบุเหตุผล..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full bg-transparent border px-3 py-2 text-xs outline-none resize-none"
            style={{ borderColor: "#ef444433", color: "#9ca3af" }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!rejectReason.trim()) return;
                onReject(user.id, rejectReason.trim());
              }}
              disabled={!rejectReason.trim()}
              className="flex-1 py-2 text-[10px] tracking-[0.2em] border transition-all"
              style={{
                borderColor: rejectReason.trim() ? "#ef4444" : "#2a2a42",
                color: rejectReason.trim() ? "#ef4444" : "#374151",
                background: rejectReason.trim() ? "#ef444411" : "transparent",
                cursor: rejectReason.trim() ? "pointer" : "not-allowed",
              }}
            >
              ✗ CONFIRM REJECTION
            </button>
            <button
              onClick={() => { setShowRejectReason(false); setRejectReason(""); }}
              className="px-4 py-2 text-[10px] border"
              style={{ borderColor: "#2a2a42", color: "#4b5563" }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Student Row ──────────────────────────────────────────

function StudentRow({ user, onDelete }: { user: StudentUser; onDelete: (id: string, name: string) => void }) {
  if (!user.student) {
    return (
      <div className="flex items-center justify-between py-3 px-4 border-b" style={{ borderColor: "#1c1c2e" }}>
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 flex items-center justify-center border text-xs font-bold" style={{ borderColor: "#ef444444", color: "#ef4444" }}>!</div>
          <div>
            <div className="text-sm text-[#e8e8f0]">{user.displayName}</div>
            <div className="text-[10px] text-[#ef4444] font-mono">no student profile — data corrupted</div>
          </div>
        </div>
        <button onClick={() => onDelete(user.id, user.displayName)}
          className="px-3 py-1.5 text-[10px] tracking-widest border"
          style={{ borderColor: "#ef444444", color: "#ef4444", background: "#ef444408" }}>
          DELETE ✗
        </button>
      </div>
    );
  }
  const s = user.student;
  const stats = {
    academic: s.academic, physical: s.physical, social: s.social,
    mental: s.mental, leadership: s.leadership, adaptability: s.adaptability,
  };
  const oaa = calcOAA(stats);
  const rank = getClassRank(oaa);
  const cfg = CLASS_CONFIG[rank];

  return (
    <div
      className="flex items-center justify-between py-3 px-4 border-b"
      style={{ borderColor: "#1c1c2e" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-7 h-7 flex items-center justify-center border text-xs font-bold"
          style={{ borderColor: `${cfg.color}44`, color: cfg.color }}
        >
          {rank}
        </div>
        <div>
          <div className="text-sm text-[#e8e8f0]">{user.displayName}</div>
          <div className="text-[10px] text-[#374151] font-mono">{s.studentId}</div>
        </div>
      </div>
      <div className="flex items-center gap-6 text-[11px]">
        <div className="text-center">
          <div className="text-[9px] text-[#374151]">OAA</div>
          <div style={{ color: cfg.color }}>{oaa}</div>
        </div>
        <div className="text-center hidden sm:block">
          <div className="text-[9px] text-[#374151]">STREAK</div>
          <div className="text-[#22c55e]">{s.checkinStreak}日</div>
        </div>
        <div className="text-center hidden md:block">
          <div className="text-[9px] text-[#374151]">PP</div>
          <div className="text-[#ffd700]">{s.privatePoints.toLocaleString()}</div>
        </div>
        <div className="text-[9px] text-[#374151] hidden lg:block">
          {fmtDate(user.reviewedAt)}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────

type Tab = "pending" | "students" | "inactive";

export default function AdminDashboard({
  pending,
  students,
  inactive,
  stats,
}: {
  pending: PendingUser[];
  students: StudentUser[];
  inactive: InactiveUser[];
  stats: Stats;
}) {
  const [tab, setTab] = useState<Tab>("pending");
  const [isPending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ msg: string; color: string } | null>(null);

  const showToast = (msg: string, color: string) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (userId: string, note?: string) => {
    startTransition(async () => {
      const res = await approveUser(userId, note);
      if (res.success) {
        setDismissed((d) => new Set([...d, userId]));
        showToast("อนุมัติเรียบร้อยแล้ว ✓", "#22c55e");
      } else {
        showToast(res.error ?? "เกิดข้อผิดพลาด", "#ef4444");
      }
    });
  };

  const handleReject = (userId: string, reason: string) => {
    startTransition(async () => {
      const res = await rejectUser(userId, reason);
      if (res.success) {
        setDismissed((d) => new Set([...d, userId]));
        showToast("ปฏิเสธเรียบร้อยแล้ว", "#ef4444");
      } else {
        showToast(res.error ?? "เกิดข้อผิดพลาด", "#ef4444");
      }
    });
  };

  const handleDelete = (userId: string, displayName: string) => {
    if (!confirm(`ลบ "${displayName}" ออกจากระบบ? ข้อมูลทั้งหมดจะถูกลบถาวร`)) return;
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (res.success) {
        setDeletedIds((d) => new Set([...d, userId]));
        showToast(`ลบ ${displayName} แล้ว`, "#ef4444");
      } else {
        showToast(res.error ?? "เกิดข้อผิดพลาด", "#ef4444");
      }
    });
  };

  const visiblePending = pending.filter((u) => !dismissed.has(u.id));

  return (
    <div className="min-h-screen bg-[#050508] text-[#e8e8f0]">
      <div className="fixed inset-0 pointer-events-none z-50 scanlines" style={{ opacity: 0.3 }} />

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[100] px-5 py-3 border text-xs animate-fade-in-up"
          style={{ borderColor: `${toast.color}66`, background: "#0b0b14", color: toast.color,
            boxShadow: `0 0 16px ${toast.color}33` }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: "#1c1c2e", background: "#050508ee" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div
              className="text-base font-bold tracking-[0.2em]"
              style={{ color: "#00d4ff", textShadow: "0 0 12px #00d4ff88" }}
            >
              ReflectIQ
            </div>
            <div className="text-[9px] tracking-[0.3em] text-[#374151]">
              ADMIN CONTROL PANEL / 管理パネル
            </div>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-4 text-[11px]">
            <div className="text-center">
              <div className="text-[9px] text-[#374151]">PENDING</div>
              <div
                className="font-bold"
                style={{ color: stats.pending > 0 ? "#ffd700" : "#374151" }}
              >
                {stats.pending}
              </div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-[#374151]">STUDENTS</div>
              <div className="font-bold text-[#22c55e]">{stats.students}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-[#374151]">REJECTED</div>
              <div className="font-bold text-[#4b5563]">{stats.rejected}</div>
            </div>
            {isPending && (
              <span className="animate-glow-pulse text-[10px]" style={{ color: "#00d4ff" }}>
                ●
              </span>
            )}
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="px-3 py-1.5 text-[10px] tracking-widest border transition-all"
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
              LOGOUT
            </button>
          </form>
        </div>

        {/* Tabs */}
        <div
          className="max-w-5xl mx-auto px-4 flex border-t"
          style={{ borderColor: "#1c1c2e" }}
        >
          {(
            [
              { id: "pending",  label: "PENDING",  labelJp: "審査待ち",   badgeColor: "#ffd700", count: stats.pending + (pending.length - visiblePending.length) },
              { id: "students", label: "STUDENTS", labelJp: "在籍生",     badgeColor: "#22c55e", count: stats.students },
              { id: "inactive", label: "INACTIVE", labelJp: "未ログイン", badgeColor: "#ef4444", count: inactive.filter(u => !deletedIds.has(u.id)).length },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-5 py-2 text-[10px] tracking-[0.2em] transition-all relative"
              style={{
                color: tab === t.id ? "#00d4ff" : "#4b5563",
                borderBottom: tab === t.id ? "1px solid #00d4ff" : "1px solid transparent",
              }}
            >
              {t.label}
              <span className="ml-1.5 text-[9px]" style={{ color: "#374151" }}>
                {t.labelJp}
              </span>
              {t.count > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: `${t.badgeColor}22`, color: t.badgeColor }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* PENDING tab */}
        {tab === "pending" && (
          <div className="space-y-4">
            {visiblePending.length === 0 ? (
              <div
                className="p-12 border text-center"
                style={{ borderColor: "#1c1c2e", borderStyle: "dashed" }}
              >
                <div className="text-[10px] tracking-[0.3em] text-[#374151]">
                  NO PENDING APPLICATIONS
                </div>
                <div className="text-xs text-[#1c1c2e] mt-2">ไม่มีใบสมัครรอการพิจารณา</div>
              </div>
            ) : (
              <>
                <div className="text-[10px] tracking-[0.3em] text-[#374151] mb-2">
                  {visiblePending.length} APPLICATION{visiblePending.length !== 1 ? "S" : ""}{" "}
                  AWAITING REVIEW
                </div>
                {visiblePending.map((user) => (
                  <ApplicationCard
                    key={user.id}
                    user={user}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* STUDENTS tab */}
        {tab === "students" && (
          <div>
            {students.length === 0 ? (
              <div
                className="p-12 border text-center"
                style={{ borderColor: "#1c1c2e", borderStyle: "dashed" }}
              >
                <div className="text-[10px] tracking-[0.3em] text-[#374151]">NO STUDENTS YET</div>
              </div>
            ) : (
              <div className="border" style={{ borderColor: "#1c1c2e" }}>
                <div
                  className="flex items-center justify-between px-4 py-2 border-b"
                  style={{ borderColor: "#1c1c2e", background: "#07070f" }}
                >
                  <div className="text-[10px] tracking-[0.3em] text-[#374151]">
                    {students.length} ACTIVE STUDENT{students.length !== 1 ? "S" : ""}
                  </div>
                </div>
                {students.map((u) => (
                  <StudentRow key={u.id} user={u} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* INACTIVE tab */}
        {tab === "inactive" && (() => {
          const visibleInactive = inactive.filter((u) => !deletedIds.has(u.id));
          return (
            <div className="space-y-3">
              <div className="p-4 border text-xs leading-relaxed"
                style={{ borderColor: "#ef444422", background: "#ef444408", color: "#9ca3af" }}>
                <span style={{ color: "#ef4444" }}>◈ </span>
                แสดงผู้ใช้ที่ได้รับการอนุมัติ (STUDENT) แต่ไม่ได้ล็อคอินภายใน 24 ชั่วโมงที่ผ่านมา
                — Admin สามารถลบออกจากระบบได้
              </div>

              {visibleInactive.length === 0 ? (
                <div className="p-12 border text-center"
                  style={{ borderColor: "#1c1c2e", borderStyle: "dashed" }}>
                  <div className="text-[10px] tracking-[0.3em] text-[#374151]">
                    NO INACTIVE USERS
                  </div>
                  <div className="text-xs text-[#1c1c2e] mt-2">ทุกคนล็อคอินภายใน 24 ชั่วโมง</div>
                </div>
              ) : (
                <div className="border" style={{ borderColor: "#1c1c2e" }}>
                  <div className="flex items-center justify-between px-4 py-2 border-b"
                    style={{ borderColor: "#1c1c2e", background: "#07070f" }}>
                    <div className="text-[10px] tracking-[0.3em] text-[#374151]">
                      {visibleInactive.length} INACTIVE USER{visibleInactive.length !== 1 ? "S" : ""}
                    </div>
                  </div>
                  {visibleInactive.map((u) => (
                    <div key={u.id}
                      className="flex items-center justify-between py-3 px-4 border-b"
                      style={{ borderColor: "#1c1c2e" }}>
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-sm text-[#e8e8f0]">{u.displayName}</div>
                          <div className="text-[10px] text-[#374151] font-mono">{u.email}</div>
                          {u.student && (
                            <div className="text-[9px] text-[#374151]">{u.student.studentId}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-[11px]">
                        <div className="text-center hidden sm:block">
                          <div className="text-[9px] text-[#374151]">APPROVED</div>
                          <div className="text-[#4b5563]">{fmtDate(u.reviewedAt)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[9px] text-[#374151]">LAST LOGIN</div>
                          <div style={{ color: u.lastLoginAt ? "#ef4444" : "#6b7280" }}>
                            {u.lastLoginAt ? fmtDate(u.lastLoginAt) : "ไม่เคย"}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(u.id, u.displayName)}
                          className="px-3 py-1.5 text-[10px] tracking-widest border transition-all"
                          style={{ borderColor: "#ef444444", color: "#ef4444", background: "#ef444408" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#ef444418";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#ef444408";
                          }}
                        >
                          DELETE ✗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </main>
    </div>
  );
}
