"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "10,000+", label: "Projects Completed" },
  { number: "500+", label: "Product Variants" },
  { number: "50+", label: "Countries Served" },
]

const philosophyItems = [
  {
    title: "Energy efficient",
    description:
      "High-efficiency LEDs with a 0.95 power factor deliver more light per watt, cutting electricity bills without compromising brightness.",
  },
  {
    title: "Premium build quality",
    description:
      "Aluminium bodies, efficient heat dissipation and surge protection keep every fixture running cool and reliably for years.",
  },
  {
    title: "Light for every mood",
    description:
      "Choose white, natural white, warm white or 3-in-1 colour options to set the right ambience for every room.",
  },
  {
    title: "Backed by warranty",
    description: "Every RIGO fixture is covered by a 2-year warranty, with dedicated customer care when you need it.",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-rigo" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Why RIGO</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Built to
              <br />
              <HighlightedText>shine</HighlightedText>
            </h2>

            <div className="relative hidden lg:block">
              <img
                src="/images/why-rigo.jpg"
                alt="RIGO COB downlight with rose-gold reflector"
                className="relative z-10 w-full max-w-lg rounded-2xl"
              />
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              For over 15 years, RIGO has crafted LED lighting that pairs modern design with dependable performance —
              so every space looks its best.
            </p>

            {philosophyItems.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="w-6 shrink-0 pt-1 text-muted-foreground/50 text-sm font-medium tabular-nums">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-8 md:p-10 text-center">
              <p className="text-4xl md:text-5xl font-medium tracking-tight mb-2">{stat.number}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
