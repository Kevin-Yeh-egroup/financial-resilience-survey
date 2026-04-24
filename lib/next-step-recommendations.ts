import type { DimensionScores, QuestionnaireResult, StructureType } from "@/types/questionnaire"

/** 好理家對外連結（與官網功能對齊） */
export const FAMILYFIN_URLS = {
  financialResilience: "https://www.familyfinhealth.com/financial-resilience",
  fraudDefense: "https://www.familyfinhealth.com/fraud-defense",
  financialAnxiety: "https://www.familyfinhealth.com/financial-anxiety",
  personalCenter: "https://www.familyfinhealth.com/personal-center?tab=overview",
  basicAccounting: "https://www.familyfinhealth.com/toolbox/financial-calculator/basic-accounting-preview",
  financialPlanning: "https://www.familyfinhealth.com/financial-planning",
  financialCalculator: "https://www.familyfinhealth.com/toolbox/financial-calculator",
  askIvy: "https://www.familyfinhealth.com/ask-ivy",
  knowledgeBase: "https://www.familyfinhealth.com/knowledge-base",
  onlineConsultation: "https://www.familyfinhealth.com/online-consultation",
} as const

export type NextStepActionId =
  | "fraud_test"
  | "anxiety_test"
  | "personal"
  | "bookkeeping"
  | "planning"
  | "calculator"
  | "ai"
  | "knowledge"
  | "consultation"

export interface NextStepAction {
  title: string
  benefit: string
  cta: string
  href: string
}

const CATALOG: Record<NextStepActionId, NextStepAction> = {
  fraud_test: {
    title: "詐騙防禦能力檢測",
    benefit: "多一層防護，日常更安心一點",
    cta: "開始檢測",
    href: FAMILYFIN_URLS.fraudDefense,
  },
  anxiety_test: {
    title: "財務焦慮檢測",
    benefit: "溫和整理一下，現在的壓力感受",
    cta: "開始檢測",
    href: FAMILYFIN_URLS.financialAnxiety,
  },
  personal: {
    title: "個人中心",
    benefit: "檢測紀錄與進度，集中在同一處查看",
    cta: "前往個人中心",
    href: FAMILYFIN_URLS.personalCenter,
  },
  bookkeeping: {
    title: "財務生活記帳助理",
    benefit: "用記帳慢慢看清，錢實際怎麼流動",
    cta: "開始記帳",
    href: FAMILYFIN_URLS.basicAccounting,
  },
  planning: {
    title: "夢想達成財務管理",
    benefit: "把想完成的事，拆成你做得到的一步步",
    cta: "開始規劃",
    href: FAMILYFIN_URLS.financialPlanning,
  },
  calculator: {
    title: "財務試算模擬器",
    benefit: "還沒算清的數字，先試算再決定也不遲",
    cta: "開始試算",
    href: FAMILYFIN_URLS.financialCalculator,
  },
  ai: {
    title: "問問 AI",
    benefit: "有疑問就問，不用自己悶著猜",
    cta: "立即詢問",
    href: FAMILYFIN_URLS.askIvy,
  },
  knowledge: {
    title: "知識庫",
    benefit: "觀念與做法，想查的時候很快找到",
    cta: "瀏覽知識庫",
    href: FAMILYFIN_URLS.knowledgeBase,
  },
  consultation: {
    title: "免費個人線上財務諮詢",
    benefit: "可以免費在線上與財務健康諮詢師討論",
    cta: "了解諮詢",
    href: FAMILYFIN_URLS.onlineConsultation,
  },
}

const ALL_IDS: NextStepActionId[] = [
  "anxiety_test",
  "consultation",
  "ai",
  "personal",
  "bookkeeping",
  "planning",
  "calculator",
  "fraud_test",
  "knowledge",
]

function structureBucket(s: StructureType): "stress" | "stuck" | "stable" | "growth" {
  if (s === "cycle" || s === "single" || s === "struggling") return "stress"
  if (s === "stuck") return "stuck"
  if (s === "supported" || s === "stable") return "stable"
  return "growth"
}

function sortedDimensions(scores: DimensionScores): (keyof DimensionScores)[] {
  return (Object.entries(scores) as [keyof DimensionScores, number][])
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k)
}

/** 依構面分數偏低時，優先推的工具／檢測 */
function dimensionBoost(dim: keyof DimensionScores): Partial<Record<NextStepActionId, number>> {
  switch (dim) {
    case "金錢管理":
      return { bookkeeping: 8, calculator: 4, knowledge: 2 }
    case "儲備應變力":
    case "債務與保障":
    case "收入穩定度":
      return { calculator: 8, planning: 5, knowledge: 2 }
    case "心理與規劃":
      return { anxiety_test: 6, ai: 7, consultation: 6, knowledge: 3 }
    case "資源連結":
      return { knowledge: 7, ai: 5, personal: 4, consultation: 5 }
    default:
      return {}
  }
}

/**
 * 依整體分級、財務結構樣貌與六構面分數，選出 3 則「下一步」建議。
 * 不含「財務韌性檢測」：使用者剛完成本測驗，改推其他檢測與工具。
 */
export function getNextStepRecommendations(result: QuestionnaireResult): NextStepAction[] {
  const bucket = structureBucket(result.structureType)
  const [d1, d2, d3] = sortedDimensions(result.dimensionScores)

  const score: Record<NextStepActionId, number> = {
    fraud_test: 0,
    anxiety_test: 0,
    personal: 0,
    bookkeeping: 0,
    planning: 0,
    calculator: 0,
    ai: 0,
    knowledge: 0,
    consultation: 0,
  }

  const add = (partial: Partial<Record<NextStepActionId, number>>) => {
    for (const id of ALL_IDS) {
      const v = partial[id]
      if (v != null) score[id] += v
    }
  }

  // 整體韌性分級
  switch (result.level) {
    case "highly-fragile":
      add({
        anxiety_test: 14,
        ai: 12,
        consultation: 11,
        personal: 10,
        fraud_test: 4,
        knowledge: 3,
      })
      break
    case "fragile":
      add({
        anxiety_test: 10,
        consultation: 9,
        fraud_test: 8,
        calculator: 5,
        bookkeeping: 5,
        ai: 6,
        personal: 5,
      })
      break
    case "approaching":
      add({
        fraud_test: 10,
        knowledge: 6,
        calculator: 5,
        planning: 5,
        consultation: 5,
        ai: 4,
        personal: 3,
      })
      break
    case "resilient":
      add({
        fraud_test: 8,
        planning: 10,
        knowledge: 9,
        calculator: 4,
        anxiety_test: 3,
        consultation: 2,
      })
      break
  }

  // 結構樣貌
  switch (bucket) {
    case "stress":
      add({ anxiety_test: 6, ai: 5, consultation: 5, personal: 4, knowledge: 3 })
      break
    case "stuck":
      add({ bookkeeping: 8, calculator: 7, knowledge: 5, ai: 4, consultation: 4 })
      break
    case "stable":
      add({ personal: 5, planning: 4, fraud_test: 3, consultation: 3 })
      break
    case "growth":
      add({ planning: 7, knowledge: 6, calculator: 4, consultation: 2 })
      break
  }

  add(dimensionBoost(d1))
  add(dimensionBoost(d2))
  for (const id of ALL_IDS) {
    const extra = dimensionBoost(d3)[id]
    if (extra != null) score[id] += extra * 0.35
  }

  const ordered = [...ALL_IDS].sort((a, b) => score[b] - score[a])

  const out: NextStepAction[] = []
  const seen = new Set<string>()
  for (const id of ordered) {
    const item = CATALOG[id]
    if (seen.has(item.href)) continue
    seen.add(item.href)
    out.push({ ...item })
    if (out.length === 3) break
  }

  for (const id of ALL_IDS) {
    if (out.length >= 3) break
    const item = CATALOG[id]
    if (seen.has(item.href)) continue
    seen.add(item.href)
    out.push({ ...item })
  }

  return out
}
