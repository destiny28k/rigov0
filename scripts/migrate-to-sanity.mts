/**
 * One-time import of the existing product catalogue, homepage content and contact details into Sanity.
 *
 *   SANITY_WRITE_TOKEN=… npx tsx --tsconfig tsconfig.json scripts/migrate-to-sanity.mts [--force]
 *
 * - Uploads every product photo from /public (Sanity de-duplicates identical files, so re-running is safe).
 * - Creates documents with fixed IDs. By default existing documents are left untouched, so content edited
 *   in the admin panel is never overwritten. Pass --force to replace them with the JSON data again.
 */
import { createReadStream, existsSync } from "node:fs"
import { basename, join } from "node:path"
import { createClient } from "@sanity/client"
import { catalog } from "../lib/legacy-catalog"
import { fieldLabel } from "../lib/products"
import { apiVersion, dataset, projectId } from "../sanity/env"

const token = process.env.SANITY_WRITE_TOKEN
if (!token) throw new Error("Set SANITY_WRITE_TOKEN (a token with write access).")
const FORCE = process.argv.includes("--force")

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })
const PUBLIC = join(process.cwd(), "public")

// ---------------------------------------------------------------- images
// 1) Collect every photo path, 2) upload them 6 at a time with progress, 3) reference them by path.
const ABOUT_IMAGE = "/images/about-room.jpg"
const allPaths = new Set<string>([ABOUT_IMAGE])
for (const tab of catalog)
  for (const category of tab.categories) {
    if (category.image) allPaths.add(category.image)
    for (const series of category.series)
      for (const v of series.versions) {
        if (v.image) allPaths.add(v.image)
        v.images.forEach((p) => allPaths.add(p))
      }
  }

for (const path of allPaths) if (!existsSync(join(PUBLIC, path))) throw new Error(`Image not found: ${path}`)

const uploaded = new Map<string, string>()
const queue = [...allPaths]
let done = 0
async function worker() {
  for (let path = queue.shift(); path; path = queue.shift()) {
    for (let attempt = 1; ; attempt++) {
      try {
        const asset = await client.assets.upload("image", createReadStream(join(PUBLIC, path)), {
          filename: basename(path),
        })
        uploaded.set(path, asset._id)
        break
      } catch (error) {
        if (attempt >= 3) throw error
        await new Promise((r) => setTimeout(r, 1500 * attempt)) // brief pause, then retry
      }
    }
    done++
    if (done % 10 === 0 || done === allPaths.size) console.log(`  photos uploaded: ${done}/${allPaths.size}`)
  }
}
console.log(`Uploading ${allPaths.size} photos (6 at a time)…`)
await Promise.all(Array.from({ length: 6 }, worker))

function image(path: string | undefined) {
  if (!path) return undefined
  const assetId = uploaded.get(path)
  if (!assetId) throw new Error(`Photo was not uploaded: ${path}`)
  return { _type: "image", asset: { _type: "reference", _ref: assetId } }
}
const withKeys = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}${i}`, ...item }))

// ---------------------------------------------------------------- products
type Doc = { _id: string; _type: string; [key: string]: unknown }
const docs: Doc[] = []
const seriesIds = new Map<string, string>() // "indoor/cob-light/alpha" -> document id

for (const tab of catalog) {
  for (const [ci, category] of tab.categories.entries()) {
    const categoryId = `category-${tab.slug}-${category.slug}`
    docs.push({
      _id: categoryId,
      _type: "category",
      name: category.name,
      tab: tab.slug,
      slug: { _type: "slug", current: category.slug },
      description: category.description,
      image: image(category.image),
      order: (ci + 1) * 10,
    })

    for (const [si, series] of category.series.entries()) {
      const seriesId = `series-${tab.slug}-${category.slug}-${series.slug}`
      seriesIds.set(`${tab.slug}/${category.slug}/${series.slug}`, seriesId)
      const versions = []
      for (const [vi, v] of series.versions.entries()) {
        const images = []
        for (const p of v.images) images.push(image(p))
        versions.push({
          _key: `v${vi}`,
          _type: "productVersion",
          label: v.label || undefined,
          subtitle: v.subtitle,
          description: v.description,
          cardImage: image(v.image),
          images: withKeys(images.filter(Boolean) as object[], "img"),
          features: v.features,
          highlights: withKeys(
            v.summary.map((row) => ({ _type: "specRow", label: row.label, value: row.value })),
            "h",
          ),
          models: withKeys(
            v.variants.map((variant, mi) => ({
              _type: "specModel",
              modelNo: variant.model,
              specs: withKeys(
                v.variantFields
                  .filter((field) => variant.values[field])
                  .map((field) => ({ _type: "specRow", label: fieldLabel(field), value: variant.values[field] })),
                `m${mi}s`,
              ),
            })),
            "m",
          ),
        })
      }
      docs.push({
        _id: seriesId,
        _type: "series",
        name: series.name,
        title: series.title !== `${series.name} Series` ? series.title : undefined,
        category: { _type: "reference", _ref: categoryId },
        slug: { _type: "slug", current: series.slug },
        order: (si + 1) * 10,
        hidden: false,
        versions,
      })
    }
  }
}

// ---------------------------------------------------------------- homepage + settings
const featured: [string, string][] = [
  ["indoor/cob-light/alpha", "Recessed COB downlight"],
  ["indoor/cob-light/fusion", "Sculpted curved COB light"],
  ["indoor/cob-premium-light/foria-pro", "Professional-grade COB"],
  ["indoor/cob-cyd/luna", "Movable COB cylinder light"],
  ["indoor/downlight/platina", "16W / 24W / 32W downlight"],
  ["indoor/panel-light/rainbow", "Dual-colour LED panel"],
]

docs.push({
  _id: "homePage",
  _type: "homePage",
  featured: withKeys(
    featured.map(([path, detail]) => {
      const ref = seriesIds.get(path)
      if (!ref) throw new Error(`Featured series not found: ${path}`)
      return { _type: "featuredItem", series: { _type: "reference", _ref: ref }, detail }
    }),
    "f",
  ),
  whyHeading: "Built to shine",
  whyIntro: "Modern design and dependable performance, so every space looks its best.",
  reasons: withKeys(
    [
      { title: "Energy efficient", description: "More light per watt with a 0.95 power factor — lower bills, same brilliance.", icon: "zap" },
      { title: "Premium build", description: "Aluminium bodies, efficient heat dissipation and surge protection.", icon: "gem" },
      { title: "Light for every mood", description: "White, natural white, warm white or 3-in-1 colour options.", icon: "sun" },
      { title: "2-year warranty", description: "Every fixture is covered, with dedicated customer care.", icon: "shield-check" },
    ].map((r) => ({ _type: "reason", ...r })),
    "r",
  ),
  stats: withKeys(
    [
      { number: "15+", label: "Years of excellence" },
      { number: "10,000+", label: "Projects completed" },
      { number: "500+", label: "Product variants" },
      { number: "50+", label: "Countries served" },
    ].map((s) => ({ _type: "stat", ...s })),
    "s",
  ),
  aboutHeading: "Crafting light, creating experiences",
  aboutText:
    "For over a decade, RIGO has made premium LED lighting that combines cutting-edge technology with sophisticated design — trusted by architects, designers and lighting professionals.",
  aboutImage: image(ABOUT_IMAGE),
  values: withKeys(
    [
      { label: "Innovation", icon: "lightbulb" },
      { label: "Quality excellence", icon: "award" },
      { label: "Customer focus", icon: "users" },
      { label: "Reliability", icon: "shield" },
    ].map((v) => ({ _type: "companyValue", ...v })),
    "val",
  ),
  journey: withKeys(
    [
      { year: "2009", title: "Founded", description: "Started with a vision for better LED lighting and design." },
      { year: "2015", title: "Global expansion", description: "Partnerships with distributors across continents." },
      { year: "2020", title: "Innovation hub", description: "Launched our R&D facility for smart, sustainable lighting." },
      { year: "2024", title: "Future forward", description: "Expanding our premium product portfolio." },
    ].map((j) => ({ _type: "milestone", ...j })),
    "j",
  ),
  faq: withKeys(
    [
      ["What types of lights does RIGO offer?", "Our indoor range includes LED panel lights (concealed and surface), COB downlights, cylinder COB lights, and track and spot lights, plus a range of outdoor fixtures. Most series come in multiple wattages, shapes and finishes."],
      ["Which colour temperatures are available?", "Most of our fixtures are available in white, natural white and warm white, and many series also offer a 3-in-1 option that lets you switch between all three with a single fixture."],
      ["Do your products come with a warranty?", "Yes. RIGO fixtures are covered by a 2-year warranty. If you face any issue, our customer care team will help you with a quick replacement or repair."],
      ["Which wattage should I choose for my room?", "It depends on the room size and ceiling height. As a rough guide, 6–12W works well for bedrooms and passages, while 15–24W suits living rooms and offices. Get in touch and we'll recommend the right fit for your space."],
      ["Do you supply in bulk for projects and dealers?", "Absolutely. We work with electricians, interior designers, builders and dealers on projects of every size. Contact us on WhatsApp or email for bulk pricing and dealership enquiries."],
      ["How do I place an order or get a quote?", "Simply message us on WhatsApp at +91 83690 51700 or email customercarerigo1@gmail.com with the products and quantities you need, and our team will get back to you with a quote."],
    ].map(([question, answer]) => ({ _type: "faqItem", question, answer })),
    "q",
  ),
})

docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  phone: "+91 83690 51700",
  whatsappNumber: "918369051700",
  emails: ["customercarerigo1@gmail.com", "jailaxmilightingsolutions@gmail.com"],
  instagramUrl: "https://instagram.com/rigolighting",
  wechatUrl: "https://u.wechat.com/kP_PkMqInEFhHvN6A0ipJ-A?s=4",
})

// ---------------------------------------------------------------- write
// Drop undefined fields (Sanity rejects explicit undefined in some places)
const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const tx = client.transaction()
for (const doc of docs) FORCE ? tx.createOrReplace(clean(doc)) : tx.createIfNotExists(clean(doc))
await tx.commit({ visibility: "async" })

const counts = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {})
console.log(`\n${FORCE ? "Replaced" : "Created (if missing)"}:`, counts, `| images uploaded: ${uploaded.size}`)
