"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { QuestionnaireResult, DimensionScores } from "@/types/questionnaire"
import { RefreshCw, Building2, Network, Layers, AlertTriangle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { calculateAverageScores, getStatistics } from "@/lib/storage"

// 單一支撐結構插圖（自定義 SVG）
function SinglePillarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 地面 */}
      <rect x="10" y="85" width="80" height="5" fill="currentColor" opacity="0.3" />
      {/* 單一支柱 */}
      <rect x="45" y="30" width="10" height="55" fill="currentColor" />
      {/* 支撐的平台 */}
      <rect x="35" y="30" width="30" height="8" fill="currentColor" opacity="0.8" />
      {/* 頂部結構 */}
      <rect x="40" y="20" width="20" height="10" fill="currentColor" />
    </svg>
  )
}

interface ResultsDisplayProps {
  result: QuestionnaireResult
  onReset: () => void
}

// 結構判讀形容詞（A-D）
const structureTypeConfig = {
  A: {
    name: "只能依靠自己的",
    subtitle: "單一支撐型｜高風險",
    description: "目前生活主要仰賴一個穩定但關鍵的來源來支撐，例如固定薪資或單一工作收入。日常開銷大致能應付，但在儲蓄、可求助的支持系統，以及面對財務問題的信心上相對不足。這樣的狀態下，只要這個主要來源出現變動，例如加班減少、工作調整或短期失去收入，壓力就會快速集中，讓人措手不及。問題不在於你不努力，而是缺乏其他可以分擔風險的支撐。",
    summary: "現在撐得住，但所有重量都壓在同一個地方。",
    icon: SinglePillarIcon,
    iconColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  B: {
    name: "勉強撐著的",
    subtitle: "撐著型｜中高風險",
    description: "目前的生活是在努力維持平衡的狀態，收入可能不太穩定，儲蓄不多，對金錢安排與未來的掌握感有限。像是臨時需要修車、醫療支出或家庭突發狀況時，往往會讓整個生活節奏被打亂。這不是因為你不夠節制或不夠努力，而是本來就沒有太多可以調整或緩衝的空間。長期下來，身心都容易感到疲累。",
    summary: "一直在撐，但真的很難喘口氣。",
    icon: Building2,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  C: {
    name: "有人接住的",
    subtitle: "人脈承接型｜中低風險",
    description: "雖然收入不穩或債務壓力存在，但你並不是一個人面對這些問題。身邊可能有家人、朋友、社工或其他資源，能夠一起討論、提供建議，甚至在關鍵時刻伸出援手。同時，你對改變現況仍抱有信心，也願意嘗試調整做法。這讓你即使條件不理想，仍有慢慢修復與轉圜的可能。",
    summary: "條件辛苦，但你不是獨自承擔。",
    icon: Network,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  D: {
    name: "有很多依靠的",
    subtitle: "多元支撐型｜低風險",
    description: "你的生活並不是只靠單一條件支撐，而是由多個面向一起撐住，例如有基本儲蓄、有人可以討論、也清楚錢該怎麼安排。即使收入不是特別高，遇到像是收入波動或臨時支出時，仍有其他方式可以接住，不至於一次失衡。這是一種相對穩定、可長期調整的結構。",
    summary: "有幾個支撐點，整體比較安心。",
    icon: Layers,
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
}

// 狀態理解動物（5 類）
const animalTypeConfig = {
  elephant: {
    name: "站在細繩上的大象",
    subtitle: "結構型脆弱",
    description: "你其實很有能力，也承擔了不少責任，像是家庭經濟、工作表現或照顧他人。收入看起來穩定，但目前所有支撐幾乎都集中在同一個地方，其他面向如儲蓄、支持或心理緩衝相對薄弱。這會讓人表面看起來很穩，內心卻常感到緊繃，因為知道一旦失衡，後果會很重。",
    summary: "不是你不行，而是承重太集中。",
    emoji: "🐘",
    image: "/大象.png", // 圖片路徑
    color: "text-blue-600",
  },
  monkey: {
    name: "在樹間移動的猴子",
    subtitle: "社會韌性型",
    description: "即使收入不穩、債務壓力偏高，你仍懂得透過人際連結來找出路，例如找人討論、請教經驗，或嘗試不同的應對方式。你不一定條件最好，但有彈性、有行動力，願意在不同支點之間移動，為自己創造調整的空間。",
    summary: "靠連結換位置，路就不只一條。",
    emoji: "🐒",
    image: "/猴子.png", // 圖片路徑
    color: "text-purple-600",
  },
  dog: {
    name: "準備出發的小狗",
    subtitle: "心理啟動型",
    description: "你已經意識到需要改變，也對未來抱有期待，只是目前在金錢管理與儲備上還缺乏具體的方法。像是想開始記帳、規劃支出，但不知道從哪一步下手。這代表動機已經出現，只要有人陪你整理方向、提供工具，就能慢慢走起來。",
    summary: "有心想走，正在學怎麼走。",
    emoji: "🐕",
    image: "/小狗.png", // 圖片路徑
    color: "text-amber-600",
  },
  turtle: {
    name: "穩定前行的烏龜",
    subtitle: "隱性韌性型",
    description: "你的狀況沒有特別亮眼的優勢，也沒有明顯的危險訊號，各個面向都落在中間值。生活節奏可能不快，但不容易因單一事件而大幅失衡。這樣的狀態適合慢慢調整與準備，而不是急著做大改變。",
    summary: "不快，但走得久。",
    emoji: "🐢",
    image: "/烏龜.png", // 圖片路徑
    color: "text-green-600",
  },
  cat: {
    name: "縮成一團休息的貓",
    subtitle: "高風險疊加型",
    description: "目前同時承受多項壓力，例如儲蓄不足、債務負擔、支持較少，以及對未來缺乏信心。這會讓人感到疲憊、退縮，甚至不想再多想下一步。這不是能力問題，而是負荷真的太重。此刻最重要的不是再撐，而是先被接住、慢慢恢復。",
    summary: "不是撐不住，是現在需要休息。",
    emoji: "🐱",
    image: "/貓.png", // 圖片路徑
    color: "text-red-600",
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
  const [averageScores, setAverageScores] = useState<DimensionScores | null>(null)
  const [statistics, setStatistics] = useState({ totalCount: 0 })

  useEffect(() => {
    // 獲取平均分數和統計資訊
    const avg = calculateAverageScores()
    const stats = getStatistics()
    setAverageScores(avg)
    setStatistics(stats)
  }, [])

  // 準備雷達圖資料（包含使用者和平均值）
  const radarData = [
    {
      dimension: "收入穩定度",
      userValue: result.dimensionScores.收入穩定度,
      averageValue: averageScores?.收入穩定度 ?? 0,
      userScore: Math.round(result.dimensionScores.收入穩定度),
      averageScore: averageScores ? Math.round(averageScores.收入穩定度) : 0,
    },
    {
      dimension: "儲備應變力",
      userValue: result.dimensionScores.儲備應變力,
      averageValue: averageScores?.儲備應變力 ?? 0,
      userScore: Math.round(result.dimensionScores.儲備應變力),
      averageScore: averageScores ? Math.round(averageScores.儲備應變力) : 0,
    },
    {
      dimension: "債務與保障",
      userValue: result.dimensionScores.債務與保障,
      averageValue: averageScores?.債務與保障 ?? 0,
      userScore: Math.round(result.dimensionScores.債務與保障),
      averageScore: averageScores ? Math.round(averageScores.債務與保障) : 0,
    },
    {
      dimension: "金錢管理",
      userValue: result.dimensionScores.金錢管理,
      averageValue: averageScores?.金錢管理 ?? 0,
      userScore: Math.round(result.dimensionScores.金錢管理),
      averageScore: averageScores ? Math.round(averageScores.金錢管理) : 0,
    },
    {
      dimension: "資源連結",
      userValue: result.dimensionScores.資源連結,
      averageValue: averageScores?.資源連結 ?? 0,
      userScore: Math.round(result.dimensionScores.資源連結),
      averageScore: averageScores ? Math.round(averageScores.資源連結) : 0,
    },
    {
      dimension: "心理與規劃",
      userValue: result.dimensionScores.心理與規劃,
      averageValue: averageScores?.心理與規劃 ?? 0,
      userScore: Math.round(result.dimensionScores.心理與規劃),
      averageScore: averageScores ? Math.round(averageScores.心理與規劃) : 0,
    },
  ]

  const chartConfig = {
    userValue: {
      label: "您的分數",
    },
    averageValue: {
      label: "平均分數",
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

      {/* 2. 六構面雷達圖（含常態比較） */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-center">六構面雷達圖</h3>
          {averageScores && statistics.totalCount > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              與 {statistics.totalCount} 位使用者的平均分數比較
            </p>
          )}
        </div>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <RadarChart data={radarData} outerRadius="65%">
            <PolarGrid />
            <PolarAngleAxis
              dataKey="dimension"
              tick={(props) => {
                const { payload, x, y, cx, cy } = props
                
                // 確保所有標籤都顯示，即使座標異常
                if (!x && x !== 0 && !y && y !== 0) {
                  return null
                }
                
                // 先嘗試從 radarData 中查找
                let data = radarData.find((d) => d.dimension === payload.value)
                
                // 如果找不到，直接從 result.dimensionScores 中獲取（備用方案）
                if (!data && payload.value) {
                  const dimensionMap: Record<string, keyof DimensionScores> = {
                    "收入穩定度": "收入穩定度",
                    "儲備應變力": "儲備應變力",
                    "債務與保障": "債務與保障",
                    "金錢管理": "金錢管理",
                    "資源連結": "資源連結",
                    "心理與規劃": "心理與規劃",
                  }
                  const dimensionKey = dimensionMap[payload.value]
                  if (dimensionKey) {
                    const userScore = Math.round(result.dimensionScores[dimensionKey])
                    const avgScore = averageScores ? Math.round(averageScores[dimensionKey]) : 0
                    data = {
                      dimension: payload.value,
                      userValue: result.dimensionScores[dimensionKey],
                      averageValue: averageScores?.[dimensionKey] ?? 0,
                      userScore,
                      averageScore: avgScore,
                    }
                  }
                }
                
                // 獲取圖表中心點
                const centerX = cx ?? 0
                const centerY = cy ?? 0
                
                // 計算從中心到當前 tick 位置的向量
                const dx = x - centerX
                const dy = y - centerY
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                // 計算單位向量（從中心指向軸線末端的方向）
                let unitX = 0
                let unitY = 0
                let angle = 0
                
                if (distance > 0.1) {
                  // 正常情況：使用實際的方向向量
                  unitX = dx / distance
                  unitY = dy / distance
                  angle = Math.atan2(dy, dx)
                } else {
                  // 異常情況：根據維度索引計算角度（確保標籤不消失）
                  const dataIndex = radarData.findIndex((d) => d.dimension === payload.value)
                  if (dataIndex >= 0) {
                    // 六個維度，每個間隔 60 度，從頂部（-90度）開始
                    angle = (dataIndex * 2 * Math.PI) / radarData.length - Math.PI / 2
                    unitX = Math.cos(angle)
                    unitY = Math.sin(angle)
                  } else {
                    // 最後的備用方案
                    unitX = 1
                    unitY = 0
                    angle = 0
                  }
                }
                
                // 根據角度調整偏移量，確保頂部和底部的標籤有足夠空間
                // 頂部（-90度附近）和底部（90度附近）需要更大的垂直偏移
                // 左右兩側需要更大的水平偏移
                const baseOffset = 50
                let offsetX = unitX * baseOffset
                let offsetY = unitY * baseOffset
                
                // 對於接近垂直方向的標籤（頂部和底部），增加垂直偏移
                const verticalThreshold = Math.abs(Math.cos(angle))
                if (verticalThreshold < 0.5) {
                  // 接近垂直方向（頂部或底部）
                  if (unitY < 0) {
                    // 頂部：向上偏移更多
                    offsetY -= 25
                  } else {
                    // 底部：向下偏移更多
                    offsetY += 25
                  }
                } else {
                  // 接近水平方向（左右兩側），增加水平偏移
                  if (unitX > 0) {
                    // 右側：向右偏移更多
                    offsetX += 15
                  } else {
                    // 左側：向左偏移更多
                    offsetX -= 15
                  }
                }
                
                const labelX = x + offsetX
                const labelY = y + offsetY
                
                return (
                  <g>
                    <text
                      x={labelX}
                      y={labelY}
                      fill="currentColor"
                      fontSize={12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-foreground"
                    >
                      {payload.value}
                    </text>
                    {data ? (
                      <>
                        <text
                          x={labelX}
                          y={labelY + 18}
                          fill="#f97316"
                          fontSize={13}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {data.userScore}
                        </text>
                        {averageScores && (
                          <text
                            x={labelX}
                            y={labelY + 32}
                            fill="#6b7280"
                            fontSize={11}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            平均 {data.averageScore}
                          </text>
                        )}
                      </>
                    ) : null}
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
            {/* 使用者的雷達圖 */}
            <Radar
              name="您的分數"
              dataKey="userValue"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
              isAnimationActive={true}
            />
            {/* 平均值的雷達圖 */}
            {averageScores && (
              <Radar
                name="平均分數"
                dataKey="averageValue"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#6b7280", strokeWidth: 1, stroke: "#fff" }}
                isAnimationActive={true}
              />
            )}
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.dimension}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
                        <span>您的分數: {payload[0].value?.toFixed(1)}</span>
                      </div>
                      {averageScores && payload[1] && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6b7280" }}></div>
                          <span>平均分數: {payload[1].value?.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
            />
          </RadarChart>
        </ChartContainer>
        {/* 圖例說明 */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
            <span className="text-muted-foreground">您的分數</span>
          </div>
          {averageScores && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-dashed" style={{ backgroundColor: "#6b7280", borderColor: "#6b7280" }}></div>
              <span className="text-muted-foreground">平均分數（{statistics.totalCount} 位使用者）</span>
            </div>
          )}
        </div>
        {!averageScores && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            目前尚無足夠數據顯示平均分數，完成測驗後將開始累積統計數據
          </p>
        )}
      </Card>

      {/* 4. 結構判讀形容詞 */}
      <Card className={`p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2 ${structureTypeConfig[result.structureType].bgColor}`}>
        <h3 className="text-xl font-semibold mb-6">結構判讀</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* 插圖 - 佔一半 */}
          <div className="w-full md:w-1/2 flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px] md:min-h-[250px]">
            {(() => {
              const Icon = structureTypeConfig[result.structureType].icon
              const iconColor = structureTypeConfig[result.structureType].iconColor
              // 檢查是否為自定義 SVG 組件（SinglePillarIcon）
              if (result.structureType === "A") {
                return <Icon className={`${iconColor} w-full h-full max-w-[200px] max-h-[200px]`} />
              }
              // lucide-react 圖標
              return <Icon className={`w-full h-full max-w-[200px] max-h-[200px] ${iconColor}`} strokeWidth={1.5} />
            })()}
          </div>
          {/* 文字內容 - 佔一半 */}
          <div className="w-full md:w-1/2 space-y-3">
            <p className={`text-xl font-bold ${structureTypeConfig[result.structureType].iconColor}`}>
              {structureTypeConfig[result.structureType].name}
            </p>
            <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
              {structureTypeConfig[result.structureType].description}
            </p>
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
              <p className="text-base font-medium text-foreground italic">
                {structureTypeConfig[result.structureType].summary}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 5. 狀態理解動物 */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-6">狀態理解</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* 動物圖示 - 佔一半 */}
          <div className="w-full md:w-1/2 flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px] md:min-h-[250px] relative">
            {animalTypeConfig[result.animalType].image ? (
              <>
                <img
                  src={animalTypeConfig[result.animalType].image!}
                  alt={animalTypeConfig[result.animalType].name}
                  className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
                  onError={(e) => {
                    // 如果圖片載入失敗，隱藏圖片並顯示 emoji
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const emojiSpan = target.nextElementSibling as HTMLElement
                    if (emojiSpan) {
                      emojiSpan.style.display = "block"
                    }
                  }}
                />
                <span className="text-6xl md:text-7xl hidden">
                  {animalTypeConfig[result.animalType].emoji}
                </span>
              </>
            ) : (
              <span className="text-6xl md:text-7xl">
                {animalTypeConfig[result.animalType].emoji}
              </span>
            )}
          </div>
          {/* 文字內容 - 佔一半 */}
          <div className="w-full md:w-1/2 space-y-3">
            <div>
              <p className={`text-xl font-bold ${animalTypeConfig[result.animalType].color}`}>
                {animalTypeConfig[result.animalType].name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {animalTypeConfig[result.animalType].subtitle}
              </p>
            </div>
            <p className="text-base leading-relaxed text-foreground">
              {animalTypeConfig[result.animalType].description}
            </p>
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
              <p className="text-base font-medium text-foreground italic">
                {animalTypeConfig[result.animalType].summary}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 6. 目前可優先討論的方向（可複選） */}
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

      {/* 7. 下一步行動按鈕 */}
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
