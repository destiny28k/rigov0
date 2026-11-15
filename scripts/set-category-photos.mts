/**
 * Points the category tiles that now have real photography at a new photo (reusing the series' card photo).
 *   npx sanity exec scripts/set-category-photos.mts --with-user-token
 */
import { getCliClient } from "sanity/cli"

const client = getCliClient({ apiVersion: "2025-10-01" }).withConfig({ useCdn: false })

/** category id → [series id, version key] whose card photo becomes the category picture */
const PLAN: Record<string, [string, string]> = {
  "category-indoor-panel-light": ["series-indoor-panel-light-rainbow", "v0"],
  "category-indoor-downlight": ["series-indoor-downlight-platina", "v0"],
  "category-indoor-deep-downlight": ["series-indoor-deep-downlight-prima", "v0"],
  "category-indoor-cob-light": ["series-indoor-cob-light-fusion", "v0"],
}

const tx = client.transaction()
for (const [categoryId, [seriesId, key]] of Object.entries(PLAN)) {
  const ref: string | null = await client.fetch(`*[_id == $id][0].versions[_key == $key][0].cardImage.asset._ref`, { id: seriesId, key })
  if (!ref) throw new Error(`No card photo on ${seriesId}`)
  tx.patch(categoryId, (p) => p.set({ image: { _type: "image", asset: { _type: "reference", _ref: ref } } }))
}
await tx.commit()
console.log(`Updated ${Object.keys(PLAN).length} category pictures.`)
