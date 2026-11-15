"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export type FeaturedItem = {
  href: string
  title: string
  detail: string
  category: string
  image: string
  /** Full photo (fills the tile) vs. cut-out (shown whole with padding) */
  photo: boolean
}


export function Projects({ items: projects }: { items: FeaturedItem[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<string>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].href))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [projects])

  return (
    <section id="projects" className="py-12 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3">Our Collection</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Featured Products</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            View all products
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8 md:gap-x-6 md:gap-y-9">
          {projects.map((project, index) => (
            <Link
              href={project.href}
              key={project.href}
              className="group block"
              onMouseEnter={() => setHoveredId(project.href)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div ref={(el) => { imageRefs.current[index] = el }} className="relative overflow-hidden aspect-[4/3] mb-3 sm:mb-4 bg-white rounded-2xl">
                {/* Same frame for every card; photos shown whole over a blurred copy of themselves */}
                {project.photo && (
                  <img
                    src={project.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
                  />
                )}
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className={`relative w-full h-full object-contain transition-transform duration-700 ${
                    project.photo ? "" : "p-5 sm:p-10"
                  } ${
                    hoveredId === project.href ? "scale-105" : "scale-100"
                  }`}
                />
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(project.href) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)", // Increased duration from 0.6s to 1.5s for slower reveal
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-xl font-medium mb-0.5 sm:mb-1 group-hover:underline underline-offset-4">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {project.detail}
                  </p>
                </div>
                <span className="hidden sm:inline text-muted-foreground/60 text-sm whitespace-nowrap">{project.category}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
