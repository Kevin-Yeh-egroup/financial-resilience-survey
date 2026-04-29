import { User, Heart, MapPin } from "lucide-react"

const personas = [
  {
    icon: User,
    text: "想了解自己目前狀況，但不想被評分的人",
  },
  {
    icon: Heart,
    text: "覺得生活過得去，卻常常有點不安心的人",
  },
  {
    icon: MapPin,
    text: "想整理一下方向，但不知道從哪裡開始的人",
  },
]

export function WhoIsItFor() {
  return (
    <section className="border-t border-border/60 bg-muted/35 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
          For You
        </p>
        <h2 className="font-sans text-balance text-3xl font-bold text-foreground md:text-4xl">
          這個測驗適合誰
        </h2>

        <div className="mx-auto mt-12 max-w-xl space-y-4">
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <div
                key={persona.text}
                className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-5 text-center shadow-sm md:flex-row md:items-start md:gap-5 md:text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base leading-[1.65] text-foreground">
                  {persona.text}
                </p>
              </div>
            )
          })}
        </div>

        <p className="mx-auto mt-10 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
          你不需要準備好所有答案，
          <br className="hidden sm:block" />
          只要如實選擇現在的感受就好。
        </p>
      </div>
    </section>
  )
}
