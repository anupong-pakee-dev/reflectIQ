// ─────────────────────────────────────────────────────────────
//  Shared constants — OAA, stats, class ranks, shop
// ─────────────────────────────────────────────────────────────

export type StatId =
  | "academic"
  | "physical"
  | "social"
  | "mental"
  | "leadership"
  | "adaptability";

export type ClassRank = "S" | "A" | "B" | "C" | "D";

export interface StatConfig {
  id: StatId;
  nameJp: string;
  nameTh: string;
  desc: string;
  weight: number;
  color: string;
  icon: string;
}

export const STATS_CONFIG: StatConfig[] = [
  { id: "academic",     nameJp: "学力",   nameTh: "วิชาการ", desc: "การเรียน / ความรู้",             weight: 1.5, color: "#00d4ff", icon: "◎" },
  { id: "physical",     nameJp: "体力",   nameTh: "ร่างกาย", desc: "กีฬา / ออกกำลังกาย",             weight: 1.0, color: "#22c55e", icon: "◉" },
  { id: "social",       nameJp: "社交力", nameTh: "สังคม",   desc: "ความสัมพันธ์ / การสื่อสาร",       weight: 1.0, color: "#ec4899", icon: "◈" },
  { id: "mental",       nameJp: "精神力", nameTh: "จิตใจ",   desc: "ความมั่นคง / ฟื้นตัว",            weight: 1.2, color: "#a855f7", icon: "◆" },
  { id: "leadership",   nameJp: "指導力", nameTh: "ผู้นำ",   desc: "ภาวะผู้นำ / การตัดสินใจ",         weight: 1.0, color: "#eab308", icon: "◇" },
  { id: "adaptability", nameJp: "適応力", nameTh: "ปรับตัว", desc: "ยืดหยุ่น / รับมือความเปลี่ยนแปลง", weight: 0.8, color: "#f97316", icon: "◐" },
];

export const TOTAL_WEIGHT = STATS_CONFIG.reduce((s, c) => s + c.weight, 0); // 6.5

export const STAT_MAP = new Map(STATS_CONFIG.map((s) => [s.id, s]));

export const CLASS_CONFIG: Record<ClassRank, { min: number; max: number; color: string; glow: string; label: string; labelJp: string }> = {
  S: { min: 90, max: 100, color: "#ffd700", glow: "#ffd70040", label: "SUPERIOR",   labelJp: "超越クラス" },
  A: { min: 75, max: 89,  color: "#00d4ff", glow: "#00d4ff33", label: "ADVANCED",   labelJp: "優秀クラス" },
  B: { min: 55, max: 74,  color: "#6366f1", glow: "#6366f133", label: "STANDARD",   labelJp: "標準クラス" },
  C: { min: 35, max: 54,  color: "#f97316", glow: "#f9731622", label: "DEVELOPING", labelJp: "発展クラス" },
  D: { min: 0,  max: 34,  color: "#ef4444", glow: "#ef444422", label: "CRITICAL",   labelJp: "要改善クラス" },
};

export function calcOAA(stats: Record<string, number>): number {
  const weighted = STATS_CONFIG.reduce(
    (sum, s) => sum + (stats[s.id] ?? 0) * s.weight, 0
  );
  return Math.round(weighted / TOTAL_WEIGHT);
}

export function getClassRank(oaa: number): ClassRank {
  if (oaa >= 90) return "S";
  if (oaa >= 75) return "A";
  if (oaa >= 55) return "B";
  if (oaa >= 35) return "C";
  return "D";
}

export function oaaToProgress(oaa: number, rank: ClassRank): number {
  const cfg = CLASS_CONFIG[rank];
  if (rank === "S") return 100;
  return Math.round(((oaa - cfg.min) / (cfg.max - cfg.min)) * 100);
}

// ─── Point Shop items ───────────────────────────────────────

export interface ShopItem {
  id: string;
  name: string;
  nameJp: string;
  desc: string;
  cost: number;
  statId?: StatId;
  boost?: number;
  type: "stat_boost" | "class_boost" | "special";
  color: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: "boost_academic",     name: "ตำราเรียน",       nameJp: "参考書",     desc: "+5 วิชาการ",      cost: 5000,  statId: "academic",     boost: 5,  type: "stat_boost",   color: "#00d4ff" },
  { id: "boost_physical",     name: "อุปกรณ์กีฬา",   nameJp: "スポーツ用具", desc: "+5 ร่างกาย",     cost: 5000,  statId: "physical",     boost: 5,  type: "stat_boost",   color: "#22c55e" },
  { id: "boost_social",       name: "ทักษะสังคม",     nameJp: "コミュ本",    desc: "+5 สังคม",        cost: 5000,  statId: "social",       boost: 5,  type: "stat_boost",   color: "#ec4899" },
  { id: "boost_mental",       name: "การทำสมาธิ",     nameJp: "精神訓練",    desc: "+5 จิตใจ",        cost: 5000,  statId: "mental",       boost: 5,  type: "stat_boost",   color: "#a855f7" },
  { id: "boost_leadership",   name: "คู่มือผู้นำ",   nameJp: "リーダー論",  desc: "+5 ภาวะผู้นำ",    cost: 5000,  statId: "leadership",   boost: 5,  type: "stat_boost",   color: "#eab308" },
  { id: "boost_adaptability", name: "การฝึกปรับตัว", nameJp: "適応訓練",    desc: "+5 ปรับตัว",      cost: 4000,  statId: "adaptability", boost: 5,  type: "stat_boost",   color: "#f97316" },
  { id: "class_boost",        name: "Class Boost",    nameJp: "クラス昇格支援", desc: "+50 Class Points", cost: 10000, type: "class_boost",  color: "#ffd700" },
  { id: "all_round",          name: "แผนการเรียนรอบด้าน", nameJp: "万能訓練計画", desc: "+3 ทุก stat",  cost: 15000, boost: 3,               type: "special",      color: "#f472b6" },
];

// ─── Special Exams ───────────────────────────────────────────

export interface SpecialExam {
  id: string;
  title: string;
  titleJp: string;
  desc: string;
  descJp: string;
  targetStat: StatId;
  requirement: number;  // stat must be >= this to pass
  passReward: { privatePoints: number; classPoints: number; statBoost?: number };
  failPenalty: { privatePoints: number; classPoints: number };
  color: string;
}

export const SPECIAL_EXAMS: SpecialExam[] = [
  {
    id: "academic_test",
    title: "การทดสอบทางวิชาการ",
    titleJp: "学力テスト",
    desc: "วิชาการต้องถึง 65 เพื่อผ่าน",
    descJp: "学力が65以上で合格",
    targetStat: "academic",
    requirement: 65,
    passReward:  { privatePoints: 3000, classPoints: 100, statBoost: 2 },
    failPenalty: { privatePoints: 1500, classPoints: 50 },
    color: "#00d4ff",
  },
  {
    id: "sports_day",
    title: "วันกีฬาสี",
    titleJp: "体育祭",
    desc: "ร่างกายต้องถึง 65 เพื่อผ่าน",
    descJp: "体力が65以上で合格",
    targetStat: "physical",
    requirement: 65,
    passReward:  { privatePoints: 3000, classPoints: 100, statBoost: 2 },
    failPenalty: { privatePoints: 1500, classPoints: 50 },
    color: "#22c55e",
  },
  {
    id: "leadership_trial",
    title: "การทดสอบภาวะผู้นำ",
    titleJp: "指導力試験",
    desc: "ภาวะผู้นำต้องถึง 60 เพื่อผ่าน",
    descJp: "指導力が60以上で合格",
    targetStat: "leadership",
    requirement: 60,
    passReward:  { privatePoints: 4000, classPoints: 150 },
    failPenalty: { privatePoints: 2000, classPoints: 75 },
    color: "#eab308",
  },
  {
    id: "survival_test",
    title: "การทดสอบการอยู่รอด",
    titleJp: "サバイバルテスト",
    desc: "จิตใจต้องถึง 70 เพื่อผ่าน",
    descJp: "精神力が70以上で合格",
    targetStat: "mental",
    requirement: 70,
    passReward:  { privatePoints: 5000, classPoints: 200, statBoost: 3 },
    failPenalty: { privatePoints: 3000, classPoints: 100 },
    color: "#a855f7",
  },
  {
    id: "social_exam",
    title: "การสอบทักษะสังคม",
    titleJp: "社交試験",
    desc: "สังคมต้องถึง 60 เพื่อผ่าน",
    descJp: "社交力が60以上で合格",
    targetStat: "social",
    requirement: 60,
    passReward:  { privatePoints: 3500, classPoints: 120 },
    failPenalty: { privatePoints: 1500, classPoints: 60 },
    color: "#ec4899",
  },
];

// ─── NPC classmates for comparison ───────────────────────────

export const NPC_STUDENTS = [
  { name: "堀北鈴音",     nameRomaji: "Horikita Suzune",     classRank: "A" as ClassRank, oaa: 94 },
  { name: "綾小路清隆",   nameRomaji: "Ayanokoji Kiyotaka",  classRank: "D" as ClassRank, oaa: 99 },
  { name: "一之瀬帆波",   nameRomaji: "Ichinose Honami",     classRank: "B" as ClassRank, oaa: 88 },
  { name: "龍園翔",       nameRomaji: "Ryuuen Kakeru",        classRank: "C" as ClassRank, oaa: 82 },
  { name: "神崎隆二",     nameRomaji: "Kanzaki Ryuji",        classRank: "A" as ClassRank, oaa: 87 },
  { name: "坂柳有栖",     nameRomaji: "Sakayanagi Arisu",    classRank: "A" as ClassRank, oaa: 97 },
];
