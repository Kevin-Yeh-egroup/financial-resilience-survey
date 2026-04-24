import type { DimensionScores } from "@/types/questionnaire"

/** 真實財務韌性（線上工具）六面向，與自我評估版六構面一對一對應；滿分加總為 100。 */
export const RESILIENCE_COMPARISON_ROWS = [
  {
    subjectiveKey: "收入穩定度",
    objectiveKey: "經濟資源",
    objectiveLabel: "A. 經濟資源",
    objectiveMax: 25,
  },
  {
    subjectiveKey: "儲備應變力",
    objectiveKey: "應急能力",
    objectiveLabel: "B. 應急能力",
    objectiveMax: 15,
  },
  {
    subjectiveKey: "債務與保障",
    objectiveKey: "金融包容性",
    objectiveLabel: "C. 金融包容性",
    objectiveMax: 15,
  },
  {
    subjectiveKey: "金錢管理",
    objectiveKey: "財務管理能力",
    objectiveLabel: "D. 財務管理能力",
    objectiveMax: 20,
  },
  {
    subjectiveKey: "資源連結",
    objectiveKey: "社會資本",
    objectiveLabel: "E. 社會資本",
    objectiveMax: 15,
  },
  {
    subjectiveKey: "心理與規劃",
    objectiveKey: "心理韌性",
    objectiveLabel: "F. 心理韌性",
    objectiveMax: 10,
  },
] as const

export type ObjectiveResilienceKey = (typeof RESILIENCE_COMPARISON_ROWS)[number]["objectiveKey"]

export type ObjectiveResilienceScores = Record<ObjectiveResilienceKey, number>

export type SubjectiveDimensionKey = (typeof RESILIENCE_COMPARISON_ROWS)[number]["subjectiveKey"]

/**
 * 與官網個人版「最新評估」示範列一致（總分 58 / 100）；僅供本站對照表模擬，非使用者真實成績。
 * 來源版型：financial-resilience-assessment-too.vercel.app 個人頁六面向表。
 */
export const DEMO_VERCEL_ASSESSMENT_SCORES: ObjectiveResilienceScores = {
  經濟資源: 9,
  應急能力: 9,
  金融包容性: 11,
  財務管理能力: 12,
  社會資本: 11,
  心理韌性: 6,
}

/** 自我評估六構面（各滿分 30）的示範原分，與上列真實面向並排可算換算%與差異 */
export const DEMO_SELF_DIMENSION_SCORES = {
  收入穩定度: 15,
  儲備應變力: 12,
  債務與保障: 14.1,
  金錢管理: 16.5,
  資源連結: 9.9,
  心理與規劃: 18,
} as const satisfies Record<SubjectiveDimensionKey, number>

export function subjectivePercent(score30: number): number {
  return Math.round((score30 / 30) * 1000) / 10
}

export function objectivePercent(score: number, max: number): number {
  if (max <= 0) return 0
  return Math.round((score / max) * 1000) / 10
}

export function indicatorLight30(score30: number): string {
  if (score30 >= 0 && score30 <= 7) return "🔴"
  if (score30 >= 8 && score30 <= 15) return "🟠"
  if (score30 >= 16 && score30 <= 23) return "🟡"
  if (score30 >= 24 && score30 <= 30) return "🟢"
  return ""
}

export function getSubjectiveRowScore(
  dimensions: DimensionScores | null,
  subjectiveKey: (typeof RESILIENCE_COMPARISON_ROWS)[number]["subjectiveKey"],
): number | null {
  if (!dimensions) return null
  return dimensions[subjectiveKey as keyof DimensionScores]
}

export function getDisplayedSubjectiveRaw(
  dimensions: DimensionScores | null,
  subjectiveKey: SubjectiveDimensionKey,
): number {
  if (!dimensions) return DEMO_SELF_DIMENSION_SCORES[subjectiveKey]
  const v = getSubjectiveRowScore(dimensions, subjectiveKey)
  return v != null ? v : DEMO_SELF_DIMENSION_SCORES[subjectiveKey]
}
