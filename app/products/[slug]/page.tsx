import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Mail, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { ProductGallery } from "@/components/product-gallery"
import { fieldLabel, getProduct, getRelatedProducts, imageSrc, products } from "@/lib/products"

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.name} — ${product.subtitle} | RIGO Lighting`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${product.subtitle}`,
      description: product.description,
      images: [imageSrc(product.image)],
    },
  }
}

const WHATSAPP_NUMBER = "918369051700"
const EMAIL = "customercarerigo1@gmail.com"

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const related = getRelatedProducts(product)
  const enquiry = `Hi! I'm interested in the ${product.title}. Can you share more details and pricing?`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiry)}`
  const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: ${product.title}`)}&body=${encodeURIComponent(enquiry)}`
  const listUrl = product.tab === "outdoor" ? "/products?tab=outdoor" : "/products"
  const categoryUrl = `${listUrl}${listUrl.includes("?") ? "&" : "?"}category=${encodeURIComponent(product.category)}`

  const single = product.variants.length === 1 ? product.variants[0] : null

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-36 pb-24 md:pt-44">
        <div className="container mx-auto px-6 md:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-10">
            <Link href={listUrl} className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              All products
            </Link>
            <span>/</span>
            <Link href={categoryUrl} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
              <ProductGallery images={product.images} alt={product.name} />
            </div>

            <div className="min-w-0">
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">
                {product.tab === "outdoor" ? "Outdoor" : "Indoor"} · {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">{product.subtitle}</p>
              <p className="text-lg leading-relaxed text-foreground/80 mb-10">{product.description}</p>

              {product.summary.length > 0 && (
                <dl className="grid sm:grid-cols-2 gap-px bg-border border border-border rounded-2xl overflow-hidden mb-10">
                  {product.summary.map((row) => (
                    <div
                      key={row.label}
                      className="bg-background p-5 sm:[&:last-child:nth-child(odd)]:col-span-2"
                    >
                      <dt className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">{row.label}</dt>
                      <dd className="font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-12">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-4 text-sm tracking-wide rounded-full hover:bg-foreground/90 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enquire on WhatsApp
                </a>
                <a
                  href={mailUrl}
                  className="inline-flex items-center justify-center gap-2 border border-foreground/20 px-7 py-4 text-sm tracking-wide rounded-full hover:bg-foreground hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email for a quote
                </a>
              </div>

              {product.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-xl font-medium mb-5">Key features</h2>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-foreground/80">
                        <Check className="w-4 h-4 mt-1 shrink-0 text-orange-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {single && product.variantFields.length > 0 && (
                <div>
                  <h2 className="text-xl font-medium mb-5">Specifications</h2>
                  <dl className="border-t border-border">
                    <div className="flex justify-between gap-6 py-3 border-b border-border">
                      <dt className="text-muted-foreground">Model No.</dt>
                      <dd className="text-right font-medium">{single.model}</dd>
                    </div>
                    {product.variantFields.map((field) => (
                      <div key={field} className="flex justify-between gap-6 py-3 border-b border-border">
                        <dt className="text-muted-foreground">{fieldLabel(field)}</dt>
                        <dd className="text-right">{single.values[field]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Multi-variant comparison table */}
          {!single && product.variants.length > 1 && (
            <div className="mt-24">
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">Specifications</h2>
              <p className="text-muted-foreground mb-8">
                Available in {product.variants.length} models. Scroll sideways on smaller screens to compare.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-border bg-white">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-secondary/60">
                      <th
                        scope="col"
                        className="sticky left-0 z-10 bg-secondary text-left font-medium px-5 py-4 min-w-[160px]"
                      >
                        Model No.
                      </th>
                      {product.variants.map((v, i) => (
                        <th key={i} scope="col" className="text-left font-medium px-5 py-4 whitespace-nowrap">
                          {v.model}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.variantFields.map((field) => (
                      <tr key={field} className="border-t border-border">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 bg-white text-left font-normal text-muted-foreground px-5 py-3.5"
                        >
                          {fieldLabel(field)}
                        </th>
                        {product.variants.map((v, i) => (
                          <td key={i} className="px-5 py-3.5 whitespace-nowrap">
                            {v.values[field] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4">You may also like</p>
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Related products</h2>
              </div>
              <Link
                href={listUrl}
                className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                View all {product.tab} products
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
