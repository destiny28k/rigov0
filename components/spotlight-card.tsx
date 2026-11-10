"use client"

import type React from "react"
import { useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * A card with a soft warm-white light that follows the cursor on hover.
 * The pointer position is written to CSS variables, so moving the mouse never re-renders React.
 */
export function SpotlightCard({
  className,
  contentClassName,
  children,
}: {
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={handleMove} className={cn("group relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--spot-x, 50%) var(--spot-y, 0%), rgba(255, 238, 210, 0.13), transparent 70%)",
        }}
      />
      <div className={cn("relative", contentClassName)}>{children}</div>
    </div>
  )
}
