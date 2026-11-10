import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HighlightedText } from "@/components/highlighted-text"
import { ProductBrowser, type BrowserProduct } from "@/components/product-browser"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

export const metadata: Metadata = {
  title: "All Products — RIGO Lighting",
  description:
    "Browse RIGO's full range of indoor and outdoor LED lighting: panel lights, COB downlights, cylinder and track lights, flood lights, street lights and high-bay lights.",
}

export default function ProductsPage() {
  const browserProducts: BrowserProduct[] = products.map(
    ({ slug, name, subtitle, title, description, category, tab, image }) => ({
      slug,
      name,
      subtitle,
      title,
      description,
      category,
      tab,
      image,
    }),
  )

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-40 pb-32 md:pt-48">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-16">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Our Collection</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-balance">
              All <HighlightedText>products</HighlightedText>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Energy-efficient LED lighting for every space — from homes and offices to streets, warehouses and
              stadiums.
            </p>
          </div>

          {/* The fallback is server-rendered so the catalogue is visible before JS loads (and to search engines). */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pt-36">
                {browserProducts
                  .filter((p) => p.tab === "indoor")
                  .map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
              </div>
            }
          >
            <ProductBrowser products={browserProducts} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  )
}
