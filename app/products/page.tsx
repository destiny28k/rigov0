import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { HighlightedText } from "@/components/highlighted-text"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryGrid } from "@/components/category-grid"
import { catalog } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Products — RIGO Lighting",
  description:
    "Browse RIGO's indoor and outdoor LED lighting: panel lights, downlights, COB, cylinder, track and linear spot lights, flood, stadium, street and high-bay lights.",
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-32 md:pt-44">
        <div className="container mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Products" }]} />

          <div className="max-w-3xl mb-20">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Our Collection</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-balance">
              All <HighlightedText>products</HighlightedText>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Energy-efficient LED lighting for every space — from homes and offices to streets, warehouses and
              stadiums. Choose a category to explore its series.
            </p>
          </div>

          <div className="space-y-28">
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
