import type { AnimalType } from "@/types/questionnaire"

export type PersonalCenterToolId = "accounting" | "resilience" | "fraud" | "anxiety" | "dream"

export const ANIMAL_MINI: Record<
  AnimalType,
  { emoji: string; title: string; typeLabel: string }
> = {
  cat: { emoji: "🐱", title: "縮成一團休息的貓", typeLabel: "高風險疊加型" },
  ant: { emoji: "🐜", title: "努力拖著家的小螞蟻", typeLabel: "透支撐持型" },
  elephant: { emoji: "🐘", title: "站在細繩上的大象", typeLabel: "結構型脆弱" },
  ox: { emoji: "🐂", title: "努力負重的牛", typeLabel: "高負荷撐持型" },
  camel: { emoji: "🐪", title: "撐很久的駱駝", typeLabel: "慢性全面吃力型" },
  otter: { emoji: "🦭", title: "被照顧著的水獺", typeLabel: "依賴型安全網" },
  monkey: { emoji: "🐒", title: "在樹間移動的猴子", typeLabel: "社會韌性型" },
  squirrel: { emoji: "🐿️", title: "躲在葉子下的小松鼠", typeLabel: "保護網型受傷狀態" },
  bear: { emoji: "🐻", title: "慢慢探出頭的小熊", typeLabel: "恢復中狀態" },
  dog: { emoji: "🐕", title: "準備出發的小狗", typeLabel: "心理啟動型" },
  eagle: { emoji: "🦅", title: "盤旋高空的老鷹", typeLabel: "高能力、低安全網型" },
  turtle: { emoji: "🐢", title: "穩定前行的烏龜", typeLabel: "日常穩定型" },
  horse: { emoji: "🐎", title: "穩健奔跑的馬", typeLabel: "成熟韌性型" },
}

type MockupBlock = {
  headline: string
  simulatedNumbers: { label: string; value: string }[]
  metrics?: { label: string; value: string }[]
  paragraphs: string[]
}

const CAMEL_MOCKUPS: Record<PersonalCenterToolId, MockupBlock> = {
  accounting: {
    headline: "財務生活記帳助理 · 模擬結果",
    simulatedNumbers: [
      { label: "本月總支出（模擬）", value: "NT$ 47,850" },
      { label: "日平均花費（模擬）", value: "NT$ 1,595" },
      { label: "固定支出占比（模擬）", value: "61%" },
      { label: "可變支出占比（模擬）", value: "39%" },
      { label: "入帳筆數（模擬）", value: "127 筆" },
      { label: "AI 標記需留意（模擬）", value: "3 筆" },
    ],
    metrics: [
      { label: "連續外食天數（模擬）", value: "4 天高於近 30 日平均" },
      { label: "週末小額採購集中度（模擬）", value: "偏高 · 建議下週試 2 天預算上限" },
    ],
    paragraphs: [
      "以「撐很久的駱駝」常見節奏：帳面多半還过得去，但幾乎沒有緩衝；記帳圖表可能顯示「食衣住行」起伏不大，臨時一筆就容易拉緊神經。",
      "AI 洞察（模擬）：若你連續多日小額採購集中在傍晚時段，系統可能建議下週先鎖兩天「只帶預算現金」當練習。",
    ],
  },
  resilience: {
    headline: "真實財務韌性 · 模擬結果",
    simulatedNumbers: [],
    metrics: [
      { label: "風險等級（模擬）", value: "有風險" },
      { label: "較可能偏低的面向（模擬）", value: "應急／儲備、心理節奏" },
    ],
    paragraphs: [
      "駱駝型在真實評估裡，常出現「沒有立刻爆掉，但多條線都黃燈」的樣子：總分可能落在「有風險」區間，與自我評估「還撐得住、其實很省著過」接近。",
      "若你在個人版做完評估，平台會留下紀錄，可能看到：這次和上次比起來，變化不大或小幅波動——適合拿來跟家人討論「要先補哪一條線」。",
    ],
  },
  fraud: {
    headline: "詐騙防禦能力 · 模擬結果",
    simulatedNumbers: [
      { label: "作答完成度（模擬）", value: "10 / 10 題" },
      { label: "主類型占比（模擬）", value: "觀望但易被說服 42%" },
      { label: "次要類型占比（模擬）", value: "情緒牽動 28%" },
      { label: "理性查證型（模擬）", value: "18%" },
      { label: "建議查證步驟數（模擬）", value: "2 步" },
    ],
    metrics: [{ label: "綜合傾向（模擬）", value: "觀望但易被說服 · 情緒牽動之間" }],
    paragraphs: [
      "駱駝型長期在「省、撐、再撐」底下，遇到「限時」「熟人急用」時，可能比較晚一步想到查證；模擬結果常落在「想先顧面子、再想風險」這一帶。",
      "工具可能替你整理：下一次接到借錢或轉帳，先完成哪兩個小步驟（例如改打電話、先傳給家人）就會安心很多。",
    ],
  },
  anxiety: {
    headline: "財務焦慮檢測 · 模擬結果",
    simulatedNumbers: [
      { label: "檢測總分（模擬）", value: "38 / 75" },
      { label: "生存壓力軸（模擬）", value: "72%" },
      { label: "未雨綢繆軸（模擬）", value: "68%" },
      { label: "失控無力軸（模擬）", value: "41%" },
      { label: "逃避凍結軸（模擬）", value: "35%" },
      { label: "過度警戒軸（模擬）", value: "52%" },
    ],
    metrics: [{ label: "雷達較凸（模擬）", value: "生存壓力、未雨綢繆" }],
    paragraphs: [
      "駱駝型在焦慮檢測上，常見「帳還繳得出來，但心裡一直預演壞劇本」：雷達可能顯示生存壓力與未雨綢繆兩塊較明顯，不一定代表失控，比較像神經長期緊繃。",
      "結果頁可能建議你從「今晚睡前的十分鐘」這種極小行動開始，而不是一次大翻修生活。",
    ],
  },
  dream: {
    headline: "夢想達成財務規劃 · 模擬結果",
    simulatedNumbers: [
      { label: "目標金額（模擬）", value: "NT$ 85,000" },
      { label: "預估達成月數（模擬）", value: "14 個月" },
      { label: "建議月存金額（模擬）", value: "NT$ 6,070" },
      { label: "目前月結餘裕度（模擬）", value: "+9.8%" },
      { label: "優先順序（模擬）", value: "先凍結 1 項固定訂閱" },
    ],
    metrics: [{ label: "若目標為一年後小旅行（模擬）", value: "月供需比現況約 +8～12%" }],
    paragraphs: [
      "駱駝型通常不是沒有夢，而是習慣先把夢往後挪；模擬規劃可能顯示：在不大改生活的前提下，要達標得先選一個「固定可砍項」或「固定可挪項」。",
      "互動步驟可能帶你排出：這個月先試一週、下個月再決定要不要加碼，比較不會三分鐘熱度。",
    ],
  },
}

const RESILIENCE_LABELS = [
  "A 經濟資源",
  "B 應急能力",
  "C 金融包容性",
  "D 財務管理能力",
  "E 社會資本",
  "F 心理韌性",
] as const
const RESILIENCE_MAX = [25, 15, 15, 20, 15, 10] as const
const RESILIENCE_BASE = [9, 9, 11, 12, 11, 6]

function buildResilienceSimulatedNumbers(total: number): { label: string; value: string }[] {
  const t = Math.max(0, Math.min(100, total))
  const factor = t / 58
  const raw = RESILIENCE_BASE.map((b, i) => {
    const v = Math.round(b * factor)
    return Math.min(RESILIENCE_MAX[i], Math.max(0, v))
  })
  const rows: { label: string; value: string }[] = [
    { label: "總分（模擬）", value: `${t} / 100 · 有風險` },
  ]
  RESILIENCE_LABELS.forEach((label, i) => {
    rows.push({ label: `${label}（模擬）`, value: `${raw[i]} / ${RESILIENCE_MAX[i]}` })
  })
  return rows
}

function personalizeForAnimal(text: string, animalType: AnimalType): string {
  if (animalType === "camel") return text
  const m = ANIMAL_MINI[animalType]
  return text
    .replace(/撐很久的駱駝/g, m.title)
    .replace(/駱駝型長期/g, `${m.title}長期`)
    .replace(/駱駝型在/g, `${m.title}在`)
    .replace(/駱駝型/g, m.title)
    .replace(/駱駝/g, m.title)
    .replace(/慢性全面吃力|長途跋涉|沙漠中|沙漠/g, m.typeLabel.replace(/型$/, ""))
}

export function getArchetypeToolMockup(
  toolId: string,
  animalType: AnimalType | null,
  totalScore: number | null,
): {
  banner: string
  headline: string
  simulatedNumbers: { label: string; value: string }[]
  metrics?: { label: string; value: string }[]
  paragraphs: string[]
} {
  const id = toolId as PersonalCenterToolId
  const base = CAMEL_MOCKUPS[id] ?? CAMEL_MOCKUPS.accounting

  const scoreHint = totalScore != null ? totalScore : 58

  let metrics = base.metrics?.map((m) => ({ ...m }))
  let paragraphs = [...base.paragraphs]

  let simulatedNumbers =
    id === "resilience"
      ? buildResilienceSimulatedNumbers(scoreHint)
      : base.simulatedNumbers.map((n) => ({ ...n }))

  if (id === "resilience" && metrics) {
    metrics = [
      { label: "風險等級（模擬）", value: "有風險" },
      { label: "自我評估總分（對照）", value: `${scoreHint} 分` },
      ...(base.metrics?.slice(1) ?? []),
    ]
  }

  if (!animalType) {
    return {
      banner: "尚未讀到自我評估類型：以下以「🐪 撐很久的駱駝」示範預覽",
      headline: base.headline,
      simulatedNumbers,
      metrics,
      paragraphs,
    }
  }

  const m = ANIMAL_MINI[animalType]
  const banner = `依你的自我評估類型：${m.emoji} ${m.title}（${m.typeLabel}）`

  if (animalType !== "camel") {
    paragraphs = paragraphs.map((p) => personalizeForAnimal(p, animalType))
  }

  return {
    banner,
    headline: base.headline,
    simulatedNumbers,
    metrics,
    paragraphs,
  }
}
