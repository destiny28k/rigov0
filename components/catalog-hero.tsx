import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type HeroCrumb = { name: string; href?: string }
export type HeroStat = { value: number; label: string }
export type HeroLink = { name: string; href: string }

/** Card pictures come at 800px wide; the hero shows them much larger, so ask the image CDN for a sharper copy. */
const sharp = (url: string) => url.replace("w=800&", "w=1600&")

/**
 * Top of the catalogue pages: a dark "spotlight" panel. Big title and key numbers on the left,
 * the range's photo emerging from the dark on the right, and quick links along the bottom.
 */
export function CatalogHero({
  crumbs,
  eyebrow,
  title,
  description,
  stats = [],
  image,
  photo = false,
  linksLabel,
  links = [],
}: {
  crumbs: HeroCrumb[]
  eyebrow: string
  title: string
  description: string
  stats?: HeroStat[]
  /** Picture shown on the right */
  image?: string
  /** Full photo (blends into the panel) vs. cut-out (stands in a pool of light) */
  photo?: boolean
  /** Accessible name for the quick links, e.g. "Panel Light series" */
  linksLabel?: string
  links?: HeroLink[]
}) {
  return (
    <header className="px-4 pt-[104px]">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary text-white">
        {/* Light: a soft beam from the top-right corner, and a faint floor glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[70%] rotate-[-12deg] bg-[radial-gradient(closest-side,rgba(255,244,224,0.16),transparent)] blur-2xl"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Phones and tablets: no picture (the products follow right below), just its colour as a corner glow */}
        {image && photo && (
          <img
            src={image}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full object-cover opacity-45 blur-3xl lg:hidden"
          />
        )}

        {/* Picture (desktop) */}
        {image &&
          (photo ? (
            <div className="absolute inset-y-0 right-0 hidden aspect-[4/3] max-w-[62%] lg:block">
              {/* The photo melts into the dark panel: no frame, just the picture fading in from the left */}
              <img src={sharp(image)} alt="" className="hero-zoom hero-photo h-full w-full object-cover" />
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 hidden w-[46%] items-center justify-center lg:flex">
              <div
                aria-hidden
                className="absolute h-[78%] aspect-square rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.96),rgba(255,255,255,0.72)_52%,rgba(255,255,255,0.12)_82%,transparent)]"
              />
              <img src={image} alt="" className="hero-zoom relative h-[62%] w-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.28)]" />
            </div>
          ))}

        <div className="relative px-6 pb-6 pt-6 sm:px-10 sm:pb-8 sm:pt-8 lg:px-14 lg:pb-12 lg:pt-12">
          <nav aria-label="Breadcrumb" className="hero-rise mb-5 lg:mb-14">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/50">
              {crumbs.map((crumb, i) => {
                const last = i === crumbs.length - 1
                return (
                  <li key={crumb.name + i} className="flex items-center gap-1.5">
                    {crumb.href && !last ? (
                      <Link href={crumb.href} className="transition-colors hover:text-white">
                        {crumb.name}
                      </Link>
                    ) : (
                      <span className={last ? "text-white" : undefined} aria-current={last ? "page" : undefined}>
                        {crumb.name}
                      </span>
                    )}
                    {!last && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                  </li>
                )
              })}
            </ol>
          </nav>

          <div className="lg:max-w-[52%]">
            <p className="hero-rise mb-3 flex items-center gap-3 text-xs lg:mb-5 uppercase tracking-[0.3em] text-white/55" style={{ animationDelay: "80ms" }}>
              <span aria-hidden className="h-px w-8 bg-white/40" />
              {eyebrow}
            </p>
            <h1
              className="hero-rise text-4xl font-medium leading-[1] tracking-tight text-balance sm:text-6xl lg:text-7xl lg:leading-[0.98] xl:text-[5.5rem]"
              style={{ animationDelay: "160ms" }}
            >
              {title}
            </h1>
            <p className="hero-rise mt-3 max-w-md text-sm leading-relaxed text-white/65 sm:text-base lg:mt-6 lg:text-lg" style={{ animationDelay: "240ms" }}>
              {description}
            </p>

            {stats.length > 0 && (
              <dl className="hero-rise mt-5 flex gap-8 border-t border-white/10 pt-4 lg:mt-9 lg:gap-10 lg:pt-6" style={{ animationDelay: "320ms" }}>
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-2xl font-medium tabular-nums tracking-tight lg:text-4xl">
                      {String(stat.value).padStart(2, "0")}
                    </dd>
                    <dt className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-white/45 lg:mt-1 lg:text-[11px]">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {links.length > 0 && (
            <nav
              aria-label={linksLabel}
              className="hero-rise -mx-6 mt-5 flex gap-2 overflow-x-auto px-6 [scrollbar-width:none] sm:-mx-10 sm:px-10 lg:mx-0 lg:mt-12 lg:flex-wrap lg:overflow-visible lg:px-0"
              style={{ animationDelay: "400ms" }}
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/75 backdrop-blur-sm",
                    "transition-all duration-300 hover:border-white hover:bg-white hover:text-black",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
