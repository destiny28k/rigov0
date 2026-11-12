import { createClient, type QueryParams } from "next-sanity"
import { apiVersion, dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
})

/** Every website query is cached under this tag; /api/revalidate clears it when content is published. */
export const SANITY_TAG = "sanity"

/**
 * Fetch published content. Results are cached and refreshed when Sanity calls /api/revalidate on publish,
 * with a time-based refresh as a safety net in case the webhook isn't set up.
 */
export function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: 300, tags: [SANITY_TAG] } })
}
