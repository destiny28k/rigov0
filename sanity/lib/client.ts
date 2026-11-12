import { createClient, type QueryParams } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env"

const isDev = process.env.NODE_ENV === "development"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Locally, skip Sanity's CDN so freshly published changes show up on the next refresh
  useCdn: !isDev,
  perspective: "published",
})

/** Every website query is cached under this tag; /api/revalidate clears it when content is published. */
export const SANITY_TAG = "sanity"

/**
 * Fetch published content. Results are cached and refreshed when Sanity calls /api/revalidate on publish,
 * with a time-based refresh as a safety net in case the webhook isn't set up.
 */
export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  // Locally (npm run dev) always fetch fresh content; the live site caches and refreshes on publish
  if (isDev) return client.fetch<T>(query, params, { cache: "no-store" })
  return client.fetch<T>(query, params, { next: { revalidate: 300, tags: [SANITY_TAG] } })
}
