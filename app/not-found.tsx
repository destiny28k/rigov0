import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Footer } from "@/components/footer"
import { getCatalog } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

/** Branded 404: same dark band and warm light effect as Why RIGO / Get in Touch. */
export default async function NotFound() {
  const catalog = await getCatalog()
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Light effect: a slim "fixture" line casting a soft warm glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-px w-64 md:w-96 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[min(1000px,140vw)] -translate-x-1/2"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255, 238, 210, 0.16), transparent 75%)",
          }}
        />

        <div className="relative container mx-auto px-6 md:px-12 pt-44 pb-28 md:pt-52 md:pb-36 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">Error 404</p>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight">This light is off</h1>
          <p className="mt-6 text-lg text-white/60 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="group/btn inline-flex items-center justify-center gap-3 bg-white text-foreground px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,238,210,0.45)]"
            >
              Back to home
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 border border-white/25 px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:border-white/60 hover:bg-white/[0.05] hover:shadow-[0_0_32px_rgba(255,238,210,0.2)]"
            >
              View all products
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <span className="text-white/40">Or browse:</span>
            {catalog.map((tab) => (
              <Link key={tab.href} href={tab.href} className="text-white/70 hover:text-white transition-colors">
                {tab.name} lighting
              </Link>
            ))}
            <Link href="/#contact" className="text-white/70 hover:text-white transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
