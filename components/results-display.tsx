"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { QuestionnaireResult } from "@/types/questionnaire"
import { RefreshCw, TrendingUp, Home, Shield, AlertTriangle } from "lucide-react"

interface ResultsDisplayProps {
  result: QuestionnaireResult
  onReset: () => void
}

const levelConfig = {
  resilient: {
    title: "財務韌性良好",
    description: "您的家庭財務狀況展現出良好的韌性，能夠應對大多數的經濟挑戰。",
    icon: Shield,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    borderColor: "border-emerald-200 dark:border-emerald-900",
    barColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
    position: 85, // Percentage position on bar
  },
  approaching: {
    title: "接近財務韌性",
    description: "您的家庭財務狀況基本穩定，但在某些方面仍有提升空間。",
    icon: TrendingUp,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
    barColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
    position: 55,
  },
  fragile: {
    title: "財務狀況脆弱",
    description: "您的家庭財務面臨一些挑戰，建議尋求適當的協助與資源。",
    icon: Home,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-900",
    barColor: "bg-gradient-to-r from-orange-500 to-amber-500",
    position: 35,
  },
  "highly-fragile": {
    title: "財務極度脆弱",
    description: "您的家庭財務狀況需要立即關注，建議盡快尋求專業協助。",
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
    barColor: "bg-gradient-to-r from-red-500 to-rose-500",
    position: 15,
  },
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const config = levelConfig[result.level]
  const Icon = config.icon

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-foreground">您的評估結果</h1>
        <p className="text-lg text-muted-foreground">以下是基於您的回答所做的分析</p>
      </div>

      <Card className={`p-6 md:p-8 mb-6 border-2 ${config.borderColor} ${config.bgColor}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-full bg-background/50`}>
            <Icon className={`h-8 w-8 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{config.title}</h2>
            <p className="text-base leading-relaxed text-foreground/90">{config.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">財務狀況指標</h3>
          <div className="relative h-12 bg-gradient-to-r from-red-200 via-orange-200 via-blue-200 to-emerald-200 rounded-full overflow-hidden">
            {/* Position indicator */}
            <div
              className="absolute top-0 bottom-0 flex items-center transition-all duration-500"
              style={{ left: `${config.position}%`, transform: "translateX(-50%)" }}
            >
              <div className={`p-2 rounded-full bg-background shadow-lg border-2 ${config.borderColor}`}>
                <Icon className={`h-5 w-5 ${config.iconColor}`} />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>需要關注</span>
            <span>穩定發展</span>
          </div>
        </div>
      </Card>

      {result.priorities.length > 0 && (
        <Card className="p-6 md:p-8 mb-6 bg-card/80 backdrop-blur-sm border-2">
          <h3 className="text-xl font-semibold mb-4">目前可優先討論的方向</h3>
          <div className="space-y-3">
            {result.priorities.map((priority, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <span className="text-base font-medium">{priority}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-4">下一步行動</h3>
        <div className="space-y-4 mb-6">
          <p className="text-base leading-relaxed text-muted-foreground">
            我們理解每個家庭都有獨特的財務狀況。無論結果如何，都有方法可以改善您的財務韌性。
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">問問 AI</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">尋求諮詢</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">紀錄本次測試結果</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
        </div>
      </Card>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          重新評估
        </Button>
      </div>
    </div>
  )
}
