import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { CategoryGrid } from "@/components/category-grid"
import { CatalogHero } from "@/components/catalog-hero"
import { getCatalog } from "@/lib/catalog"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "All Products",
  description:
    "Browse RIGO's indoor and outdoor LED lighting: panel lights, downlights, COB, cylinder, track and linear spot lights, flood, stadium, street and high-bay lights.",
  path: "/products",
})

export default async function ProductsPage() {
  const catalog = await getCatalog()
  const allCategories = catalog.flatMap((tab) => tab.categories)
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <CatalogHero
        crumbs={[{ name: "Home", href: "/" }, { name: "Products" }]}
        eyebrow="Our Collection"
        title="All products"
        description="Energy-efficient LED lighting for every space — from homes and offices to streets, warehouses and stadiums."
        stats={[
          { value: allCategories.length, label: "Categories" },
          { value: allCategories.reduce((n, c) => n + c.series.length, 0), label: "Series" },
        ]}
        image={allCategories[0]?.image}
        photo={allCategories[0]?.photo}
        linksLabel="Product ranges"
        links={catalog.map((tab) => ({ name: `${tab.name} lighting`, href: `#${tab.slug}` }))}
      />

      <section className="pt-12 pb-32 md:pt-16">
        <div className="container mx-auto px-6 md:px-12">

          <div className="space-y-24 pt-4">
            {catalog.map((tab) => (
              <section key={tab.slug} id={tab.slug} aria-labelledby={`${tab.slug}-heading`} className="scroll-mt-32">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 pb-6 border-b border-border">
                  <div>
                    <h2 id={`${tab.slug}-heading`} className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
                      {tab.name} lighting
                    </h2>
                    <p className="text-muted-foreground max-w-xl">{tab.description}</p>
                  </div>
                  <Link
                    href={tab.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  >
                    View {tab.name.toLowerCase()} range
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <CategoryGrid categories={tab.categories} />
              </section>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
