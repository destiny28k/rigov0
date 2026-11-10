import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import { DEFAULT_OG_IMAGE } from "@/lib/seo"

// Satoshi by Indian Type Foundry (Fontshare), self-hosted under the ITF Free Font License.
// One variable file covers every weight from Light (300) to Black (900).
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  variable: "--font-satoshi",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Pages set a short title; the template adds the brand, e.g. "COB Light — Indoor Lighting | RIGO Lighting"
  title: { default: `${SITE_NAME} — Premium LED Lighting Solutions`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "LED lights",
    "LED panel light",
    "COB light",
    "LED downlight",
    "track light",
    "LED flood light",
    "LED street light",
    "high bay light",
    "RIGO",
    "RIGO LED",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    title: `${SITE_NAME} — Premium LED Lighting Solutions`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE.url] },
  // Canonical URLs are set per page (a layout-level canonical would be inherited by every page).
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" className={satoshi.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
