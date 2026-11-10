import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

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
  title: "RIGO Lighting — Premium LED Lighting Solutions",
  description:
    "Premium LED panel lights, COB downlights, cylinder and track lights from RIGO. Energy-efficient lighting that elevates every space.",
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
    <html lang="en" className={satoshi.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
