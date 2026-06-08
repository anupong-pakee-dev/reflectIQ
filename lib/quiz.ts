import type { StatId } from "@/lib/constants";

export type QuizOption = {
  text: string;
  points: 0 | 1 | 2 | 3;
};

export type QuizQuestion = {
  id: number;
  stat: StatId;
  question: string;
  options: QuizOption[]; // always 4 options
  explanation: string;
};

// ─── 30 questions, 5 per stat ─────────────────────────────────
// Display order is interleaved: A P S M L D  A P S M L D  ...

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── ACADEMIC ──────────────────────────────────────────────

  {
    id: 0, stat: "academic",
    question: "ตัวเลขลำดับถัดไปในชุด 2, 6, 12, 20, 30, __ คือ?",
    options: [
      { text: "38", points: 0 },
      { text: "40", points: 0 },
      { text: "42", points: 3 },
      { text: "44", points: 0 },
    ],
    explanation: "n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42",
  },
  {
    id: 6, stat: "academic",
    question: "ถ้า A < B, B > C, C > D ข้อใดต่อไปนี้เป็นความจริงเสมอ?",
    options: [
      { text: "A > D", points: 0 },
      { text: "B > D", points: 3 },
      { text: "A < D", points: 0 },
      { text: "A = D", points: 0 },
    ],
    explanation: "B > C และ C > D ดังนั้น B > D เสมอ แต่ A กับ D ไม่ทราบความสัมพันธ์",
  },
  {
    id: 12, stat: "academic",
    question: "การทดสอบโรคมีความแม่นยำ 95% (true positive rate) และมีผลบวกปลอม 5% ประชากร 1% มีโรคนี้ ถ้าผลตรวจ positive โอกาสที่มีโรคจริงคือเท่าไหร่?",
    options: [
      { text: "~95%", points: 0 },
      { text: "~50%", points: 0 },
      { text: "~16%", points: 3 },
      { text: "~5%", points: 1 },
    ],
    explanation: "Bayes' theorem: (0.01×0.95)/(0.01×0.95+0.99×0.05) ≈ 16% — ผลบวกปลอมมีผลมากเมื่อโรคหายาก",
  },
  {
    id: 18, stat: "academic",
    question: "กลุ่มตัวอย่าง 10 คน คะแนน: 45, 52, 58, 62, 65, 68, 72, 75, 80, 95 ข้อใดถูก?",
    options: [
      { text: "ค่าเฉลี่ยสูงกว่าค่ามัธยฐาน", points: 3 },
      { text: "ค่ามัธยฐานสูงกว่าค่าเฉลี่ย", points: 0 },
      { text: "ค่าเฉลี่ยเท่ากับค่ามัธยฐาน", points: 0 },
      { text: "ไม่สามารถเปรียบเทียบได้โดยไม่คำนวณ", points: 1 },
    ],
    explanation: "mean=67.2, median=66.5 — outlier 95 ดึงค่าเฉลี่ยขึ้น",
  },
  {
    id: 24, stat: "academic",
    question: "บริษัทอ้างว่า 'ผลิตภัณฑ์ช่วยลดน้ำหนัก 85% ของผู้ทดลอง' ข้อมูลใดสำคัญที่สุดก่อนเชื่อ?",
    options: [
      { text: "ระยะเวลาในการทดลอง", points: 2 },
      { text: "ขนาดกลุ่มตัวอย่างและมีกลุ่มควบคุมหรือไม่", points: 3 },
      { text: "ราคาและความน่าเชื่อถือของแบรนด์", points: 0 },
      { text: "คะแนนรีวิวจากผู้ใช้จริง", points: 1 },
    ],
    explanation: "Control group เป็นสิ่งจำเป็นเพื่อแยก placebo effect และการเปลี่ยนแปลงตามธรรมชาติออก",
  },

  // ── PHYSICAL ──────────────────────────────────────────────

  {
    id: 1, stat: "physical",
    question: "สำหรับนักวิ่งที่ต้องการเพิ่ม endurance วิธีฝึกใดถูกต้องตามหลักวิทยาศาสตร์?",
    options: [
      { text: "วิ่ง interval ความเข้มสูงทุกวัน เพราะ HIIT มีประสิทธิภาพสูง", points: 0 },
      { text: "วิ่งระยะกลางด้วย pace ปานกลางทุกวันสม่ำเสมอ", points: 1 },
      { text: "80% ของ training เป็น low-intensity, 20% เป็น high-intensity", points: 3 },
      { text: "วิ่งหนักให้มากที่สุดทุกวันเพื่อให้ร่างกายชิน", points: 0 },
    ],
    explanation: "Polarized training (80/20 rule) ได้รับการยืนยันจากงานวิจัยว่ามีประสิทธิภาพสูงสุดสำหรับ endurance",
  },
  {
    id: 7, stat: "physical",
    question: "หลัง resistance training หนัก กล้ามเนื้อกลุ่มใหญ่ต้องการเวลาฟื้นตัวกี่ชั่วโมง?",
    options: [
      { text: "6–12 ชั่วโมง", points: 0 },
      { text: "12–24 ชั่วโมง", points: 1 },
      { text: "24–48 ชั่วโมง", points: 2 },
      { text: "48–72 ชั่วโมง", points: 3 },
    ],
    explanation: "muscle protein synthesis ใช้เวลา 48-72 ชั่วโมง สำหรับการออกกำลังกายหนักและกลุ่มกล้ามเนื้อใหญ่",
  },
  {
    id: 13, stat: "physical",
    question: "นักกีฬา strength training ต้องการโปรตีนเท่าไหร่ต่อน้ำหนักตัวต่อวัน?",
    options: [
      { text: "0.5–0.8 g/kg", points: 0 },
      { text: "0.8–1.0 g/kg", points: 1 },
      { text: "1.6–2.2 g/kg", points: 3 },
      { text: "3.0+ g/kg", points: 0 },
    ],
    explanation: "งานวิจัยปัจจุบัน (ISSN 2017) แนะนำ 1.6–2.2 g/kg สำหรับ maximizing muscle hypertrophy",
  },
  {
    id: 19, stat: "physical",
    question: "สิ่งใดอธิบาย physical performance ของคุณได้ตรงที่สุดในปัจจุบัน?",
    options: [
      { text: "วิ่ง 5 km ได้ภายใน 25 นาที ออกกำลังกาย 4+ วัน/สัปดาห์อย่างสม่ำเสมอมากกว่า 3 เดือน", points: 3 },
      { text: "ออกกำลังกาย 2–3 วัน/สัปดาห์ มีแผนการฝึกชัดเจน", points: 2 },
      { text: "ออกกำลังกายเป็นครั้งคราว ไม่มีแผนแน่นอน", points: 1 },
      { text: "ไม่มีกิจวัตรออกกำลังกาย หรือออกน้อยกว่า 1 วัน/สัปดาห์", points: 0 },
    ],
    explanation: "ความสม่ำเสมอและมีแผนคือตัวชี้วัดสำคัญกว่าความเข้มในแต่ละครั้ง",
  },
  {
    id: 25, stat: "physical",
    question: "การนอนหลับส่งผลต่อ physical performance ในด้านใดมากที่สุดตามงานวิจัย?",
    options: [
      { text: "ส่งผลเฉพาะ focus และ motivation เท่านั้น", points: 0 },
      { text: "ส่งผลต่อ recovery และ muscle protein synthesis โดยตรง", points: 3 },
      { text: "ส่งผลต่อ endurance มากกว่า strength", points: 1 },
      { text: "ส่งผลน้อย หากกิน protein เพียงพอ", points: 0 },
    ],
    explanation: "การหลั่ง growth hormone 70% เกิดในช่วง deep sleep ส่งผลต่อ muscle repair โดยตรง",
  },

  // ── SOCIAL ────────────────────────────────────────────────

  {
    id: 2, stat: "social",
    question: "เพื่อนร่วมงานรายงาน progress ผิดพลาดต่อหน้าทีมทั้งหมด คุณจะทำอย่างไร?",
    options: [
      { text: "แก้ไขทันทีต่อหน้าทุกคนเพื่อให้ข้อมูลถูกต้อง", points: 1 },
      { text: "เพิกเฉย เพราะไม่ใช่ความรับผิดชอบของคุณ", points: 0 },
      { text: "พูดคุยกับเขาเป็นส่วนตัวหลังประชุม", points: 3 },
      { text: "รายงานให้หัวหน้าทราบทันที", points: 0 },
    ],
    explanation: "การปกป้อง dignity ของเพื่อนร่วมงานสร้าง trust ระยะยาว การแก้ข้อมูลส่วนตัวมีประสิทธิภาพกว่า",
  },
  {
    id: 8, stat: "social",
    question: "เพื่อนบอก 'ไม่เป็นไรหรอก' ด้วยน้ำเสียงเครียด คุณตอบสนองอย่างไร?",
    options: [
      { text: "เชื่อคำพูดเขา ไม่ถามต่อ", points: 0 },
      { text: "บอกว่า 'ดูเหมือนคุณรู้สึกเหนื่อยนะ ถ้าอยากคุยบอกได้นะ'", points: 3 },
      { text: "ให้คำแนะนำแก้ปัญหาทันที", points: 1 },
      { text: "เปลี่ยนเรื่องคุยเพื่อเบี่ยงความสนใจ", points: 0 },
    ],
    explanation: "Acknowledge ทั้งคำพูดและ non-verbal cue พร้อมเปิดโอกาสให้เขาเลือกว่าจะคุยหรือไม่",
  },
  {
    id: 14, stat: "social",
    question: "คุณนำเสนองาน สังเกตว่าผู้ฟังขยับตัวบ่อย มองนาฬิกา แต่ไม่มีใครพูดอะไร คุณทำอะไร?",
    options: [
      { text: "นำเสนอต่อไปตามแผน", points: 0 },
      { text: "ถาม 'มีคำถามไหม?' แล้วรอ", points: 2 },
      { text: "สรุปจุดสำคัญ ถามว่าต้องการรายละเอียดเพิ่มหรือหยุดตรงนี้ก่อน", points: 3 },
      { text: "ขอโทษที่ยาวเกินและจบทันที", points: 1 },
    ],
    explanation: "อ่าน signal แล้วให้ audience control ทำให้ engagement ดีกว่าการถาม closed-ended question",
  },
  {
    id: 20, stat: "social",
    question: "เพื่อนสอบตกและรู้สึกแย่มาก คุณพูดอะไร?",
    options: [
      { text: "'อย่างน้อยก็มีโอกาสสอบใหม่นะ'", points: 1 },
      { text: "'ครั้งหน้าพยายามมากกว่านี้นะ'", points: 0 },
      { text: "'เรื่องแบบนี้เกิดกับทุกคน ไม่ต้องกังวล'", points: 0 },
      { text: "'ฉันเข้าใจว่าต้องรู้สึกท้อมาก บอกเล่าให้ฟังได้นะ'", points: 3 },
    ],
    explanation: "Empathy = validate ความรู้สึกก่อน ไม่ใช่ minimize หรือให้คำแนะนำทันที",
  },
  {
    id: 26, stat: "social",
    question: "คุณไปงาน networking ครั้งแรก พบคนที่น่าสนใจ วิธีสร้าง connection ที่ดีที่สุดคือ?",
    options: [
      { text: "แลกนามบัตรและรอให้เขาติดต่อมา", points: 1 },
      { text: "คุยให้นานที่สุดเพื่อให้เขาจำได้", points: 0 },
      { text: "เพิ่ม LinkedIn ทันทีในงาน", points: 2 },
      { text: "คุยเรื่อง passion ที่มีร่วมกัน แล้ว follow-up ด้วย message ส่วนตัวภายใน 24 ชั่วโมง", points: 3 },
    ],
    explanation: "Follow-up ที่เฉพาะเจาะจงภายใน 24 ชั่วโมงสร้างความสัมพันธ์จริงได้ดีกว่า surface-level contact",
  },

  // ── MENTAL ────────────────────────────────────────────────

  {
    id: 3, stat: "mental",
    question: "คุณมีงานต้องส่งพรุ่งนี้ แต่เพิ่งพบว่า approach ที่ใช้ไม่ work วิธีรับมือที่ดีที่สุดคือ?",
    options: [
      { text: "ทำงานทั้งคืนโดยไม่นอน panic ไปก่อน", points: 0 },
      { text: "บอกว่าจะส่งช้าทันที", points: 1 },
      { text: "ทำต่อด้วย approach เดิม หวังว่าจะ work", points: 0 },
      { text: "หยุด 5–10 นาที ประเมิน scope จริง แล้ว reprioritize ใหม่", points: 3 },
    ],
    explanation: "Pause สั้นๆ เพื่อ assess สถานการณ์จริงทำให้ตัดสินใจได้ดีกว่า reactive panic",
  },
  {
    id: 9, stat: "mental",
    question: "คุณลงทุนเวลา 3 เดือนกับ project แต่ถูกยกเลิก คุณตอบสนองอย่างไร?",
    options: [
      { text: "รู้สึกเสียใจมาก ใช้เวลาหลายสัปดาห์กว่าจะก้าวต่อไปได้", points: 0 },
      { text: "โกรธและ blame สถานการณ์หรือคนอื่น", points: 0 },
      { text: "ไม่รู้สึกอะไร เพราะชินกับความล้มเหลวแล้ว", points: 1 },
      { text: "รู้สึกผิดหวัง แต่ตั้งสติได้ภายในไม่กี่วัน สรุป lesson learned", points: 3 },
    ],
    explanation: "Resilience คือการรับรู้ความเจ็บปวดได้ แต่ฟื้นตัวได้เร็ว ไม่ใช่การไม่รู้สึกอะไร",
  },
  {
    id: 15, stat: "mental",
    question: "คุณกำลัง overloaded และเพื่อนร่วมงานทำผิดพลาดซ้ำๆ คุณรู้สึกหงุดหงิดมาก คุณจัดการอย่างไร?",
    options: [
      { text: "บอกตรงๆ ทันทีว่ารำคาญ", points: 1 },
      { text: "กดความรู้สึกไว้ ทำงานต่อ", points: 0 },
      { text: "หา distraction เพื่อลืมความหงุดหงิด", points: 0 },
      { text: "รับรู้ความรู้สึกตัวเอง หยุดพักสั้นๆ แล้ว address ปัญหาอย่างสงบ", points: 3 },
    ],
    explanation: "Emotion regulation ≠ suppression ต้องรับรู้ก่อน แล้วเลือก response ที่เหมาะสม",
  },
  {
    id: 21, stat: "mental",
    question: "ตลอดเดือนที่ผ่านมา คุณมีกิจวัตรอะไรดูแล mental health?",
    options: [
      { text: "ไม่มีกิจวัตรชัดเจน", points: 0 },
      { text: "พักผ่อนบ้างเมื่อรู้สึกเหนื่อย", points: 1 },
      { text: "มีบ้าง แต่ไม่สม่ำเสมอ เช่น ออกกำลังกาย หรือนอนเพียงพอ", points: 2 },
      { text: "มีหลายอย่างสม่ำเสมอ เช่น meditation, journaling, ออกกำลังกาย", points: 3 },
    ],
    explanation: "Proactive mental health practices มีผลต่อ resilience และ cognitive performance อย่างมีนัยสำคัญ",
  },
  {
    id: 27, stat: "mental",
    question: "คุณเรียนทักษะใหม่แล้วล้มเหลวซ้ำๆ ความคิดใดตรงกับคุณมากที่สุด?",
    options: [
      { text: "'ฉันไม่เก่งเรื่องนี้ ควรเลิก'", points: 0 },
      { text: "'ต้องพยายามมากกว่านี้ แม้ไม่รู้ว่าทำอะไรผิด'", points: 1 },
      { text: "'บางทีเวลาไม่ใช่ก็แค่นั้น'", points: 2 },
      { text: "'ยาก แต่ทุก feedback สอนอะไรบางอย่าง'", points: 3 },
    ],
    explanation: "Growth mindset ต้องคู่กับ deliberate reflection ไม่ใช่แค่พยายามซ้ำในแบบเดิม",
  },

  // ── LEADERSHIP ────────────────────────────────────────────

  {
    id: 4, stat: "leadership",
    question: "สมาชิกทีม 2 คนขัดแย้งเรื่อง approach ทำให้งานไม่คืบหน้า คุณ (ในฐานะ lead) ทำอะไร?",
    options: [
      { text: "ปล่อยให้แก้กันเอง เพราะต้องให้ autonomy ทีม", points: 0 },
      { text: "เลือกฝ่ายที่มี logic ดีกว่าและสั่งให้ทำตามนั้น", points: 1 },
      { text: "แบ่งงานให้แต่ละคนทำ approach ของตัวเองไปก่อน", points: 2 },
      { text: "จัด meeting ให้ทั้งคู่นำเสนอ trade-offs แล้ว decide ร่วมกัน", points: 3 },
    ],
    explanation: "การให้ทุกคนนำเสนอ trade-offs สร้าง shared understanding และ buy-in มากกว่าการ impose",
  },
  {
    id: 10, stat: "leadership",
    question: "คุณต้องตัดสินใจสำคัญ แต่ข้อมูลไม่ครบและกำหนดเวลาใกล้เข้ามา วิธีที่ดีที่สุดคือ?",
    options: [
      { text: "รอจนมีข้อมูลครบก่อนตัดสินใจ", points: 0 },
      { text: "ตัดสินใจทันทีด้วยข้อมูลที่มี", points: 1 },
      { text: "มอบการตัดสินใจให้คนอื่น", points: 0 },
      { text: "ระบุข้อมูลที่จำเป็นที่สุด รวบรวมเร็วๆ ตัดสินใจพร้อมแผน contingency", points: 3 },
    ],
    explanation: "Good leaders ระบุ 'minimum viable information' แทนที่จะรอสมบูรณ์แบบหรือตัดสินใจ blind",
  },
  {
    id: 16, stat: "leadership",
    question: "งานสำคัญที่คุณทำได้ดีกว่าทีม แต่คุณ overloaded อยู่แล้ว คุณทำอะไร?",
    options: [
      { text: "ทำเองทั้งหมดเพราะคุณภาพสำคัญ", points: 0 },
      { text: "ทำร่วมกับทีมทุกขั้นตอนเพื่อควบคุมคุณภาพ", points: 1 },
      { text: "มอบหมายให้ทีมและไม่ตามงาน เพราะต้อง trust", points: 1 },
      { text: "มอบหมายพร้อม brief ชัดเจนและ check-in point ที่กำหนดไว้", points: 3 },
    ],
    explanation: "Delegation ที่ดีต้องมี clarity ของ expectation และ structured follow-up ไม่ใช่ abdication",
  },
  {
    id: 22, stat: "leadership",
    question: "ทีมของคุณ performance ลดลงหลัง project ยาวและเหนื่อย วิธีใดช่วยได้ดีที่สุดในระยะยาว?",
    options: [
      { text: "เพิ่ม pressure และ deadline ให้ชัดขึ้น", points: 0 },
      { text: "จัด team building activity สนุกๆ", points: 1 },
      { text: "ให้ bonus หรือรางวัลพิเศษ", points: 2 },
      { text: "คุยเพื่อ understand ปัญหา ให้ autonomy และ acknowledge ความพยายาม", points: 3 },
    ],
    explanation: "Self-determination theory: autonomy + recognition สร้าง intrinsic motivation ที่ยั่งยืนกว่า extrinsic rewards",
  },
  {
    id: 28, stat: "leadership",
    question: "Project ล้มเหลว หัวหน้าถามสาเหตุ คุณตอบอย่างไร?",
    options: [
      { text: "อธิบาย factor ภายนอกที่ทำให้เกิดปัญหา", points: 1 },
      { text: "พยายามไม่ให้โทษใคร รวมถึงตัวเอง", points: 0 },
      { text: "'ทีมต้องร่วมรับผิดชอบทั้งหมด'", points: 2 },
      { text: "'ผม/หนูรับผิดชอบในส่วนที่ควบคุมได้ นี่คือสิ่งที่เรียนรู้และ plan แก้ไข'", points: 3 },
    ],
    explanation: "Accountable leadership = own what you can control + learn + forward-looking ไม่ใช่ blame หรือ deflect",
  },

  // ── ADAPTABILITY ──────────────────────────────────────────

  {
    id: 5, stat: "adaptability",
    question: "บริษัทเปลี่ยน system ที่คุณใช้มา 3 ปี เป็น system ใหม่กะทันหัน คุณตอบสนองอย่างไร?",
    options: [
      { text: "ต่อต้าน เพราะ system เก่าดีอยู่แล้ว", points: 0 },
      { text: "ใช้ system เก่าต่อจนถูกบังคับเปลี่ยน", points: 0 },
      { text: "รอให้คนอื่นเรียนก่อน แล้วค่อยตาม", points: 1 },
      { text: "รู้สึกไม่สะดวก แต่เริ่มเรียนทันทีและหา advantage ของ system ใหม่", points: 3 },
    ],
    explanation: "Adaptability ≠ ชอบการเปลี่ยนแปลง แต่คือการ engage กับมันแม้รู้สึกไม่สะดวก",
  },
  {
    id: 11, stat: "adaptability",
    question: "คุณต้องเรียนทักษะใหม่ที่ไม่คุ้นเคยภายใน 2 สัปดาห์ วิธีใดดีที่สุด?",
    options: [
      { text: "อ่านหรือดู tutorial ให้ครบก่อนลองทำ", points: 1 },
      { text: "ลองทำทันที ผิดแล้วค่อยแก้", points: 2 },
      { text: "หาผู้เชี่ยวชาญช่วยทำแทน", points: 0 },
      { text: "เรียน 20% ที่ cover 80% ของ use case ก่อน ฝึกจนใช้งานได้แล้วค่อยลงลึก", points: 3 },
    ],
    explanation: "Pareto principle ใช้ได้กับการเรียนรู้: master the core use cases ก่อน แล้วค่อย expand",
  },
  {
    id: 17, stat: "adaptability",
    question: "คุณได้ feedback เชิงลบที่ไม่เห็นด้วย คุณทำอะไร?",
    options: [
      { text: "อธิบายมุมมองของคุณทันทีเพื่อหักล้าง", points: 0 },
      { text: "รับ feedback ทุกอย่างและเปลี่ยนตามทันที", points: 1 },
      { text: "เก็บไว้ในใจ แต่ไม่ตอบหรือถามต่อ", points: 1 },
      { text: "รับฟังจนจบ ขอบคุณ ใช้เวลาพิจารณาก่อนตัดสินใจว่าจะใช้หรือไม่", points: 3 },
    ],
    explanation: "Separating ego from feedback ทำให้สามารถประเมิน merit ของ feedback ได้อย่างเป็นกลาง",
  },
  {
    id: 23, stat: "adaptability",
    question: "งานที่ได้รับมี requirement ไม่ชัดเจน คุณทำอย่างไร?",
    options: [
      { text: "รอให้ requirement ชัดก่อนเริ่ม", points: 0 },
      { text: "ตีความเองและทำไปเลย", points: 1 },
      { text: "ถามทุกรายละเอียดจนชัดก่อนเริ่ม", points: 2 },
      { text: "ระบุ assumption ที่ทำไว้ สร้าง minimal version เพื่อ validate ก่อน", points: 3 },
    ],
    explanation: "Bias toward action ที่มี documented assumptions ทำให้ iterate ได้เร็วกว่ารอ perfect spec",
  },
  {
    id: 29, stat: "adaptability",
    question: "วิธีเดิมไม่ work แล้ว คุณ approach ปัญหาอย่างไร?",
    options: [
      { text: "ลองวิธีเดิมซ้ำๆ ด้วยความพยายามมากขึ้น", points: 0 },
      { text: "ลอง 2–3 วิธีใหม่สุ่มๆ", points: 1 },
      { text: "ยอมรับว่าปัญหานี้แก้ไม่ได้", points: 0 },
      { text: "ถาม 'Why' หลายชั้นเพื่อหา root cause แล้ว solve ที่ต้นตอ", points: 3 },
    ],
    explanation: "5-Whys methodology — การ solve ที่ symptom ทำให้ปัญหากลับมาซ้ำ ต้องหา underlying cause",
  },
];

// Display order: interleaved by stat (A, P, S, M, L, D repeated 5 times)
export const DISPLAY_ORDER: number[] = [
  0, 1, 2, 3, 4, 5,     // round 1: one per stat
  6, 7, 8, 9, 10, 11,   // round 2
  12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23,
  24, 25, 26, 27, 28, 29,
];

// Returns stat → score (0-100) from answers map (questionId → optionIndex)
// Used for visual display only — NOT the stored value.
export function calcAssessmentScores(answers: Record<number, number>): Record<StatId, number> {
  const pts: Record<string, number> = {
    academic: 0, physical: 0, social: 0,
    mental: 0, leadership: 0, adaptability: 0,
  };

  for (const q of QUIZ_QUESTIONS) {
    const chosen = answers[q.id];
    if (chosen !== undefined) {
      pts[q.stat] += q.options[chosen]?.points ?? 0;
    }
  }

  const result: Record<string, number> = {};
  for (const stat of Object.keys(pts)) {
    // max 15 pts per stat (5 questions × 3 pts)
    result[stat] = Math.round((pts[stat] / 15) * 100);
  }
  return result as Record<StatId, number>;
}

// ─────────────────────────────────────────────────────────────
//  calcInitialStats — ค่าที่บันทึกลง DB จริงหลัง assessment
//
//  กฎ: ทุก stat ต้องไม่เกิน 2/100 (การสอบครั้งแรกเป็นเพียง baseline)
//  mapping: raw 0-33 → 0 | 34-66 → 1 | 67-100 → 2
// ─────────────────────────────────────────────────────────────
export function calcInitialStats(answers: Record<number, number>): Record<StatId, number> {
  const raw = calcAssessmentScores(answers); // 0–100
  const STAT_IDS: StatId[] = [
    "academic", "physical", "social", "mental", "leadership", "adaptability",
  ];
  const result = {} as Record<StatId, number>;
  for (const id of STAT_IDS) {
    // Three tiers, hard cap at 2
    result[id] = Math.min(2, Math.floor((raw[id] / 100) * 3));
  }
  return result;
}

export const STAT_META: Record<StatId, { name: string; nameJp: string; color: string; icon: string }> = {
  academic:     { name: "วิชาการ",  nameJp: "学力",   color: "#00d4ff", icon: "◈" },
  physical:     { name: "ร่างกาย",  nameJp: "体力",   color: "#22c55e", icon: "◉" },
  social:       { name: "สังคม",    nameJp: "社交力", color: "#a855f7", icon: "◎" },
  mental:       { name: "จิตใจ",    nameJp: "精神力", color: "#f59e0b", icon: "◆" },
  leadership:   { name: "ผู้นำ",    nameJp: "指導力", color: "#ef4444", icon: "◇" },
  adaptability: { name: "ปรับตัว", nameJp: "適応力", color: "#06b6d4", icon: "◐" },
};
