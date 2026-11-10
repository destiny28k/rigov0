import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { imageSrc, type Product } from "@/lib/products"

type CardProduct = Pick<Product, "slug" | "name" | "subtitle" | "category" | "image">

export function ProductCard({ product }: { product: CardProduct }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden aspect-square mb-5 bg-white rounded-2xl border border-border/60">
        <img
          src={imageSrc(product.image)}
          alt={`${product.name} — ${product.subtitle}`}
          loading="lazy"
          className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 text-[11px] tracking-[0.15em] uppercase text-muted-foreground bg-background/80 backdrop-blur px-2.5 py-1 rounded-full">
          {product.category}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-medium mb-1 group-hover:underline underline-offset-4">{product.name}</h3>
          <p className="text-muted-foreground text-sm truncate">{product.subtitle}</p>
        </div>
        <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground transition-all group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  )
}
