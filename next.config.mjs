import { readFileSync } from "node:fs"

/**
 * Old URLs from the previous rigoled.com site → new pages (permanent 308 redirects keep search rankings).
 * data/legacy-redirects.json maps every old /product/:id and /outdoor-product/:id to its new series page.
 */
const legacyProducts = JSON.parse(readFileSync(new URL("./data/legacy-redirects.json", import.meta.url), "utf8"))

// The old site filtered /products with ?tab=…&category=… (e.g. from its navbar).
// ".{1,3}" accepts a space, "+" or "%20" between words.
const legacyCategories = [
  ["indoor", "Panel.{1,3}Light", "/products/indoor/panel-light"],
  ["indoor", "COB.{1,3}Light", "/products/indoor/cob-light"],
  ["indoor", "Cylinder.{1,3}COB", "/products/indoor/cob-cyd"],
  ["indoor", "Track.{1,3}Light", "/products/indoor/track-light"],
  ["outdoor", "Flood.{1,3}Light", "/products/outdoor/flood-light"],
  ["outdoor", "Stadium.{1,3}Flood.{1,3}Light", "/products/outdoor/stadium-light"],
  ["outdoor", "Street.{1,3}Light", "/products/outdoor/street-light"],
  ["outdoor", "High-Bay.{1,3}Light", "/products/outdoor/highbay-light"],
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      ...legacyProducts.map(({ source, destination }) => ({ source, destination, permanent: true })),
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/contact", destination: "/#contact", permanent: true },
      { source: "/parallax", destination: "/", permanent: true },
      // Category filters first, then plain tab filters
      ...legacyCategories.map(([tab, category, destination]) => ({
        source: "/products",
        has: [
          { type: "query", key: "tab", value: tab },
          { type: "query", key: "category", value: category },
        ],
        destination,
        permanent: true,
      })),
      ...legacyCategories.map(([, category, destination]) => ({
        source: "/products",
        has: [{ type: "query", key: "category", value: category }],
        destination,
        permanent: true,
      })),
      { source: "/products", has: [{ type: "query", key: "tab", value: "indoor" }], destination: "/products/indoor", permanent: true },
      { source: "/products", has: [{ type: "query", key: "tab", value: "outdoor" }], destination: "/products/outdoor", permanent: true },
    ]
  },
}

export default nextConfig
