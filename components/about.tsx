import { ContentIcon } from "./icon"
import type { HomePage } from "@/lib/content"

/**
 * About RIGO: a large statement with the short story beside it, one wide photo carrying the core values,
 * and the journey as a quiet row of big, light year numbers.
 */
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
    <section id="about" className="pt-16 pb-10 md:pt-32 md:pb-16 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Statement + story */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span aria-hidden className="h-px w-8 bg-foreground/30" />
              About RIGO
            </p>
            <h2 className="text-4xl font-medium leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              {heading}
            </h2>
          </div>
          {text && (
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-5 lg:pb-2">{text}</p>
          )}
        </div>

        {/* Wide photo; on larger screens the values sit on it */}
        <div className="group relative mt-10 overflow-hidden rounded-[1.75rem] md:mt-16">
          <img
            src={image || "/images/about-room.jpg"}
            alt="Office meeting room lit with recessed downlights and a linear pendant"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03] sm:aspect-[16/9] lg:aspect-[21/9]"
          />
          {values.length > 0 && (
            <>
              <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-2/5 bg-gradient-to-t from-black/70 to-transparent md:block" />
              <ul className="absolute inset-x-0 bottom-0 hidden flex-wrap items-center gap-x-10 gap-y-3 px-8 pb-7 text-white md:flex lg:px-10 lg:pb-9">
                {values.map(({ label, icon }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm font-medium">
                    <ContentIcon name={icon} className="h-4 w-4 opacity-80" strokeWidth={1.5} />
                    {label}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Phones: the values as a simple two-column list under the photo */}
        {values.length > 0 && (
          <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 md:hidden">
            {values.map(({ label, icon }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm font-medium">
                <ContentIcon name={icon} className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                {label}
              </li>
            ))}
          </ul>
        )}

        {/* Journey */}
        {journey.length > 0 && (
          <div className="mt-14 md:mt-24">
            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground md:mb-10">Our journey</p>
            <ol className="grid border-t border-border lg:grid-cols-4 lg:gap-10 lg:border-t-0">
              {journey.map((step) => (
                <li
                  key={step.year}
                  className="group/step grid grid-cols-[5.5rem_1fr] items-baseline gap-x-4 border-b border-border py-5 lg:block lg:border-b-0 lg:border-t lg:py-0 lg:pt-7"
                >
                  <p className="text-3xl font-light tabular-nums tracking-tight text-foreground/30 transition-colors duration-500 group-hover/step:text-foreground lg:text-6xl">
                    {step.year}
                  </p>
                  <div className="lg:mt-5">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
