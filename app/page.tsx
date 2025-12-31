"use client"

import { useState } from "react"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { ResultsDisplay } from "@/components/results-display"
import type { QuestionnaireResult } from "@/types/questionnaire"

export default function Home() {
  const [result, setResult] = useState<QuestionnaireResult | null>(null)

  const handleComplete = (completedResult: QuestionnaireResult) => {
    setResult(completedResult)
  }

  const handleReset = () => {
    setResult(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {!result ? (
          <QuestionnaireForm onComplete={handleComplete} />
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
