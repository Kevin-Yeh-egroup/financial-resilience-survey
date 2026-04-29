import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function MobileCtaBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_hsl(var(--foreground)/0.12)] backdrop-blur-md md:hidden"
      role="region"
      aria-label="快速開始檢測"
    >
      <Link
        href="/assessment"
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-colors hover:bg-primary/90 active:bg-primary/95 touch-manipulation"
      >
        開始檢測
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
    </div>
  )
}
