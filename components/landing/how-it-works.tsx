import { MessageCircle, Hand, Lightbulb } from "lucide-react"

export function HowItWorks() {
  return (
    <section
      id="process"
      className="scroll-mt-8 border-t border-border/60 bg-muted/35 px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
          How It Works
        </p>
        <h2 className="font-sans text-balance text-3xl font-bold text-foreground md:text-4xl">
          這個測驗怎麼進行
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          就像有人陪你把現況整理一下
        </p>

        <div className="mx-auto mt-14 max-w-2xl space-y-5">
          {/* Step 1 */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-colors hover:border-accent/40 md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-semibold text-foreground">
                看到日常的情境問題
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                你會看到一些很日常的問題，例如：
              </p>
              <ul className="mt-4 space-y-2.5 text-base leading-relaxed text-muted-foreground">
                <li className="flex items-start justify-center gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                  如果收入突然變少，生活會不會受影響？
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                  突然需要一筆錢，心裡會不會很慌？
                </li>
                <li className="flex items-start justify-center gap-2">
                  <span className="mt-2 w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                  對未來的經濟狀況，是安心多一點，還是擔心多一點？
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-colors hover:border-accent/40 md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Hand className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                選出最接近你的答案
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                你只需要選出最接近你現在狀況的答案。不需要計算，也不需要記住任何數字。
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-colors hover:border-accent/40 md:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                這不是考試
              </h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                也不是在檢查你做得好不好。只是一次安靜的自我整理。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
