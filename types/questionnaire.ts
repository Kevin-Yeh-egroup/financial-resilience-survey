export interface Question {
  id: number
  text: string
  options: Option[]
}

export interface Option {
  label: string
  value: string
  score: number
}

export interface DimensionScores {
  收入與穩定性: number
  儲蓄與突發應對: number
  債務壓力與風險保障: number
  金錢管理與金融使用: number
  支持資源與連結: number
  心理韌性與未來感: number
}

export interface QuestionnaireResult {
  totalScore: number
  level: "resilient" | "approaching" | "fragile" | "highly-fragile"
  priorities: string[]
  dimensionScores: DimensionScores
  structureType: "A" | "B" | "C" | "D" | "E"
}
