import type { StructureResolver } from "sanity/structure"
import { House, LayoutGrid, Lightbulb, Settings, Sun, Trees } from "lucide-react"

/** The admin sidebar: products grouped the same way as the website, plus the two single pages. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("RIGO website")
    .items([
      S.listItem()
        .title("Products by category")
        .icon(Lightbulb)
        .child(
          S.list()
            .title("Indoor / Outdoor")
            .items(
              (["indoor", "outdoor"] as const).map((tab) =>
                S.listItem()
                  .id(tab)
                  .title(tab === "indoor" ? "Indoor" : "Outdoor")
                  .icon(tab === "indoor" ? Sun : Trees)
                  .child(
                    S.documentTypeList("category")
                      .title(`${tab === "indoor" ? "Indoor" : "Outdoor"} categories`)
                      .filter('_type == "category" && tab == $tab')
                      .params({ tab })
                      .defaultOrdering([{ field: "order", direction: "asc" }])
                      .initialValueTemplates([S.initialValueTemplateItem("category-in-tab", { tab })])
                      .child((categoryId) =>
                        S.documentTypeList("series")
                          .title("Series")
                          .filter('_type == "series" && category._ref == $categoryId')
                          .params({ categoryId })
                          .defaultOrdering([{ field: "order", direction: "asc" }])
                          .initialValueTemplates([S.initialValueTemplateItem("series-in-category", { categoryId })]),
                      ),
                  ),
              ),
            ),
        ),
      S.documentTypeListItem("series").title("All product series").icon(Lightbulb),
      S.documentTypeListItem("category").title("All categories").icon(LayoutGrid),
      S.divider(),
      S.listItem()
        .title("Homepage")
        .icon(House)
        .child(S.document().schemaType("homePage").documentId("homePage").title("Homepage")),
      S.listItem()
        .title("Site settings")
        .icon(Settings)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
    ])
