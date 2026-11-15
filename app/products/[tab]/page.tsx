import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { CategoryGrid } from "@/components/category-grid"
import { CatalogHero } from "@/components/catalog-hero"
import { getCatalog, getTab } from "@/lib/catalog"
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo"
import { JsonLd } from "@/components/json-ld"

type Params = { tab: string }

export async function generateStaticParams(): Promise<Params[]> {
  return (await getCatalog()).map((t) => ({ tab: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const tab = await getTab((await params).tab)
  if (!tab) return {}
  return pageMetadata({ title: `${tab.name} LED Lighting`, description: tab.description, path: tab.href })
}

export default async function TabPage({ params }: { params: Promise<Params> }) {
  const tab = await getTab((await params).tab)
  if (!tab) notFound()
  const other = (await getCatalog()).find((t) => t.slug !== tab.slug)

  return (
    <main className="min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: tab.name, path: tab.href },
        ])}
      />
      <SiteHeader />

      <CatalogHero
        crumbs={[{ name: "Products", href: "/products" }, { name: tab.name }]}
        eyebrow="Products"
        title={`${tab.name} lighting`}
        description={tab.description}
        stats={[
          { value: tab.categories.length, label: "Categories" },
          { value: tab.categories.reduce((n, c) => n + c.series.length, 0), label: "Series" },
        ]}
        image={tab.categories[0]?.image}
        photo={tab.categories[0]?.photo}
        linksLabel={`${tab.name} categories`}
        links={tab.categories.map((c) => ({ name: c.name, href: c.href }))}
      />

      <section className="pt-12 pb-32 md:pt-16">
        <div className="container mx-auto px-6 md:px-12">

          <CategoryGrid categories={tab.categories} />

          {other && (
            <div className="mt-24 pt-10 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-muted-foreground">Looking for {other.name.toLowerCase()} lighting?</p>
              <Link
                href={other.href}
                className="inline-flex items-center gap-2 text-sm hover:text-[rgb(251,146,60)] transition-colors"
              >
                Explore {other.name.toLowerCase()} products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
