import { ArrowRight } from "lucide-react"
import { SpotlightCard } from "./spotlight-card"

/** Get in Touch — dark band with the same light effects as Why RIGO. */
export function CallToAction() {
  return (
    <section id="contact" className="relative overflow-hidden bg-foreground text-primary-foreground scroll-mt-24">
      {/* Light effect: a slim "fixture" line at the top casting a soft warm glow over the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-64 md:w-96 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(1000px,140vw)] -translate-x-1/2"
        style={{
          background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255, 238, 210, 0.16), transparent 75%)",
        }}
      />

      {/* The whole band: a soft light follows the cursor */}
      <SpotlightCard radius={520} strength={0.08} contentClassName="py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-white/50 text-xs tracking-[0.3em] uppercase mb-6">Get in Touch</p>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-6 text-balance">
              Ready to light up your space?
            </h2>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              Tell us about your project and we&apos;ll help you pick the right lighting — for one room or an entire
              building.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918369051700"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center justify-center gap-3 bg-white text-foreground px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,238,210,0.45)]"
              >
                Chat on WhatsApp
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </a>
              <a
                href="mailto:customercarerigo1@gmail.com"
                className="inline-flex items-center justify-center gap-2 border border-white/25 px-8 py-4 text-sm tracking-wide transition-all duration-500 hover:border-white/60 hover:bg-white/[0.05] hover:shadow-[0_0_32px_rgba(255,238,210,0.2)]"
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </section>
  )
}
