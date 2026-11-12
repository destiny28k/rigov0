import { ContentIcon } from "./icon"
import type { HomePage } from "@/lib/content"

/** About RIGO — photo + short story, core values, and a horizontal journey timeline. */
export function About({
  heading,
  text,
  image,
  values,
  journey,
}: {
  heading: string
  text: string
  image: string
  values: HomePage["values"]
  journey: HomePage["journey"]
}) {
  return (
    <section id="about" className="py-28 md:py-36 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={image || "/images/about-room.jpg"}
              alt="Office meeting room lit with recessed downlights and a linear pendant"
              loading="lazy"
              className="w-full aspect-[4/3] object-cover"
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">About RIGO</p>
            <h2 className="text-4xl md:text-5xl font-medium leading-[1.1] tracking-tight text-balance">{heading}</h2>
            {text && <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-lg">{text}</p>}

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5">
              {values.map(({ label, icon }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <ContentIcon name={icon} className="h-4 w-4 text-foreground" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Journey timeline: horizontal on desktop, stacked on phones */}
        {journey.length > 0 && (
          <div className="mt-24 md:mt-28">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10">Our journey</p>
            <div className="relative">
              {/* Desktop: one horizontal line through all the dots */}
              <div aria-hidden className="hidden lg:block absolute left-0 right-0 top-[5px] h-px bg-border" />
              <ol className="grid lg:grid-cols-4 lg:gap-8">
                {journey.map((step) => (
                  // Phones/tablets: vertical timeline with the line down the left
                  <li
                    key={step.year}
                    className="relative pl-8 pb-10 last:pb-0 border-l border-border lg:pl-0 lg:pb-0 lg:border-l-0"
                  >
                    <span className="absolute -left-[6px] top-1.5 lg:static z-10 block h-[11px] w-[11px] rounded-full bg-foreground ring-4 ring-background" />
                    <p className="lg:mt-6 text-2xl lg:text-3xl font-medium tracking-tight tabular-nums">{step.year}</p>
                    <h3 className="mt-2 font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
