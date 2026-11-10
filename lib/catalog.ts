/**
 * Product hierarchy from "Website FrameWork.pdf":
 *   Products → Indoor / Outdoor → Category → Series → (Versions)
 *
 * The order of tabs, categories and series here is the order shown on the site.
 * Each series lists the product entries (from data/*.json, by slug) that belong to it.
 * A series with several entries (e.g. Deco Concealed + Deco Surface) gets one page with a version switch.
 * A series with no entries yet stays hidden until its product data is added.
 */
import { products, type Product, type ProductTab } from "./products"

type SeriesDef = {
  slug: string
  name: string
  /** Defaults to "<name> Series" */
  title?: string
  versions: { product: string; label?: string }[]
}

type CategoryDef = {
  slug: string
  name: string
  description: string
  /** Tile picture; defaults to the first series' image */
  image?: string
  series: SeriesDef[]
}

type TabDef = {
  slug: ProductTab
  name: string
  description: string
  /** Short line under the name in the Products dropdown */
  tagline: string
  /** Picture shown in the Products dropdown */
  image: string
  categories: CategoryDef[]
}

const one = (product: string) => [{ product }]

const TAXONOMY: TabDef[] = [
  {
    slug: "indoor",
    name: "Indoor",
    description: "Panels, downlights, COB, cylinder, track and spot lighting for homes, offices, retail and hospitality.",
    tagline: "Panels, downlights, COB, track & spot",
    image: "/images/products/alpha.png",
    categories: [
      {
        slug: "panel-light",
        name: "Panel Light",
        description: "Slim LED panels in concealed and surface-mount styles for clean, even everyday lighting.",
        image: "/images/products/rainbow.png",
        series: [
          {
            slug: "deco",
            name: "Deco",
            versions: [
              { product: "deco-series-concealed-panel", label: "Concealed" },
              { product: "deco-series-surface-panel", label: "Surface" },
            ],
          },
          {
            slug: "glow",
            name: "Glow",
            versions: [
              { product: "glow-series-conseal-panel", label: "Concealed" },
              { product: "glow-series-surface-panel", label: "Surface" },
            ],
          },
          {
            slug: "rainbow",
            name: "Rainbow",
            versions: [
              { product: "rainbow-series-conseal-panel", label: "Concealed" },
              { product: "rainbow-series-surface-panel", label: "Surface" },
            ],
          },
          // Not in the framework PDF — kept here (nearest category) until the client confirms.
          { slug: "neo", name: "Neo", versions: one("neo-series-pvc-down-light-panel") },
        ],
      },
      {
        slug: "downlight",
        name: "DownLight",
        description: "Recessed LED downlights for a neat, uniform wash of light across living spaces, offices and corridors.",
        series: [
          { slug: "platina", name: "Platina", versions: one("platina-series-down-light-panel") },
          { slug: "olive", name: "Olive", versions: one("olive-series-deep-down-light") },
        ],
      },
      {
        slug: "deep-downlight",
        name: "Deep DownLight",
        description: "Deep-set downlights that sink the light source into the ceiling for softer, low-glare illumination.",
        series: [
          { slug: "prima", name: "Prima", versions: one("prima-down-light-panel") },
          { slug: "bella", name: "Bella", versions: [] },
        ],
      },
      {
        slug: "cob-light",
        name: "COB Light",
        description: "Focused COB downlights with precision reflectors for crisp accent and ambient lighting.",
        series: [
          { slug: "alpha", name: "Alpha", versions: one("alpha-series-delta-cob") },
          { slug: "ador", name: "Ador", versions: one("adore-series-delta-cob") },
          { slug: "fusion", name: "Fusion", versions: one("fusion-series-curve-cob") },
          { slug: "nexus", name: "Nexus", versions: one("nexus-series-lens-cob") },
          { slug: "sigma", name: "Sigma", versions: one("sigma-series-movable-cob-light") },
          { slug: "vibe", name: "Vibe", versions: one("vibe-series-cob-deep-spot") },
        ],
      },
      {
        slug: "cob-premium-light",
        name: "COB Premium Light",
        description: "Our premium COB range with refined finishes and optics for high-end homes, retail and hospitality.",
        series: [
          { slug: "della", name: "Della", versions: one("della-series") },
          { slug: "foria", name: "Foria", versions: one("foria-series") },
          { slug: "foria-pro", name: "Foria Pro", versions: one("foria-pro-series") },
          { slug: "rio", name: "Rio", versions: one("rio-series") },
          { slug: "spark", name: "Spark", versions: one("spark-series") },
          { slug: "rolex", name: "Rolex", versions: [] },
          { slug: "snow", name: "Snow", versions: one("snow-series") },
          { slug: "grace", name: "Grace", versions: [] },
          { slug: "seltos", name: "Seltos", versions: [] },
        ],
      },
      {
        slug: "cob-cyd",
        name: "COB CYD",
        description: "Surface-mounted COB cylinder lights for high ceilings, accent walls and modern interiors.",
        series: [
          { slug: "vela", name: "Vela", versions: one("vela-series-cob-cylinder-light") },
          { slug: "luna", name: "Luna", versions: one("luna-series-movable-cob-cylinder-light") },
          // Not in the framework PDF — kept here (nearest category) until the client confirms.
          { slug: "creta", name: "Creta", versions: one("creta-series") },
        ],
      },
      {
        slug: "track-light",
        name: "Track Light",
        description: "Adjustable track-mounted spotlights to highlight artwork, displays and architectural details.",
        series: [
          { slug: "blaze", name: "Blaze", versions: one("blaze-track-light") },
          { slug: "magnite", name: "Magnite", versions: [] },
        ],
      },
      {
        slug: "linear-spot-light",
        name: "Linear Spot Light",
        description: "Linear SMD spot lights for slim, directional accent lighting.",
        series: [
          { slug: "nexa", name: "Nexa", versions: [] },
          { slug: "magic", name: "Magic", versions: one("magic-series-liner-smd-spot-light") },
        ],
      },
    ],
  },
  {
    slug: "outdoor",
    name: "Outdoor",
    description: "Flood, stadium, street and high-bay lighting built for demanding environments.",
    tagline: "Flood, stadium, street & high-bay",
    image: "/images/outdoor/30WUNIK_nobg.png",
    categories: [
      {
        slug: "flood-light",
        name: "Flood Light",
        description: "Weather-resistant LED flood lights for facades, yards, signage and security lighting.",
        series: [
          { slug: "unik", name: "Unik", versions: one("unik-series-slim-led-flood-light") },
          { slug: "star", name: "Star", versions: one("star-series-slim-led-flood-light") },
          { slug: "optix", name: "Optix", versions: one("optix-series-lens-led-flood-light") },
          {
            slug: "unik-back-choke",
            name: "Unik Back Choke",
            title: "Unik Back Choke",
            versions: one("back-choke-led-flood-light"),
          },
          { slug: "dob-flood", name: "DOB Flood", title: "DOB Flood Light", versions: [] },
          // Not in the framework PDF — kept here (nearest category) until the client confirms.
          { slug: "xylo", name: "Xylo", versions: one("xylo-series-gm-model-led-flood-light") },
        ],
      },
      {
        slug: "stadium-light",
        name: "Stadium Light",
        description: "High-output flood lighting for stadiums, sports grounds and large open areas.",
        series: [
          { slug: "stadium-light", name: "Stadium Light", title: "Stadium Light", versions: one("staduim-led-flood-light") },
        ],
      },
      {
        slug: "street-light",
        name: "Street Light",
        description: "Durable LED street lights for roads, campuses, parking areas and pathways.",
        series: [
          { slug: "galaxy", name: "Galaxy", versions: one("galaxy-series-led-street-light") },
          { slug: "lancy", name: "Lancy", versions: one("lency-series-led-street-light") },
          { slug: "dob-street", name: "DOB Street", title: "DOB Street Light", versions: [] },
        ],
      },
      {
        slug: "highbay-light",
        name: "HighBay Light",
        description: "High-bay LED lighting for warehouses, factories and other high-ceiling spaces.",
        series: [
          {
            slug: "ufo",
            name: "UFO Series",
            title: "UFO Series",
            versions: [
              { product: "ufo-series-lense-high-bay-led-light", label: "Lens" },
              { product: "ufo-series-glass-high-bay-led-light", label: "Glass" },
            ],
          },
          { slug: "ufo-eco", name: "UFO Eco Series", title: "UFO Eco Series", versions: [] },
        ],
      },
    ],
  },
]

/* ------------------------------------------------------------------ */

export type Version = Product & { label: string; anchor: string }

export type Series = {
  slug: string
  name: string
  title: string
  href: string
  image: string
  tab: Tab
  category: Category
  versions: Version[]
}

export type Category = {
  slug: string
  name: string
  description: string
  href: string
  image: string
  tab: Tab
  /** Only series that have product data */
  series: Series[]
}

export type Tab = {
  slug: ProductTab
  name: string
  description: string
  tagline: string
  image: string
  href: string
  categories: Category[]
}

function anchorFor(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function build(): Tab[] {
  const used = new Set<string>()
  const problems: string[] = []

  const tabs = TAXONOMY.map((tabDef) => {
    const tab: Tab = {
      slug: tabDef.slug,
      name: tabDef.name,
      description: tabDef.description,
      tagline: tabDef.tagline,
      image: tabDef.image,
      href: `/products/${tabDef.slug}`,
      categories: [],
    }

    tab.categories = tabDef.categories
      .map((catDef) => {
        const category: Category = {
          slug: catDef.slug,
          name: catDef.name,
          description: catDef.description,
          href: `${tab.href}/${catDef.slug}`,
          image: "",
          tab,
          series: [],
        }

        category.series = catDef.series
          .map((seriesDef) => {
            const versions: Version[] = seriesDef.versions.flatMap(({ product: slug, label }) => {
              const product = products.find((p) => p.slug === slug)
              if (!product) {
                problems.push(`Series "${seriesDef.name}" points to missing product "${slug}"`)
                return []
              }
              if (used.has(slug)) problems.push(`Product "${slug}" is assigned to more than one series`)
              used.add(slug)
              const versionLabel = label ?? ""
              return [{ ...product, label: versionLabel, anchor: anchorFor(versionLabel) }]
            })

            return {
              slug: seriesDef.slug,
              name: seriesDef.name,
              title: seriesDef.title ?? `${seriesDef.name} Series`,
              href: `${category.href}/${seriesDef.slug}`,
              image: versions[0]?.image ?? "",
              tab,
              category,
              versions,
            } satisfies Series
          })
          .filter((series) => series.versions.length > 0)

        category.image = catDef.image ?? category.series[0]?.image ?? ""
        return category
      })
      .filter((category) => category.series.length > 0)

    return tab
  })

  for (const product of products) {
    if (!used.has(product.slug)) problems.push(`Product "${product.slug}" is not assigned to any series in lib/catalog.ts`)
  }
  if (problems.length > 0) {
    throw new Error(`Product catalogue is out of sync with the data files:\n- ${problems.join("\n- ")}`)
  }

  return tabs
}

export const catalog: Tab[] = build()

export function getTab(tab: string) {
  return catalog.find((t) => t.slug === tab)
}

export function getCategory(tab: string, category: string) {
  return getTab(tab)?.categories.find((c) => c.slug === category)
}

export function getSeries(tab: string, category: string, series: string) {
  return getCategory(tab, category)?.series.find((s) => s.slug === series)
}

export function allSeries(): Series[] {
  return catalog.flatMap((t) => t.categories.flatMap((c) => c.series))
}

/** Same category first, then the rest of the same tab. */
export function getRelatedSeries(series: Series, limit = 4) {
  const sameTab = series.tab.categories.flatMap((c) => c.series).filter((s) => s.href !== series.href)
  const sameCategory = sameTab.filter((s) => s.category.slug === series.category.slug)
  const others = sameTab.filter((s) => s.category.slug !== series.category.slug)
  return [...sameCategory, ...others].slice(0, limit)
}

/** A short line for cards: the version labels, or the single product's descriptor. */
export function seriesSubtitle(series: Series) {
  if (series.versions.length > 1) return series.versions.map((v) => v.label).join(" · ")
  return series.versions[0].subtitle
}

/** Lightweight menu structure for the header (safe to pass to client components). */
export type MenuTab = { name: string; href: string; tagline: string; image: string }

export function getMenu(): MenuTab[] {
  return catalog.map((tab) => ({ name: tab.name, href: tab.href, tagline: tab.tagline, image: tab.image }))
}
