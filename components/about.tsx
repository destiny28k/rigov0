"use client"

import { useEffect, useRef, useState } from "react"
import { Lightbulb, Award, Users, Shield } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

const stats = [
  { number: "15+", label: "Years of Excellence" },
  { number: "10,000+", label: "Projects Completed" },
  { number: "500+", label: "Product Variants" },
  { number: "50+", label: "Countries Served" },
]

const values = [
  {
    title: "Innovation",
    description: "Constantly pushing the boundaries of lighting technology to deliver cutting-edge solutions.",
    icon: Lightbulb,
  },
  {
    title: "Quality Excellence",
    description: "Uncompromising commitment to premium materials and superior craftsmanship in every product.",
    icon: Award,
  },
  {
    title: "Customer Focus",
    description: "Building lasting relationships through exceptional service and tailored lighting solutions.",
    icon: Users,
  },
  {
    title: "Reliability",
    description: "Trusted by professionals for consistent performance and long-lasting durability.",
    icon: Shield,
  },
]

const journey = [
  {
    year: "2009",
    title: "Foundation",
    description:
      "RIGO Lighting was founded with a vision to revolutionize the lighting industry through innovative LED technology and superior design.",
  },
  {
    year: "2015",
    title: "Global Expansion",
    description:
      "Expanded operations internationally, establishing partnerships with distributors across multiple continents.",
  },
  {
    year: "2020",
    title: "Innovation Hub",
    description:
      "Launched our R&D facility, focusing on smart lighting solutions and sustainable technologies.",
  },
  {
    year: "2024",
    title: "Future Forward",
    description:
      "Continuing to lead with next-generation lighting solutions and an expanding premium product portfolio.",
  },
]

function useReveal(threshold = 0.2) {
  const [visible, setVisible] = useState<number[]>([])
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setVisible((prev) => (prev.includes(index) ? prev : [...prev, index]))
          }
        })
      },
      { threshold },
    )
    refs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [threshold])

  return { visible, refs }
}

export function About() {
  const values$ = useReveal()
  const journey$ = useReveal()

  return (
    <section id="about" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        {/* Intro */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">About RIGO</p>
            <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance lg:text-7xl">
              Crafting light,
              <br />
              creating <HighlightedText>experiences</HighlightedText>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              RIGO Lighting has been at the forefront of the lighting industry for over a decade, specializing in
              premium LED solutions that combine cutting-edge technology with sophisticated design.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our commitment to excellence drives us to continuously innovate, ensuring that every product we create
              not only meets but exceeds the expectations of architects, designers and lighting professionals.
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/about.jpg"
              alt="RIGO COB downlight"
              className="w-full aspect-[4/3] object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden mb-32">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-8 md:p-10 text-center">
              <p className="text-4xl md:text-5xl font-medium tracking-tight mb-2">{stat.number}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Values + Journey */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">What we stand for</h3>
            <p className="text-muted-foreground leading-relaxed mb-12 max-w-md">
              The principles that shape every fixture we design and every relationship we build.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    ref={(el) => {
                      values$.refs.current[index] = el
                    }}
                    data-index={index}
                    className={`transition-all duration-700 ${
                      values$.visible.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Icon className="w-8 h-8 mb-4 text-foreground" strokeWidth={1.25} />
                    <h4 className="text-lg font-medium mb-2">{value.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-12">Our journey</h3>
            <div className="space-y-10">
              {journey.map((item, index) => (
                <div
                  key={item.year}
                  ref={(el) => {
                    journey$.refs.current[index] = el
                  }}
                  data-index={index}
                  className={`relative pl-8 border-l transition-all duration-700 ${
                    index === journey.length - 1 ? "border-orange-400" : "border-border"
                  } ${journey$.visible.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <p className="text-muted-foreground/60 text-sm font-medium mb-1">{item.year}</p>
                  <h4 className="text-xl font-medium mb-2">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
