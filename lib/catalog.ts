/**
 * Product catalogue, read from Sanity (edited at /studio):
 *   Products → Indoor / Outdoor → Category → Series → (Versions)
 *
 * Order comes from the "Order" fields in the admin. Hidden series, and categories with no visible series,
 * are left out. Results are cached (see sanity/lib/client.ts) and de-duplicated per request with React cache().
 */
import { cache } from "react"
import { sanityFetch } from "@/sanity/lib/client"
import { imageUrl, type SanityImage } from "@/sanity/lib/image"

export type ProductTab = "indoor" | "outdoor"
export type SpecRow = { label: string; value: string }

export type Version = {
  key: string
  /** e.g. "Concealed" — empty when the series has a single version */
  label: string
  anchor: string
  /** e.g. "Delta COB" */
  subtitle: string
  description: string
  /** Card picture URL */
  image: string
  /** Gallery photo URLs and matching thumbnail URLs */
  images: string[]
  thumbs: string[]
  features: string[]
  /** Key specs shown at the top of the product page */
  summary: SpecRow[]
  /** Spec names in display order, shared by all models */
  variantFields: string[]
  /** One entry per model; values are keyed by spec name */
  variants: { model: string; values: Record<string, string> }[]
}

export type Series = {
  id: string
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
  id: string
  slug: string
  name: string
  description: string
  href: string
  image: string
  tab: Tab
  series: Series[]
}

export type Tab = {
  slug: ProductTab
  name: string
  description: string
  href: string
  categories: Category[]
}

const TABS: { slug: ProductTab; name: string; description: string }[] = [
  {
    slug: "indoor",
    name: "Indoor",
    description: "Panels, downlights, COB, cylinder, track and spot lighting for homes, offices, retail and hospitality.",
  },
  {
    slug: "outdoor",
    name: "Outdoor",
    description: "Flood, stadium, street and high-bay lighting built for demanding environments.",
  },
]

// ---------------------------------------------------------------- Sanity query

type RawSpec = { label?: string; value?: string }
type RawVersion = {
  _key: string
  label?: string
  subtitle?: string
  description?: string
  cardImage?: SanityImage
  images?: SanityImage[]
  features?: string[]
  highlights?: RawSpec[]
  models?: { modelNo?: string; specs?: RawSpec[] }[]
}
type RawCategory = { _id: string; name: string; tab: ProductTab; slug: string; description?: string; image?: SanityImage }
type RawSeries = { _id: string; name: string; title?: string; slug: string; categoryId: string; versions?: RawVersion[] }

const CATALOG_QUERY = `{
  "categories": *[_type == "category" && defined(slug.current) && tab in ["indoor", "outdoor"]]
    | order(order asc, name asc) { _id, name, tab, description, image, "slug": slug.current },
  "series": *[_type == "series" && hidden != true && defined(slug.current) && defined(category._ref)]
    | order(order asc, name asc) {
      _id, name, title, "slug": slug.current, "categoryId": category._ref,
      versions[] { _key, label, subtitle, description, cardImage, images, features,
        highlights[] { label, value }, models[] { modelNo, specs[] { label, value } } }
    }
}`

// ---------------------------------------------------------------- build

const anchorFor = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const cleanRows = (rows: RawSpec[] = []): SpecRow[] =>
  rows
    .map((r) => ({ label: (r.label ?? "").trim(), value: (r.value ?? "").trim() }))
    .filter((r) => r.label && r.value)

function buildVersion(raw: RawVersion): Version | null {
  const photos = (raw.images ?? []).filter((img) => img?.asset)
  const card = raw.cardImage?.asset ? raw.cardImage : photos[0]
  if (!card) return null

  // Spec names are matched case-insensitively so "Power" and "power" share one table row
  const fieldByKey = new Map<string, string>()
  const variants = (raw.models ?? []).map((model, i) => {
    const values: Record<string, string> = {}
    for (const row of cleanRows(model.specs)) {
      const key = row.label.toLowerCase()
      if (!fieldByKey.has(key)) fieldByKey.set(key, row.label)
      values[fieldByKey.get(key)!] = row.value
    }
    return { model: (model.modelNo ?? "").trim() || `Model ${i + 1}`, values }
  })

  const label = (raw.label ?? "").trim()
  return {
    key: raw._key,
    label,
    anchor: anchorFor(label),
    subtitle: (raw.subtitle ?? "").trim(),
    description: (raw.description ?? "").trim(),
    image: imageUrl(card, 800),
    images: photos.length ? photos.map((img) => imageUrl(img, 1600)) : [imageUrl(card, 1600)],
    thumbs: photos.length ? photos.map((img) => imageUrl(img, 200)) : [imageUrl(card, 200)],
    features: (raw.features ?? []).map((f) => f.trim()).filter(Boolean),
    summary: cleanRows(raw.highlights),
    variantFields: [...fieldByKey.values()],
    variants,
  }
}

async function loadCatalog(): Promise<Tab[]> {
  const data = await sanityFetch<{ categories: RawCategory[]; series: RawSeries[] }>(CATALOG_QUERY)

  return TABS.map((tabDef) => {
    const tab: Tab = { ...tabDef, href: `/products/${tabDef.slug}`, categories: [] }

    tab.categories = data.categories
      .filter((c) => c.tab === tab.slug)
      .map((raw) => {
        const category: Category = {
          id: raw._id,
          slug: raw.slug,
          name: raw.name,
          description: raw.description ?? "",
          href: `${tab.href}/${raw.slug}`,
          image: "",
          tab,
          series: [],
        }
        category.series = data.series
          .filter((s) => s.categoryId === raw._id)
          .map((s) => {
            const versions = (s.versions ?? []).map(buildVersion).filter((v): v is Version => v !== null)
            return {
              id: s._id,
              slug: s.slug,
              name: s.name,
              title: s.title?.trim() || `${s.name} Series`,
              href: `${category.href}/${s.slug}`,
              image: versions[0]?.image ?? "",
              tab,
              category,
              versions,
            } satisfies Series
          })
          .filter((s) => s.versions.length > 0)
        category.image = raw.image?.asset ? imageUrl(raw.image, 800) : (category.series[0]?.image ?? "")
        return category
      })
      .filter((c) => c.series.length > 0)

    return tab
  })
}

// ---------------------------------------------------------------- public API

/** The whole catalogue (one Sanity request per page render). */
export const getCatalog = cache(loadCatalog)

export async function getTab(tab: string) {
  return (await getCatalog()).find((t) => t.slug === tab)
}

export async function getCategory(tab: string, category: string) {
  return (await getTab(tab))?.categories.find((c) => c.slug === category)
}

export async function getSeries(tab: string, category: string, series: string) {
  return (await getCategory(tab, category))?.series.find((s) => s.slug === series)
}

export async function allSeries(): Promise<Series[]> {
  return (await getCatalog()).flatMap((t) => t.categories.flatMap((c) => c.series))
}

/** Same category first, then the rest of the same tab. */
export function getRelatedSeries(series: Series, limit = 4) {
  const sameTab = series.tab.categories.flatMap((c) => c.series).filter((s) => s.href !== series.href)
  const sameCategory = sameTab.filter((s) => s.category.id === series.category.id)
  const others = sameTab.filter((s) => s.category.id !== series.category.id)
  return [...sameCategory, ...others].slice(0, limit)
}

/** A short line for cards: the version labels, or the single product's descriptor. */
export function seriesSubtitle(series: Series) {
  if (series.versions.length > 1) return series.versions.map((v) => v.label).filter(Boolean).join(" · ")
  return series.versions[0].subtitle
}

/** Lightweight menu structure for the header (safe to pass to client components). */
export type MenuTab = { name: string; href: string }

export async function getMenu(): Promise<MenuTab[]> {
  return (await getCatalog()).map((tab) => ({ name: tab.name, href: tab.href }))
}
