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

export interface QuestionnaireResult {
  totalScore: number
  level: "resilient" | "approaching" | "fragile" | "highly-fragile"
  priorities: string[]
}
