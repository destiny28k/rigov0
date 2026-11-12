import { defineCliConfig } from "sanity/cli"

/** Used by `npx sanity …` commands (e.g. the data migration script). */
export default defineCliConfig({
  api: { projectId: "g85itbkg", dataset: "production" },
})
