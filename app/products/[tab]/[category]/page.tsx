import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CategoryExplorer } from "@/components/category-explorer"
import { CatalogHero } from "@/components/catalog-hero"
import { getCatalog, getCategory, seriesSubtitle } from "@/lib/catalog"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

type Params = { tab: string; category: string }

export async function generateStaticParams(): Promise<Params[]> {
  return (await getCatalog()).flatMap((t) => t.categories.map((c) => ({ tab: t.slug, category: c.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tab, category: slug } = await params
  const category = await getCategory(tab, slug)
  if (!category) return {}
  return pageMetadata({
    title: `${category.name} — ${category.tab.name} LED Lighting`,
    description: `${category.description} Series: ${category.series.map((s) => s.name).join(", ")}.`,
    path: category.href,
    image: category.image,
  })
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { tab: tabSlug, category: slug } = await params
  const category = await getCategory(tabSlug, slug)
  if (!category) notFound()
  const { tab } = category
  const modelCount = category.series.reduce(
    (total, series) => total + series.versions.reduce((n, version) => n + version.variants.length, 0),
    0,
  )

  return (
    <main className="min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: tab.name, path: tab.href },
          { name: category.name, path: category.href },
        ])}
      />
      <SiteHeader />

      <CatalogHero
        crumbs={[{ name: "Products", href: "/products" }, { name: tab.name, href: tab.href }, { name: category.name }]}
        eyebrow={`${tab.name} lighting`}
        title={category.name}
        description={category.description}
        stats={[
          { value: category.series.length, label: "Series" },
          { value: modelCount, label: "Models" },
        ]}
        image={category.image}
        photo={category.photo}
        linksLabel={`${category.name} series`}
        links={category.series.map((series) => ({ name: series.name, href: series.href }))}
      />

      <section className="pt-12 pb-24 md:pt-16">
        <div className="container mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {category.series.map((series, i) => (
              <ProductCard
                key={series.href}
                priority={i < 4}
                item={{
                  href: series.href,
                  name: series.title,
                  subtitle: seriesSubtitle(series),
                  tag: series.versions.length > 1 ? `${series.versions.length} versions` : undefined,
                  image: series.image,
                  photo: series.photo,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other categories in this tab: dark index list with a photo panel that follows the pointer */}
      <CategoryExplorer
        label={`More ${tab.name.toLowerCase()} lighting`}
        viewAllHref={tab.href}
        viewAllLabel={`View all ${tab.name.toLowerCase()}`}
        items={tab.categories
          .filter((c) => c.slug !== category.slug)
          .map((c) => ({ href: c.href, name: c.name, count: c.series.length, image: c.image, photo: c.photo }))}
      />


      <Footer />
    </main>
  )
}
