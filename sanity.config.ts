"use client"

/**
 * Sanity Studio (the admin panel), served by the website at /studio.
 */
import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { apiVersion, dataset, projectId } from "./sanity/env"
import { SINGLETONS, schemaTypes } from "./sanity/schemaTypes"
import { structure } from "./sanity/structure"

export default defineConfig({
  name: "rigo",
  title: "RIGO Website",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // New-document templates used when creating a category inside Indoor/Outdoor, or a series inside a category
    templates: (prev) => [
      ...prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
      {
        id: "category-in-tab",
        title: "Category",
        schemaType: "category",
        parameters: [{ name: "tab", type: "string" }],
        value: (params: { tab: string }) => ({ tab: params.tab }),
      },
      {
        id: "series-in-category",
        title: "Product series",
        schemaType: "series",
        parameters: [{ name: "categoryId", type: "string" }],
        value: (params: { categoryId: string }) => ({
          category: { _type: "reference", _ref: params.categoryId },
        }),
      },
    ],
  },
  document: {
    // Single pages can't be deleted or duplicated
    actions: (prev, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? prev.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action))
        : prev,
    newDocumentOptions: (prev) => prev.filter((item) => !SINGLETONS.includes(item.templateId)),
  },
  plugins: [
    structureTool({ structure }),
    // Query playground for developers only; the client never sees it on the live site
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
})
