"use client"

import { useEffect, useState, useRef } from "react"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorText, setCursorText] = useState("")

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let dotX = 0
    let dotY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactiveElement = target.closest('a, button, [data-cursor="pointer"], [data-cursor-text]')
      
      if (interactiveElement) {
        setIsHovering(true)
        const text = interactiveElement.getAttribute('data-cursor-text')
        setCursorText(text || "")
      } else {
        setIsHovering(false)
        setCursorText("")
      }
    }

    const animate = () => {
      const ease = 0.15
      const dotEase = 0.25

      cursorX += (mouseX - cursorX) * ease
      cursorY += (mouseY - cursorY) * ease
      dotX += (mouseX - dotX) * dotEase
      dotY += (mouseY - dotY) * dotEase

      // Position at mouse coordinates, CSS transform handles centering
      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`
      cursorDot.style.left = `${dotX}px`
      cursorDot.style.top = `${dotY}px`

      requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseover", handleMouseOver)
    
    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden lg:flex items-center justify-center transition-[width,height,background-color] duration-300 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? (cursorText ? 120 : 64) : 48,
          height: isHovering ? (cursorText ? 120 : 64) : 48,
          borderRadius: "50%",
          border: `2px solid ${isClicking ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.8)"}`,
          backgroundColor: isHovering ? "rgba(255,255,255,0.1)" : "transparent",
        }}
      >
        {cursorText && (
          <span className="text-xs font-medium text-white tracking-wide uppercase">
            {cursorText}
          </span>
        )}
      </div>
      <div
        ref={cursorDotRef}
        className="fixed pointer-events-none z-[9999] hidden lg:block -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: isClicking ? "rgba(255,255,255,0.5)" : "white",
          mixBlendMode: "difference",
        }}
      />
    </>
  )
}
