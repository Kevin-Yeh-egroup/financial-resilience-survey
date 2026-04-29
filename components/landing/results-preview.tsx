"use client"

import { Activity, PawPrint, Compass } from "lucide-react"

const results = [
  {
    number: "01",
    icon: Activity,
    title: "整體狀態在哪一區",
    lead: "一句話標出大致位置：",
    bullets: ["大致穩定", "還撐得住，但有點吃力", "需多留意"],
    footnote: "不比好壞，只標位置。",
  },
  {
    number: "02",
    icon: PawPrint,
    title: "生活化的狀態比喻",
    lead: "用動物意象描述「現在怎麼撐住」，例如：",
    bullets: ["穩定前行的烏龜", "努力撐住的螞蟻", "慢慢恢復的小熊"],
    footnote: "幫你感受現況，不是把人分類。",
  },
  {
    number: "03",
    icon: Compass,
    title: "結構式整理",
    lead: "把支撐與壓力點說清楚：",
    bullets: ["主要支撐在哪", "哪裡一變動壓力容易變大", "暫撐住或漸趨穩定"],
    footnote: "整理現況，不預測未來。",
  },
]

export function ResultsPreview() {
  return (
    <section className="border-t border-border/60 bg-card px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
            Results
          </p>
          <h2 className="font-sans text-balance text-3xl font-bold text-foreground md:text-4xl">
            你會看到什麼結果
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-base text-muted-foreground md:text-lg">
            一份現況整理，不是評分表
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {results.map((item) => {
            const Icon = item.icon
            return (
              <article
                key={item.number}
                className="group flex flex-col rounded-2xl border border-border bg-background p-5 text-left shadow-sm transition-all hover:border-accent/40 hover:shadow-md md:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold leading-snug text-foreground">
                        {item.title}
                      </h3>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground/70">
                        {item.number}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground">
                      {item.lead}
                    </p>
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-sm leading-snug text-foreground/90">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 pl-0.5">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/50"
                        aria-hidden
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {item.footnote}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
