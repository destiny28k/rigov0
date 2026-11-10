import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { catalog, getCategory, seriesSubtitle } from "@/lib/catalog"
import { cn } from "@/lib/utils"

type Params = { tab: string; category: string }

export const dynamicParams = false

export function generateStaticParams(): Params[] {
  return catalog.flatMap((t) => t.categories.map((c) => ({ tab: t.slug, category: c.slug })))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tab, category: slug } = await params
  const category = getCategory(tab, slug)
  if (!category) return {}
  return {
    title: `${category.name} — ${category.tab.name} Lighting | RIGO Lighting`,
    description: `${category.description} Series: ${category.series.map((s) => s.name).join(", ")}.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { tab: tabSlug, category: slug } = await params
  const category = getCategory(tabSlug, slug)
  if (!category) notFound()
  const { tab } = category

  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-24 md:pt-44">
        <div className="container mx-auto px-6 md:px-12">
          <Breadcrumbs
            items={[
              { name: "Products", href: "/products" },
              { name: tab.name, href: tab.href },
              { name: category.name },
            ]}
          />

          <div className="max-w-3xl mb-12">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">{tab.name} lighting</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-balance">
              {category.name}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{category.description}</p>
          </div>

          {/* Series jump bar — mirrors the "All / Series…" lists in the framework */}
          <nav aria-label={`${category.name} series`} className="flex flex-wrap gap-2 mb-14">
            <span className="px-4 py-2 rounded-full text-sm border bg-foreground text-background border-foreground">
              All
            </span>
            {category.series.map((series) => (
              <Link
                key={series.href}
                href={series.href}
                className="px-4 py-2 rounded-full text-sm border border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-all duration-300"
              >
                {series.name}
              </Link>
            ))}
          </nav>

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
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other categories in this tab */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6 md:px-12">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">More {tab.name.toLowerCase()} lighting</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {tab.categories.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  aria-current={c.slug === category.slug ? "page" : undefined}
                  className={cn(
                    "text-xl md:text-2xl font-medium tracking-tight transition-colors",
                    c.slug === category.slug
                      ? "text-foreground underline underline-offset-8 decoration-[rgb(251,146,60)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  )
}
