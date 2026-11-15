import { SiteHeader } from "@/components/site-header"
import { JsonLd } from "@/components/json-ld"
import { organizationJsonLd, pageMetadata } from "@/lib/seo"
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Philosophy } from "@/components/philosophy"
import { Projects, type FeaturedItem } from "@/components/projects"
import { allSeries } from "@/lib/catalog"
import { getHomePage, getSiteSettings } from "@/lib/content"
import { ShopByCategory } from "@/components/shop-by-category"
import { FAQ } from "@/components/faq"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

export const metadata = pageMetadata({
  title: `${SITE_NAME} — Premium LED Lighting Solutions`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
})

export default async function Home() {
  const [home, settings, series] = await Promise.all([getHomePage(), getSiteSettings(), allSeries()])

  // Featured products are chosen in the admin (Homepage → Featured products); hidden ones are skipped
  const featured: FeaturedItem[] = home.featured.flatMap(({ seriesId, detail }) => {
    const s = series.find((item) => item.id === seriesId)
    if (!s) return []
    return [
      {
        href: s.href,
        title: s.title,
        detail: detail || seriesSubtitleOf(s),
        category: s.category.name,
        image: s.image,
        photo: s.photo,
      },
    ]
  })

  return (
    <main className="min-h-screen">
      <JsonLd data={organizationJsonLd(settings)} />
      <SiteHeader />
      <Hero />
      <ShopByCategory />
      {featured.length > 0 && <Projects items={featured} />}
      <Philosophy heading={home.whyHeading} intro={home.whyIntro} reasons={home.reasons} stats={home.stats} />
      <About
        heading={home.aboutHeading}
        text={home.aboutText}
        image={home.aboutImage}
        values={home.values}
        journey={home.journey}
      />
      {home.faq.length > 0 && <FAQ items={home.faq} />}
      <CallToAction settings={settings} />
      <Footer />
    </main>
  )
}

function seriesSubtitleOf(s: Awaited<ReturnType<typeof allSeries>>[number]) {
  return s.versions[0]?.subtitle ?? ""
}
