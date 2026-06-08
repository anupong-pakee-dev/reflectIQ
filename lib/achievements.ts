// ─────────────────────────────────────────────────────────────
//  Achievement definitions (shared between server & client)
// ─────────────────────────────────────────────────────────────

export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface AchievementDef {
  code: string;
  title: string;       // Japanese title
  titleTh: string;     // Thai title
  desc: string;        // Thai description
  descJp: string;      // Japanese description
  rarity: Rarity;
  color: string;
  icon: string;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── Common ──
  {
    code: "FIRST_STEP",
    title: "入学",
    titleTh: "ก้าวแรก",
    desc: "เริ่มต้นการประเมิน",
    descJp: "初期評価を開始する",
    rarity: "common",
    color: "#6b7280",
    icon: "◈",
  },
  {
    code: "FIRST_CHECKIN",
    title: "出席確認",
    titleTh: "เช็คอินแรก",
    desc: "ทำการ Check-in ครั้งแรก",
    descJp: "初めてチェックインする",
    rarity: "common",
    color: "#6b7280",
    icon: "◉",
  },
  {
    code: "FIRST_EXAM",
    title: "初試験",
    titleTh: "สอบครั้งแรก",
    desc: "บันทึกผลสอบครั้งแรก",
    descJp: "初めての試験結果を記録する",
    rarity: "common",
    color: "#6b7280",
    icon: "◎",
  },
  {
    code: "NOTE_TAKER",
    title: "記録者",
    titleTh: "นักบันทึก",
    desc: "บันทึกโน้ต 10 รายการ",
    descJp: "ノートを10件記録する",
    rarity: "common",
    color: "#6b7280",
    icon: "◆",
  },
  // ── Rare ──
  {
    code: "SCHOLAR",
    title: "秀才",
    titleTh: "นักวิชาการ",
    desc: "วิชาการ ≥ 90",
    descJp: "学力 ≥ 90",
    rarity: "rare",
    color: "#00d4ff",
    icon: "◎",
  },
  {
    code: "ATHLETE",
    title: "体育会系",
    titleTh: "นักกีฬา",
    desc: "ร่างกาย ≥ 90",
    descJp: "体力 ≥ 90",
    rarity: "rare",
    color: "#22c55e",
    icon: "◉",
  },
  {
    code: "IRON_WILL",
    title: "鋼の意志",
    titleTh: "ใจเหล็ก",
    desc: "จิตใจ ≥ 90",
    descJp: "精神力 ≥ 90",
    rarity: "rare",
    color: "#a855f7",
    icon: "◆",
  },
  {
    code: "SOCIALITE",
    title: "社交家",
    titleTh: "นักสังคม",
    desc: "สังคม ≥ 90",
    descJp: "社交力 ≥ 90",
    rarity: "rare",
    color: "#ec4899",
    icon: "◎",
  },
  {
    code: "COMMANDER",
    title: "指揮官",
    titleTh: "ผู้นำ",
    desc: "ภาวะผู้นำ ≥ 90",
    descJp: "指導力 ≥ 90",
    rarity: "rare",
    color: "#eab308",
    icon: "◇",
  },
  {
    code: "CHAMELEON",
    title: "カメレオン",
    titleTh: "กิ้งก่า",
    desc: "ปรับตัว ≥ 90",
    descJp: "適応力 ≥ 90",
    rarity: "rare",
    color: "#f97316",
    icon: "◐",
  },
  {
    code: "STREAK_7",
    title: "連続出席",
    titleTh: "เช็คอิน 7 วัน",
    desc: "Check-in ติดต่อกัน 7 วัน",
    descJp: "7日間連続チェックイン",
    rarity: "rare",
    color: "#eab308",
    icon: "◈",
  },
  {
    code: "EXAM_PASS",
    title: "合格者",
    titleTh: "ผ่านสอบ",
    desc: "สอบผ่าน 5 วิชา",
    descJp: "5科目に合格する",
    rarity: "rare",
    color: "#00d4ff",
    icon: "◎",
  },
  // ── Epic ──
  {
    code: "ALL_ROUNDER",
    title: "万能者",
    titleTh: "รอบด้าน",
    desc: "ทุก stat ≥ 70",
    descJp: "全stat ≥ 70",
    rarity: "epic",
    color: "#f472b6",
    icon: "◆",
  },
  {
    code: "S_CANDIDATE",
    title: "Sクラス候補",
    titleTh: "ผู้สมัคร S-Class",
    desc: "OAA ≥ 90",
    descJp: "OAA ≥ 90",
    rarity: "epic",
    color: "#ffd700",
    icon: "◈",
  },
  {
    code: "CLASS_UP",
    title: "クラスアップ",
    titleTh: "เลื่อนชั้น",
    desc: "OAA ขึ้น class ใหม่",
    descJp: "OAAが新クラスに昇格",
    rarity: "epic",
    color: "#00d4ff",
    icon: "◉",
  },
  {
    code: "SPECIAL_PASS",
    title: "特別試験合格",
    titleTh: "ผ่าน Special Exam",
    desc: "ผ่าน Special Exam ครั้งแรก",
    descJp: "特別試験に初めて合格する",
    rarity: "epic",
    color: "#f97316",
    icon: "◇",
  },
  // ── Legendary ──
  {
    code: "MILLIONAIRE",
    title: "大富豪",
    titleTh: "เศรษฐี",
    desc: "Private Points ≥ 500,000P",
    descJp: "Private Points ≥ 500,000P",
    rarity: "legendary",
    color: "#ffd700",
    icon: "◈",
  },
  {
    code: "PERFECT",
    title: "完璧主義者",
    titleTh: "นักสมบูรณ์แบบ",
    desc: "ทุก stat = 100",
    descJp: "全stat = 100",
    rarity: "legendary",
    color: "#ffd700",
    icon: "◆",
  },
];

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENT_DEFS.map((a) => [a.code, a]));

export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "COMMON",
  rare: "RARE",
  epic: "EPIC",
  legendary: "LEGENDARY",
};

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "#6b7280",
  rare: "#00d4ff",
  epic: "#a855f7",
  legendary: "#ffd700",
};
