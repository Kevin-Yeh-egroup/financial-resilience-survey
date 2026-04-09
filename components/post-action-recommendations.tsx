"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FAMILYFIN_URLS } from "@/lib/next-step-recommendations"
import { ArrowRight } from "lucide-react"

export interface NextActionItem {
  title: string
  benefit: string
  cta: string
  /** 未設定或空白時為 `#`（同頁）；`http(s)://` 會另開分頁 */
  href?: string
}

/** 未傳入 actions 時的後備（與好理家工具網址一致） */
const DEFAULT_ACTIONS: NextActionItem[] = [
  {
    title: "財務生活記帳助理",
    benefit: "用記帳慢慢看清，錢實際怎麼流動",
    cta: "開始記帳",
    href: FAMILYFIN_URLS.basicAccounting,
  },
  {
    title: "財務試算模擬器",
    benefit: "還沒算清的數字，先試算再決定也不遲",
    cta: "開始試算",
    href: FAMILYFIN_URLS.financialCalculator,
  },
  {
    title: "問問 AI",
    benefit: "有疑問就問，不用自己悶著猜",
    cta: "立即詢問",
    href: FAMILYFIN_URLS.askIvy,
  },
]

export interface PostActionRecommendationsProps {
  /** 一句話描述使用者剛完成測驗後的狀態 */
  statusSummary: string
  /** 可選：覆寫預設三則建議 */
  actions?: NextActionItem[]
}

export function PostActionRecommendations({
  statusSummary,
  actions: actionsProp,
}: PostActionRecommendationsProps) {
  const actions: NextActionItem[] = actionsProp ?? DEFAULT_ACTIONS

  return (
    <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">下一步，你可以這樣開始</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground rounded-lg bg-muted/40 border border-border/50 px-4 py-3">
            {statusSummary}
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {actions.map((action) => {
            const href = action.href?.trim() || "#"
            const isExternal = /^https?:\/\//i.test(href)
            return (
              <li key={action.title}>
                <div className="flex h-full flex-col rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm">
                  <p className="text-base font-semibold text-foreground">{action.title}</p>
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary/70" aria-hidden />
                    <span>{action.benefit}</span>
                  </p>
                  <div className="mt-4 flex flex-1 flex-col justify-end">
                    <Button className="w-full" size="lg" asChild>
                      <a
                        href={href}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {action.cta}
                      </a>
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <p className="text-center text-sm text-muted-foreground">不用一次完成，從一個開始就很好</p>
      </div>
    </Card>
  )
}
