import { Header } from "./header"
import { getMenu } from "@/lib/catalog"
import { getSiteSettings } from "@/lib/content"

/** Server wrapper: loads the menu and social links so the client header gets only what it needs. */
export async function SiteHeader() {
  const [menu, settings] = await Promise.all([getMenu(), getSiteSettings()])
  return <Header menu={menu} wechatUrl={settings.wechatUrl} instagramUrl={settings.instagramUrl} />
}
