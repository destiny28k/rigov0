import { Gem, ShieldCheck, Sun, Zap } from "lucide-react"

const reasons = [
  {
    title: "Energy efficient",
    description: "More light per watt with a 0.95 power factor — lower bills, same brilliance.",
    icon: Zap,
  },
  {
    title: "Premium build",
    description: "Aluminium bodies, efficient heat dissipation and surge protection.",
    icon: Gem,
  },
  {
    title: "Light for every mood",
    description: "White, natural white, warm white or 3-in-1 colour options.",
    icon: Sun,
  },
  {
    title: "2-year warranty",
    description: "Every fixture is covered, with dedicated customer care.",
    icon: ShieldCheck,
  },
]

const stats = [
  { number: "15+", label: "Years of excellence" },
  { number: "10,000+", label: "Projects completed" },
  { number: "500+", label: "Product variants" },
  { number: "50+", label: "Countries served" },
]

/** Why RIGO — dark showcase band: benefit cards + headline stats. */
export function Philosophy() {
  return (
    <section id="why-rigo" className="py-28 md:py-36 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">Why RIGO</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">Built to shine</h2>
          <p className="mt-6 text-lg text-white/60 leading-relaxed">
            Modern design and dependable performance, so every space looks its best.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reasons.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-5 sm:block rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 transition-colors duration-500 hover:bg-white/[0.06] hover:border-white/20"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15">
                <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="sm:mt-8 text-lg font-medium text-white">{title}</h3>
                <p className="mt-1.5 sm:mt-2 text-sm leading-relaxed text-white/55">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-20 md:mt-24 pt-12 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-y-10 text-center">
          {stats.map((stat) => (
            <li key={stat.label}>
              <p className="text-4xl md:text-6xl font-medium tracking-tight tabular-nums text-white">{stat.number}</p>
              <p className="mt-3 text-xs tracking-[0.2em] uppercase text-white/50">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
