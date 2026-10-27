import { CheckCircle2, MapPin, MessageCircle, Phone, ArrowRight, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { Seo, breadcrumbLd } from '../components/Seo';
import { PageHero, Section, SectionHead } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
import { whatsappLink } from '../utils/format';

interface Props {
  city: string;
  region: string;
  pincode?: string;
  landmark: string;
  headline: string;
  areas: string[];
}

export const LOCAL_DATA: Record<string, Props> = {
  mohali: {
    city: 'Mohali (SAS Nagar)',
    region: 'Punjab',
    pincode: '160059',
    landmark: 'Phase 5, Sector 59, SAS Nagar',
    headline: 'Top Website Development & Local SEO Company in Mohali Phase 5',
    areas: ['Phase 5 Mohali', 'Phase 3B2', 'Phase 7', 'Sector 70', 'Sector 82 JLPL', 'IT City Mohali', 'Aerocity'],
  },
  chandigarh: {
    city: 'Chandigarh',
    region: 'Tricity',
    pincode: '160017',
    landmark: 'Serving Sector 17, 34, 35, Manimajra & IT Park',
    headline: 'Premier Website Design & Digital Marketing Agency in Chandigarh',
    areas: ['Sector 17', 'Sector 34', 'Sector 35', 'Chandigarh IT Park', 'Sector 22', 'Industrial Area Phase 1 & 2'],
  },
  panchkula: {
    city: 'Panchkula',
    region: 'Haryana / Tricity',
    pincode: '134109',
    landmark: 'Serving Sector 5, 8, 9, 20 & Industrial Area',
    headline: 'High-Converting Web Development & SEO Services in Panchkula',
    areas: ['Sector 5', 'Sector 8', 'Sector 9', 'Sector 20', 'MDC Panchkula', 'Industrial Area Phase 1 & 2'],
  },
  zirakpur: {
    city: 'Zirakpur',
    region: 'Punjab',
    pincode: '140603',
    landmark: 'Serving VIP Road, Chandigarh-Ambala Highway & PR7 Airport Road',
    headline: 'Local SEO & Business Website Developers in Zirakpur',
    areas: ['VIP Road', 'PR7 Airport Road', 'Dhakoli', 'Baltana', 'Ambala Highway', 'High Ground'],
  },
  himachal: {
    city: 'Himachal Pradesh',
    region: 'Himachal Pradesh',
    pincode: '171001',
    landmark: 'Serving Shimla, Kangra, Solan, Mandi, Kullu & Statewide Businesses',
    headline: 'Professional Website Development & Digital Marketing for Himachal Pradesh Businesses',
    areas: ['Hotels & Homestays', 'Tour & Travel Operators', 'Local Retail', 'Clinics & Healthcare', 'Educational Institutes', 'Industrial Units'],
  },
  una: {
    city: 'Una',
    region: 'Himachal Pradesh',
    pincode: '174303',
    landmark: 'Serving Una Town, Mehatpur Industrial Area, Chandpur & Surrounding Regions',
    headline: 'Top Website Design & Local SEO Services in Una, Himachal Pradesh',
    areas: ['Una City Centre', 'Mehatpur Industrial Area', 'Gagret Road', 'Amb Road', 'Rakhkar', 'Jhalera'],
  },
  amb: {
    city: 'Amb',
    region: 'Himachal Pradesh',
    pincode: '177203',
    landmark: 'Serving Amb Market, Chintpurni Road, Gagret & Industrial Corridor',
    headline: 'Custom Website Development & Google Maps SEO in Amb, Himachal Pradesh',
    areas: ['Amb Town Market', 'Chintpurni Road', 'Gagret Highway', 'Athwan', 'Pratap Nagar'],
  },
  andaura: {
    city: 'Amb Andaura',
    region: 'Himachal Pradesh',
    pincode: '177204',
    landmark: 'Serving Amb Andaura Railway Station Corridor, Industrial Zone & Local Commercial Businesses',
    headline: 'Business Website Developers & Digital Growth Agency in Amb Andaura, HP',
    areas: ['Amb Andaura Station Area', 'Industrial Estate', 'Lohara', 'Chururu', 'Panoh'],
  },
  nangal: {
    city: 'Nangal',
    region: 'Punjab',
    pincode: '140124',
    landmark: 'Serving Nangal Township, NFL Colony, Mehatpur Border & BBMB Area',
    headline: 'High-Performance Web Design & Local SEO Company in Nangal',
    areas: ['Nangal Township', 'Main Market', 'NFL Colony', 'BBMB Colony', 'Naya Nangal', 'Shivalik Avenue'],
  },
  'anandpur-sahib': {
    city: 'Sri Anandpur Sahib',
    region: 'Punjab',
    pincode: '140118',
    landmark: 'Serving Anandpur Sahib City, Virasat-e-Khalsa Belt, Nurpur Bedi & Agampur',
    headline: 'Modern Website Development & Local Visibility Services in Anandpur Sahib',
    areas: ['Anandpur Sahib Market', 'Virasat-e-Khalsa Zone', 'Agampur Industrial Area', 'Nurpur Bedi Road', 'Bhallan'],
  },
  haryana: {
    city: 'Haryana',
    region: 'Haryana',
    pincode: '134003',
    landmark: 'Serving Ambala, Kurukshetra, Karnal, Panipat, Sonipat & Statewide Enterprises',
    headline: 'Bespoke Website Development, MERN Stack Apps & SEO Services Across Haryana',
    areas: ['Manufacturing Units', 'Healthcare & Clinics', 'Logistics & Warehousing', 'Educational Academies', 'E-Commerce Brands'],
  },
};

export default function LocalLanding({ slug = 'mohali' }: { slug?: string }) {
  const normalizedSlug = slug.toLowerCase();
  const data = LOCAL_DATA[normalizedSlug] || LOCAL_DATA.mohali;
  const s = useSettings();
  const wa = whatsappLink(s.whatsappNumber, `Hi RS Stack, I need website development / SEO services in ${data.city}.`);

  return (
    <>
      <Seo
        title={`${data.headline} | RS Stack`}
        description={`Professional website development, Google Business Profile ranking, and local SEO in ${data.city}, ${data.region}. Direct WhatsApp consultation with RS Stack (HQ: Phase 5 Mohali) at +91 98057 20962.`}
        path={`/locations/${normalizedSlug}`}
        keywords={[
          `website development company in ${data.city}`,
          `website designer in ${data.city}`,
          `local SEO services ${data.city}`,
          `Google Business Profile ranking ${data.city}`,
          `best digital marketing agency ${data.city} ${data.region}`,
          `affordable web design in ${data.city}`,
          `e-commerce website development ${data.region}`,
        ]}
        jsonLd={[
          breadcrumbLd([
            ['Home', '/'],
            ['Locations', '/locations/mohali'],
            [data.city, `/locations/${normalizedSlug}`],
          ]),
        ]}
      />

      <PageHero
        eyebrow={`Local Search & Growth • ${data.city}, ${data.region}`}
        title={data.headline}
        text={`Dominate Google Search and Local Maps in ${data.city}. We engineer mobile-first responsive websites, local 3-Pack rankings, and targeted advertising funnels that convert visitors into paying clients.`}
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/contact" className="btn-primary shadow-glow">
            Book Free Consultation in {data.city} <ArrowRight className="h-4 w-4" />
          </Link>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 fill-current" /> WhatsApp Direct (+91 98057 20962)
            </a>
          )}
        </div>
      </PageHero>

      <Section className="pt-4">
        {/* Value Pillars */}
        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {[
            {
              title: `Google Maps Dominance in ${data.city}`,
              desc: `Optimize your Google Business Profile for high-intent searches in ${data.city} and surrounding areas to capture nearby customers looking for your exact services.`,
            },
            {
              title: 'Ultra-Fast Responsive Websites',
              desc: `Modern React 18 & Vite architecture with sub-second mobile loading speeds, accessible UI, and conversion-optimized quotation forms.`,
            },
            {
              title: 'ROI-Driven Targeted Campaigns',
              desc: `Deploy geo-fenced Google and Meta Ad campaigns targeting customers across ${data.city} and ${data.region} with zero wasted ad spend.`,
            },
          ].map((item, i) => (
            <div key={i} className="card p-7">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Capability 0{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Localized Details & Coverage */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12 mb-14 border border-white/10">
          <SectionHead
            eyebrow="Regional Reach"
            title={`Serving Ambitious Enterprises in ${data.city} & Surrounding Hubs`}
            center={false}
          />
          <div className="grid gap-8 lg:grid-cols-2 mt-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Agency Headquarters & Coverage</h4>
                  <p className="text-sm text-muted">
                    Phase 5, Mohali, SAS Nagar, Punjab 160059, India
                  </p>
                  <p className="text-xs text-secondary mt-1">Focus Coverage: {data.landmark}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Direct Phone Support</h4>
                  <a href="tel:+919805720962" className="text-sm text-secondary hover:underline font-semibold">
                    +91 98057 20962
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-white">Direct WhatsApp Support</h4>
                  <a href={wa || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 font-semibold hover:underline">
                    +91 98057 20962 (Instant Reply)
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Key Service Sectors & Localities in {data.city}:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {data.areas.map((a) => (
                    <span key={a} className="chip">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title={`Map of ${data.city}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13719.648118029517!2d76.71239846665798!3d30.718712316499834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fee0091ff1a77%3A0x6b107e3251c27891!2sPhase%205%2C%20Sector%2059%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab%20160059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Explore Other Locations Navigation */}
        <div className="mb-14">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            Explore Other Service Regions
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(LOCAL_DATA).map(([slugKey, loc]) => (
              <Link
                key={slugKey}
                to={`/locations/${slugKey}`}
                className={`btn btn-sm text-xs transition ${
                  slugKey === normalizedSlug
                    ? 'bg-primary text-white shadow-glow'
                    : 'border border-white/15 bg-white/5 text-muted hover:text-ink hover:border-white/30'
                }`}
              >
                {loc.city}
              </Link>
            ))}
          </div>
        </div>

        {/* Local Consultation Form */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-3">Claim Your Free Website & SEO Audit for {data.city}</h2>
          <p className="text-muted mb-8 max-w-xl text-sm">
            Leave your details or current website. We will inspect your search presence in {data.city} and provide an actionable strategy and quote.
          </p>
          <div className="max-w-3xl">
            <ContactForm source={`location-${normalizedSlug}`} />
          </div>
        </div>
      </Section>
    </>
  );
}
