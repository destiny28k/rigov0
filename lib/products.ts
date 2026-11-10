import indoorData from "@/data/indoor-products.json"
import outdoorData from "@/data/outdoor-products.json"

export type ProductTab = "indoor" | "outdoor"

export type SpecRow = { label: string; value: string }

export type Product = {
  slug: string
  title: string
  /** Series name, e.g. "Alpha Series" */
  name: string
  /** Short descriptor from the title's brackets, e.g. "Delta COB" (falls back to category) */
  subtitle: string
  description: string
  category: string
  tab: ProductTab
  image: string
  images: string[]
  features: string[]
  /** Product-level specs (outdoor items have these) */
  summary: SpecRow[]
  /** Spec field names, in display order, shared by all variants */
  variantFields: string[]
  /** One entry per model/wattage variant; values are keyed by canonical field key */
  variants: { model: string; values: Record<string, string> }[]
}

type RawProduct = {
  title: string
  description: string
  category: string
  tab?: string
  image?: string
  images?: string[]
  features?: string[]
  specifications?: Record<string, unknown> & { items?: Record<string, string>[] }
}

const ACRONYMS = new Set(["COB", "LED", "PVC", "SMD", "UFO", "GM", "IP", "CCT", "CRI", "PCB", "ID"])

function titleCaseWord(word: string) {
  const upper = word.toUpperCase()
  if (ACRONYMS.has(upper)) return upper
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function titleCase(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => word.split("/").map(titleCaseWord).join("/"))
    .join(" ")
}

/** "body_color", "Body Color" and "BODY COLOR" all map to "body color" */
function canonicalKey(key: string) {
  return key.replace(/_/g, " ").replace(/\s+/g, " ").trim().toLowerCase()
}

const MODEL_KEYS = new Set(["modal no", "model no", "item no"])

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

const SUMMARY_LABELS: Record<string, string> = {
  power: "Power",
  voltage: "Input Voltage",
  leds: "LEDs",
  ip_rating: "IP Rating",
  lifespan_and_warranty: "Lifespan & Warranty",
}

const FIELD_LABELS: Record<string, string> = {
  "body dimension mm": "Body Dimension (mm)",
  "driver dimension mm": "Driver Dimension (mm)",
  "pcb size mm": "PCB Size (mm)",
  "pipe id mm": "Pipe ID (mm)",
  "available power watt": "Available Wattage",
  "cut out": "Cut-out",
}

/** Display label for a canonical spec field key */
export function fieldLabel(field: string) {
  return FIELD_LABELS[field] ?? titleCase(field)
}

function normalize(raw: RawProduct, tab: ProductTab): Product {
  const title = raw.title.trim()
  const match = title.match(/^(.*?)\s*\((.*)\)\s*$/)
  const name = titleCase(match ? match[1] : title)
  const subtitle = match ? titleCase(match[2]) : raw.category

  const specs = raw.specifications ?? {}
  const items = Array.isArray(specs.items) ? specs.items : []

  const summary: SpecRow[] = Object.entries(specs)
    .filter(([key, value]) => key !== "items" && typeof value === "string" && value.trim())
    .map(([key, value]) => ({ label: SUMMARY_LABELS[key] ?? titleCase(key.replace(/_/g, " ")), value: value as string }))

  const variantFields: string[] = []
  const variants = items.map((item, index) => {
    const values: Record<string, string> = {}
    let model = ""
    for (const [rawKey, rawValue] of Object.entries(item)) {
      const value = String(rawValue ?? "").trim()
      if (!value) continue
      const key = canonicalKey(rawKey)
      if (MODEL_KEYS.has(key)) {
        model ||= value
        continue
      }
      values[key] = value
      if (!variantFields.includes(key)) variantFields.push(key)
    }
    return { model: model || `Variant ${index + 1}`, values }
  })

  const images = raw.images && raw.images.length > 0 ? raw.images : raw.image ? [raw.image] : []

  return {
    slug: slugify(title),
    title,
    name,
    subtitle,
    description: raw.description,
    category: raw.category,
    tab,
    image: raw.image ?? images[0] ?? "/placeholder.svg",
    images,
    features: (raw.features ?? []).map((f) => f.trim()).filter(Boolean),
    summary,
    variantFields,
    variants,
  }
}

function buildCatalog(): Product[] {
  const all = [
    ...(indoorData.products as RawProduct[]).map((p) => normalize(p, "indoor")),
    ...(outdoorData.products as RawProduct[]).map((p) => normalize(p, "outdoor")),
  ]
  // The source data contains an exact duplicate entry (XYLO series); keep the first of each slug.
  const seen = new Set<string>()
  return all.filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
}

export const products: Product[] = buildCatalog()

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

/** Encode a public path that may contain spaces or brackets. */
export function imageSrc(path: string) {
  return encodeURI(path)
}
