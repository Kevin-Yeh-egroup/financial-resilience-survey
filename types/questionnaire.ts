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
  收入穩定度: number
  儲備應變力: number
  債務與保障: number
  金錢管理: number
  資源連結: number
  心理與規劃: number
}

export type StructureType = "A" | "B" | "C" | "D" | "E" | "F"
export type AnimalType = "elephant" | "monkey" | "dog" | "turtle" | "cat" | "bear" | "ant" | "squirrel"

export interface QuestionnaireResult {
  totalScore: number
  level: "resilient" | "approaching" | "fragile" | "highly-fragile"
  priorities: string[]
  dimensionScores: DimensionScores
  structureType: StructureType
  animalType: AnimalType
}
