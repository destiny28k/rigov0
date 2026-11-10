import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { HighlightedText } from "@/components/highlighted-text"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryGrid } from "@/components/category-grid"
import { catalog, getTab } from "@/lib/catalog"

type Params = { tab: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return catalog.map((t) => ({ tab: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const tab = getTab((await params).tab)
  if (!tab) return {}
  return {
    title: `${tab.name} Lighting — RIGO Lighting`,
    description: tab.description,
  }
}

export default async function TabPage({ params }: { params: Promise<Params> }) {
  const tab = getTab((await params).tab)
  if (!tab) notFound()
  const other = catalog.find((t) => t.slug !== tab.slug)

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-32 md:pt-44">
        <div className="container mx-auto px-6 md:px-12">
          <Breadcrumbs items={[{ name: "Products", href: "/products" }, { name: tab.name }]} />

          <div className="max-w-3xl mb-16">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Products</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-balance">
              {tab.name} <HighlightedText>lighting</HighlightedText>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{tab.description}</p>
          </div>

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
