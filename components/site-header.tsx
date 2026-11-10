import { Header } from "./header"
import { getMenu } from "@/lib/catalog"

/** Server wrapper: builds the Products menu from the catalogue so the client header gets only what it needs. */
export function SiteHeader() {
  return <Header menu={getMenu()} />
}
