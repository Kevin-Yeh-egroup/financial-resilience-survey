"use client"

import { useState } from "react"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { ResultsDisplay } from "@/components/results-display"
import { TransitionAnimation } from "@/components/transition-animation"
import type { QuestionnaireResult } from "@/types/questionnaire"
import { saveResult } from "@/lib/storage"

export default function Home() {
  const [result, setResult] = useState<QuestionnaireResult | null>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [pendingResult, setPendingResult] = useState<QuestionnaireResult | null>(null)

  const handleComplete = (completedResult: QuestionnaireResult) => {
    // 儲存結果到本地儲存
    saveResult(completedResult.dimensionScores)
    // 先顯示轉換動畫，保存結果
    setPendingResult(completedResult)
    setShowTransition(true)
  }

  const handleReset = () => {
    setResult(null)
    setShowTransition(false)
    setPendingResult(null)
  }

  const handleTransitionComplete = () => {
    // 動畫完成後顯示結果
    if (pendingResult) {
      setResult(pendingResult)
      setPendingResult(null)
    }
    setShowTransition(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {showTransition ? (
          <TransitionAnimation onComplete={handleTransitionComplete} />
        ) : !result ? (
          <QuestionnaireForm onComplete={handleComplete} />
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
