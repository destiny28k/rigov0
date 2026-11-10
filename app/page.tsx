import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Philosophy } from "@/components/philosophy"
import { Projects, type FeaturedItem } from "@/components/projects"
import { getSeries } from "@/lib/catalog"
import { Expertise } from "@/components/expertise"
import { FAQ } from "@/components/faq"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

// Hand-picked for the homepage; links and categories come from the catalogue so they stay in sync.
const FEATURED = [
  { path: ["indoor", "cob-light", "alpha"], detail: "Recessed COB downlight", image: "/images/products/alpha.png" },
  { path: ["indoor", "cob-light", "fusion"], detail: "Sculpted curved COB light", image: "/images/products/fusion.png" },
  { path: ["indoor", "cob-premium-light", "foria-pro"], detail: "Professional-grade COB", image: "/images/products/foria-pro.png" },
  { path: ["indoor", "cob-cyd", "luna"], detail: "Movable COB cylinder light", image: "/images/products/luna.png" },
  { path: ["indoor", "downlight", "platina"], detail: "16W / 24W / 32W downlight", image: "/images/products/platina.png" },
  { path: ["indoor", "panel-light", "rainbow"], detail: "Dual-colour LED panel", image: "/images/products/rainbow.png" },
] as const

const featured: FeaturedItem[] = FEATURED.map(({ path, detail, image }) => {
  const [tab, category, slug] = path
  const series = getSeries(tab, category, slug)
  if (!series) throw new Error(`Featured product not found in catalogue: ${path.join("/")}`)
  return { href: series.href, title: series.title, detail, category: series.category.name, image }
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <Hero />
      <About />
      <Philosophy />
      <Projects items={featured} />
      <Expertise />
      <FAQ />
      <CallToAction />
      <Footer />
    </main>
  )
}
