"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { QuestionnaireResult } from "@/types/questionnaire"
import { RefreshCw } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"

interface ResultsDisplayProps {
  result: QuestionnaireResult
  onReset: () => void
}

// 結構型判讀文字（A-E）
const structureTypeConfig = {
  A: {
    name: "單一支撐結構",
    description: "目前家庭的財務狀況，主要仰賴單一條件來維持穩定。\n當這個支撐點運作順利時，生活尚能撐住；\n但一旦出現變動，其他可承接的空間相對有限。",
  },
  B: {
    name: "撐著運作結構",
    description: "目前家庭是在努力維持生活運作的狀態，\n多數調整仰賴當下的撐持與應付。\n當狀況穩定時可以繼續前進，但面對突發事件時，調整空間較小。",
  },
  C: {
    name: "人脈承接結構",
    description: "雖然目前的財務條件帶來一定壓力，\n但你並不是孤立面對問題。\n願意行動的心態與可連結的支持，\n讓家庭在條件不利時，仍保有調整與修復的可能。",
  },
  D: {
    name: "多元支撐結構",
    description: "家庭的財務狀況並非完全沒有壓力，\n但同時具備多個可以相互支撐的面向。\n即使其中一項條件出現變動，\n仍有其他力量能協助承接與調整。",
  },
  E: {
    name: "壓力集中結構",
    description: "目前有多個重要面向同時承受壓力，\n使家庭在面對變動時較難有餘裕調整。\n這樣的狀態，代表需要更多支持與陪伴，\n才能慢慢把壓力拆解開來。",
  },
}

// 分數區間配置
function getScoreConfig(score: number) {
  if (score >= 75) {
    return {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-900",
      label: "財務韌性良好",
      feedback: "從你的填答來看，目前家庭在面對金錢壓力與突發狀況時，具備一定的穩定度與調整空間。\n即使遇到變動，通常仍有時間思考與因應。\n建議你留意目前已做得不錯的地方，未來可逐步為長期目標或風險再多做一些準備。",
    }
  } else if (score >= 60) {
    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-900",
      label: "接近韌性",
      feedback: "你的家庭已具備部分財務基礎，但在某些情境下仍容易感到吃力。\n目前正處於一個「很關鍵的階段」，只要針對幾個弱項做調整，就能實際降低未來的風險。\n建議先從分數較低的面向開始，一次專注改善一件事。",
    }
  } else if (score >= 40) {
    return {
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-900",
      label: "財務較脆弱",
      feedback: "你的填答顯示，家庭在面對突發事件或收入變動時，承受的壓力較大，選擇也相對有限。\n這並不代表你做得不好，而是目前真的承擔了很多現實壓力。\n若能有人陪你一起整理財務狀況，風險是可以被降低的。",
    }
  } else {
    return {
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-900",
      label: "高度脆弱",
      feedback: "目前家庭的財務與心理壓力偏高，很多事情可能只能先撐著。\n這樣的狀態，並不適合一個人獨自面對。\n建議儘早尋求可信任的專業或支持資源，一起找出可行的下一步。",
    }
  }
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const scoreConfig = getScoreConfig(result.totalScore)

  // 準備雷達圖資料
  const radarData = [
    {
      dimension: "收入與\n穩定性",
      value: result.dimensionScores.收入與穩定性,
      score: Math.round(result.dimensionScores.收入與穩定性),
    },
    {
      dimension: "儲蓄與\n突發應對",
      value: result.dimensionScores.儲蓄與突發應對,
      score: Math.round(result.dimensionScores.儲蓄與突發應對),
    },
    {
      dimension: "債務壓力\n與風險保障",
      value: result.dimensionScores.債務壓力與風險保障,
      score: Math.round(result.dimensionScores.債務壓力與風險保障),
    },
    {
      dimension: "金錢管理\n與金融使用",
      value: result.dimensionScores.金錢管理與金融使用,
      score: Math.round(result.dimensionScores.金錢管理與金融使用),
    },
    {
      dimension: "支持資源\n與連結",
      value: result.dimensionScores.支持資源與連結,
      score: Math.round(result.dimensionScores.支持資源與連結),
    },
    {
      dimension: "心理韌性\n與未來感",
      value: result.dimensionScores.心理韌性與未來感,
      score: Math.round(result.dimensionScores.心理韌性與未來感),
    },
  ]

  const chartConfig = {
    value: {
      label: "分數",
    },
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. 整體財務韌性分數 */}
      <Card className={`p-6 md:p-8 border-2 ${scoreConfig.borderColor} ${scoreConfig.bgColor}`}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">整體財務韌性分數</h2>
          <div className={`text-6xl md:text-7xl font-bold mb-2 ${scoreConfig.color}`}>
            {result.totalScore}
          </div>
          <p className={`text-lg font-medium mb-8 ${scoreConfig.color}`}>{scoreConfig.label}</p>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-border/50 shadow-sm">
              <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line text-center">
                {scoreConfig.feedback}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. 六構面雷達圖 */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-6 text-center">六構面雷達圖</h3>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <RadarChart data={radarData} outerRadius="75%">
            <PolarGrid />
            <PolarAngleAxis
              dataKey="dimension"
              tick={(props) => {
                const { payload, x, y } = props
                const data = radarData.find((d) => d.dimension === payload.value)
                return (
                  <g>
                    <text
                      x={x}
                      y={y}
                      fill="currentColor"
                      fontSize={12}
                      textAnchor="middle"
                      className="text-foreground"
                    >
                      {payload.value}
                    </text>
                    {data && (
                      <text
                        x={x}
                        y={y + 18}
                        fill="hsl(var(--primary))"
                        fontSize={14}
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {data.score}
                      </text>
                    )}
                  </g>
                )
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="分數"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.4}
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "#fff" }}
              isAnimationActive={true}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ChartContainer>
      </Card>

      {/* 4. 結構型判讀文字（A-E，擇一） */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-4">結構判讀</h3>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            {structureTypeConfig[result.structureType].name}
          </p>
          <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
            {structureTypeConfig[result.structureType].description}
          </p>
        </div>
      </Card>

      {/* 5. 目前可優先討論的方向（可複選） */}
      {result.priorities.length > 0 && (
        <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
          <h3 className="text-xl font-semibold mb-2">目前可優先討論的方向</h3>
          <p className="text-base text-muted-foreground mb-6">
            以下是依據你的填答，
            <br />
            目前較值得被討論與整理的方向：
          </p>
          <div className="space-y-3">
            {result.priorities.map((priority, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/30 border border-border/50"
              >
                <span className="text-base font-medium">{priority}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 6. 下一步行動按鈕 */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-4">下一步行動</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">個人財務諮詢</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">問問 AI</span>
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

      {/* 重新評估按鈕 */}
      <div className="text-center">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          重新評估
        </Button>
      </div>
    </div>
  )
}
