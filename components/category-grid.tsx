import { ProductCard } from "./product-card"
import type { Category } from "@/lib/catalog"

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
      {categories.map((category) => (
        <ProductCard
          key={category.href}
          item={{
            href: category.href,
            name: category.name,
            subtitle: category.series.map((s) => s.name).join(" · "),
            tag: `${category.series.length} series`,
            image: category.image,
            photo: category.photo,
          }}
        />
      ))}
    </div>
  )
}
