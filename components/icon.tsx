import { Award, Gem, Lightbulb, Shield, ShieldCheck, Sun, Users, Zap, type LucideProps } from "lucide-react"

/** Icons the admin can choose from (see ICON_OPTIONS in sanity/schemaTypes/site.ts). */
const ICONS = {
  zap: Zap,
  gem: Gem,
  sun: Sun,
  "shield-check": ShieldCheck,
  lightbulb: Lightbulb,
  award: Award,
  users: Users,
  shield: Shield,
}

export function ContentIcon({ name, ...props }: { name?: string } & LucideProps) {
  const Icon = ICONS[(name ?? "") as keyof typeof ICONS] ?? Lightbulb
  return <Icon {...props} />
}
