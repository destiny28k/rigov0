import { defineArrayMember, defineField, defineType } from "sanity"
import { House, Settings } from "lucide-react"

export const ICON_OPTIONS = [
  { title: "Lightning (energy)", value: "zap" },
  { title: "Gem (quality)", value: "gem" },
  { title: "Sun (light)", value: "sun" },
  { title: "Shield with tick (warranty)", value: "shield-check" },
  { title: "Light bulb", value: "lightbulb" },
  { title: "Award", value: "award" },
  { title: "People", value: "users" },
  { title: "Shield", value: "shield" },
]

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: Settings,
  fields: [
    defineField({
      name: "phone",
      title: "Phone (as shown)",
      type: "string",
      description: "e.g. +91 83690 51700",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      description: "Digits only with country code, no + or spaces, e.g. 918369051700",
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d{8,15}$/, { name: "digits only" })
          .error("Use digits only, including the country code (e.g. 918369051700)."),
    }),
    defineField({
      name: "emails",
      title: "Email addresses",
      type: "array",
      description: "The first one is used for “Email us” buttons.",
      of: [defineArrayMember({ type: "string", validation: (rule) => rule.email() })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "wechatUrl", title: "WeChat link", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
})

const reason = defineArrayMember({
  type: "object",
  name: "reason",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "icon", title: "Icon", type: "string", options: { list: ICON_OPTIONS } }),
  ],
})

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  icon: House,
  groups: [
    { name: "featured", title: "Featured products", default: true },
    { name: "why", title: "Why RIGO" },
    { name: "about", title: "About" },
    { name: "faq", title: "FAQ" },
  ],
  fields: [
    defineField({
      name: "featured",
      title: "Featured products",
      type: "array",
      group: "featured",
      description: "Six works best. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "featuredItem",
          fields: [
            defineField({
              name: "series",
              title: "Product series",
              type: "reference",
              to: [{ type: "series" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "detail",
              title: "Short line",
              type: "string",
              description: "e.g. Recessed COB downlight",
            }),
          ],
          preview: {
            select: { title: "series.name", subtitle: "detail", media: "series.versions.0.cardImage" },
          },
        }),
      ],
    }),

    defineField({ name: "whyHeading", title: "Heading", type: "string", group: "why" }),
    defineField({ name: "whyIntro", title: "Intro line", type: "text", rows: 2, group: "why" }),
    defineField({ name: "reasons", title: "Reasons", type: "array", group: "why", of: [reason] }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "why",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "number", title: "Number", type: "string", description: "e.g. 15+" }),
            defineField({ name: "label", title: "Label", type: "string", description: "e.g. Years of excellence" }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        }),
      ],
    }),

    defineField({ name: "aboutHeading", title: "Heading", type: "string", group: "about" }),
    defineField({ name: "aboutText", title: "Text", type: "text", rows: 4, group: "about" }),
    defineField({ name: "aboutImage", title: "Photo", type: "image", options: { hotspot: true }, group: "about" }),
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "companyValue",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "icon", title: "Icon", type: "string", options: { list: ICON_OPTIONS } }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
    }),
    defineField({
      name: "journey",
      title: "Our journey",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "object",
          name: "milestone",
          fields: [
            defineField({ name: "year", title: "Year", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
          ],
          preview: { select: { title: "year", subtitle: "title" } },
        }),
      ],
    }),

    defineField({
      name: "faq",
      title: "Questions & answers",
      type: "array",
      group: "faq",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
})
