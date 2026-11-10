"use client"

import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard } from "./product-card"
import type { Product, ProductTab } from "@/lib/products"

export type BrowserProduct = Pick<
  Product,
  "slug" | "name" | "subtitle" | "title" | "description" | "category" | "tab" | "image"
>

const TABS: { value: ProductTab; label: string }[] = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
]

export function ProductBrowser({ products }: { products: BrowserProduct[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab: ProductTab = searchParams.get("tab") === "outdoor" ? "outdoor" : "indoor"
  const category = searchParams.get("category") ?? "All"
  const query = searchParams.get("q") ?? ""

  const updateParams = (changes: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === "") params.delete(key)
      else params.set(key, value)
    }
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const tabProducts = useMemo(() => products.filter((p) => p.tab === tab), [products, tab])
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tabProducts.map((p) => p.category)))],
    [tabProducts],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tabProducts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [tabProducts, category, query])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="inline-flex p-1 rounded-full bg-secondary self-start">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => updateParams({ tab: t.value === "indoor" ? null : t.value, category: null })}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300",
                tab === t.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="ml-2 opacity-60">{products.filter((p) => p.tab === t.value).length}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => updateParams({ q: e.target.value })}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full pl-11 pr-10 py-3 rounded-full bg-white border border-border text-sm focus:outline-none focus:border-foreground/40 transition-colors"
          />
          {query && (
            <button
              onClick={() => updateParams({ q: null })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => updateParams({ category: c === "All" ? null : c })}
            className={cn(
              "px-4 py-2 rounded-full text-sm border transition-all duration-300",
              category === c
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        Showing {filtered.length} of {tabProducts.length} {tab} products
      </p>

      {filtered.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-border rounded-2xl">
          <p className="text-xl font-medium mb-2">No products found</p>
          <p className="text-muted-foreground mb-6">Try a different search or category.</p>
          <button
            onClick={() => updateParams({ q: null, category: null })}
            className="text-sm underline underline-offset-4 hover:text-foreground/70"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
