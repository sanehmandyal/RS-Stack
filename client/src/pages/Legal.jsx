import { Seo } from '../components/Seo';
import { PageHero, Section } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
const POLICIES = {
    privacy: {
        title: 'Privacy Policy',
        path: '/privacy',
        desc: 'How Growora collects, uses, protects, and handles your information in compliance with Indian IT and Data Protection laws.',
        lastUpdated: 'October 2026',
        sections: [
            {
                heading: '1. Information We Collect',
                body: [
                    'When you contact Growora via our consultation form, email, or WhatsApp, we collect information including your name, email address, phone number, business name, and details of your requested project.',
                    'To ensure cybersecurity and prevent automated spam, our servers log standard technical information including an anonymized one-way hash of your IP address, browser user-agent, and submission timestamp.',
                    'We do not collect sensitive personal data or financial payment card details through our public website.',
                ],
            },
            {
                heading: '2. Purpose and Legal Basis for Processing',
                body: [
                    'We use the information you submit strictly to evaluate your project requirements, deliver formal proposals, respond to inquiries, and fulfill contractual obligations.',
                    'We do not sell, rent, or trade your personal information to third-party data brokers or marketing lists.',
                ],
            },
            {
                heading: '3. Data Security and Storage',
                body: [
                    'All web traffic is transmitted via TLS 1.3 encryption (HTTPS). Administrative access to customer inquiries is protected with role-based authentication, salted Argon2id password hashing, and encrypted database connections.',
                    'Server infrastructure is hosted in secure, ISO/IEC 27001-compliant cloud facilities with strict network isolation.',
                ],
            },
            {
                heading: '4. Third-Party Service Providers',
                body: [
                    'We may utilize trusted third-party providers to facilitate website hosting (e.g., Vercel, Render), transactional email delivery (e.g., Resend, SendGrid), and database persistence (e.g., MongoDB Atlas). These vendors operate under strict data processing agreements and are not permitted to use your data for independent purposes.',
                ],
            },
            {
                heading: '5. Data Retention',
                body: [
                    'Prospective inquiries and project consultation requests are retained for up to 24 months for client relationship management and accounting records, after which they are securely archived or permanently deleted.',
                ],
            },
            {
                heading: '6. Your Rights',
                body: [
                    'Under the Digital Personal Data Protection Act (DPDP Act) and applicable international privacy regulations, you have the right to request a copy of your personal data, request correction of inaccurate records, or request deletion of your information.',
                    'To exercise any of these rights, contact our data privacy officer at contact@growora.com.',
                ],
            },
        ],
    },
    terms: {
        title: 'Terms and Conditions',
        path: '/terms',
        desc: 'Terms and conditions governing the use of the Growora website and professional digital services.',
        lastUpdated: 'October 2026',
        sections: [
            {
                heading: '1. Agreement to Terms',
                body: [
                    'By accessing this website or engaging Growora for web development, search engine optimization, or digital consulting, you agree to be bound by these Terms and Conditions.',
                    'Specific client projects are governed by individual written proposals, Statements of Work (SOW), or contracts signed between Growora and the client. In the event of a conflict between these general terms and an executed contract, the terms of the signed contract shall prevail.',
                ],
            },
            {
                heading: '2. Scope of Services and Project Milestones',
                body: [
                    'Growora provides bespoke website development, search engine optimization, Google Business Profile optimization, and custom web application engineering.',
                    'Project deliverables, timelines, technical specifications, and fee schedules are agreed in writing prior to project kickoff. Milestones require formal client review and sign-off.',
                ],
            },
            {
                heading: '3. Intellectual Property and Code Ownership',
                body: [
                    'Unless otherwise specified in a custom agreement, upon receipt of full and final payment for an agreed project, 100% of the custom source code, design assets, and content created specifically for the client are assigned to the client.',
                    'Growora retains the right to use non-confidential screenshots and summaries of the completed project in its portfolio and marketing case studies, unless a non-disclosure agreement (NDA) has been agreed.',
                ],
            },
            {
                heading: '4. Third-Party Services and Subscriptions',
                body: [
                    'Third-party services required for website operation (including domain registration, DNS management, cloud hosting, ad platform budgets, and external API licenses) are billed directly by their respective providers or passed through at actual cost.',
                    'Growora is not responsible for service interruptions, terms modifications, or price adjustments instituted by third-party hosting or API providers.',
                ],
            },
            {
                heading: '5. Limitation of Liability',
                body: [
                    'While we implement industry standard security practices and test deliverables rigorously across modern browsers, Growora shall not be liable for indirect, incidental, or consequential damages resulting from business disruption or third-party outages.',
                    'Our total cumulative liability for any claim arising from our services shall not exceed the total fees paid by the client to Growora under the applicable agreement during the three months preceding the claim.',
                ],
            },
            {
                heading: '6. Governing Law and Jurisdiction',
                body: [
                    'These Terms and Conditions and any dispute arising from them shall be governed by and construed in accordance with the laws of India.',
                    'The courts located in SAS Nagar (Mohali), Punjab, India shall have exclusive jurisdiction over any disputes arising under or in connection with these terms.',
                ],
            },
        ],
    },
    cookies: {
        title: 'Cookie Policy',
        path: '/cookie-policy',
        desc: 'How Growora uses essential session storage and respects user cookie preferences.',
        lastUpdated: 'October 2026',
        sections: [
            {
                heading: '1. What Are Cookies',
                body: [
                    'Cookies are small data files stored on your device that enable websites to recognize your preferences and maintain session state.',
                ],
            },
            {
                heading: '2. Essential Cookies',
                body: [
                    'Our administrative portal uses strictly necessary, HttpOnly session cookies to authenticate authorized staff and secure admin routes. The public pages of this website operate without requiring user authentication cookies.',
                ],
            },
            {
                heading: '3. Analytics and Performance Cookies',
                body: [
                    'Optional tracking tags (such as Google Analytics or Meta Pixel) are only loaded if you explicitly grant consent through our cookie consent banner. If you decline or close the banner, no tracking cookies are set.',
                ],
            },
            {
                heading: '4. Managing Your Cookie Choices',
                body: [
                    'You may change your cookie preferences or clear your stored cookies at any time via your browser settings. Clearing your browser cookies will prompt our consent banner to re-appear on your next visit.',
                ],
            },
        ],
    },
    refund: {
        title: 'Refund and Cancellation Policy',
        path: '/refund-policy',
        desc: 'Refund terms, milestone payments, and cancellation conditions for Growora services.',
        lastUpdated: 'October 2026',
        sections: [
            {
                heading: '1. Project Work and Milestone Payments',
                body: [
                    'Custom development projects are billed across clearly defined milestones (e.g., Discovery and UI Design, Core Development, and Final Launch).',
                    'Deposits covering completed research, discovery, and UI architecture phases are non-refundable once work has commenced. For milestones not yet started, cancellation requests submitted in writing will terminate future milestone billing.',
                ],
            },
            {
                heading: '2. Recurring Maintenance and Support',
                body: [
                    'Monthly maintenance or retainer services require a 30-day written notice of cancellation. Services will remain active through the end of the paid billing cycle.',
                ],
            },
            {
                heading: '3. Third-Party Costs',
                body: [
                    'Fees paid to third-party providers (such as domain registrars, cloud host providers, or advertising networks) are subject to the respective provider policies and are non-refundable.',
                ],
            },
        ],
    },
};
export default function Legal({ kind }) {
    const policy = POLICIES[kind] || POLICIES.privacy;
    const { contactEmail, address } = useSettings();
    return (<>
      <Seo title={`${policy.title} | Growora`} description={policy.desc} path={policy.path}/>
      <PageHero title={policy.title}/>
      <Section className="pt-0">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3 text-xs text-slate-500">
            <span>Last Updated: {policy.lastUpdated}</span>
            <span>Growora • Phase 5, Mohali</span>
          </div>

          <div className="prose-rs space-y-8">
            {policy.sections.map((sec) => (<div key={sec.heading} className="border-b border-slate-100 pb-6 last:border-b-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{sec.heading}</h2>
                <div className="space-y-3">
                  {sec.body.map((p, i) => (<p key={i} className="text-sm text-slate-600 leading-relaxed">
                      {p}
                    </p>))}
                </div>
              </div>))}

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 mt-8">
              <h3 className="text-base font-bold text-slate-900 mb-1.5">Questions or Legal Inquiries?</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-3">
                For questions regarding these terms, privacy compliance, or project agreements, please contact our team directly:
              </p>
              <ul className="text-xs sm:text-sm text-slate-700 space-y-1">
                <li><strong>Email:</strong> <a href={`mailto:${contactEmail || 'contact@growora.com'}`} className="text-teal-700 underline">{contactEmail || 'contact@growora.com'}</a></li>
                <li><strong>Office:</strong> {address || 'Phase 5, Mohali, SAS Nagar, Punjab 160059, India'}</li>
                <li><strong>Phone:</strong> +91 98057 20962</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </>);
}
