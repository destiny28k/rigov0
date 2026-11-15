"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type ExplorerItem = {
  href: string
  name: string
  count: number
  image: string
  /** Full photo (fills the panel over a blurred copy of itself) vs. cut-out (shown on a lit white tile) */
  photo: boolean
}

/**
 * "More indoor/outdoor lighting": a dark band with a large numbered index of the other categories.
 * On desktop, pointing at a name lights it up and crossfades the photo panel beside the list;
 * on phones each row carries its own small photo.
 */
export function CategoryExplorer({
  label,
  viewAllHref,
  viewAllLabel,
  items,
}: {
  label: string
  viewAllHref: string
  viewAllLabel: string
  items: ExplorerItem[]
}) {
  const [active, setActive] = useState(0)
  if (items.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-primary text-white">
      {/* Soft pool of light behind the photo panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 h-[640px] w-[640px] -translate-y-1/2 rounded-full bg-white/[0.07] blur-[120px]"
      />

      <div className="relative container mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="flex items-center justify-between gap-6 mb-6 md:mb-10">
          <p className="text-xs tracking-[0.18em] sm:tracking-[0.3em] uppercase text-white/50 whitespace-nowrap">{label}</p>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors shrink-0"
          >
            {viewAllLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] gap-x-20 items-center">
          {/* The index */}
          <ul className="border-t border-white/10">
            {items.map((item, i) => {
              const on = i === active
              return (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-center gap-4 md:gap-6 py-3.5 md:py-5"
                  >
                    <span className="hidden sm:block w-7 text-xs tabular-nums text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Phones / tablets: each row shows its own photo */}
                    <span
                      className={cn(
                        "lg:hidden relative block h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg",
                        !item.photo && "bg-white",
                      )}
                    >
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        className={cn("h-full w-full", item.photo ? "object-cover" : "object-contain p-1.5")}
                      />
                    </span>

                    <span
                      className={cn(
                        "text-xl sm:text-2xl lg:text-[2.5rem] lg:leading-tight font-medium tracking-tight transition-all duration-300",
                        on ? "lg:text-white lg:translate-x-2" : "lg:text-white/40",
                      )}
                    >
                      {item.name}
                    </span>

                    <span className="ml-auto flex items-center gap-4 shrink-0">
                      <span className="text-xs sm:text-sm tabular-nums text-white/45">{item.count} series</span>
                      <ArrowUpRight
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          on ? "lg:opacity-100 lg:translate-x-0" : "lg:opacity-0 lg:-translate-x-2",
                          "text-white/70",
                        )}
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop: one large photo panel that crossfades to the category being pointed at */}
          <div className="hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.6)]">
              {items.map((item, i) => (
                <div
                  key={item.href}
                  aria-hidden={i !== active}
                  className={cn(
                    "absolute inset-0 transition-all duration-700 ease-out",
                    i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]",
                    !item.photo && "bg-[radial-gradient(120%_90%_at_50%_38%,#ffffff_0%,#f1f2f4_55%,#dcdfe3_100%)]",
                  )}
                >
                  {item.photo && (
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl"
                    />
                  )}
                  <img
                    src={item.image}
                    alt={i === active ? item.name : ""}
                    loading="lazy"
                    className={cn("relative h-full w-full object-contain", !item.photo && "p-14")}
                  />
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center justify-between text-sm text-white/50">
              <span className="text-white/80">{items[active].name}</span>
              <span className="tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
