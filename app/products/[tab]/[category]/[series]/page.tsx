import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Mail, MessageCircle } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { ProductGallery } from "@/components/product-gallery"
import { VersionPanel, VersionProvider, VersionSwitch } from "@/components/version-switch"
import { allSeries, getRelatedSeries, getSeries, seriesSubtitle, type Version } from "@/lib/catalog"
import { getSiteSettings, type SiteSettings } from "@/lib/content"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

type Params = { tab: string; category: string; series: string }

export async function generateStaticParams(): Promise<Params[]> {
  return (await allSeries()).map((s) => ({ tab: s.tab.slug, category: s.category.slug, series: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tab, category, series: slug } = await params
  const series = await getSeries(tab, category, slug)
  if (!series) return {}
  const first = series.versions[0]
  return pageMetadata({
    title: `${series.title} — ${series.category.name}`,
    // Lead with the series-specific details so every product page has a unique description
    description: `${series.title} (${seriesSubtitle(series)}) from RIGO's ${series.category.name} range. ${first.description}`,
    path: series.href,
    image: series.image,
  })
}

function enquiryLinks(seriesTitle: string, version: Version, settings: SiteSettings) {
  const name = version.label ? `${seriesTitle} (${version.label})` : seriesTitle
  const message = `Hi! I'm interested in the ${name}. Can you share more details and pricing?`
  return {
    whatsapp: `${settings.whatsappUrl}?text=${encodeURIComponent(message)}`,
    email: `mailto:${settings.emails[0]}?subject=${encodeURIComponent(`Enquiry: ${name}`)}&body=${encodeURIComponent(message)}`,
  }
}

export default async function SeriesPage({ params }: { params: Promise<Params> }) {
  const { tab: tabSlug, category: categorySlug, series: slug } = await params
  const series = await getSeries(tabSlug, categorySlug, slug)
  if (!series) notFound()
  const settings = await getSiteSettings()

  const { tab, category, versions } = series
  const related = getRelatedSeries(series)

  return (
    <main className="min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: tab.name, path: tab.href },
          { name: category.name, path: category.href },
          { name: series.title, path: series.href },
        ])}
      />
      <SiteHeader />

      <VersionProvider labels={versions.map((v) => v.label)} anchors={versions.map((v) => v.anchor)}>
        <section className="pt-32 pb-24 md:pt-36">
          <div className="container mx-auto px-6 md:px-12">
            <Breadcrumbs
              items={[
                { name: "Products", href: "/products" },
                { name: tab.name, href: tab.href },
                { name: category.name, href: category.href },
                { name: series.name },
              ]}
            />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Gallery */}
              <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
                {versions.map((version, i) => (
                  <VersionPanel key={version.key} index={i}>
                    <ProductGallery
                      images={version.images}
                      thumbs={version.thumbs}
                      photos={version.galleryPhotos}
                      alt={version.label ? `${series.title} — ${version.label}` : series.title}
                    />
                  </VersionPanel>
                ))}
              </div>

              {/* Details */}
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
                  {tab.name} · {category.name}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight mb-6">
                  {series.title}
                </h1>

                <VersionSwitch />

                {versions.map((version, i) => {
                  const links = enquiryLinks(series.title, version, settings)
                  const single = version.variants.length === 1 ? version.variants[0] : null
                  return (
                    <VersionPanel key={version.key} index={i}>
                      <p className="text-xl text-muted-foreground mb-8">{version.subtitle}</p>
                      <p className="text-lg leading-relaxed text-foreground/80 mb-10">{version.description}</p>

                      {version.summary.length > 0 && (
                        <dl className="grid sm:grid-cols-2 gap-px bg-border border border-border rounded-2xl overflow-hidden mb-10">
                          {version.summary.map((row) => (
                            <div
                              key={row.label}
                              className="bg-background p-5 sm:[&:last-child:nth-child(odd)]:col-span-2"
                            >
                              <dt className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                                {row.label}
                              </dt>
                              <dd className="font-medium">{row.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3 mb-12">
                        <a
                          href={links.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-4 text-sm tracking-wide rounded-full hover:bg-foreground/90 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Enquire on WhatsApp
                        </a>
                        <a
                          href={links.email}
                          className="inline-flex items-center justify-center gap-2 border border-foreground/20 px-7 py-4 text-sm tracking-wide rounded-full hover:bg-foreground hover:text-background transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Email for a quote
                        </a>
                      </div>

                      {version.features.length > 0 && (
                        <div className="mb-12">
                          <h2 className="text-xl font-medium mb-5">Key features</h2>
                          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                            {version.features.map((feature) => (
                              <li key={feature} className="flex gap-3 text-foreground/80">
                                <Check className="w-4 h-4 mt-1 shrink-0 text-orange-400" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {single && version.variantFields.length > 0 && (
                        <div>
                          <h2 className="text-xl font-medium mb-5">Specifications</h2>
                          <dl className="border-t border-border">
                            <div className="flex justify-between gap-6 py-3 border-b border-border">
                              <dt className="text-muted-foreground">Model No.</dt>
                              <dd className="text-right font-medium">{single.model}</dd>
                            </div>
                            {version.variantFields.map((field) => (
                              <div key={field} className="flex justify-between gap-6 py-3 border-b border-border">
                                <dt className="text-muted-foreground">{field}</dt>
                                <dd className="text-right">{single.values[field]}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </VersionPanel>
                  )
                })}
              </div>
            </div>

            {/* Multi-model comparison table */}
            {versions.map((version, i) =>
              version.variants.length > 1 ? (
                <VersionPanel key={version.key} index={i}>
                  <div className="mt-24">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">Specifications</h2>
                    <p className="text-muted-foreground mb-8">
                      Available in {version.variants.length} models. Scroll sideways on smaller screens to compare.
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-secondary/60">
                            <th
                              scope="col"
                              className="sticky left-0 z-10 bg-secondary text-left font-medium px-5 py-4 min-w-[160px]"
                            >
                              Model No.
                            </th>
                            {version.variants.map((v, j) => (
                              <th key={j} scope="col" className="text-left font-medium px-5 py-4 whitespace-nowrap">
                                {v.model}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {version.variantFields.map((field) => (
                            <tr key={field} className="border-t border-border">
                              <th
                                scope="row"
                                className="sticky left-0 z-10 bg-white text-left font-normal text-muted-foreground px-5 py-3.5"
                              >
                                {field}
                              </th>
                              {version.variants.map((v, j) => (
                                <td key={j} className="px-5 py-3.5 whitespace-nowrap">
                                  {v.values[field] || "—"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </VersionPanel>
              ) : null,
            )}
          </div>
        </section>
      </VersionProvider>

      {related.length > 0 && (
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">You may also like</p>
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Related products</h2>
              </div>
              <Link
                href={category.href}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                View all {category.name}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((s) => (
                <ProductCard
                  key={s.href}
                  item={{
                    href: s.href,
                    name: s.title,
                    subtitle: seriesSubtitle(s),
                    tag: s.category.name,
                    image: s.image,
                    photo: s.photo,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
