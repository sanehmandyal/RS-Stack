import { Seo } from '../components/Seo';
import { PageHero, Section } from '../components/ui';
import { useSettings } from '../hooks/useSettings';

type Kind = 'privacy' | 'terms' | 'cookies' | 'refund';

const DOCS: Record<Kind, { title: string; path: string; desc: string; sections: [string, string][] }> = {
  privacy: {
    title: 'Privacy Policy', path: '/privacy-policy', desc: 'How RS Stack collects, uses and protects your personal information.',
    sections: [
      ['Information we collect', 'When you submit our contact form we collect your name, email, phone number (optional), business details and the message you write, plus your consent record. We also store a one-way hash of your IP address and your browser type to help prevent spam.'],
      ['How we use it', 'We use this information to respond to your enquiry, prepare quotes and manage our relationship with you. We do not sell your personal information.'],
      ['Analytics and advertising', 'If analytics or advertising tags are enabled, they load only after you accept cookies. See the Cookie Policy.'],
      ['Sharing', 'We use service providers such as hosting, database and email providers to operate this site. They process data on our instructions.'],
      ['Retention', 'We keep enquiry data for as long as needed to respond and for our legitimate business records, then delete or anonymise it. [Set your exact retention period.]'],
      ['Your rights', 'Depending on where you live, you may have rights to access, correct or delete your data and to withdraw consent. Contact us using the details on the Contact page.'],
    ],
  },
  terms: {
    title: 'Terms of Service', path: '/terms-of-service', desc: 'The terms that apply when you use the RS Stack website and services.',
    sections: [
      ['Using this website', 'You may use this website for lawful purposes. Content is provided for general information and may change.'],
      ['Our services', 'Services are provided under a written proposal or agreement that sets out scope, fees, timelines and ownership. If this page and your agreement differ, your agreement applies.'],
      ['No guarantees', 'We do not guarantee search rankings, traffic, leads, sales or advertising results. Outcomes depend on many factors outside our control.'],
      ['Third-party costs', 'Domains, hosting, advertising spend, software subscriptions and similar items are billed by their providers and are separate from our fees unless the agreement says otherwise.'],
      ['Liability', '[Insert limitation of liability and governing law appropriate to your jurisdiction.]'],
    ],
  },
  cookies: {
    title: 'Cookie Policy', path: '/cookie-policy', desc: 'How RS Stack uses cookies and similar technologies.',
    sections: [
      ['Essential cookies', 'The administration area uses a secure, HttpOnly session cookie so authorised staff can sign in. The public website does not need cookies to work.'],
      ['Analytics and advertising', 'If configured, Google Analytics, Google Tag Manager or Meta Pixel set cookies to measure visits and advertising. They are loaded only after you choose Accept, and you can choose Reject.'],
      ['Changing your choice', 'Clear this site’s data in your browser to see the cookie choice again.'],
    ],
  },
  refund: {
    title: 'Refund & Cancellation Policy', path: '/refund-policy', desc: 'Refund and cancellation terms for RS Stack services.',
    sections: [
      ['Project work', '[Describe deposits, milestone payments and when refunds apply.]'],
      ['Recurring services', '[Describe notice periods for maintenance, hosting management or campaign management.]'],
      ['Third-party fees', 'Fees paid to third parties (domains, hosting, ad platforms) are generally non-refundable by us and governed by those providers’ terms.'],
    ],
  },
};

export default function Legal({ kind }: { kind: Kind }) {
  const d = DOCS[kind];
  const { contactEmail } = useSettings();
  return (
    <>
      <Seo title={`${d.title} | RS Stack`} description={d.desc} path={d.path} />
      <PageHero title={d.title} />
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <p className="mb-8 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Template notice: this text is a starting template. It must be reviewed and adapted by a qualified professional to reflect RS Stack’s actual business, integrations, jurisdiction and commercial terms before launch. Items in [brackets] are placeholders.
          </p>
          <div className="prose-rs">
            {d.sections.map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}
            <h2>Contact</h2><p>{contactEmail ? <>Questions? Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : 'Questions? Use the contact form.'}</p>
          </div>
        </div>
      </Section>
    </>
  );
}
