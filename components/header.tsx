"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { MenuTab } from "@/lib/catalog"


/** Small spaced capitals, soft white that brightens on hover; the current page gets a small dot underneath. */
function navLinkClass(active: boolean, open = false) {
  return cn(
    "relative inline-flex items-center gap-1.5 py-2 text-[12px] font-medium uppercase tracking-[0.22em] transition-colors duration-300 hover:text-white",
    "after:absolute after:left-1/2 after:-bottom-1 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-white after:transition-opacity after:duration-300",
    active ? "text-white after:opacity-100" : cn(open ? "text-white" : "text-white/65", "after:opacity-0"),
  )
}

/** A row in the phone menu */
function mobileRowClass(active: boolean) {
  return cn(
    "flex items-center justify-between py-4 text-[1.6rem] leading-none font-light transition-colors outline-none focus-visible:text-white",
    active ? "text-white" : "text-white/75",
  )
}

export function Header({
  menu,
  wechatUrl,
  instagramUrl,
}: {
  menu: MenuTab[]
  wechatUrl: string
  instagramUrl: string
}) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const productsActive = pathname.startsWith("/products")

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  // Phone menu: which range (Indoor / Outdoor) is showing its categories
  const [mobileTab, setMobileTab] = useState(0)
  const activeMobileTab = menu[mobileTab] ?? menu[0]
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close menus on navigation; the phone menu starts on the range the visitor is already in
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaOpen(false)
    const current = menu.findIndex((tab) => pathname.startsWith(tab.href))
    if (current >= 0) setMobileTab(current)
  }, [pathname, menu])

  // While the phone menu is open, the page behind it should not scroll
  useEffect(() => {
    if (!mobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMegaOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [megaOpen])

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150)
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  // On the homepage, "Home" and the logo scroll smoothly to the top instead of reloading
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return
    e.preventDefault()
    closeMobileMenu()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Every page (including the homepage, whose hero is now a framed video on the light background)
  // uses the solid floating bar, so the white menu text is always readable.
  return (
    <header className="fixed z-50 top-4 left-4 right-4 rounded-2xl bg-primary backdrop-blur-md py-4">
      <nav className="container mx-auto px-6 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:px-[24]">
        <Link href="/" className="flex items-center gap-2 group justify-self-start" onClick={handleHomeClick}>
          <Image
            src="/images/rigo-logo-white.png"
            alt="RIGO Lighting"
            width={408}
            height={244}
            className="w-auto h-10"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center justify-center gap-12">
          <li>
            <Link href="/" onClick={handleHomeClick} className={navLinkClass(isHome)}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/#about" className={navLinkClass(false)}>
              About Us
            </Link>
          </li>
          <li className="relative" onMouseEnter={openMega} onMouseLeave={scheduleCloseMega}>
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-controls="products-menu"
              onClick={() => (megaOpen ? setMegaOpen(false) : openMega())}
              className={navLinkClass(productsActive, megaOpen)}
            >
              Products
              <ChevronDown
                className={cn("w-3 h-3 opacity-70 transition-transform duration-300", megaOpen && "rotate-180")}
                strokeWidth={2}
              />
            </button>

            {/* Products dropdown: Indoor / Outdoor; pointing at one opens its categories beside it */}
            <div
              id="products-menu"
              className={cn(
                "absolute left-1/2 top-full -translate-x-1/2 pt-6 w-52 transition-all duration-300",
                megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none",
              )}
            >
              <ul className="bg-primary rounded-xl border border-white/10 shadow-xl py-3 text-[12px] font-medium uppercase tracking-[0.18em]">
                {menu.map((tab) => (
                  <li key={tab.href} className="group/tab relative">
                    <Link
                      href={tab.href}
                      aria-current={pathname === tab.href ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between gap-3 px-6 py-2.5 transition-colors duration-300 hover:text-white group-hover/tab:text-white group-focus-within/tab:text-white",
                        pathname.startsWith(tab.href) ? "text-white" : "text-white/65",
                      )}
                    >
                      {tab.name}
                      <ChevronRight className="w-3 h-3 opacity-60" strokeWidth={2} />
                    </Link>

                    {tab.categories.length > 0 && (
                      <div className="absolute left-full -top-3 pl-2 invisible opacity-0 -translate-x-1 transition-all duration-200 group-hover/tab:visible group-hover/tab:opacity-100 group-hover/tab:translate-x-0 group-focus-within/tab:visible group-focus-within/tab:opacity-100 group-focus-within/tab:translate-x-0">
                        <ul className="w-60 bg-primary rounded-xl border border-white/10 shadow-xl py-3">
                          {tab.categories.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                aria-current={pathname === c.href ? "page" : undefined}
                                className={cn(
                                  "block px-6 py-2.5 transition-colors duration-300 hover:text-white",
                                  pathname.startsWith(c.href) ? "text-white" : "text-white/65",
                                )}
                              >
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/#contact" className={navLinkClass(false)}>
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3 justify-self-end">
          <a
            href={wechatUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with RIGO on WeChat"
            title="WeChat"
            className="rounded-full transition-transform duration-200 hover:scale-110"
          >
            <Image src="/images/wechat.png" alt="" width={32} height={32} aria-hidden="true" className="w-7 h-7 md:w-8 md:h-8" />
          </a>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow RIGO on Instagram"
            title="Instagram"
            className="rounded-lg transition-transform duration-200 hover:scale-110"
          >
            <Image src="/images/instagram.png" alt="" width={32} height={32} aria-hidden="true" className="w-7 h-7 md:w-8 md:h-8" />
          </a>

          <button
            className="md:hidden z-50 w-7 h-7 flex items-center justify-center transition-colors duration-300 text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {/* 20px glyph centred in a 28px tap area, so it lines up with the social icons without outweighing them */}
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="20" y1="4" x2="4" y2="20" />
                <line x1="4" y1="4" x2="20" y2="20" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="7" x2="22" y2="7" />
                <line x1="2" y1="17" x2="22" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu: tidy rows; Products opens to an Indoor / Outdoor switch with that tab's categories */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out [scrollbar-width:none]",
          mobileMenuOpen
            ? "max-h-[calc(100dvh-7rem)] overflow-y-auto opacity-100 mt-5"
            : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div className="px-6 pb-3">
          <ul className="border-t border-white/10 text-white">
            <li className="border-b border-white/10">
              <Link href="/" onClick={handleHomeClick} className={mobileRowClass(isHome)}>
                Home
              </Link>
            </li>
            <li className="border-b border-white/10">
              <Link href="/#about" onClick={closeMobileMenu} className={mobileRowClass(false)}>
                About Us
              </Link>
            </li>
            <li className="border-b border-white/10">
              <button
                type="button"
                aria-expanded={mobileProductsOpen}
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={cn(mobileRowClass(productsActive || mobileProductsOpen), "w-full")}
              >
                Products
                <ChevronDown
                  className={cn("w-5 h-5 opacity-70 transition-transform duration-300", mobileProductsOpen && "rotate-180")}
                  strokeWidth={1.5}
                />
              </button>

              {mobileProductsOpen && activeMobileTab && (
                <div className="pb-5">
                  {/* Indoor | Outdoor switch */}
                  <div role="tablist" aria-label="Product range" className="flex gap-1 rounded-full bg-white/[0.06] p-1">
                    {menu.map((tab, i) => (
                      <button
                        key={tab.href}
                        type="button"
                        role="tab"
                        aria-selected={i === mobileTab}
                        onClick={() => setMobileTab(i)}
                        className={cn(
                          "flex-1 rounded-full py-2 text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                          i === mobileTab ? "bg-white text-black" : "text-white/65",
                        )}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {activeMobileTab.categories.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "flex h-full items-center rounded-xl border px-3.5 py-3 text-[15px] leading-tight transition-colors",
                            pathname.startsWith(c.href)
                              ? "border-white/40 bg-white/[0.08] text-white"
                              : "border-white/10 text-white/75",
                          )}
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={activeMobileTab.href}
                    onClick={closeMobileMenu}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-white/60"
                  >
                    View all {activeMobileTab.name.toLowerCase()}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </li>
            <li>
              <Link href="/#contact" onClick={closeMobileMenu} className={mobileRowClass(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
