"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { questions } from "@/lib/questionnaire-data"
import { calculateResult } from "@/lib/scoring"
import type { QuestionnaireResult } from "@/types/questionnaire"
import { CheckCircle2, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuestionnaireFormProps {
  onComplete: (result: QuestionnaireResult) => void
}

export function QuestionnaireForm({ onComplete }: QuestionnaireFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedOption, setSelectedOption] = useState<string>("")

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  const handleAnswer = (optionValue: string) => {
    setSelectedOption(optionValue)

    const option = question.options.find((opt) => opt.value === optionValue)
    if (!option) return

    const newAnswers = {
      ...answers,
      [question.id]: option.score,
    }
    setAnswers(newAnswers)

    // Auto-advance after a short delay to show selection
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption("")
      } else {
        const result = calculateResult(newAnswers)
        onComplete(result)
      }
    }, 300)
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption("")
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">財務韌性快速檢視</h1>
        <p className="text-lg text-muted-foreground text-pretty">透過 10 個簡單問題，了解您的家庭財務健康狀況</p>
      </div>

      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              問題 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round(progress)}% 完成</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-balance leading-relaxed">{question.text}</h2>

          <RadioGroup value={selectedOption} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.value} className="relative">
                  <RadioGroupItem value={option.value} id={`option-${option.value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-accent/50"
                  >
                    <span className="text-base leading-relaxed">{option.label}</span>
                    {selectedOption === option.value && (
                      <CheckCircle2 className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {currentQuestion > 0 && (
          <Button variant="outline" onClick={handleBack} className="w-full bg-transparent gap-2">
            <ChevronLeft className="h-4 w-4" />
            上一題
          </Button>
        )}
      </Card>
    </div>
  )
}
