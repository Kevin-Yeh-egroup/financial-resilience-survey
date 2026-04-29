import { RadarPreview } from "./radar-preview"

export function RadarSection() {
  return (
    <section className="border-t border-border/60 bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <div className="flex flex-col items-center justify-center gap-12 text-center md:flex-row md:gap-14 md:text-left">
          <div className="flex-1 md:max-w-md">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
              Visualization
            </p>
            <h2 className="font-sans text-balance text-3xl font-bold text-foreground md:text-4xl">
              六個面向的韌性輪廓
            </h2>
            <p className="mt-4 text-base leading-[1.65] text-muted-foreground md:text-lg md:leading-relaxed">
              結果會用雷達圖呈現你在六個財務面向的狀態，讓你一眼看出哪些地方比較有支撐、哪些地方比較容易感到壓力。
            </p>
            <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
              不需要懂專業名詞，也能看出輪廓。
            </p>
          </div>
          <div className="shrink-0 w-full max-w-sm md:w-auto">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
              <RadarPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
