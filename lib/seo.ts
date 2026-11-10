import type { Metadata } from "next"
import { CONTACT, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site"

export const DEFAULT_OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: `${SITE_NAME} — premium LED lighting` }

/**
 * Consistent metadata for a page: title (the layout template adds "| RIGO Lighting"), description,
 * canonical URL and share preview. Pass `image` to use a product photo instead of the default preview.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
}: {
  title: string
  description: string
  path: string
  image?: string
  absoluteTitle?: boolean
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: path,
      title: fullTitle,
      description,
      images: image ? [{ url: encodeURI(image), alt: title }] : [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image ? encodeURI(image) : DEFAULT_OG_IMAGE.url],
    },
  }
}

const abs = (path: string) => `${SITE_URL}${encodeURI(path)}`

/** schema.org Organization + WebSite, for the homepage. */
export function organizationJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: abs("/images/rigo-logo.png"),
      description: SITE_DESCRIPTION,
      sameAs: [CONTACT.instagram],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: CONTACT.phone,
          email: CONTACT.emails[0],
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en-IN",
    },
  ]
}

/** schema.org BreadcrumbList, matching the visible breadcrumbs. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  }
}
