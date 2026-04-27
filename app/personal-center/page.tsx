"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight, LineChart, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArchetypeToolMockupCard } from "@/components/archetype-tool-mockup-card"
import { PerceptionVsRealityCompare } from "@/components/perception-vs-reality-compare"
import { ANIMAL_MINI } from "@/lib/archetype-tool-mockups"
import {
  getLastQuestionnaireProfile,
  getLastSnapshot,
  type LastQuestionnaireProfile,
  type QuestionnaireSnapshot,
} from "@/lib/storage"
import { cn } from "@/lib/utils"
import type { AnimalType } from "@/types/questionnaire"

type TabValue = "overview" | "resilience" | "fraud" | "anxiety" | "dream"

type CenterTool = {
  id: string
  title: string
  /** Hero 區一行話，口語好懂 */
  summary: string
  /** 展開後：這是什麼、適合誰 */
  description: string
  /** 用這個功能對使用者的好處（口語條列） */
  benefits: string[]
  href: string
  ctaLabel: string
  badge?: string
  chips?: string[]
}

const TOOLS: Record<string, CenterTool> = {
  accounting: {
    id: "accounting",
    title: "財務生活記帳助理",
    summary: "像隨身小幫手，幫你把每天花錢記下來，還用圖表讓你一眼看懂錢怎麼流出去。",
    description:
      "很多人不是不會賺錢，是不知道錢不見在哪裡。用手機記一筆、分類一下，久了就會發現哪裡省一點、哪裡調一下，心裡就比較踏實。",
    benefits: [
      "圖表拉出來，一看就懂錢花到哪。",
      "AI 幫你留意花費習慣，哪裡固定、哪裡衝動，心裡比較有譜。",
      "有記帳習慣之後，要規劃下一步或和家人討論，比較有根據。",
    ],
    href: "https://www.familyfinhealth.com/toolbox/financial-calculator/basic-accounting-preview",
    ctaLabel: "開啟記帳助理",
    badge: "全新上線",
    chips: ["智慧記帳", "AI 幫你看出門道", "每月一張圖就懂"],
  },
  resilience: {
    id: "resilience",
    title: "真實財務韌性",
    summary: "用問卷跟分數，把你家現在「耐不耐撞、萬一沒收入能撐多久」講得白話一點、具體一點。",
    description:
      "做完自我評估，心裡會有一個「感覺」。這裡再往前一步：用總分、六大面向及前後兩次對照，看清哪裡要先補強，要跟家人談或找資源時比較說得出重點。",
    benefits: [
      "知道哪一塊比較穩、哪一塊比較薄，不會什麼都一起擔心。",
      "可以回看上次跟這次有沒有變好，不是做完就忘。",
      "把「我覺得還行」跟「分數怎麼說」放在一起看，比較不會誤判狀況。",
    ],
    href: "https://financial-resilience-assessment-too.vercel.app/personal",
    ctaLabel: "前往真實財務韌性",
  },
  fraud: {
    id: "fraud",
    title: "詐騙防禦能力",
    summary: "用生活裡常見的情境，看看你在「很急、很熟、看起來超合理」的時候，第一個念頭通常是什麼。",
    description:
      "現在的詐騙常長得像通知、像熟人借錢、像限時優惠。這份檢測讓你發現：壓力一來，你習慣先相信還是先緩一緩、先查證？先認識自己的習慣，才知道哪裡要練習踩煞車。",
    benefits: [
      "知道自己「容易心軟」還是「容易急」，接到可疑訊息時心裡會多一個提醒。",
      "結果對應幾種常見反應類型，幫你找到適合的防範節奏。",
      "可以跟家人一起做、一起對答案，彼此提醒。",
    ],
    href: "https://www.familyfinhealth.com/fraud-defense",
    ctaLabel: "開始防詐檢測",
  },
  anxiety: {
    id: "anxiety",
    title: "財務焦慮",
    summary: "錢的壓力一來，有人睡不著、有人裝沒事、有人一直想最壞的情況——這裡幫你看你比較像哪一種。",
    description:
      "就是問你：帳單快來、薪水還沒進帳的時候，你通常怎麼想、怎麼反應。做完會得到一個大概的輪廓，讓你知道「原來很多人也會這樣」，也比較敢去找人聊或試著調整一小步。",
    benefits: [
      "比較不會覺得「只有我一個人在慌」——先被理解，心就會鬆一點。",
      "用白話整理可以試的小方向，不是做完就丟一個抽象名詞。",
      "若有做自我評估或真實評估，可以一起看：心裡很慌時，跟實際狀況是不是同一回事。",
    ],
    href: "https://www.familyfinhealth.com/financial-anxiety",
    ctaLabel: "開始財務焦慮檢測",
  },
  dream: {
    id: "dream",
    title: "夢想達成財務規劃",
    summary: "不是要你一次變有錢，而是陪你把「想去旅行、想買房、想轉職」拆成這個月、下個月辦得到的小步。",
    description:
      "很多人心裡有目標，但不知道從哪裡下手，就一直拖。這裡用引導式步驟，陪你想想錢從哪來、什麼要先擋、什麼可以緩，一步一步排下去，比較不會三分鐘熱度。",
    benefits: [
      "大願望不只停在「好想喔」，而是變成排得出來的順序。",
      "比較清楚每個月可以挪多少給這個目標，心裡有底。",
      "若已在記帳、做評估，可以把數字跟夢想接在一起，計畫比較站得住腳。",
    ],
    href: "https://www.familyfinhealth.com/financial-planning",
    ctaLabel: "開始夢想財務規劃",
  },
}

const TAB_TOOL_IDS: Record<TabValue, string[]> = {
  overview: ["accounting", "resilience", "fraud", "anxiety", "dream"],
  resilience: ["resilience"],
  fraud: ["fraud"],
  anxiety: ["anxiety"],
  dream: ["dream"],
}

const TAB_LABELS: { value: TabValue; label: string }[] = [
  { value: "overview", label: "總覽" },
  { value: "resilience", label: "真實財務韌性" },
  { value: "fraud", label: "詐騙防禦能力" },
  { value: "anxiety", label: "財務焦慮" },
  { value: "dream", label: "夢想達成財務管理" },
]

function ExternalHeroLink({
  href,
  label,
  className,
}: {
  href: string
  label: string
  className?: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-md transition hover:bg-white/30",
        className,
      )}
      aria-label={label}
    >
      <ArrowRight className="size-5" />
    </a>
  )
}

function ToolBenefitsBlock({ tool }: { tool: CenterTool }) {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 px-4 py-4">
      <p className="text-sm font-semibold text-foreground">用這個功能，對你有什麼幫助？</p>
      <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground marker:text-primary">
        {tool.benefits.map((line) => (
          <li key={line} className="pl-0.5">
            {line}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ToolFullSection({
  tool,
  animalType,
  totalScore,
}: {
  tool: CenterTool
  animalType: AnimalType | null
  totalScore: number | null
}) {
  return (
    <Card className="overflow-hidden border-2 border-border/70 bg-card/95 shadow-sm">
      <div className="border-b border-border/60 bg-muted/20 px-5 py-4">
        <h2 className="text-lg font-bold tracking-tight text-foreground md:text-xl">{tool.title}</h2>
      </div>
      <div className="space-y-5 px-5 py-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
        <ArchetypeToolMockupCard toolId={tool.id} animalType={animalType} totalScore={totalScore} />
        <ToolBenefitsBlock tool={tool} />
        <ToolHeroPanel tool={tool} />
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={tool.href} target="_blank" rel="noopener noreferrer">
              {tool.ctaLabel}
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground sm:text-right">
          將於新分頁開啟官方工具
        </p>
      </div>
    </Card>
  )
}

function ToolHeroPanel({ tool }: { tool: CenterTool }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg md:p-8">
      {tool.badge ? (
        <Badge className="mb-3 border-0 bg-amber-500/90 text-amber-950 hover:bg-amber-500">
          <Sparkles className="mr-1 size-3" />
          {tool.badge}
        </Badge>
      ) : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <h4 className="text-xl font-bold tracking-tight md:text-2xl">{tool.title}</h4>
          <p className="text-sm leading-relaxed text-white/90 md:text-base">{tool.summary}</p>
          {tool.chips && tool.chips.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {tool.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/95"
                >
                  {c}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <ExternalHeroLink href={tool.href} label={tool.ctaLabel} />
      </div>
    </div>
  )
}

export default function PersonalCenterPage() {
  const [snapshot, setSnapshot] = useState<QuestionnaireSnapshot | null>(null)
  const [profile, setProfile] = useState<LastQuestionnaireProfile | null>(null)

  useEffect(() => {
    setSnapshot(getLastSnapshot())
    setProfile(getLastQuestionnaireProfile())
  }, [])

  const lastUpdated =
    snapshot != null
      ? format(new Date(snapshot.updatedAt), "yyyy/MM/dd")
      : "—"

  const scoreDisplay = snapshot != null ? String(snapshot.totalScore) : "—"
  const delta =
    snapshot?.previousTotalScore != null
      ? snapshot.totalScore - snapshot.previousTotalScore
      : null
  const deltaText =
    delta === null ? "較上次 —" : `較上次 ${delta >= 0 ? "+" : ""}${delta} 分`

  const archetypeLabel =
    profile != null
      ? `${ANIMAL_MINI[profile.animalType].emoji} ${ANIMAL_MINI[profile.animalType].title}`
      : null

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <p className="mb-6 text-center text-sm text-muted-foreground md:text-left">
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            ← 回到自我評估
          </Link>
        </p>

        <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              個人中心
            </h1>
            <p className="text-muted-foreground">
              把做過的評估、想用的工具都收在同一個地方，隨時回來看、隨時往前一步。
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full bg-amber-100/80 text-amber-900">
                最後更新 {lastUpdated}
              </Badge>
              <Badge variant="secondary" className="rounded-full bg-primary/15 text-primary">
                專屬個人資料
              </Badge>
              {archetypeLabel != null ? (
                <Badge variant="secondary" className="rounded-full bg-violet-100/90 text-violet-950 dark:bg-violet-950/40 dark:text-violet-100">
                  自我評估狀態：{archetypeLabel}
                </Badge>
              ) : null}
            </div>
          </div>

          <Card className="w-full shrink-0 border border-border/80 bg-card/90 p-5 shadow-sm lg:w-80">
            <div className="flex items-start gap-4">
              <Avatar className="size-14 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                  {profile != null ? ANIMAL_MINI[profile.animalType].emoji : "會"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-semibold">會員</p>
                <p className="truncate text-sm text-muted-foreground">
                  {archetypeLabel != null ? `目前以「${archetypeLabel}」模擬各工具預覽` : "登入後顯示完整資料"}
                </p>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  自我評估財務韌性 {scoreDisplay} 分
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full gap-6">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
            {TAB_LABELS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-3 text-sm font-medium text-muted-foreground shadow-none data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none md:px-4"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TAB_LABELS.map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-6 space-y-6">
              {value === "overview" ? (
                <>
                  <Card className="relative overflow-hidden border-2 border-border/80 bg-card p-6 shadow-sm md:p-8">
                    <LineChart className="absolute right-4 top-4 size-8 text-primary/30" aria-hidden />
                    <p className="text-sm font-medium text-muted-foreground">自我評估財務韌性</p>
                    <p className="mt-2 text-5xl font-bold tabular-nums text-foreground md:text-6xl">
                      {scoreDisplay}
                      <span className="text-2xl font-semibold text-muted-foreground md:text-3xl">
                        {" "}
                        分
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{deltaText}</p>
                    {snapshot == null ? (
                      <p className="mt-4 text-sm text-muted-foreground">
                        尚未有自我評估紀錄，可先{" "}
                        <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                          完成首測
                        </Link>
                        。
                      </p>
                    ) : null}
                  </Card>

                  <div className="space-y-6">
                    {TAB_TOOL_IDS.overview.map((id) => (
                      <ToolFullSection
                        key={id}
                        tool={TOOLS[id]}
                        animalType={profile?.animalType ?? null}
                        totalScore={profile?.totalScore ?? snapshot?.totalScore ?? null}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {value === "resilience" ? <PerceptionVsRealityCompare /> : null}
                  <div className="space-y-6">
                    {TAB_TOOL_IDS[value].map((id) => (
                      <ToolFullSection
                        key={id}
                        tool={TOOLS[id]}
                        animalType={profile?.animalType ?? null}
                        totalScore={profile?.totalScore ?? snapshot?.totalScore ?? null}
                      />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
