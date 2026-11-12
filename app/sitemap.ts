import type { MetadataRoute } from "next"
import { getCatalog } from "@/lib/catalog"
import { SITE_URL } from "@/lib/site"

/** /sitemap.xml — every page, built from the product catalogue so new series are included automatically. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog()
  const lastModified = new Date()
  const url = (path: string) => `${SITE_URL}${path}`

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: url("/products"), lastModified, changeFrequency: "weekly", priority: 0.9 },
  ]

  for (const tab of catalog) {
    pages.push({ url: url(tab.href), lastModified, changeFrequency: "weekly", priority: 0.8 })
    for (const category of tab.categories) {
      pages.push({ url: url(category.href), lastModified, changeFrequency: "weekly", priority: 0.8 })
      for (const series of category.series) {
        pages.push({ url: url(series.href), lastModified, changeFrequency: "monthly", priority: 0.7 })
      }
    }
  }

  pages.push(
    { url: url("/privacy-policy"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  )

  return pages
}
