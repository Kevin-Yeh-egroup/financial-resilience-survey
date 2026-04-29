"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { DimensionScores } from "@/types/questionnaire"
import { getAllResults } from "@/lib/storage"
import {
  RESILIENCE_COMPARISON_ROWS,
  getDisplayedSubjectiveRaw,
  indicatorLight30,
  objectivePercent,
  subjectivePercent,
} from "@/lib/resilience-comparison-rows"
import { SIMULATED_FETCHED_ASSESSMENT } from "@/lib/simulated-objective-assessment"

/** 正式串接施測平台後改為 await fetch(...)；目前回傳模擬 payload */
function useObjectiveScoresFromAssessment() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 0)
    return () => window.clearTimeout(t)
  }, [])

  const data = SIMULATED_FETCHED_ASSESSMENT
  return { ready, scores: data.scores, meta: data }
}

function formatRowDelta(cur: number, prev: number): string {
  const d = Math.round((cur - prev) * 10) / 10
  if (d === 0) return "持平"
  return `${d > 0 ? "+" : ""}${d}`
}

function ComparisonIllustrationDemo() {
  return (
    <div className="rounded-xl border border-dashed border-primary/25 bg-gradient-to-b from-primary/5 to-transparent p-4 md:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">怎麼看對照（示範數字）</p>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          與下方「真實韌性」同一筆模擬施測結果
        </span>
      </div>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-primary" aria-hidden />
          自我評估（每面向滿分 30 → 換算%）
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-2.5 rounded-sm bg-violet-500" aria-hidden />
          真實（A～F 滿分不同 → 換算%）
        </span>
      </div>
      <ul className="space-y-4">
        {RESILIENCE_COMPARISON_ROWS.map((row) => {
          const subjRaw = getDisplayedSubjectiveRaw(null, row.subjectiveKey)
          const subjPct = subjectivePercent(subjRaw)
          const objRaw = SIMULATED_FETCHED_ASSESSMENT.scores[row.objectiveKey]
          const objPct = objectivePercent(objRaw, row.objectiveMax)
          return (
            <li key={row.subjectiveKey} className="rounded-lg border border-border/60 bg-card/80 px-3 py-3">
              <p className="mb-2 text-xs font-medium text-foreground">
                {row.subjectiveKey}
                <span className="mx-1 text-muted-foreground">·</span>
                <span className="text-muted-foreground">{row.objectiveLabel}</span>
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[11px] text-muted-foreground">自評</span>
                  <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${Math.min(100, subjPct)}%` }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-foreground">
                    {subjPct}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-10 shrink-0 text-[11px] text-muted-foreground">真實</span>
                  <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-[width] duration-500"
                      style={{ width: `${Math.min(100, objPct)}%` }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-foreground">
                    {objPct}%
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function PerceptionVsRealityCompare() {
  const [subjectiveDims, setSubjectiveDims] = useState<DimensionScores | null>(null)
  const { ready, scores: objectiveScores, meta } = useObjectiveScoresFromAssessment()

  useEffect(() => {
    const all = getAllResults()
    const last = all.length > 0 ? all[all.length - 1] : null
    setSubjectiveDims(last?.dimensionScores ?? null)
  }, [])

  const averages = useMemo(() => {
    let subjSum = 0
    let objSum = 0
    const n = RESILIENCE_COMPARISON_ROWS.length
    for (const row of RESILIENCE_COMPARISON_ROWS) {
      const s = getDisplayedSubjectiveRaw(subjectiveDims, row.subjectiveKey)
      const oClamped = Math.min(
        Math.max(0, objectiveScores[row.objectiveKey]),
        row.objectiveMax,
      )
      subjSum += subjectivePercent(s)
      objSum += objectivePercent(oClamped, row.objectiveMax)
    }
    const subjAvg = Math.round((subjSum / n) * 10) / 10
    const objAvg = Math.round((objSum / n) * 10) / 10
    return {
      subj: subjAvg,
      obj: objAvg,
      gap: Math.round((objAvg - subjAvg) * 10) / 10,
    }
  }, [subjectiveDims, objectiveScores])

  const objectiveTotal = useMemo(() => {
    return RESILIENCE_COMPARISON_ROWS.reduce((sum, row) => {
      const v = Math.min(Math.max(0, objectiveScores[row.objectiveKey]), row.objectiveMax)
      return sum + v
    }, 0)
  }, [objectiveScores])

  const assessedDisplay = format(parseISO(meta.assessedAtIso), "yyyy/MM/dd")
  const totalDelta = meta.total - meta.previousTotal

  return (
    <Card className="border-2 border-primary/15 bg-card/90 p-5 shadow-sm md:p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight">自我評估版 vs 真實版，六面向對照</h3>

        <div className="rounded-xl border-2 border-violet-200/70 bg-gradient-to-b from-violet-50/90 to-card/80 p-4 dark:border-violet-900/50 dark:from-violet-950/35 dark:to-card/50 md:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-violet-600 text-white hover:bg-violet-600">現實財務韌性</Badge>
            <Badge variant="secondary">模擬 · 施測結果已同步</Badge>
            {!ready ? (
              <span className="text-xs text-muted-foreground">載入中…</span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">最新評估 · {assessedDisplay}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                {meta.respondentDemoName}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-950 dark:bg-amber-950/50 dark:text-amber-100">
                  {meta.levelLabel}
                </span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {meta.subtitleLabel}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                共 {meta.attemptOrdinal} 次評估 · 總分{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {meta.total} / 100
                </span>
                {totalDelta !== 0 ? (
                  <span className="tabular-nums text-foreground">
                    {" "}
                    （較上次 {totalDelta > 0 ? "+" : ""}
                    {totalDelta}）
                  </span>
                ) : null}
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-violet-200/50 dark:border-violet-900/40">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b bg-violet-100/50 dark:bg-violet-950/40">
                  <th className="px-3 py-2 font-medium">面向</th>
                  <th className="px-3 py-2 font-medium">本次得分</th>
                  <th className="px-3 py-2 font-medium">上次得分</th>
                  <th className="px-3 py-2 font-medium">變化</th>
                </tr>
              </thead>
              <tbody>
                {RESILIENCE_COMPARISON_ROWS.map((row) => {
                  const cur = objectiveScores[row.objectiveKey]
                  const prev = meta.previousScores[row.objectiveKey]
                  return (
                    <tr key={row.objectiveKey} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-2 text-muted-foreground">{row.objectiveLabel}</td>
                      <td className="px-3 py-2 tabular-nums">
                        {cur} / {row.objectiveMax}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {prev} / {row.objectiveMax}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{formatRowDelta(cur, prev)}</td>
                    </tr>
                  )
                })}
                <tr className="border-t-2 border-violet-200/60 bg-violet-50/40 font-medium dark:border-violet-900/50 dark:bg-violet-950/25">
                  <td className="px-3 py-2">總分</td>
                  <td className="px-3 py-2 tabular-nums">
                    {meta.total} / 100
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {meta.previousTotal} / 100
                  </td>
                  <td className="px-3 py-2 tabular-nums">
                    {formatRowDelta(meta.total, meta.previousTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <ComparisonIllustrationDemo />

        {subjectiveDims == null ? (
          <p className="rounded-lg border border-blue-200/80 bg-blue-50/80 px-4 py-3 text-sm text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
            尚未在本站留下自我評估構面時，對照表中「自我評估」欄會先顯示<strong className="font-semibold">示範原分</strong>；請到{" "}
            <Link href="/assessment" className="font-medium underline underline-offset-4">
              前往完成自我評估
            </Link>
            後，左側會自動改為你的分數。
          </p>
        ) : null}

        <div className="grid gap-3 rounded-xl border bg-muted/30 p-4 text-sm md:grid-cols-3">
          <div>
            <p className="text-muted-foreground">自我評估六面向平均（換算%）</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{averages.subj}%</p>
            {subjectiveDims == null ? (
              <p className="mt-1 text-xs text-muted-foreground">目前含示範資料</p>
            ) : null}
          </div>
          <div>
            <p className="text-muted-foreground">真實六面向平均（換算%）</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{averages.obj}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              真實總分（加總）：{objectiveTotal} / 100 · 與上方同步結果一致
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">平均落差（真實% − 自我評估%）</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {averages.gap >= 0 ? "+" : ""}
              {averages.gap}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              正數代表真實版換算後比自我評估高；負數代表你感覺比較好、分數卻較保守。
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-2 font-medium">自我評估構面</th>
                <th className="px-3 py-2 font-medium">自我評估</th>
                <th className="px-3 py-2 font-medium">自我評估換算%</th>
                <th className="px-3 py-2 font-medium">對應真實面向</th>
                <th className="px-3 py-2 font-medium">真實得分</th>
                <th className="px-3 py-2 font-medium">真實換算%</th>
                <th className="px-3 py-2 font-medium">差（百分點）</th>
              </tr>
            </thead>
            <tbody>
              {RESILIENCE_COMPARISON_ROWS.map((row) => {
                const sRaw = getDisplayedSubjectiveRaw(subjectiveDims, row.subjectiveKey)
                const s30 = Math.round(sRaw * 10) / 10
                const sPct = subjectivePercent(sRaw)
                const oRaw = objectiveScores[row.objectiveKey]
                const oNum = Math.min(Math.max(0, oRaw), row.objectiveMax)
                const oPct = objectivePercent(oNum, row.objectiveMax)
                const gap = Math.round((oPct - sPct) * 10) / 10
                return (
                  <tr key={row.subjectiveKey} className="border-b border-border/60 last:border-0">
                    <td className="px-3 py-2 text-muted-foreground">{row.subjectiveKey}</td>
                    <td className="px-3 py-2 tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        {indicatorLight30(sRaw)} {s30}
                      </span>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{sPct}%</td>
                    <td className="px-3 py-2">
                      <span className="text-muted-foreground">{row.objectiveLabel}</span>
                      <span className="sr-only">（滿分 {row.objectiveMax}）</span>
                    </td>
                    <td className="px-3 py-2 tabular-nums">{`${oNum} / ${row.objectiveMax}`}</td>
                    <td className="px-3 py-2 tabular-nums">{oPct}%</td>
                    <td className="px-3 py-2 tabular-nums">
                      {gap >= 0 ? "+" : ""}
                      {gap}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}
