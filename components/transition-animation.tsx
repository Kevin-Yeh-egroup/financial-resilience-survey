"use client"

import { useEffect, useState } from "react"

interface TransitionAnimationProps {
  onComplete: () => void
}

export function TransitionAnimation({ onComplete }: TransitionAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    // 觸發動畫
    setIsVisible(true)

    // 逐行顯示文字動畫
    const lineTimer = setInterval(() => {
      setLineIndex((prev) => {
        if (prev < 2) {
          return prev + 1
        }
        return prev
      })
    }, 800)

    // 3-5秒後自動進入結果頁（使用4秒作為中間值）
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 4000)

    return () => {
      clearInterval(lineTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const lines = [
    "這不是一份評分表，",
    "而是一張幫你找出",
    "「哪些地方在撐你、哪些地方需要被接住」的地圖。",
  ]

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6">
        {/* 載入動畫 */}
        <div className="flex justify-center mb-8">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-primary/10 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-primary/60 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
        </div>

        {/* 文字逐行顯示 */}
        <div className="space-y-4">
          {lines.map((line, index) => (
            <p
              key={index}
              className={`text-xl md:text-2xl leading-relaxed text-foreground transition-all duration-700 ${
                index <= lineIndex
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* 脈衝點動畫 */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

