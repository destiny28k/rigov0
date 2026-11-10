"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Ctx = { active: number; setActive: (i: number) => void; labels: string[]; anchors: string[] }
const VersionContext = createContext<Ctx | null>(null)

/**
 * Wraps a series page whose versions (e.g. Concealed / Surface) are all rendered on the server.
 * Only the active version is shown; the choice is mirrored in the URL hash (#surface) so it can be shared.
 */
export function VersionProvider({
  labels,
  anchors,
  children,
}: {
  labels: string[]
  anchors: string[]
  children: React.ReactNode
}) {
  const [active, setActiveState] = useState(0)

  useEffect(() => {
    const fromHash = () => {
      const i = anchors.indexOf(window.location.hash.slice(1))
      if (i >= 0) setActiveState(i)
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [anchors])

  const setActive = (i: number) => {
    setActiveState(i)
    history.replaceState(null, "", i === 0 ? window.location.pathname : `#${anchors[i]}`)
  }

  return <VersionContext.Provider value={{ active, setActive, labels, anchors }}>{children}</VersionContext.Provider>
}

export function VersionPanel({ index, children }: { index: number; children: React.ReactNode }) {
  const ctx = useContext(VersionContext)
  const hidden = ctx ? ctx.active !== index : index !== 0
  return <div hidden={hidden}>{children}</div>
}

export function VersionSwitch() {
  const ctx = useContext(VersionContext)
  if (!ctx || ctx.labels.length < 2) return null
  return (
    <div role="tablist" aria-label="Version" className="inline-flex p-1 rounded-full bg-secondary mb-8">
      {ctx.labels.map((label, i) => (
        <button
          key={label}
          role="tab"
          aria-selected={ctx.active === i}
          onClick={() => ctx.setActive(i)}
          className={cn(
            "px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-300",
            ctx.active === i ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
