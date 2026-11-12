import { SpotlightCard } from "./spotlight-card"
import { ContentIcon } from "./icon"
import type { HomePage } from "@/lib/content"

/** Why RIGO — dark showcase band: benefit cards + headline stats. */
export function Philosophy({
  heading,
  intro,
  reasons,
  stats,
}: {
  heading: string
  intro: string
  reasons: HomePage["reasons"]
  stats: HomePage["stats"]
}) {
  return (
    <section id="why-rigo" className="relative overflow-hidden py-20 md:py-24 bg-primary text-primary-foreground">
      {/* Light effect: a slim "fixture" line at the top casting a soft warm glow over the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-64 md:w-96 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(1000px,140vw)] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255, 238, 210, 0.16), transparent 75%)",
        }}
      />

      <div className="relative container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">Why RIGO</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">{heading}</h2>
          {intro && <p className="mt-6 text-lg text-white/60 leading-relaxed">{intro}</p>}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reasons.map(({ title, description, icon }) => (
            <SpotlightCard
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
              contentClassName="flex gap-5 sm:block p-6 sm:p-8"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-white/50 group-hover:shadow-[0_0_28px_rgba(255,238,210,0.35)]">
                <ContentIcon name={icon} className="h-5 w-5 text-white" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="sm:mt-8 text-lg font-medium text-white">{title}</h3>
                <p className="mt-1.5 sm:mt-2 text-sm leading-relaxed text-white/55 transition-colors duration-500 group-hover:text-white/75">
                  {description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {stats.length > 0 && (
          <ul className="mt-14 md:mt-16 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-y-10 text-center">
            {stats.map((stat) => (
              <li key={stat.label}>
                <p className="text-4xl md:text-6xl font-medium tracking-tight tabular-nums text-white">{stat.number}</p>
                <p className="mt-3 text-xs tracking-[0.2em] uppercase text-white/50">{stat.label}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
