"use client"

import { useState } from "react"
import { QuestionnaireForm } from "@/components/questionnaire-form"
import { ResultsDisplay } from "@/components/results-display"
import { TransitionAnimation } from "@/components/transition-animation"
import type { QuestionnaireResult } from "@/types/questionnaire"
import { saveLastQuestionnaireProfile, saveLastSnapshot, saveResult } from "@/lib/storage"
import { Button } from "@/components/ui/button"

const CAMEL_DEMO_RESULT: QuestionnaireResult = {
  totalScore: 58,
  level: "fragile",
  priorities: ["建立 1 個月緊急預備金", "每週固定記帳 3 天", "盤點固定支出可調整項目"],
  dimensionScores: {
    收入穩定度: 11,
    儲備應變力: 8,
    債務與保障: 10,
    金錢管理: 9,
    資源連結: 10,
    心理與規劃: 10,
  },
  structureType: "struggling",
  animalType: "camel",
}

export default function Home() {
  const [result, setResult] = useState<QuestionnaireResult | null>(null)
  const [showTransition, setShowTransition] = useState(false)
  const [pendingResult, setPendingResult] = useState<QuestionnaireResult | null>(null)

  const handleComplete = (completedResult: QuestionnaireResult) => {
    // 儲存結果到本地儲存
    saveResult(completedResult.dimensionScores)
    saveLastSnapshot(completedResult.totalScore)
    saveLastQuestionnaireProfile({
      animalType: completedResult.animalType,
      structureType: completedResult.structureType,
      totalScore: completedResult.totalScore,
    })
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
          <div className="space-y-6">
            <div className="mx-auto max-w-3xl rounded-xl border border-primary/20 bg-primary/5 p-4 md:p-5">
              <p className="text-sm text-muted-foreground">想直接看完成後結果展示？</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => {
                    saveLastSnapshot(CAMEL_DEMO_RESULT.totalScore)
                    saveLastQuestionnaireProfile({
                      animalType: CAMEL_DEMO_RESULT.animalType,
                      structureType: CAMEL_DEMO_RESULT.structureType,
                      totalScore: CAMEL_DEMO_RESULT.totalScore,
                    })
                    setResult(CAMEL_DEMO_RESULT)
                  }}
                >
                  查看駱駝範例結果
                </Button>
                <p className="text-sm text-muted-foreground">可直接檢視「自我評估 → 個人中心解鎖客觀分析」流程。</p>
              </div>
            </div>
            <QuestionnaireForm onComplete={handleComplete} />
          </div>
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
