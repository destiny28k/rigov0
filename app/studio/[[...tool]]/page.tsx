/**
 * The admin panel at /studio. Editors log in with their own Sanity account (invite them at sanity.io/manage).
 */
import { NextStudio } from "next-sanity/studio"
import config from "../../../sanity.config"

export const dynamic = "force-static"

export { metadata, viewport } from "next-sanity/studio"

export default function StudioPage() {
  return <NextStudio config={config} />
}
