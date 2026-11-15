import { defineArrayMember, defineField, defineType } from "sanity"
import { Lightbulb } from "lucide-react"

/** One specification line, e.g. "IP Rating: IP65". */
export const specRow = defineType({
  name: "specRow",
  title: "Specification",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "value", title: "Value", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: {
    select: { label: "label", value: "value" },
    prepare: ({ label, value }) => ({ title: `${label ?? ""}: ${value ?? ""}` }),
  },
})

/** One model / wattage of a product, with its own specification lines. */
export const specModel = defineType({
  name: "specModel",
  title: "Model",
  type: "object",
  fields: [
    defineField({
      name: "modelNo",
      title: "Model no.",
      type: "string",
      description: "e.g. RG-112 or UNIK-FL-01 30W",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description: "Use the same names across models (e.g. Power, Beam Angle) so they line up in the comparison table.",
      of: [defineArrayMember({ type: "specRow" })],
    }),
  ],
  preview: {
    select: { title: "modelNo", specs: "specs" },
    prepare: ({ title, specs }) => ({
      title,
      subtitle: `${specs?.length ?? 0} specifications`,
    }),
  },
})

/** A version of a series, e.g. Deco "Concealed" and Deco "Surface". Most series have just one. */
export const productVersion = defineType({
  name: "productVersion",
  title: "Version",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Version name",
      type: "string",
      description: "Only needed when the series has more than one version, e.g. Concealed / Surface. Shown as a switch.",
    }),
    defineField({
      name: "subtitle",
      title: "Short line",
      type: "string",
      description: "Shown under the product name, e.g. “Delta COB” or “Slim LED Flood Light”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Describe this product in 2–3 sentences. Also used in Google results, so make it unique.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cardImage",
      title: "Card picture",
      type: "image",
      description:
        "Shown on product cards. Best: a landscape photo, 1536 × 1024 px, with the logo and name away from the edges. If empty, the first photo is used.",
      options: { hotspot: true },
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      description:
        "Gallery on the product page. Drag to reorder; the first one is shown first. Best size: 1536 × 1024 px (landscape), the same for every photo.",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "features",
      title: "Key features",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "highlights",
      title: "Key specs (top of page)",
      type: "array",
      description: "Optional summary boxes, e.g. Power: 30W–200W, IP Rating: IP65.",
      of: [defineArrayMember({ type: "specRow" })],
    }),
    defineField({
      name: "models",
      title: "Models & specifications",
      type: "array",
      description: "One model shows as a list; two or more show as a comparison table.",
      of: [defineArrayMember({ type: "specModel" })],
    }),
  ],
  preview: {
    select: { label: "label", subtitle: "subtitle", media: "cardImage", photo: "images.0" },
    prepare: ({ label, subtitle, media, photo }) => ({
      title: label || subtitle || "Version",
      subtitle: label ? subtitle : undefined,
      media: media || photo,
    }),
  },
})

export const series = defineType({
  name: "series",
  title: "Product series",
  type: "document",
  icon: Lightbulb,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "versions", title: "Versions & specs" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "e.g. Alpha, Foria Pro, Unik",
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Page heading",
      type: "string",
      description: "Leave empty to show “<Name> Series”. Fill in for names like “Stadium Light”.",
      group: "details",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Part of the page link, e.g. alpha. Click “Generate”. Avoid changing it once live.",
      options: { source: "name", maxLength: 60 },
      group: "details",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order in category",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 100,
      group: "details",
    }),
    defineField({
      name: "hidden",
      title: "Hide from website",
      type: "boolean",
      description: "Turn on to hide this series without deleting it.",
      initialValue: false,
      group: "details",
    }),
    defineField({
      name: "versions",
      title: "Versions",
      type: "array",
      description: "Most series have one version. Add more for variants like Concealed / Surface.",
      of: [defineArrayMember({ type: "productVersion" })],
      group: "versions",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    { title: "Order in category", name: "order", by: [{ field: "order", direction: "asc" }] },
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: {
    select: {
      name: "name",
      category: "category.name",
      hidden: "hidden",
      media: "versions.0.cardImage",
      photo: "versions.0.images.0",
    },
    prepare: ({ name, category, hidden, media, photo }) => ({
      title: name,
      subtitle: [category, hidden ? "Hidden" : null].filter(Boolean).join(" · "),
      media: media || photo,
    }),
  },
})
