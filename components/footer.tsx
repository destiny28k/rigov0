import Link from "next/link"
import Image from "next/image"
import { getSiteSettings } from "@/lib/content"

export async function Footer() {
  const settings = await getSiteSettings()
  return (
    <footer className="pt-10 pb-8 md:pt-20 border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-10 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4 md:mb-6">
              <Image src="/images/rigo-logo.png" alt="RIGO Lighting" width={408} height={244} className="w-auto h-12 md:h-14" />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              Premium LED lighting that elevates every space. Energy-efficient panels, COB lights and more — built to
              last.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4">Explore</h4>
            {/* Two columns on phones so the short links don't leave the right half empty */}
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#range" className="hover:text-foreground transition-colors">
                  Our Range
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-4">Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              {settings.emails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="hover:text-foreground transition-colors break-all">
                    {email}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 md:pt-8 border-t border-border flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs md:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RIGO Lighting. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
