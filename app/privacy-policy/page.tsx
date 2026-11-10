import type { Metadata } from "next"
import Link from "next/link"
import { ContactList, LegalPage, LegalSection } from "@/components/legal-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How RIGO Lighting collects, uses and protects the personal information you share with us through WhatsApp, email and this website.",
  path: "/privacy-policy",
})

// Update this whenever the policy text changes.
const LAST_UPDATED = "10 November 2026"

/*
  TODO (required before launch): add the registered legal entity name and postal address of the business
  operating this website (in the intro and in "Contact us"). A privacy policy must identify who is responsible
  for the data and give a physical address for formal requests. "RIGO Lighting" is a brand name, not a legal entity.
*/

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro={
        <p>
          RIGO Lighting (&ldquo;we&rdquo;, &ldquo;us&rdquo;) manufactures and supplies LED lighting products. This
          policy explains what personal information we collect through this website, why we collect it, and what you can
          ask us to do with it.
        </p>
      }
    >
      <LegalSection title="What we collect">
        <p>We only collect information you choose to give us, plus basic technical data:</p>
        <ul>
          <li>
            <strong>Messages you send us</strong> — anything you share when you contact us on WhatsApp or by email, such
            as your name, phone number, email address and project details.
          </li>
          <li>
            <strong>Anonymous visit statistics</strong> — we use Vercel Web Analytics to count page views and see which
            pages are popular. It does not use cookies and does not identify individual visitors.
          </li>
          <li>
            <strong>Server logs</strong> — our hosting provider records standard technical data, such as IP address and
            browser type, to keep the site running securely.
          </li>
        </ul>
        <p>
          This website has no user accounts, contact forms or online payments. We do not collect financial information,
          and we do not knowingly collect information from children.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it">
        <p>
          To reply to your enquiry, prepare quotations, advise on product selection, and provide warranty or after-sales
          support. We also keep enquiry records for our own business accounts, and use visit statistics to improve this
          website.
        </p>
        <p>We do not use your details for automated decision-making or profiling.</p>
      </LegalSection>

      <LegalSection title="Cookies and tracking">
        <p>
          This website does not use advertising cookies or third-party tracking pixels. Our visit statistics are
          collected without cookies. If we add any cookie-based tools later, we will update this policy and, where
          required, ask for your consent first.
        </p>
      </LegalSection>

      <LegalSection title="Who else sees your information">
        <p>
          We do not sell, rent or trade your personal information. It is shared only with the service providers that
          make our business work:
        </p>
        <ul>
          <li>
            <strong>WhatsApp (Meta)</strong> — conversations started from the WhatsApp links on this site are handled on
            Meta&rsquo;s platform under their own privacy terms.
          </li>
          <li>
            <strong>Email</strong> — our enquiry inboxes are hosted with Google (Gmail).
          </li>
          <li>
            <strong>Website hosting and analytics</strong> — this website is hosted by Vercel, which also provides our
            visit statistics.
          </li>
        </ul>
        <p>
          Links to WeChat and Instagram take you to those services, which have their own privacy policies. We may also
          disclose information where the law requires it.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep enquiry correspondence for as long as needed to serve you and to meet our record-keeping obligations,
          and delete it once it is no longer required. You can ask us to delete it sooner.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under India&rsquo;s Digital Personal Data Protection Act, 2023, you can ask us for a copy of the information
          we hold about you, ask us to correct anything inaccurate, or ask us to delete it. You can also withdraw
          consent for us to keep contacting you.
        </p>
        <p>
          Contact us using the details below and we will respond within a reasonable period. If you are not satisfied
          with our response, you may raise a complaint with the Data Protection Board of India.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We take reasonable steps to protect your information, but no method of transmission over the internet is
          completely secure. Please avoid sending sensitive personal or financial details by WhatsApp or email.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We may update this policy from time to time. The revised version takes effect once published here, with the
          date at the top updated. Please also read our <Link href="/terms">Terms of Use</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>For any question about this policy, or to exercise the rights above:</p>
        <ContactList />
      </LegalSection>
    </LegalPage>
  )
}
