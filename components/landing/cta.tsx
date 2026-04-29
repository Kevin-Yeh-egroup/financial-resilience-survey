import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section
      className="border-t border-border/60 bg-card px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-sans text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
          先確認現在的位置
          <br />
          再慢慢想接下來的事
        </h2>

        <p className="mx-auto mt-6 max-w-md text-pretty text-base leading-[1.65] text-muted-foreground">
          這個測驗不會要求你立刻改變什麼，也不會替你做任何決定。它只是陪你把「現在」整理清楚。
        </p>

        <Button
          asChild
          size="lg"
          className="mt-10 h-12 min-h-12 w-full max-w-sm rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20 touch-manipulation sm:max-w-xs"
        >
          <Link href="/assessment">
            確認你的財務韌性
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          約 3–5 分鐘完成
        </p>
      </div>
    </section>
  )
}
