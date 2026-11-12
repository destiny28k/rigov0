import { createImageUrlBuilder } from "@sanity/image-url"
import { dataset, projectId } from "../env"

const builder = createImageUrlBuilder({ projectId, dataset })

export type SanityImage = { asset?: { _ref: string }; hotspot?: unknown; crop?: unknown } | null | undefined

/**
 * A resized image URL from Sanity's CDN. `auto=format` serves WebP/AVIF to browsers that support them,
 * so photos are much smaller than the original uploads.
 */
export function imageUrl(image: SanityImage, width: number): string {
  if (!image?.asset) return ""
  return builder.image(image).width(width).fit("max").auto("format").quality(82).url()
}
