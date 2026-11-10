import type { Metadata } from "next"
import Link from "next/link"
import { ContactList, LegalPage, LegalSection } from "@/components/legal-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply when you use the RIGO Lighting website, including product information, quotations, warranty and content use.",
  path: "/terms",
})

// Update this whenever the terms change.
const LAST_UPDATED = "10 November 2026"

/*
  TODO (required before launch):
  - Add the registered legal entity name and postal address of the business (intro + "Contact us").
  - Confirm the city for "Governing law" (courts with jurisdiction), e.g. the city of the registered office.
  - Have the business owner (ideally with legal advice) review these terms; they are a starting point, not legal advice.
*/

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          These terms apply to your use of the RIGO Lighting website (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using this
          website you agree to them. If you do not agree, please do not use the website.
        </p>
      }
    >
      <LegalSection title="About this website">
        <p>
          This website presents our LED lighting products and lets you contact us. It is a catalogue: products are not
          sold or paid for online. Orders, prices and delivery are agreed directly with our team by WhatsApp, phone or
          email.
        </p>
      </LegalSection>

      <LegalSection title="Product information">
        <p>
          We work to keep product descriptions, specifications and images accurate and up to date. However, products are
          improved over time, so specifications, finishes and available wattages may change without notice. Photos are
          for illustration, and actual colours and light output can look different from the screen.
        </p>
        <p>
          Before ordering, please confirm the exact model, specifications and suitability for your project with our
          team.
        </p>
      </LegalSection>

      <LegalSection title="Quotations and orders">
        <p>
          Any prices or quotations shared with you are valid only as stated in that quotation. An order is confirmed
          only when we confirm it to you in writing. Terms of payment, delivery and installation are agreed for each
          order.
        </p>
      </LegalSection>

      <LegalSection title="Warranty">
        <p>
          Our products are covered by the warranty stated for each product (typically 2 years). The warranty covers
          manufacturing defects under normal use and does not cover damage from incorrect installation, voltage
          fluctuations beyond the stated range, physical damage or unauthorised repairs. To make a claim, contact us
          with your purchase details.
        </p>
      </LegalSection>

      <LegalSection title="Use of our content">
        <p>
          The RIGO name and logo, product photos, text and design of this website belong to us or are used with
          permission. You may view and share pages for personal or business enquiries, but you may not copy, modify or
          reuse our content, images or branding for any other purpose without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="Links to other websites">
        <p>
          This website links to services such as WhatsApp, WeChat and Instagram. We are not responsible for the content
          or practices of those services; their own terms and privacy policies apply.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          This website and its content are provided &ldquo;as is&rdquo;. To the extent permitted by law, we are not
          liable for any loss arising from your use of the website or reliance on its content, including errors,
          omissions or temporary unavailability. Nothing in these terms limits any rights you have as a consumer that
          cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          How we handle your personal information is explained in our <Link href="/privacy-policy">Privacy Policy</Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of India, and disputes are subject to the jurisdiction of Indian courts.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms from time to time. The updated version applies once published here, with the date at
          the top updated.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>Questions about these terms:</p>
        <ContactList />
      </LegalSection>
    </LegalPage>
  )
}
