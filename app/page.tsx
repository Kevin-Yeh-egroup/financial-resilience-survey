import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { ResultsPreview } from "@/components/landing/results-preview"
import { RadarSection } from "@/components/landing/radar-section"
import { WhoIsItFor } from "@/components/landing/who-is-it-for"
import { PlatformMoreTools } from "@/components/landing/platform-more-tools"
import { CTA } from "@/components/landing/cta"
import { MobileCtaBar } from "@/components/landing/mobile-cta-bar"

export default function LandingPage() {
  return (
    <main className="min-h-screen pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <Hero />
      <HowItWorks />
      <ResultsPreview />
      <RadarSection />
      <WhoIsItFor />
      <PlatformMoreTools />
      <CTA />
      <Footer />
      <MobileCtaBar />
    </main>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background px-6 py-12 md:py-14">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">財務韌性檢測</p>
        <p className="text-sm leading-relaxed">
          這是一個自我覺察工具，不構成任何財務建議。
        </p>
      </div>
    </footer>
  )
}
