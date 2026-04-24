"use client"

import { Badge } from "@/components/ui/badge"
import { getArchetypeToolMockup } from "@/lib/archetype-tool-mockups"
import type { AnimalType } from "@/types/questionnaire"

export function ArchetypeToolMockupCard({
  toolId,
  animalType,
  totalScore,
}: {
  toolId: string
  animalType: AnimalType | null
  totalScore: number | null
}) {
  const mock = getArchetypeToolMockup(toolId, animalType, totalScore)

  return (
    <div className="rounded-xl border-2 border-amber-200/70 bg-gradient-to-b from-amber-50/90 to-card/80 p-4 shadow-sm dark:border-amber-900/60 dark:from-amber-950/40 dark:to-card/50">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-amber-600 text-white hover:bg-amber-600">模擬結果</Badge>
        <Badge variant="secondary" className="bg-amber-100 text-amber-950 dark:bg-amber-900/50 dark:text-amber-100">
          數據為示範演算
        </Badge>
      </div>
      <p className="mt-3 text-xs font-medium text-muted-foreground">{mock.banner}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{mock.headline}</p>

      {mock.simulatedNumbers.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            模擬數據一覽
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {mock.simulatedNumbers.map((row) => (
              <div
                key={row.label}
                className="rounded-lg border border-amber-200/50 bg-background/90 px-3 py-2.5 dark:border-amber-900/40"
              >
                <p className="text-[11px] leading-tight text-muted-foreground">{row.label}</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {mock.metrics && mock.metrics.length > 0 ? (
        <ul className="mt-4 space-y-2 rounded-lg border border-border/60 bg-background/70 px-3 py-3 text-sm">
          {mock.metrics.map((m) => (
            <li key={m.label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-muted-foreground">{m.label}</span>
              <span className="font-medium tabular-nums text-foreground">{m.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
        {mock.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mt-4 border-t border-border/50 pt-3 text-xs text-muted-foreground">
        以上依你的自我評估類型在本站示範演算；實際圖表、分數與建議以你進入各官方工具後為準。
      </p>
    </div>
  )
}
