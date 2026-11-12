/**
 * Site settings and homepage content, read from Sanity (edited at /studio → Site settings / Homepage).
 */
import { cache } from "react"
import { sanityFetch } from "@/sanity/lib/client"
import { imageUrl, type SanityImage } from "@/sanity/lib/image"

export type SiteSettings = {
  phone: string
  /** Digits with country code, e.g. 918369051700 */
  whatsappNumber: string
  whatsappUrl: string
  emails: string[]
  instagramUrl: string
  wechatUrl: string
}

/** Used for any field left empty in the admin, so contact details are never blank. */
const DEFAULT_SETTINGS = {
  phone: "+91 83690 51700",
  whatsappNumber: "918369051700",
  emails: ["customercarerigo1@gmail.com", "jailaxmilightingsolutions@gmail.com"],
  instagramUrl: "https://instagram.com/rigolighting",
  wechatUrl: "https://u.wechat.com/kP_PkMqInEFhHvN6A0ipJ-A?s=4",
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const raw = await sanityFetch<Partial<typeof DEFAULT_SETTINGS> | null>(
    `*[_id == "siteSettings"][0]{ phone, whatsappNumber, emails, instagramUrl, wechatUrl }`,
  )
  const pick = <K extends keyof typeof DEFAULT_SETTINGS>(key: K) =>
    (raw?.[key] && (!Array.isArray(raw[key]) || (raw[key] as unknown[]).length) ? raw[key] : DEFAULT_SETTINGS[key]) as (typeof DEFAULT_SETTINGS)[K]
  const whatsappNumber = pick("whatsappNumber").replace(/\D/g, "")
  return {
    phone: pick("phone"),
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    emails: pick("emails").filter(Boolean),
    instagramUrl: pick("instagramUrl"),
    wechatUrl: pick("wechatUrl"),
  }
})

export type HomePage = {
  featured: { seriesId: string; detail: string }[]
  whyHeading: string
  whyIntro: string
  reasons: { title: string; description: string; icon: string }[]
  stats: { number: string; label: string }[]
  aboutHeading: string
  aboutText: string
  aboutImage: string
  values: { label: string; icon: string }[]
  journey: { year: string; title: string; description: string }[]
  faq: { question: string; answer: string }[]
}

type RawHome = Omit<HomePage, "aboutImage" | "featured"> & {
  aboutImage?: SanityImage
  featured?: { seriesId?: string; detail?: string }[]
}

export const getHomePage = cache(async (): Promise<HomePage> => {
  const raw = await sanityFetch<Partial<RawHome> | null>(`*[_id == "homePage"][0]{
    "featured": featured[]{ "seriesId": series._ref, detail },
    whyHeading, whyIntro, reasons[]{ title, description, icon }, stats[]{ number, label },
    aboutHeading, aboutText, aboutImage, values[]{ label, icon },
    journey[]{ year, title, description }, faq[]{ question, answer }
  }`)
  return {
    featured: (raw?.featured ?? [])
      .filter((f): f is { seriesId: string; detail?: string } => Boolean(f.seriesId))
      .map((f) => ({ seriesId: f.seriesId, detail: f.detail ?? "" })),
    whyHeading: raw?.whyHeading || "Built to shine",
    whyIntro: raw?.whyIntro ?? "",
    reasons: raw?.reasons ?? [],
    stats: raw?.stats ?? [],
    aboutHeading: raw?.aboutHeading || "About RIGO",
    aboutText: raw?.aboutText ?? "",
    aboutImage: imageUrl(raw?.aboutImage, 1400),
    values: raw?.values ?? [],
    journey: raw?.journey ?? [],
    faq: raw?.faq ?? [],
  }
})
