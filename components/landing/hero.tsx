import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 py-16 md:min-h-[90vh] md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] h-96 w-96 rounded-full bg-muted blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-muted-foreground">
          <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-accent" />
          10 題・約 3–5 分鐘
        </div>

        <h1 className="font-sans text-balance text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-[3.25rem] lg:leading-tight">
          想了解自己現在的
          <br />
          <span className="text-accent">財務狀態</span>嗎？
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
          不是看你賺多少，
          <br className="hidden md:block" />
          而是看看
          <strong className="font-medium text-foreground">
            現在的生活撐不撐得住
          </strong>
        </p>

        <p className="mx-auto mt-4 max-w-md text-pretty text-base leading-[1.65] text-muted-foreground">
          很多人其實不是沒在努力，只是生活一有變化，就會覺得特別吃力。這個小測驗用 10
          題貼近日常的問題，陪你一起把目前的狀況整理清楚。
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 min-h-12 w-full max-w-xs rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20 touch-manipulation sm:w-auto sm:max-w-none"
          >
            <Link href="/assessment">開始檢測</Link>
          </Button>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            免費・不用輸入金額・沒有對錯
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 text-left text-sm leading-relaxed text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:text-center">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2.5 sm:rounded-full">
            <CheckCircleIcon />
            <span>不用輸入金額</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2.5 sm:rounded-full">
            <CheckCircleIcon />
            <span>沒有對錯、不貼標籤</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2.5 sm:rounded-full">
            <CheckCircleIcon />
            <span>約 3–5 分鐘</span>
          </div>
        </div>

        <a
          href="#process"
          className="mt-14 inline-flex flex-col items-center gap-1 text-sm text-muted-foreground/80 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          aria-label="了解測驗怎麼進行"
        >
          <span>往下瀏覽</span>
          <ChevronDown className="h-5 w-5 motion-safe:animate-bounce" aria-hidden />
        </a>
      </div>
    </section>
  )
}

function CheckCircleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0 text-accent"
      aria-hidden
    >
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 8l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
