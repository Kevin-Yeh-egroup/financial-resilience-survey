"use client"

import { useEffect, useRef } from "react"

const LABELS = ["收入穩定度", "支出彈性", "緊急準備", "債務壓力", "心理安全感", "未來信心"]
const VALUES = [0.7, 0.5, 0.4, 0.8, 0.55, 0.6]

export function RadarPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 280
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = 100
    const sides = LABELS.length
    const angleStep = (Math.PI * 2) / sides
    const startAngle = -Math.PI / 2

    // Draw grid rings
    const rings = [0.25, 0.5, 0.75, 1]
    for (const ring of rings) {
      ctx.beginPath()
      for (let i = 0; i <= sides; i++) {
        const angle = startAngle + i * angleStep
        const x = cx + Math.cos(angle) * maxR * ring
        const y = cy + Math.sin(angle) * maxR * ring
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = "rgba(110, 80, 90, 0.08)"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axes
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR)
      ctx.strokeStyle = "rgba(110, 80, 90, 0.08)"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw data polygon
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const angle = startAngle + (i % sides) * angleStep
      const val = VALUES[i % sides]
      const x = cx + Math.cos(angle) * maxR * val
      const y = cy + Math.sin(angle) * maxR * val
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = "rgba(248, 150, 184, 0.22)"
    ctx.fill()
    ctx.strokeStyle = "rgba(248, 150, 184, 0.7)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw data dots
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep
      const val = VALUES[i]
      const x = cx + Math.cos(angle) * maxR * val
      const y = cy + Math.sin(angle) * maxR * val
      ctx.beginPath()
      ctx.arc(x, y, 3.5, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(248, 150, 184, 0.9)"
      ctx.fill()
    }

    // Draw labels
    ctx.font = '11px "Noto Sans TC", sans-serif'
    ctx.fillStyle = "rgba(98, 70, 78, 0.55)"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep
      const labelR = maxR + 22
      const x = cx + Math.cos(angle) * labelR
      const y = cy + Math.sin(angle) * labelR
      ctx.fillText(LABELS[i], x, y)
    }
  }, [])

  return (
    <div className="flex items-center justify-center py-4">
      <canvas ref={canvasRef} className="opacity-80" />
    </div>
  )
}
