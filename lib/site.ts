/**
 * The site's public address, used for the sitemap, robots.txt and share previews.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (Project → Settings → Environment Variables) once the domain is final.
 * The fallback is the live production domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.rigoled.com").replace(/\/+$/, "")

export const SITE_NAME = "RIGO Lighting"
export const SITE_DESCRIPTION =
  "Premium LED lighting from RIGO: panel lights, downlights, COB, cylinder, track and linear spot lights, plus flood, street, stadium and high-bay lights. Energy-efficient lighting with a 2-year warranty."

