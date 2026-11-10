import Link from "next/link"
import { ChevronRight } from "lucide-react"

export type Crumb = { name: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-10">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.name + i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.name}
                </Link>
              ) : (
                <span className={last ? "text-foreground" : undefined} aria-current={last ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!last && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
