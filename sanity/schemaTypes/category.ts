import { defineField, defineType } from "sanity"
import { LayoutGrid } from "lucide-react"

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: LayoutGrid,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Panel Light, COB Light, Flood Light",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tab",
      title: "Indoor or outdoor",
      type: "string",
      options: {
        list: [
          { title: "Indoor", value: "indoor" },
          { title: "Outdoor", value: "outdoor" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "indoor",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Part of the page link, e.g. panel-light. Click “Generate”. Avoid changing it once live.",
      options: { source: "name", maxLength: 60 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "One or two sentences shown at the top of the category page and in Google results.",
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "image",
      title: "Tile picture",
      type: "image",
      description: "Shown on category tiles. A product cut-out on a transparent background looks best. If empty, the first series' picture is used.",
      options: { hotspot: true },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Website order",
      name: "websiteOrder",
      by: [
        { field: "tab", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", tab: "tab", media: "image" },
    prepare: ({ title, tab, media }) => ({
      title,
      subtitle: tab === "outdoor" ? "Outdoor" : "Indoor",
      media,
    }),
  },
})
