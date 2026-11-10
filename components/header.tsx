"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import type { MenuTab } from "@/lib/catalog"

const WECHAT_URL = "https://u.wechat.com/kP_PkMqInEFhHvN6A0ipJ-A?s=4"
const INSTAGRAM_URL = "https://instagram.com/rigolighting"

const linkClass =
  "hover:text-[rgb(251,146,60)] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px hover:after:w-full after:bg-[rgb(251,146,60)] after:transition-all after:duration-300"

export function Header({ menu }: { menu: MenuTab[] }) {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const productsActive = pathname.startsWith("/products")

  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
    setMegaOpen(false)
  }, [pathname])

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

  // Inner pages have a light background, so the header is always solid there
  const solid = scrolled || mobileMenuOpen || megaOpen || !isHome

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 my-0 py-0 rounded-none",
        solid
          ? "bg-primary backdrop-blur-md py-4 top-4 left-4 right-4 rounded-2xl"
          : "bg-transparent py-4 top-0 left-0 right-0",
      )}
    >
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

        <ul className="hidden md:flex items-center justify-center gap-10 text-sm tracking-wide">
          <li>
            <Link href="/" onClick={handleHomeClick} className={cn(linkClass, "text-white after:w-0")}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/#about" className={cn(linkClass, "text-white after:w-0")}>
              About Us
            </Link>
          </li>
          <li className="relative" onMouseEnter={openMega} onMouseLeave={scheduleCloseMega}>
            <button
              type="button"
              aria-expanded={megaOpen}
              aria-controls="products-menu"
              onClick={() => (megaOpen ? setMegaOpen(false) : openMega())}
              className={cn(
                linkClass,
                "inline-flex items-center gap-1",
                productsActive || megaOpen ? "text-[rgb(251,146,60)] after:w-full" : "text-white after:w-0",
              )}
            >
              Products
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", megaOpen && "rotate-180")} />
            </button>

            {/* Products dropdown: Indoor / Outdoor only; categories and series live on those pages */}
            <div
              id="products-menu"
              className={cn(
                "absolute left-1/2 top-full -translate-x-1/2 pt-6 w-44 transition-all duration-300",
                megaOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none",
              )}
            >
              <ul className="bg-primary rounded-xl border border-white/10 shadow-xl py-2 text-sm tracking-wide">
                {[...menu, { name: "All Products", href: "/products" }].map((item, i) => {
                  const active = item.href === "/products" ? pathname === "/products" : pathname.startsWith(item.href)
                  return (
                    <li key={item.href} className={cn(i === menu.length && "mt-2 pt-2 border-t border-white/10")}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={cn(
                          "block px-5 py-2 transition-colors duration-300 hover:text-[rgb(251,146,60)]",
                          active ? "text-[rgb(251,146,60)]" : "text-white/80",
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </li>
          <li>
            <Link href="/#contact" className={cn(linkClass, "text-white after:w-0")}>
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3 justify-self-end">
          <a
            href={WECHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect with RIGO on WeChat"
            title="WeChat"
            className="rounded-full transition-transform duration-200 hover:scale-110"
          >
            <Image src="/images/wechat.png" alt="" width={32} height={32} aria-hidden="true" className="w-8 h-8" />
          </a>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow RIGO on Instagram"
            title="Instagram"
            className="rounded-lg transition-transform duration-200 hover:scale-110"
          >
            <Image src="/images/instagram.png" alt="" width={32} height={32} aria-hidden="true" className="w-8 h-8" />
          </a>

          <button
            className="md:hidden z-50 transition-colors duration-300 text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen
            ? "max-h-[calc(100dvh-7rem)] overflow-y-auto opacity-100 mt-8"
            : "max-h-0 overflow-hidden opacity-0",
        )}
      >
        <div className="container mx-auto px-6">
          <ul className="flex flex-col gap-6 mb-8 text-white">
            <li>
              <Link
                href="/"
                onClick={handleHomeClick}
                className="hover:text-[rgb(251,146,60)] transition-colors text-4xl font-light block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#about"
                onClick={closeMobileMenu}
                className="hover:text-[rgb(251,146,60)] transition-colors text-4xl font-light block"
              >
                About Us
              </Link>
            </li>
            <li>
              <button
                type="button"
                aria-expanded={mobileProductsOpen}
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className={cn(
                  "flex w-full items-center justify-between text-4xl font-light transition-colors",
                  productsActive ? "text-[rgb(251,146,60)]" : "hover:text-[rgb(251,146,60)]",
                )}
              >
                Products
                <ChevronDown
                  className={cn("w-7 h-7 transition-transform duration-300", mobileProductsOpen && "rotate-180")}
                  strokeWidth={1.25}
                />
              </button>

              {mobileProductsOpen && (
                <ul className="mt-5 space-y-3 border-l border-white/15 pl-5">
                  {[...menu, { name: "All Products", href: "/products" }].map((item) => {
                    const active = item.href === "/products" ? pathname === "/products" : pathname.startsWith(item.href)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            "block text-2xl font-light transition-colors hover:text-[rgb(251,146,60)]",
                            active ? "text-[rgb(251,146,60)]" : "text-white/80",
                          )}
                        >
                          {item.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/#contact"
                onClick={closeMobileMenu}
                className="hover:text-[rgb(251,146,60)] transition-colors text-4xl font-light block"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
