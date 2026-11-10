import type React from "react"
import { SiteHeader } from "./site-header"
import { Footer } from "./footer"
import { Breadcrumbs } from "./breadcrumbs"

export const CONTACT_EMAILS = ["customercarerigo1@gmail.com", "jailaxmilightingsolutions@gmail.com"]
export const WHATSAPP_URL = "https://wa.me/918369051700"
export const WHATSAPP_DISPLAY = "+91 83690 51700"

/** Shared layout for Privacy Policy, Terms of Use and similar text pages. */
export function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string
  lastUpdated: string
  intro: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="pt-36 pb-24 md:pt-44 md:pb-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />

            <header className="mb-14">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Legal</p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight">{title}</h1>
              <p className="mt-4 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
              <div className="mt-8 text-lg leading-relaxed text-foreground/80">{intro}</div>
            </header>

            <div className="space-y-12">{children}</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-xl font-medium tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 leading-relaxed text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  )
}

export function ContactList() {
  return (
    <ul>
      {CONTACT_EMAILS.map((email) => (
        <li key={email}>
          <a href={`mailto:${email}`}>{email}</a>
        </li>
      ))}
      <li>
        WhatsApp / phone:{" "}
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          {WHATSAPP_DISPLAY}
        </a>
      </li>
    </ul>
  )
}
