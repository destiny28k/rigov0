import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { imageSrc } from "@/lib/products"
import { cn } from "@/lib/utils"

export type CardData = {
  href: string
  name: string
  subtitle: string
  /** Small tag in the image corner, e.g. the category or "3 series" */
  tag?: string
  image: string
  /** Full photo: fills the card edge to edge. Otherwise a cut-out, shown whole with breathing room. */
  photo?: boolean
}

/** Card used for series (and category tiles) across the catalogue and homepage. */
export function ProductCard({ item, priority = false }: { item: CardData; priority?: boolean }) {
  return (
    <Link href={item.href} className="group block">
      {/* Every card is the same 4:3 frame. Photos are shown whole (never cropped); any leftover space
          around a differently-shaped photo is filled with a soft blurred copy of it, not a white margin. */}
      <div className="relative overflow-hidden aspect-[4/3] mb-5 bg-white rounded-2xl border border-border/60">
        {item.photo && (
          <img
            src={imageSrc(item.image)}
            alt=""
            aria-hidden
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
          />
        )}
        <img
          src={imageSrc(item.image)}
          alt={item.name}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "relative w-full h-full object-contain transition-transform duration-700 group-hover:scale-105",
            !item.photo && "p-8",
          )}
        />
        {/* Not on full photos: it would cover the RIGO logo printed in their corner */}
        {item.tag && !item.photo && (
          <span className="absolute top-4 left-4 text-[11px] tracking-[0.15em] uppercase text-muted-foreground bg-background/80 backdrop-blur px-2.5 py-1 rounded-full">
            {item.tag}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-medium mb-1 group-hover:underline underline-offset-4">{item.name}</h3>
          <p className="text-muted-foreground text-sm truncate">{item.subtitle}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
