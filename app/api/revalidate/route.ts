/**
 * Called by a Sanity webhook whenever content is published, so the website shows the change straight away.
 * Set up once at sanity.io/manage → project → API → Webhooks (see SANITY.md). The shared secret must match
 * SANITY_REVALIDATE_SECRET in Vercel.
 */
import { revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"
import { SANITY_TAG } from "@/sanity/lib/client"

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 })

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true)
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 })

    // All website content shares one cache tag; expire it immediately so the next visit gets fresh content
    revalidateTag(SANITY_TAG, { expire: 0 })
    return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() })
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 })
  }
}
