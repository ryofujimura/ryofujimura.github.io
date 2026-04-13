"use client"

import { useRef, useEffect, useCallback } from "react"

const ASCII_CHARS = "01{}[]<>/\\|=-+*#@&%$!?.,:;~`^"

export function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    timeRef.current += 0.003

    ctx.fillStyle = "hsl(0, 0%, 4%)"
    ctx.fillRect(0, 0, width, height)

    const fontSize = 11
    ctx.font = `${fontSize}px monospace`

    const cols = Math.floor(width / (fontSize * 0.65))
    const rows = Math.floor(height / fontSize)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * fontSize * 0.65
        const y = row * fontSize

        const distFromCenter = Math.sqrt(
          Math.pow((col / cols - 0.5) * 2, 2) +
          Math.pow((row / rows - 0.5) * 2, 2)
        )

        const wave = Math.sin(timeRef.current + col * 0.05 + row * 0.03) * 0.5 + 0.5
        const opacity = Math.max(0.02, (1 - distFromCenter * 0.8) * wave * 0.12)

        if (Math.random() > 0.97 - wave * 0.02) {
          const char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
          ctx.fillText(char, x, y)
        } else if (
          (row % 8 === 0 && Math.random() > 0.6) ||
          (col % 12 === 0 && Math.random() > 0.7)
        ) {
          const gridChar = row % 8 === 0 ? "-" : "|"
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.5})`
          ctx.fillText(gridChar, x, y)
        }
      }
    }

    // Draw crosshair lines through center
    const cx = width / 2
    const cy = height / 2

    ctx.strokeStyle = "rgba(255, 255, 255, 0.04)"
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 6])

    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, height)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(width, cy)
    ctx.stroke()

    ctx.setLineDash([])
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const animate = () => {
      draw(ctx, canvas.width, canvas.height)
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
