import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { getCatalog } from "@/lib/catalog"
import { imageSrc } from "@/lib/products"

/** Homepage "Shop by category": every category from the catalogue, grouped by Indoor / Outdoor. */
export async function ShopByCategory() {
  const catalog = await getCatalog()
  return (
    <section id="range" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Our Range</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Shop by category</h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            View all products
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="space-y-16">
          {catalog.map((tab) => (
            <div key={tab.slug}>
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <h3 className="text-xs tracking-[0.3em] uppercase text-muted-foreground">{tab.name}</h3>
                <Link
                  href={tab.href}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  All {tab.name.toLowerCase()}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                {tab.categories.map((category) => (
                  <Link key={category.href} href={category.href} className="group block">
                    <div className="relative aspect-[4/3] mb-4 bg-white rounded-2xl border border-border/60 overflow-hidden">
                      <img
                        src={imageSrc(category.image)}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-contain p-5 sm:p-8 transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-medium mb-0.5 group-hover:underline underline-offset-4">
                          {category.name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {category.series.length} series
                        </p>
                      </div>
                      <ArrowUpRight className="hidden sm:block w-5 h-5 shrink-0 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
