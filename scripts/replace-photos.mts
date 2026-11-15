/**
 * Replaces the photos of existing series with the client's new photo sets (in /public/images/*-2026…/).
 * Only `images` and `cardImage` on each version are changed — names, descriptions and specs stay as they are.
 *
 *   npx sanity exec scripts/replace-photos.mts --with-user-token
 */
import { createReadStream } from "node:fs"
import { basename, join } from "node:path"
import { getCliClient } from "sanity/cli"

const client = getCliClient({ apiVersion: "2025-10-01" }).withConfig({ useCdn: false })

const COB = "public/images/COB Light-20261113T092817Z-1-001/COB Light"
const DEEP = "public/images/Deep Downlight-20261110T091227Z-1-001/Deep Downlight"
const DOWN = "public/images/DownLight-20261110T065533Z-1-001 (1)/DownLight"
const PANEL = "public/images/Panel Light-20261110T065519Z-1-001 (1)/Panel Light"

const n = (dir: string, prefix: string, from: number, to: number, ext = "png") =>
  Array.from({ length: to - from + 1 }, (_, i) => `${dir}/${prefix}${from + i}.${ext}`)

/** series id → version key → { photos in gallery order, card picture } */
const PLAN: Record<string, Record<string, { images: string[]; card: string }>> = {
  "series-indoor-cob-light-ador": { v0: { images: n(`${COB}/Ador`, "Ador", 1, 6), card: `${COB}/Ador/Ador2.png` } },
  "series-indoor-cob-light-alpha": { v0: { images: n(`${COB}/Alpha`, "Alpha", 1, 5), card: `${COB}/Alpha/Alpha2.png` } },
  "series-indoor-cob-light-fusion": {
    v0: { images: [`${COB}/Fusion/Fusion.png`, ...n(`${COB}/Fusion`, "Fusion0", 1, 4)], card: `${COB}/Fusion/Fusion01.png` },
  },
  "series-indoor-cob-light-nexus": { v0: { images: n(`${COB}/Nexus`, "Nexus", 1, 7), card: `${COB}/Nexus/Nexus2.png` } },
  "series-indoor-cob-light-sigma": {
    v0: {
      images: [`${COB}/Sigma/Sigma0.png`, `${COB}/Sigma/Sigma2.png`, `${COB}/Sigma/Sigma3.png`, `${COB}/Sigma/Sigma4.jpeg`],
      card: `${COB}/Sigma/Sigma2.png`,
    },
  },
  "series-indoor-cob-light-vibe": {
    v0: { images: [...n(`${COB}/Vibe`, "Vibe", 1, 6), ...n(`${COB}/Vibe`, "VibeSeries", 1, 6)], card: `${COB}/Vibe/Vibe2.png` },
  },
  "series-indoor-deep-downlight-prima": { v0: { images: n(`${DEEP}/Prima`, "Prima", 1, 5), card: `${DEEP}/Prima/Prima2.png` } },
  "series-indoor-downlight-platina": { v0: { images: n(`${DOWN}/Platina`, "Platima", 1, 4), card: `${DOWN}/Platina/Platima2.png` } },
  "series-indoor-panel-light-deco": {
    v0: { images: n(`${PANEL}/Deco/Deco Conceal`, "DecoConcealed", 1, 5), card: `${PANEL}/Deco/Deco Conceal/DecoConcealed2.png` },
    v1: { images: n(`${PANEL}/Deco/Deco Surface`, "DecoSurface", 1, 5), card: `${PANEL}/Deco/Deco Surface/DecoSurface2.png` },
  },
  "series-indoor-panel-light-glow": {
    v0: { images: n(`${PANEL}/Glow/Glow Concealed`, "GlowSeries", 1, 5), card: `${PANEL}/Glow/Glow Concealed/GlowSeries2.png` },
    v1: { images: n(`${PANEL}/Glow/Glow Surface`, "GlowSeries", 1, 5), card: `${PANEL}/Glow/Glow Surface/GlowSeries2.png` },
  },
  "series-indoor-panel-light-rainbow": {
    v0: {
      images: n(`${PANEL}/Rainbow/Rainbow Concealed`, "RainbowSeries", 1, 5),
      card: `${PANEL}/Rainbow/Rainbow Concealed/RainbowSeries2.png`,
    },
    v1: {
      images: [
        `${PANEL}/Rainbow/Rainbow Surface/Rainbowsurface1.png`,
        ...n(`${PANEL}/Rainbow/Rainbow Surface`, "RainbowSurface", 2, 4),
        `${PANEL}/Rainbow/Rainbow Surface/Rainbowsurface5.png`,
      ],
      card: `${PANEL}/Rainbow/Rainbow Surface/RainbowSurface2.png`,
    },
  },
}

// ---- upload every photo once (Sanity de-duplicates identical files), 6 at a time
const paths = [...new Set(Object.values(PLAN).flatMap((s) => Object.values(s).flatMap((v) => [...v.images, v.card])))]
const assetIds = new Map<string, string>()
const queue = [...paths]
let done = 0
async function worker() {
  for (let p = queue.shift(); p; p = queue.shift()) {
    for (let attempt = 1; ; attempt++) {
      try {
        const asset = await client.assets.upload("image", createReadStream(join(process.cwd(), p)), { filename: basename(p) })
        assetIds.set(p, asset._id)
        break
      } catch (error) {
        if (attempt >= 3) throw error
        await new Promise((r) => setTimeout(r, 1500 * attempt))
      }
    }
    if (++done % 10 === 0 || done === paths.length) console.log(`  photos uploaded: ${done}/${paths.length}`)
  }
}
console.log(`Uploading ${paths.length} photos…`)
await Promise.all(Array.from({ length: 6 }, worker))

const img = (p: string, key?: string) => ({
  ...(key ? { _key: key } : {}),
  _type: "image",
  asset: { _type: "reference", _ref: assetIds.get(p)! },
})

// ---- patch each series in one transaction (published documents only, so the site updates directly)
const tx = client.transaction()
for (const [id, versions] of Object.entries(PLAN)) {
  const set: Record<string, unknown> = {}
  for (const [key, v] of Object.entries(versions)) {
    set[`versions[_key=="${key}"].images`] = v.images.map((p, i) => img(p, `img${i}`))
    set[`versions[_key=="${key}"].cardImage`] = img(v.card)
  }
  tx.patch(id, (patch) => patch.set(set))
}
await tx.commit()
console.log(`Updated ${Object.keys(PLAN).length} series.`)

// ---- warn about unpublished Studio drafts, which would still show the old photos until discarded
const drafts: string[] = await client.fetch(`*[_id in $ids]._id`, { ids: Object.keys(PLAN).map((id) => `drafts.${id}`) })
if (drafts.length) console.log(`Note: these series have unpublished drafts in the Studio (left untouched): ${drafts.join(", ")}`)
