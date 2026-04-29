import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

const detectionTools = [
  {
    title: "詐騙防禦能力檢測",
    description: "從生活情境題認識自己的防詐反應模式",
    href: "https://www.familyfinhealth.com/fraud-defense",
  },
  {
    title: "財務焦慮檢測",
    description: "整理壓力來臨時，自己較容易出現的反應傾向",
    href: "https://www.familyfinhealth.com/financial-anxiety",
  },
] as const

const utilityTools = [
  {
    title: "個人中心",
    description: "查看在好理家在檢測的歷史進度與紀錄",
    href: "https://www.familyfinhealth.com/personal-center?tab=overview",
  },
  {
    title: "財務生活記帳助理",
    description: "透過實際記帳，了解實際財務狀況",
    href: "https://www.familyfinhealth.com/toolbox/financial-calculator/basic-accounting-preview",
  },
  {
    title: "夢想達成財務管理",
    description: "訂定自我財務目標",
    href: "https://www.familyfinhealth.com/financial-planning",
  },
  {
    title: "財務試算模擬器",
    description: "不清楚的財務數字直接試算",
    href: "https://www.familyfinhealth.com/toolbox/financial-calculator",
  },
  {
    title: "問問AI",
    description: "直接詢問財務相關問題",
    href: "https://www.familyfinhealth.com/ask-ivy",
  },
  {
    title: "免費個人線上財務諮詢",
    description: "可以免費在線上與財務健康諮詢師討論",
    href: "https://www.familyfinhealth.com/online-consultation",
  },
  {
    title: "知識庫",
    description: "快速查找知識與經驗",
    href: "https://www.familyfinhealth.com/knowledge-base",
  },
] as const

type ToolItem = (typeof detectionTools)[number]

function ToolCard({ item }: { item: ToolItem }) {
  return (
    <li>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm md:p-7",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-1 hover:border-accent/45 hover:shadow-lg hover:shadow-accent/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <span className="flex items-start justify-between gap-3">
          <h3 className="text-balance text-lg font-semibold leading-snug text-foreground">
            {item.title}
          </h3>
          <ExternalLink
            className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent"
            aria-hidden
          />
        </span>
        <p className="mt-3 grow text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        <span className="mt-6 text-xs text-muted-foreground/90">另開新視窗</span>
      </a>
    </li>
  )
}

function ToolGrid({ items }: { items: readonly ToolItem[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
      {items.map((item) => (
        <ToolCard key={item.href} item={item} />
      ))}
    </ul>
  )
}

export function PlatformMoreTools() {
  return (
    <section
      className="border-t border-border/60 bg-muted/35 px-6 py-20 md:py-28"
      aria-labelledby="platform-more-tools-heading"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-center text-sm font-medium uppercase tracking-wide text-accent">
          好理家在｜財務健檢網
        </p>
        <h2
          id="platform-more-tools-heading"
          className="text-center font-sans text-3xl font-bold text-balance text-foreground md:text-4xl"
        >
          你還可以使用這些功能
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          以下連結將於另開新視窗前往好理家在財務健檢網。
        </p>

        <div className="mt-12">
          <h3 className="mb-5 text-lg font-semibold text-foreground md:text-xl">
            檢測
          </h3>
          <ToolGrid items={detectionTools} />
        </div>

        <div className="mt-14 md:mt-16">
          <h3 className="mb-5 text-lg font-semibold text-foreground md:text-xl">
            工具使用
          </h3>
          <ToolGrid items={utilityTools} />
        </div>
      </div>
    </section>
  )
}
