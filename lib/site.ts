/**
 * The site's public address, used for the sitemap, robots.txt and share previews.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (Project → Settings → Environment Variables) once the domain is final.
 * The fallback is the domain the previous site used.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rigolighting.com").replace(/\/+$/, "")
