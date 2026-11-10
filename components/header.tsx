"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"

const WECHAT_URL = "https://u.wechat.com/kP_PkMqInEFhHvN6A0ipJ-A?s=4"
const INSTAGRAM_URL = "https://instagram.com/rigolighting"

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/products" },
  { label: "Contact", href: "/#contact" },
]

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  // On the homepage, "Home" and the logo scroll smoothly to the top instead of reloading
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return
    e.preventDefault()
    closeMobileMenu()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isActive = (href: string) => {
    if (href === "/products") return pathname.startsWith("/products")
    return false
  }

  // Inner pages have a light background, so the header is always solid there
  const solid = scrolled || mobileMenuOpen || !isHome

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
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={item.href === "/" ? handleHomeClick : undefined}
                className={cn(
                  "hover:text-[rgb(251,146,60)] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px hover:after:w-full after:bg-[rgb(251,146,60)] after:transition-all after:duration-300",
                  isActive(item.href) ? "text-[rgb(251,146,60)] after:w-full" : "text-white after:w-0",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
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

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[600px] opacity-100 mt-8" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-6">
          <ul className="flex flex-col gap-6 mb-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-[rgb(251,146,60)] transition-colors duration-300 text-4xl font-light block",
                    isActive(item.href) ? "text-[rgb(251,146,60)]" : "text-white",
                  )}
                  onClick={item.href === "/" ? handleHomeClick : closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
