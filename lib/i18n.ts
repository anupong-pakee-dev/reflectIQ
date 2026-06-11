export type Lang = "th" | "jp" | "en" | "th-jp";

export interface Translations {
  dateLocale: string;
  systemTagline: string;

  // Tabs
  tabStatus: string; tabStatusSub: string;
  tabParams: string; tabParamsSub: string;
  tabPoints: string; tabPointsSub: string;
  tabExams: string;  tabExamsSub: string;
  tabAchievements: string; tabAchievementsSub: string;

  // Header
  labelStudent: string;
  btnSpecialExam: string;
  btnLogout: string;
  langLabel: string;

  // OAA / Class card
  oaaTitle: string;
  toNextRank: string;
  needsPts: string;
  labelClass: string;
  classLabels: Record<"S"|"A"|"B"|"C"|"D", { label: string; sub: string }>;

  // Student ID card
  labelStudentName: string;
  labelEnrollDate: string;
  labelStreak: string;
  streakUnit: string;
  labelPrivatePoints: string;
  labelClassPoints: string;

  // Panels
  radarTitle: string;
  paramRankTitle: string;
  compareTitle: string;
  youLabel: string;
  activityLogTitle: string;
  entriesLabel: string;
  noteTitle: string;
  notePlaceholder: string;
  noteBtn: string;

  // Stats (per id)
  stats: Record<string, { name: string; nameSub?: string; desc: string }>;

  // Points panel
  balanceTitle: string;
  adjustTitle: string;
  amountLabel: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  btnAdd: string;
  btnSubtract: string;
  txTitle: string;
  noTx: string;

  // Exams panel
  examRecordTitle: string;
  scoreLabel: string;
  maxScoreLabel: string;
  passCriteria: string;
  examNotesPh: string;
  examSubmitBtn: string;
  examHistoryTitle: string;
  noExams: string;
  passLabel: string;
  failLabel: string;
  examSubjects: { id: string; label: string; labelSub?: string }[];

  // Exam quiz
  examQuizDesc: string;
  examQuizStart: string;
  examQuizTag: string;
  examQuizLoading: string;
  examQuizAlreadyDone: string;
  examQuizOneAttemptNote: string;
  examQuizClose: string;
  examQuizPass: string;
  examQuizFail: string;
  examQuizResultNote: string;
  examQuizAnswered: string;
  examQuizPrev: string;
  examQuizNext: string;
  examQuizSubmit: string;
  examQuizSubmitting: string;
  examQuizUnanswered: string;
  examQuizQCount: string;
  examQuizPtEach: string;
  examQuizAttempts: string;
  examQuizWarning: string;

  // Parameters tab
  paramsReadOnlyNote: string;

  // Achievements
  achievementTotal: string;
  lockedDesc: string;

  // Check-in modal
  checkinTitle: string;
  checkinSub: string;
  streakLabel: string;
  checkinBtn: string;
  checkinDismiss: string;
  checkinBonus: string;

  // Special exam modal
  specialExamTitle: string;
  specialExamClose: string;
  canPass: string;
  willFail: string;
  requiredLabel: string;

  // Auth pages (login / register)
  authRequired: string;
  authSub: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  rememberMe: string;
  forgotPwdLink: string;
  loginBtn: string;
  loginBtnLoading: string;
  noAccountText: string;
  registerLinkText: string;
  registerPageTitle: string;
  registerPageSub: string;
  adminNotice: string;
  displayNameLabel: string;
  motivationLabel: string;
  motivationPh: string;
  goalsLabel: string;
  goalsPh: string;
  checkinFreqLabel: string;
  registerBtn: string;
  registerBtnLoading: string;
  hasAccountText: string;
  loginLinkText: string;

  // ── Shared auth pages ────────────────────────────────────────
  backToLogin: string;

  // ── Forgot password page ─────────────────────────────────────
  forgotPwdPageSub: string;
  forgotPwdSubtitle: string;
  forgotPwdSentTitle: string;
  forgotPwdSentHint: string;
  forgotPwdSendBtn: string;
  forgotPwdSendingBtn: string;

  // ── Reset password page ──────────────────────────────────────
  resetPageSub: string;
  resetDoneTitle: string;
  resetDoneDesc: string;
  resetBtn: string;
  resetBtnLoading: string;
  newPasswordLabel: string;
  confirmNewPasswordLabel: string;

  // ── Register success page ────────────────────────────────────
  regSuccessTitle: string;
  regSuccessDesc1: string;
  regSuccessDesc2: string;
  regSuccessStep1: string;
  regSuccessStep2: string;
  regSuccessStep3: string;
  regSuccessBackBtn: string;

  // ── Pending page ─────────────────────────────────────────────
  pendingWaitTag: string;
  pendingRejectedTag: string;
  pendingWaitGreeting: string;
  pendingRejectedGreeting: string;
  pendingWaitDesc: string;
  pendingRejectedDesc: string;
  pendingReasonTag: string;
  pendingRetryNote: string;
  pendingWaitMsg: string;
  pendingSummaryTitle: string;
  pendingCheckinOptions: Record<string, string>;

  // ── Assessment quiz UI ───────────────────────────────────────
  assessPageSub: string;
  assessProtocolLabel: string;
  assessMainTitle: string;
  assessDescNote: string;
  assessDesc1: string;
  assessDesc2: string;
  assessDescWarning: string;
  assessBeginBtn: string;
  assessCalcTag: string;
  assessCalcTitle: string;
  assessBaselineTag: string;
  assessCalcLabel: string;
  assessSavingMsg: string;
  assessErrorTag: string;
  assessErrorDefault: string;
  assessRetryBtn: string;

  // ── Check-in option labels (register page) ───────────────────
  checkinOptionLabels: Record<string, { label: string; desc: string }>;

  // ── Daily Challenge ──────────────────────────────────────────
  challengePracticeBtn: string;
  challengeQCount: string;
  challengeCorrectPts: string;
  challengeWrongPts: string;
  challengeStartBtn: string;
  challengeQuestion: string;
  challengeCorrectLabel: string;
  challengeWrongLabel: string;
  challengeAlreadyDone: string;
  challengeAlreadyDoneSub: string;
  challengeCloseBtn: string;
}

// ─── Thai ────────────────────────────────────────────────────

const th: Translations = {
  dateLocale: "th-TH",
  systemTagline: "โรงเรียนพัฒนาขั้นสูง — ระบบติดตามตนเอง",
  tabStatus: "สถานะ",         tabStatusSub: "",
  tabParams: "พารามิเตอร์",    tabParamsSub: "",
  tabPoints: "คะแนน",         tabPointsSub: "",
  tabExams:  "ข้อสอบ",        tabExamsSub: "",
  tabAchievements: "ความสำเร็จ", tabAchievementsSub: "",
  labelStudent: "นักเรียน",
  btnSpecialExam: "สอบพิเศษ",
  btnLogout: "ออกจากระบบ",
  langLabel: "ภาษา",
  oaaTitle: "การประเมินความสามารถรวม",
  toNextRank: "→ ระดับ",
  needsPts: "ต้องการ",
  labelClass: "ระดับ",
  classLabels: {
    S: { label: "ยอดเยี่ยม",     sub: "ระดับสูงสุด" },
    A: { label: "ดีเยี่ยม",       sub: "ระดับดีมาก" },
    B: { label: "มาตรฐาน",       sub: "ระดับปกติ" },
    C: { label: "กำลังพัฒนา",    sub: "ต้องพัฒนา" },
    D: { label: "ต้องปรับปรุง",  sub: "ระดับวิกฤต" },
  },
  labelStudentName: "ชื่อนักเรียน",
  labelEnrollDate: "วันที่เข้าเรียน",
  labelStreak: "ต่อเนื่อง",
  streakUnit: " วัน",
  labelPrivatePoints: "คะแนนส่วนตัว",
  labelClassPoints: "คะแนนห้องเรียน",
  radarTitle: "แผนภูมิความสามารถ",
  paramRankTitle: "อันดับพารามิเตอร์",
  compareTitle: "เปรียบเทียบชั้นเรียน",
  youLabel: "คุณ",
  activityLogTitle: "บันทึกกิจกรรม",
  entriesLabel: "รายการ",
  noteTitle: "บันทึก",
  notePlaceholder: "บันทึกความคิด...",
  noteBtn: "บันทึก ▶",
  stats: {
    academic:     { name: "วิชาการ",  desc: "การเรียน / ความรู้" },
    physical:     { name: "ร่างกาย",  desc: "กีฬา / ออกกำลังกาย" },
    social:       { name: "สังคม",    desc: "ความสัมพันธ์ / การสื่อสาร" },
    mental:       { name: "จิตใจ",    desc: "ความมั่นคง / ฟื้นตัว" },
    leadership:   { name: "ผู้นำ",    desc: "ภาวะผู้นำ / การตัดสินใจ" },
    adaptability: { name: "ปรับตัว", desc: "ยืดหยุ่น / รับมือความเปลี่ยนแปลง" },
  },
  balanceTitle: "ยอดคะแนนส่วนตัว",
  adjustTitle: "อัพเดทยอดเงิน",
  amountLabel: "จำนวน (P)",
  reasonLabel: "เหตุผล",
  reasonPlaceholder: "เช่น เงินเดือน, ค่าอาหาร...",
  btnAdd: "+ เพิ่ม",
  btnSubtract: "− ลด",
  txTitle: "ประวัติธุรกรรม",
  noTx: "ยังไม่มีธุรกรรม",
  examRecordTitle: "บันทึกผลสอบ",
  scoreLabel: "คะแนน",
  maxScoreLabel: "คะแนนเต็ม",
  passCriteria: "เกณฑ์ผ่าน 60%",
  examNotesPh: "บันทึกเพิ่มเติม...",
  examSubmitBtn: "บันทึกผล ▶",
  examHistoryTitle: "ประวัติการสอบ",
  noExams: "ยังไม่มีผลสอบ",
  passLabel: "ผ่าน",
  failLabel: "ไม่ผ่าน",
  examSubjects: [
    { id: "math",     label: "คณิตศาสตร์" },
    { id: "science",  label: "วิทยาศาสตร์" },
    { id: "language", label: "ภาษา" },
    { id: "history",  label: "สังคมศึกษา" },
    { id: "physical", label: "พลศึกษา" },
    { id: "special",  label: "พิเศษ" },
  ],
  examQuizDesc: "ข้อสอบ 20 ข้อต่อวิชา · ข้อละ 1 คะแนน · ทำได้ครั้งเดียว",
  examQuizStart: "เริ่มสอบ ▶",
  examQuizTag: "ACADEMIC EXAM",
  examQuizLoading: "กำลังโหลดข้อสอบ...",
  examQuizAlreadyDone: "สอบวิชานี้แล้ว",
  examQuizOneAttemptNote: "การสอบนี้ทำได้ครั้งเดียวเท่านั้น",
  examQuizClose: "ปิด",
  examQuizPass: "◉ ผ่าน",
  examQuizFail: "✕ ไม่ผ่าน",
  examQuizResultNote: "ผลการสอบถูกบันทึกแล้ว — ไม่สามารถสอบซ้ำได้",
  examQuizAnswered: "ตอบแล้ว",
  examQuizPrev: "ก่อนหน้า",
  examQuizNext: "ถัดไป",
  examQuizSubmit: "ส่งคำตอบ",
  examQuizSubmitting: "กำลังตรวจ...",
  examQuizUnanswered: "มีข้อที่ยังไม่ได้ตอบ",
  examQuizQCount: "ข้อ",
  examQuizPtEach: "คะแนน/ข้อ",
  examQuizAttempts: "ครั้ง",
  examQuizWarning: "การสอบนี้ทำได้ครั้งเดียวเท่านั้น ไม่มีการเฉลย และผลจะถูกบันทึกถาวร",
  paramsReadOnlyNote: "ค่าพารามิเตอร์ถูกกำหนดโดยระบบจากผลการประเมินเบื้องต้น ไม่สามารถแก้ไขด้วยตนเองได้ ค่าจะเปลี่ยนได้ผ่านการสอบพิเศษเท่านั้น",
  achievementTotal: "ความสำเร็จทั้งหมด",
  lockedDesc: "???",
  checkinTitle: "เช็คอินประจำวัน",
  checkinSub: "เช็คอินประจำวัน",
  streakLabel: "ต่อเนื่อง",
  checkinBtn: "เช็คอิน ◉",
  checkinDismiss: "ข้ามไปก่อน",
  checkinBonus: "◈ โบนัสสตรีค ◈",
  specialExamTitle: "สอบพิเศษ",
  specialExamClose: "ปิด",
  canPass: "ผ่านได้",
  willFail: "คาดว่าไม่ผ่าน",
  requiredLabel: "ต้องการ",
  authRequired: "ต้องยืนยันตัวตน",
  authSub: "เข้าสู่ระบบเพื่อใช้งาน",
  emailLabel: "อีเมล",
  passwordLabel: "รหัสผ่าน",
  confirmPasswordLabel: "ยืนยันรหัสผ่าน",
  rememberMe: "จดจำฉันไว้ (30 วัน)",
  forgotPwdLink: "ลืมรหัสผ่าน?",
  loginBtn: "เข้าสู่ระบบ ▶",
  loginBtnLoading: "กำลังตรวจสอบ...",
  noAccountText: "ยังไม่มีบัญชี?",
  registerLinkText: "สมัครสมาชิก →",
  registerPageTitle: "ใบสมัครนักเรียนใหม่",
  registerPageSub: "ใบสมัครเข้าศึกษา",
  adminNotice: "ใบสมัครจะถูกตรวจสอบโดย Admin ก่อนที่คุณจะสามารถเข้าถึงระบบได้ กรุณากรอกข้อมูลให้ครบถ้วนและตรงไปตรงมา",
  displayNameLabel: "ชื่อที่แสดง",
  motivationLabel: "เหตุผลที่อยากเข้าร่วม",
  motivationPh: "อธิบายเหตุผลที่คุณสนใจระบบนี้... (min 50 ตัวอักษร)",
  goalsLabel: "เป้าหมาย",
  goalsPh: "คุณต้องการบรรลุอะไรจากระบบนี้ภายใน 3–6 เดือน... (min 30 ตัวอักษร)",
  checkinFreqLabel: "ความถี่เช็คอิน",
  registerBtn: "ส่งใบสมัคร ▶",
  registerBtnLoading: "กำลังส่ง...",
  hasAccountText: "มีบัญชีแล้ว?",
  loginLinkText: "เข้าสู่ระบบ →",
  backToLogin: "← กลับไป LOGIN",
  forgotPwdPageSub: "กู้คืนรหัสผ่าน",
  forgotPwdSubtitle: "กรอก email แล้วระบบจะส่ง link รีเซ็ตรหัสผ่านให้คุณ",
  forgotPwdSentTitle: "ส่ง link รีเซ็ตรหัสผ่านแล้ว",
  forgotPwdSentHint: "ตรวจสอบ email ของคุณ (รวมถึงโฟลเดอร์ spam) — Link จะหมดอายุใน 1 ชั่วโมง",
  forgotPwdSendBtn: "SEND RESET LINK ▶",
  forgotPwdSendingBtn: "SENDING...",
  resetPageSub: "ตั้งรหัสผ่านใหม่",
  resetDoneTitle: "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว",
  resetDoneDesc: "กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ",
  resetBtn: "SET NEW PASSWORD ▶",
  resetBtnLoading: "UPDATING...",
  newPasswordLabel: "รหัสผ่านใหม่",
  confirmNewPasswordLabel: "ยืนยันรหัสผ่านใหม่",
  regSuccessTitle: "ส่งใบสมัครเรียบร้อยแล้ว",
  regSuccessDesc1: "ใบสมัครของคุณถูกส่งเข้าสู่ระบบแล้ว Admin จะตรวจสอบและแจ้งผลทาง email ที่คุณระบุไว้",
  regSuccessDesc2: "หากได้รับการอนุมัติ คุณจะสามารถเข้าสู่ระบบและเริ่มติดตามพัฒนาการได้ทันที",
  regSuccessStep1: "รอการตรวจสอบจาก Admin",
  regSuccessStep2: "รับ email แจ้งผลการพิจารณา",
  regSuccessStep3: "เข้าสู่ระบบและเริ่มต้น",
  regSuccessBackBtn: "กลับไปหน้า LOGIN →",
  pendingWaitTag: "◈ PENDING REVIEW",
  pendingRejectedTag: "✗ APPLICATION NOT APPROVED",
  pendingWaitGreeting: "สวัสดี",
  pendingRejectedGreeting: "ขออภัย",
  pendingWaitDesc: "ใบสมัครของคุณอยู่ในระหว่างการพิจารณา Admin จะแจ้งผลทาง email ที่คุณระบุไว้",
  pendingRejectedDesc: "ใบสมัครของคุณยังไม่ผ่านการพิจารณา",
  pendingReasonTag: "เหตุผล",
  pendingRetryNote: "คุณสามารถสมัครใหม่ได้หลังจาก 7 วัน",
  pendingWaitMsg: "WAITING FOR ADMIN REVIEW...",
  pendingSummaryTitle: "APPLICATION SUMMARY",
  pendingCheckinOptions: { daily: "ทุกวัน", "3x_week": "3 วัน/สัปดาห์", weekly: "สัปดาห์ละครั้ง" },
  assessPageSub: "INITIAL ABILITY ASSESSMENT / การประเมินความสามารถ",
  assessProtocolLabel: "OAA ASSESSMENT PROTOCOL",
  assessMainTitle: "การประเมินความสามารถเบื้องต้น",
  assessDescNote: "◈ คำอธิบาย",
  assessDesc1: "แบบทดสอบนี้ประกอบด้วย 30 ข้อ ครอบคลุม 6 ด้านความสามารถ ได้แก่ วิชาการ ร่างกาย สังคม จิตใจ ภาวะผู้นำ และความสามารถปรับตัว",
  assessDesc2: "ผลลัพธ์จะกำหนดค่าพารามิเตอร์เริ่มต้น (สูงสุด 2/100) ของคุณ ระบบกำหนด baseline ต่ำโดยเจตนา — คุณต้องพิสูจน์ความสามารถผ่านการใช้งานจริง",
  assessDescWarning: "⚠ ค่าพารามิเตอร์จะถูกกำหนดโดยระบบเท่านั้น ไม่สามารถแก้ไขด้วยตนเองได้",
  assessBeginBtn: "BEGIN ASSESSMENT ▶",
  assessCalcTag: "PROCESSING RESULTS",
  assessCalcTitle: "กำลังประมวลผล...",
  assessBaselineTag: "INITIAL BASELINE — PROVE YOURSELF THROUGH ACTION",
  assessCalcLabel: "CALCULATING OAA...",
  assessSavingMsg: "SAVING TO DATABASE...",
  assessErrorTag: "SAVE ERROR",
  assessErrorDefault: "เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่",
  assessRetryBtn: "ลองใหม่ / RETRY ▶",
  checkinOptionLabels: {
    daily:     { label: "ทุกวัน",        desc: "เช็คอินทุกวัน" },
    "3x_week": { label: "3 วัน/สัปดาห์", desc: "3 ครั้งต่อสัปดาห์" },
    weekly:    { label: "1 วัน/สัปดาห์", desc: "สัปดาห์ละครั้ง" },
  },
  challengePracticeBtn: "ฝึกทักษะ ▶",
  challengeQCount: "20 ข้อ",
  challengeCorrectPts: "CP ต่อข้อ (ถูก)",
  challengeWrongPts: "CP ต่อข้อ (ผิด)",
  challengeStartBtn: "เริ่มทำ ▶",
  challengeQuestion: "ข้อที่",
  challengeCorrectLabel: "ถูก",
  challengeWrongLabel: "ผิด",
  challengeAlreadyDone: "ทำครบแล้ววันนี้",
  challengeAlreadyDoneSub: "◈ กลับมาพรุ่งนี้",
  challengeCloseBtn: "ปิด ✕",
};

// ─── Japanese ────────────────────────────────────────────────

const jp: Translations = {
  dateLocale: "ja-JP",
  systemTagline: "先進育成高校 — セルフモニタリング",
  tabStatus: "状態",   tabStatusSub: "",
  tabParams: "パラメータ", tabParamsSub: "",
  tabPoints: "ポイント", tabPointsSub: "",
  tabExams:  "試験",   tabExamsSub: "",
  tabAchievements: "実績", tabAchievementsSub: "",
  labelStudent: "生徒",
  btnSpecialExam: "特別試験",
  btnLogout: "ログアウト",
  langLabel: "言語",
  oaaTitle: "総合能力評価",
  toNextRank: "→",
  needsPts: "必要",
  labelClass: "クラス",
  classLabels: {
    S: { label: "超越",   sub: "超越クラス" },
    A: { label: "優秀",   sub: "優秀クラス" },
    B: { label: "標準",   sub: "標準クラス" },
    C: { label: "発展",   sub: "発展クラス" },
    D: { label: "要改善", sub: "要改善クラス" },
  },
  labelStudentName: "生徒氏名",
  labelEnrollDate: "入学日",
  labelStreak: "連続出席",
  streakUnit: "日",
  labelPrivatePoints: "プライベートポイント",
  labelClassPoints: "クラスポイント",
  radarTitle: "能力レーダー",
  paramRankTitle: "パラメータランク",
  compareTitle: "クラス比較",
  youLabel: "あなた",
  activityLogTitle: "活動ログ",
  entriesLabel: "件",
  noteTitle: "メモ",
  notePlaceholder: "考えを記録...",
  noteBtn: "記録する ▶",
  stats: {
    academic:     { name: "学力",   desc: "学習・知識" },
    physical:     { name: "体力",   desc: "スポーツ・体力強化" },
    social:       { name: "社交力", desc: "人間関係・コミュニケーション" },
    mental:       { name: "精神力", desc: "精神安定・回復力" },
    leadership:   { name: "指導力", desc: "リーダーシップ・意思決定" },
    adaptability: { name: "適応力", desc: "柔軟性・変化対応力" },
  },
  balanceTitle: "ポイント残高",
  adjustTitle: "残高更新",
  amountLabel: "金額 (P)",
  reasonLabel: "理由",
  reasonPlaceholder: "例：給料、食費...",
  btnAdd: "+ 追加",
  btnSubtract: "− 減算",
  txTitle: "取引履歴",
  noTx: "取引なし",
  examRecordTitle: "試験結果記録",
  scoreLabel: "スコア",
  maxScoreLabel: "満点",
  passCriteria: "合格基準 60%",
  examNotesPh: "メモ...",
  examSubmitBtn: "記録する ▶",
  examHistoryTitle: "試験履歴",
  noExams: "試験なし",
  passLabel: "合格",
  failLabel: "不合格",
  examSubjects: [
    { id: "math",     label: "数学" },
    { id: "science",  label: "理科" },
    { id: "language", label: "言語" },
    { id: "history",  label: "社会" },
    { id: "physical", label: "体育" },
    { id: "special",  label: "特別" },
  ],
  examQuizDesc: "20問/科目 · 1問1点 · 1回限り",
  examQuizStart: "試験開始 ▶",
  examQuizTag: "ACADEMIC EXAM",
  examQuizLoading: "試験を読み込み中...",
  examQuizAlreadyDone: "受験済み",
  examQuizOneAttemptNote: "この試験は1回のみ受験可能です",
  examQuizClose: "閉じる",
  examQuizPass: "◉ 合格",
  examQuizFail: "✕ 不合格",
  examQuizResultNote: "結果が記録されました — 再受験不可",
  examQuizAnswered: "回答済み",
  examQuizPrev: "前へ",
  examQuizNext: "次へ",
  examQuizSubmit: "解答を提出",
  examQuizSubmitting: "採点中...",
  examQuizUnanswered: "未回答の問題があります",
  examQuizQCount: "問",
  examQuizPtEach: "点/問",
  examQuizAttempts: "回",
  examQuizWarning: "この試験は1回のみ受験可能です。解答は表示されず、結果は永久に記録されます。",
  paramsReadOnlyNote: "パラメータ値はシステムによる初期評価で決定されます。手動での変更はできません。特別試験のみ変更可能です。",
  achievementTotal: "取得済み実績",
  lockedDesc: "???",
  checkinTitle: "デイリーチェックイン",
  checkinSub: "デイリーチェックイン",
  streakLabel: "連続出席",
  checkinBtn: "チェックイン ◉",
  checkinDismiss: "後で",
  checkinBonus: "◈ ストリークボーナス ◈",
  specialExamTitle: "特別試験",
  specialExamClose: "閉じる",
  canPass: "合格可",
  willFail: "失敗予測",
  requiredLabel: "必要",
  authRequired: "認証が必要です",
  authSub: "ログイン",
  emailLabel: "メールアドレス",
  passwordLabel: "パスワード",
  confirmPasswordLabel: "パスワード確認",
  rememberMe: "ログイン状態を保持 (30日間)",
  forgotPwdLink: "パスワードを忘れた?",
  loginBtn: "ログイン ▶",
  loginBtnLoading: "認証中...",
  noAccountText: "アカウントがない方は",
  registerLinkText: "登録する →",
  registerPageTitle: "新入生申請",
  registerPageSub: "入学申請",
  adminNotice: "申請内容は管理者が確認します。正確な情報を入力してください。",
  displayNameLabel: "表示名",
  motivationLabel: "参加動機",
  motivationPh: "このシステムに興味を持った理由を説明してください... (50文字以上)",
  goalsLabel: "目標",
  goalsPh: "3〜6ヶ月で達成したいことを書いてください... (30文字以上)",
  checkinFreqLabel: "チェックイン頻度",
  registerBtn: "申請を送信 ▶",
  registerBtnLoading: "送信中...",
  hasAccountText: "すでにアカウントをお持ちですか?",
  loginLinkText: "ログインする →",
  backToLogin: "← LOGINに戻る",
  forgotPwdPageSub: "パスワード回復",
  forgotPwdSubtitle: "メールアドレスを入力するとリセットリンクを送信します",
  forgotPwdSentTitle: "リセットリンクを送信しました",
  forgotPwdSentHint: "メールを確認してください（スパムフォルダも含む）— リンクは1時間で失効します",
  forgotPwdSendBtn: "SEND RESET LINK ▶",
  forgotPwdSendingBtn: "送信中...",
  resetPageSub: "新しいパスワードの設定",
  resetDoneTitle: "パスワードを変更しました",
  resetDoneDesc: "新しいパスワードでログインしてください",
  resetBtn: "SET NEW PASSWORD ▶",
  resetBtnLoading: "更新中...",
  newPasswordLabel: "新しいパスワード",
  confirmNewPasswordLabel: "パスワードの確認",
  regSuccessTitle: "申請を送信しました",
  regSuccessDesc1: "申請内容は管理者が確認します。メールで結果をお知らせします",
  regSuccessDesc2: "承認後、すぐにシステムにログインして活動を開始できます",
  regSuccessStep1: "管理者の審査待ち",
  regSuccessStep2: "結果をメールで受信",
  regSuccessStep3: "ログインして開始",
  regSuccessBackBtn: "LOGINに戻る →",
  pendingWaitTag: "◈ PENDING REVIEW / 審査中",
  pendingRejectedTag: "✗ APPLICATION NOT APPROVED / 不承認",
  pendingWaitGreeting: "ようこそ",
  pendingRejectedGreeting: "申し訳ありません",
  pendingWaitDesc: "申請内容を審査中です。結果は登録したメールアドレスにお知らせします",
  pendingRejectedDesc: "申請が承認されませんでした",
  pendingReasonTag: "理由",
  pendingRetryNote: "7日後に再申請できます",
  pendingWaitMsg: "WAITING FOR ADMIN REVIEW...",
  pendingSummaryTitle: "APPLICATION SUMMARY / 申請内容",
  pendingCheckinOptions: { daily: "毎日", "3x_week": "週3回", weekly: "週1回" },
  assessPageSub: "INITIAL ABILITY ASSESSMENT / 初期能力評価",
  assessProtocolLabel: "OAA ASSESSMENT PROTOCOL",
  assessMainTitle: "初期能力評価",
  assessDescNote: "◈ 説明",
  assessDesc1: "このテストは30問で構成されており、学力・体力・社交力・精神力・指導力・適応力の6分野を評価します",
  assessDesc2: "結果は初期パラメータ値（最大2/100）を決定します。低い baseline は意図的です — 実際の活動で実力を証明してください",
  assessDescWarning: "⚠ パラメータ値はシステムによってのみ決定されます。手動では変更できません",
  assessBeginBtn: "BEGIN ASSESSMENT ▶",
  assessCalcTag: "PROCESSING RESULTS",
  assessCalcTitle: "処理中...",
  assessBaselineTag: "INITIAL BASELINE — PROVE YOURSELF THROUGH ACTION",
  assessCalcLabel: "CALCULATING OAA...",
  assessSavingMsg: "データを保存中...",
  assessErrorTag: "SAVE ERROR",
  assessErrorDefault: "データの保存中にエラーが発生しました。再試行してください",
  assessRetryBtn: "再試行 / RETRY ▶",
  checkinOptionLabels: {
    daily:     { label: "毎日",  desc: "毎日チェックイン" },
    "3x_week": { label: "週3回", desc: "週3日チェックイン" },
    weekly:    { label: "週1回", desc: "週1回チェックイン" },
  },
  challengePracticeBtn: "練習する ▶",
  challengeQCount: "20問",
  challengeCorrectPts: "CP/正解",
  challengeWrongPts: "CP/不正解",
  challengeStartBtn: "開始 ▶",
  challengeQuestion: "問",
  challengeCorrectLabel: "正解",
  challengeWrongLabel: "不正解",
  challengeAlreadyDone: "本日完了",
  challengeAlreadyDoneSub: "◈ 明日また挑戦",
  challengeCloseBtn: "閉じる ✕",
};

// ─── English ─────────────────────────────────────────────────

const en: Translations = {
  dateLocale: "en-US",
  systemTagline: "ADVANCED NURTURING HIGH SCHOOL — SELF-MONITORING",
  tabStatus: "STATUS",       tabStatusSub: "",
  tabParams: "PARAMETERS",   tabParamsSub: "",
  tabPoints: "POINTS",       tabPointsSub: "",
  tabExams:  "EXAMS",        tabExamsSub: "",
  tabAchievements: "ACHIEVEMENTS", tabAchievementsSub: "",
  labelStudent: "STUDENT",
  btnSpecialExam: "SPECIAL EXAM",
  btnLogout: "LOGOUT",
  langLabel: "LANG",
  oaaTitle: "OVERALL ABILITY ASSESSMENT",
  toNextRank: "→",
  needsPts: "needs",
  labelClass: "CLASS",
  classLabels: {
    S: { label: "SUPERIOR",   sub: "TRANSCENDENT" },
    A: { label: "ADVANCED",   sub: "EXCELLENT" },
    B: { label: "STANDARD",   sub: "AVERAGE" },
    C: { label: "DEVELOPING", sub: "BELOW AVG" },
    D: { label: "CRITICAL",   sub: "NEEDS WORK" },
  },
  labelStudentName: "STUDENT NAME",
  labelEnrollDate: "ENROLLED",
  labelStreak: "STREAK",
  streakUnit: " days",
  labelPrivatePoints: "PRIVATE POINTS",
  labelClassPoints: "CLASS POINTS",
  radarTitle: "ABILITY RADAR",
  paramRankTitle: "PARAMETER RANK",
  compareTitle: "CLASS COMPARISON",
  youLabel: "YOU",
  activityLogTitle: "ACTIVITY LOG",
  entriesLabel: "entries",
  noteTitle: "NOTE",
  notePlaceholder: "Record your thoughts...",
  noteBtn: "LOG NOTE ▶",
  stats: {
    academic:     { name: "Academic",     desc: "Learning & Knowledge" },
    physical:     { name: "Physical",     desc: "Sports & Fitness" },
    social:       { name: "Social",       desc: "Relationships & Communication" },
    mental:       { name: "Mental",       desc: "Stability & Resilience" },
    leadership:   { name: "Leadership",   desc: "Leadership & Decision Making" },
    adaptability: { name: "Adaptability", desc: "Flexibility & Adaptation" },
  },
  balanceTitle: "PRIVATE POINTS BALANCE",
  adjustTitle: "UPDATE BALANCE",
  amountLabel: "AMOUNT (P)",
  reasonLabel: "REASON",
  reasonPlaceholder: "e.g. Salary, Food expense...",
  btnAdd: "+ ADD",
  btnSubtract: "− SUBTRACT",
  txTitle: "TRANSACTION HISTORY",
  noTx: "No transactions yet",
  examRecordTitle: "RECORD EXAM RESULT",
  scoreLabel: "SCORE",
  maxScoreLabel: "MAX SCORE",
  passCriteria: "Pass criteria: 60%",
  examNotesPh: "Additional notes...",
  examSubmitBtn: "SUBMIT RESULT ▶",
  examHistoryTitle: "EXAM HISTORY",
  noExams: "No exam results yet",
  passLabel: "PASS",
  failLabel: "FAIL",
  examSubjects: [
    { id: "math",     label: "Mathematics" },
    { id: "science",  label: "Science" },
    { id: "language", label: "Language" },
    { id: "history",  label: "Social Studies" },
    { id: "physical", label: "Physical Ed." },
    { id: "special",  label: "Special" },
  ],
  examQuizDesc: "20 questions/subject · 1 pt each · one attempt only",
  examQuizStart: "START EXAM ▶",
  examQuizTag: "ACADEMIC EXAM",
  examQuizLoading: "LOADING EXAM...",
  examQuizAlreadyDone: "ALREADY ATTEMPTED",
  examQuizOneAttemptNote: "This exam can only be taken once.",
  examQuizClose: "CLOSE",
  examQuizPass: "◉ PASS",
  examQuizFail: "✕ FAIL",
  examQuizResultNote: "Result recorded — retakes are not allowed.",
  examQuizAnswered: "answered",
  examQuizPrev: "PREV",
  examQuizNext: "NEXT",
  examQuizSubmit: "SUBMIT ANSWERS",
  examQuizSubmitting: "Grading...",
  examQuizUnanswered: "Some questions are unanswered",
  examQuizQCount: "questions",
  examQuizPtEach: "pt each",
  examQuizAttempts: "attempt",
  examQuizWarning: "This exam can be taken only once. No answer key is shown, and the result is recorded permanently.",
  paramsReadOnlyNote: "Parameters are determined by the system from your initial assessment. They cannot be edited manually. Only Special Exams can alter them.",
  achievementTotal: "TOTAL UNLOCKED",
  lockedDesc: "???",
  checkinTitle: "DAILY CHECK-IN",
  checkinSub: "Daily Check-In",
  streakLabel: "CURRENT STREAK",
  checkinBtn: "CHECK IN ◉",
  checkinDismiss: "Skip for now",
  checkinBonus: "◈ STREAK BONUS ACTIVE ◈",
  specialExamTitle: "SPECIAL EXAM",
  specialExamClose: "CLOSE",
  canPass: "CAN PASS",
  willFail: "WILL FAIL",
  requiredLabel: "required",
  authRequired: "AUTHENTICATION REQUIRED",
  authSub: "Sign in to continue",
  emailLabel: "EMAIL ADDRESS",
  passwordLabel: "PASSWORD",
  confirmPasswordLabel: "CONFIRM PASSWORD",
  rememberMe: "REMEMBER ME (30 days)",
  forgotPwdLink: "FORGOT PASSWORD?",
  loginBtn: "LOGIN ▶",
  loginBtnLoading: "AUTHENTICATING...",
  noAccountText: "No account?",
  registerLinkText: "Register →",
  registerPageTitle: "NEW STUDENT APPLICATION",
  registerPageSub: "Apply to join ReflectIQ",
  adminNotice: "Your application will be reviewed by an Admin before you can access the system. Please provide accurate information.",
  displayNameLabel: "DISPLAY NAME",
  motivationLabel: "MOTIVATION",
  motivationPh: "Explain why you're interested in this system... (min 50 chars)",
  goalsLabel: "GOALS",
  goalsPh: "What do you want to achieve in 3–6 months... (min 30 chars)",
  checkinFreqLabel: "CHECK-IN FREQUENCY",
  registerBtn: "SUBMIT APPLICATION ▶",
  registerBtnLoading: "SUBMITTING...",
  hasAccountText: "Already have an account?",
  loginLinkText: "Login →",
  backToLogin: "← Back to LOGIN",
  forgotPwdPageSub: "PASSWORD RECOVERY",
  forgotPwdSubtitle: "Enter your email and we'll send you a reset link",
  forgotPwdSentTitle: "Reset link sent",
  forgotPwdSentHint: "Check your email (including spam) — link expires in 1 hour",
  forgotPwdSendBtn: "SEND RESET LINK ▶",
  forgotPwdSendingBtn: "SENDING...",
  resetPageSub: "SET NEW PASSWORD",
  resetDoneTitle: "Password updated",
  resetDoneDesc: "Please log in with your new password",
  resetBtn: "SET NEW PASSWORD ▶",
  resetBtnLoading: "UPDATING...",
  newPasswordLabel: "NEW PASSWORD",
  confirmNewPasswordLabel: "CONFIRM NEW PASSWORD",
  regSuccessTitle: "Application submitted",
  regSuccessDesc1: "Your application has been submitted. An admin will review it and notify you by email",
  regSuccessDesc2: "Once approved, you can log in and start tracking your progress immediately",
  regSuccessStep1: "Awaiting admin review",
  regSuccessStep2: "Receive email notification",
  regSuccessStep3: "Log in and get started",
  regSuccessBackBtn: "Back to LOGIN →",
  pendingWaitTag: "◈ PENDING REVIEW",
  pendingRejectedTag: "✗ APPLICATION NOT APPROVED",
  pendingWaitGreeting: "Hello",
  pendingRejectedGreeting: "Sorry",
  pendingWaitDesc: "Your application is under review. The admin will notify you by email",
  pendingRejectedDesc: "Your application was not approved at this time",
  pendingReasonTag: "REASON",
  pendingRetryNote: "You may reapply after 7 days",
  pendingWaitMsg: "WAITING FOR ADMIN REVIEW...",
  pendingSummaryTitle: "APPLICATION SUMMARY",
  pendingCheckinOptions: { daily: "Daily", "3x_week": "3x / week", weekly: "Weekly" },
  assessPageSub: "INITIAL ABILITY ASSESSMENT",
  assessProtocolLabel: "OAA ASSESSMENT PROTOCOL",
  assessMainTitle: "Initial Ability Assessment",
  assessDescNote: "◈ Description",
  assessDesc1: "This test consists of 30 questions covering 6 ability areas: Academic, Physical, Social, Mental, Leadership, and Adaptability",
  assessDesc2: "Results determine your initial parameters (max 2/100). Low baseline is intentional — prove your abilities through real activity",
  assessDescWarning: "⚠ Parameters are determined by the system only and cannot be edited manually",
  assessBeginBtn: "BEGIN ASSESSMENT ▶",
  assessCalcTag: "PROCESSING RESULTS",
  assessCalcTitle: "Processing...",
  assessBaselineTag: "INITIAL BASELINE — PROVE YOURSELF THROUGH ACTION",
  assessCalcLabel: "CALCULATING OAA...",
  assessSavingMsg: "SAVING TO DATABASE...",
  assessErrorTag: "SAVE ERROR",
  assessErrorDefault: "Failed to save. Please try again",
  assessRetryBtn: "RETRY ▶",
  checkinOptionLabels: {
    daily:     { label: "Daily",     desc: "Check in every day" },
    "3x_week": { label: "3x / week", desc: "3 days per week" },
    weekly:    { label: "Weekly",    desc: "Once per week" },
  },
  challengePracticeBtn: "PRACTICE ▶",
  challengeQCount: "20 questions",
  challengeCorrectPts: "CP / correct",
  challengeWrongPts: "CP / wrong",
  challengeStartBtn: "START ▶",
  challengeQuestion: "Q",
  challengeCorrectLabel: "CORRECT",
  challengeWrongLabel: "WRONG",
  challengeAlreadyDone: "Already completed today",
  challengeAlreadyDoneSub: "◈ Come back tomorrow",
  challengeCloseBtn: "CLOSE ✕",
};

// ─── Thai + Japanese (mixed, default) ────────────────────────

const thJp: Translations = {
  dateLocale: "th-TH",
  systemTagline: "ADVANCED NURTURING HIGH SCHOOL — SELF-MONITORING",
  tabStatus: "STATUS",       tabStatusSub: "状態",
  tabParams: "PARAMETERS",   tabParamsSub: "パラメータ",
  tabPoints: "POINTS",       tabPointsSub: "ポイント",
  tabExams:  "EXAMS",        tabExamsSub: "試験",
  tabAchievements: "ACHIEVEMENTS", tabAchievementsSub: "実績",
  labelStudent: "STUDENT",
  btnSpecialExam: "特別試験",
  btnLogout: "LOGOUT",
  langLabel: "LANG",
  oaaTitle: "OVERALL ABILITY ASSESSMENT",
  toNextRank: "→",
  needsPts: "ต้องการ",
  labelClass: "CLASS",
  classLabels: {
    S: { label: "SUPERIOR",   sub: "超越クラス" },
    A: { label: "ADVANCED",   sub: "優秀クラス" },
    B: { label: "STANDARD",   sub: "標準クラス" },
    C: { label: "DEVELOPING", sub: "発展クラス" },
    D: { label: "CRITICAL",   sub: "要改善クラス" },
  },
  labelStudentName: "STUDENT NAME",
  labelEnrollDate: "入学日",
  labelStreak: "連続出席",
  streakUnit: "日",
  labelPrivatePoints: "PRIVATE POINTS",
  labelClassPoints: "CLASS POINTS",
  radarTitle: "ABILITY RADAR / 能力レーダー",
  paramRankTitle: "PARAMETER RANK",
  compareTitle: "CLASS COMPARISON / クラス比較",
  youLabel: "あなた",
  activityLogTitle: "ACTIVITY LOG",
  entriesLabel: "entries",
  noteTitle: "NOTE / メモ",
  notePlaceholder: "บันทึกความคิด...",
  noteBtn: "LOG NOTE ▶",
  stats: {
    academic:     { name: "学力",   nameSub: "วิชาการ", desc: "การเรียน / ความรู้" },
    physical:     { name: "体力",   nameSub: "ร่างกาย", desc: "กีฬา / ออกกำลังกาย" },
    social:       { name: "社交力", nameSub: "สังคม",   desc: "ความสัมพันธ์ / การสื่อสาร" },
    mental:       { name: "精神力", nameSub: "จิตใจ",   desc: "ความมั่นคง / ฟื้นตัว" },
    leadership:   { name: "指導力", nameSub: "ผู้นำ",   desc: "ภาวะผู้นำ / การตัดสินใจ" },
    adaptability: { name: "適応力", nameSub: "ปรับตัว", desc: "ยืดหยุ่น / รับมือความเปลี่ยนแปลง" },
  },
  balanceTitle: "PRIVATE POINTS BALANCE",
  adjustTitle: "อัพเดทยอดเงิน / UPDATE BALANCE",
  amountLabel: "จำนวน (P)",
  reasonLabel: "เหตุผล / REASON",
  reasonPlaceholder: "เช่น เงินเดือน, ค่าอาหาร...",
  btnAdd: "+ เพิ่ม (ADD)",
  btnSubtract: "− ลด (SUBTRACT)",
  txTitle: "TRANSACTION HISTORY",
  noTx: "ยังไม่มีธุรกรรม",
  examRecordTitle: "RECORD EXAM RESULT / 試験記録",
  scoreLabel: "SCORE",
  maxScoreLabel: "MAX SCORE",
  passCriteria: "เกณฑ์ผ่าน 60%",
  examNotesPh: "บันทึกเพิ่มเติม...",
  examSubmitBtn: "SUBMIT RESULT ▶",
  examHistoryTitle: "EXAM HISTORY",
  noExams: "ยังไม่มีผลสอบ",
  passLabel: "PASS",
  failLabel: "FAIL",
  examSubjects: [
    { id: "math",     label: "คณิตศาสตร์",   labelSub: "数学" },
    { id: "science",  label: "วิทยาศาสตร์", labelSub: "理科" },
    { id: "language", label: "ภาษา",         labelSub: "言語" },
    { id: "history",  label: "สังคม",         labelSub: "社会" },
    { id: "physical", label: "พลศึกษา",      labelSub: "体育" },
    { id: "special",  label: "พิเศษ",         labelSub: "特別" },
  ],
  examQuizDesc: "20 ข้อ/วิชา · ข้อละ 1 คะแนน · ทำได้ครั้งเดียว",
  examQuizStart: "เริ่มสอบ ▶",
  examQuizTag: "ACADEMIC EXAM",
  examQuizLoading: "กำลังโหลดข้อสอบ...",
  examQuizAlreadyDone: "สอบวิชานี้แล้ว",
  examQuizOneAttemptNote: "การสอบนี้ทำได้ครั้งเดียวเท่านั้น",
  examQuizClose: "ปิด",
  examQuizPass: "◉ PASS / ผ่าน",
  examQuizFail: "✕ FAIL / ไม่ผ่าน",
  examQuizResultNote: "ผลบันทึกแล้ว — ไม่สามารถสอบซ้ำได้",
  examQuizAnswered: "ตอบแล้ว",
  examQuizPrev: "ก่อนหน้า",
  examQuizNext: "ถัดไป",
  examQuizSubmit: "ส่งคำตอบ",
  examQuizSubmitting: "กำลังตรวจ...",
  examQuizUnanswered: "มีข้อที่ยังไม่ได้ตอบ",
  examQuizQCount: "ข้อ",
  examQuizPtEach: "คะแนน/ข้อ",
  examQuizAttempts: "ครั้ง",
  examQuizWarning: "การสอบนี้ทำได้ครั้งเดียวเท่านั้น ไม่มีการเฉลย และผลจะถูกบันทึกถาวร",
  paramsReadOnlyNote: "ค่าพารามิเตอร์ถูกกำหนดโดยระบบจากผลการประเมินเบื้องต้น (初期評価) ไม่สามารถแก้ไขด้วยตนเอง ค่าจะเปลี่ยนได้ผ่านการสอบพิเศษ (特別試験) เท่านั้น",
  achievementTotal: "TOTAL UNLOCKED",
  lockedDesc: "???",
  checkinTitle: "DAILY CHECK-IN",
  checkinSub: "デイリーチェックイン",
  streakLabel: "CURRENT STREAK",
  checkinBtn: "CHECK IN ◉",
  checkinDismiss: "ข้ามไปก่อน / 後で",
  checkinBonus: "◈ STREAK BONUS ACTIVE ◈",
  specialExamTitle: "SPECIAL EXAM / 特別試験",
  specialExamClose: "CLOSE",
  canPass: "PASS可",
  willFail: "FAIL予測",
  requiredLabel: "required",
  authRequired: "AUTHENTICATION REQUIRED",
  authSub: "ログイン / เข้าสู่ระบบ",
  emailLabel: "EMAIL ADDRESS",
  passwordLabel: "PASSWORD / パスワード",
  confirmPasswordLabel: "CONFIRM PASSWORD",
  rememberMe: "REMEMBER ME (30 days)",
  forgotPwdLink: "FORGOT PASSWORD?",
  loginBtn: "LOGIN ▶",
  loginBtnLoading: "AUTHENTICATING...",
  noAccountText: "ยังไม่มีบัญชี?",
  registerLinkText: "สมัครสมาชิก →",
  registerPageTitle: "NEW STUDENT APPLICATION",
  registerPageSub: "入学申請",
  adminNotice: "◈ ใบสมัครจะถูกตรวจสอบโดย Admin ก่อนที่คุณจะสามารถเข้าถึงระบบได้ กรุณากรอกข้อมูลให้ครบถ้วนและตรงไปตรงมา",
  displayNameLabel: "DISPLAY NAME / 表示名",
  motivationLabel: "MOTIVATION / เหตุผลที่อยากเข้าร่วม",
  motivationPh: "อธิบายเหตุผลที่คุณสนใจระบบนี้... (min 50 ตัวอักษร)",
  goalsLabel: "GOALS / เป้าหมาย",
  goalsPh: "คุณต้องการบรรลุอะไรจากระบบนี้ภายใน 3–6 เดือน... (min 30 ตัวอักษร)",
  checkinFreqLabel: "CHECK-IN FREQUENCY / ความถี่",
  registerBtn: "SUBMIT APPLICATION ▶",
  registerBtnLoading: "SUBMITTING...",
  hasAccountText: "มีบัญชีแล้ว?",
  loginLinkText: "เข้าสู่ระบบ →",
  backToLogin: "← กลับไป LOGIN",
  forgotPwdPageSub: "PASSWORD RECOVERY / パスワード回復",
  forgotPwdSubtitle: "กรอก email แล้วระบบจะส่ง link รีเซ็ตรหัสผ่านให้คุณ",
  forgotPwdSentTitle: "ส่ง link รีเซ็ตรหัสผ่านแล้ว",
  forgotPwdSentHint: "ตรวจสอบ email ของคุณ (รวมถึงโฟลเดอร์ spam) — Link จะหมดอายุใน 1 ชั่วโมง",
  forgotPwdSendBtn: "SEND RESET LINK ▶",
  forgotPwdSendingBtn: "SENDING...",
  resetPageSub: "SET NEW PASSWORD / 新しいパスワード",
  resetDoneTitle: "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว",
  resetDoneDesc: "กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ",
  resetBtn: "SET NEW PASSWORD ▶",
  resetBtnLoading: "UPDATING...",
  newPasswordLabel: "NEW PASSWORD / รหัสผ่านใหม่",
  confirmNewPasswordLabel: "CONFIRM NEW PASSWORD",
  regSuccessTitle: "ส่งใบสมัครเรียบร้อยแล้ว",
  regSuccessDesc1: "ใบสมัครของคุณถูกส่งเข้าสู่ระบบแล้ว Admin จะตรวจสอบและแจ้งผลทาง email ที่คุณระบุไว้",
  regSuccessDesc2: "หากได้รับการอนุมัติ คุณจะสามารถเข้าสู่ระบบและเริ่มติดตามพัฒนาการได้ทันที",
  regSuccessStep1: "รอการตรวจสอบจาก Admin / 管理者の審査待ち",
  regSuccessStep2: "รับ email แจ้งผลการพิจารณา",
  regSuccessStep3: "เข้าสู่ระบบและเริ่มต้น",
  regSuccessBackBtn: "กลับไปหน้า LOGIN →",
  pendingWaitTag: "◈ PENDING REVIEW / 審査中",
  pendingRejectedTag: "✗ APPLICATION NOT APPROVED / 不承認",
  pendingWaitGreeting: "สวัสดี",
  pendingRejectedGreeting: "ขออภัย",
  pendingWaitDesc: "ใบสมัครของคุณอยู่ในระหว่างการพิจารณา Admin จะแจ้งผลทาง email ที่คุณระบุไว้",
  pendingRejectedDesc: "ใบสมัครของคุณยังไม่ผ่านการพิจารณา",
  pendingReasonTag: "REASON / เหตุผล",
  pendingRetryNote: "คุณสามารถสมัครใหม่ได้หลังจาก 7 วัน",
  pendingWaitMsg: "WAITING FOR ADMIN REVIEW...",
  pendingSummaryTitle: "APPLICATION SUMMARY / 申請内容",
  pendingCheckinOptions: { daily: "毎日 / ทุกวัน", "3x_week": "週3回 / 3 วัน/สัปดาห์", weekly: "週1回 / สัปดาห์ละครั้ง" },
  assessPageSub: "INITIAL ABILITY ASSESSMENT / 初期能力評価",
  assessProtocolLabel: "OAA ASSESSMENT PROTOCOL",
  assessMainTitle: "การประเมินความสามารถเบื้องต้น",
  assessDescNote: "◈ คำอธิบาย",
  assessDesc1: "แบบทดสอบนี้ประกอบด้วย 30 ข้อ ครอบคลุม 6 ด้านความสามารถ ได้แก่ วิชาการ ร่างกาย สังคม จิตใจ ภาวะผู้นำ และความสามารถปรับตัว",
  assessDesc2: "ผลลัพธ์จะกำหนดค่าพารามิเตอร์เริ่มต้น (สูงสุด 2/100) ของคุณ ระบบกำหนด baseline ต่ำโดยเจตนา — คุณต้องพิสูจน์ความสามารถผ่านการใช้งานจริง",
  assessDescWarning: "⚠ ค่าพารามิเตอร์จะถูกกำหนดโดยระบบเท่านั้น ไม่สามารถแก้ไขด้วยตนเองได้",
  assessBeginBtn: "BEGIN ASSESSMENT ▶",
  assessCalcTag: "PROCESSING RESULTS",
  assessCalcTitle: "กำลังประมวลผล...",
  assessBaselineTag: "INITIAL BASELINE — PROVE YOURSELF THROUGH ACTION",
  assessCalcLabel: "CALCULATING OAA...",
  assessSavingMsg: "SAVING TO DATABASE...",
  assessErrorTag: "SAVE ERROR",
  assessErrorDefault: "เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่",
  assessRetryBtn: "ลองใหม่ / RETRY ▶",
  checkinOptionLabels: {
    daily:     { label: "毎日",  desc: "ทุกวัน" },
    "3x_week": { label: "週3回", desc: "3 วัน/สัปดาห์" },
    weekly:    { label: "週1回", desc: "1 วัน/สัปดาห์" },
  },
  challengePracticeBtn: "練習 ▶",
  challengeQCount: "20問 / 20 ข้อ",
  challengeCorrectPts: "CP (ถูก)",
  challengeWrongPts: "CP (ผิด)",
  challengeStartBtn: "開始 ▶",
  challengeQuestion: "問",
  challengeCorrectLabel: "ถูก",
  challengeWrongLabel: "ผิด",
  challengeAlreadyDone: "本日完了 / ทำครบแล้ววันนี้",
  challengeAlreadyDoneSub: "◈ 明日また / กลับมาพรุ่งนี้",
  challengeCloseBtn: "閉じる ✕",
};

export const TRANSLATIONS: Record<Lang, Translations> = {
  th,
  jp,
  en,
  "th-jp": thJp,
};

export const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "th",    label: "ไทย" },
  { value: "jp",    label: "日本語" },
  { value: "en",    label: "EN" },
  { value: "th-jp", label: "ไทย+JP" },
];
