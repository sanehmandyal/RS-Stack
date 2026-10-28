import { MapPin, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/ContactForm';
import { Seo, breadcrumbLd } from '../components/Seo';
import { PageHero, Section, SectionHead } from '../components/ui';
import { useSettings } from '../hooks/useSettings';
import { whatsappLink } from '../utils/format';
export const LOCAL_DATA = {
    mohali: {
        city: 'Mohali (SAS Nagar)',
        region: 'Punjab',
        pincode: '160059',
        landmark: 'Phase 5, Sector 59, SAS Nagar',
        headline: 'Top Website Development & Local SEO Company in Mohali Phase 5',
        areas: ['Phase 5 Mohali', 'Phase 3B2', 'Phase 7', 'Sector 70', 'Sector 82 JLPL', 'IT City Mohali', 'Aerocity'],
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    },
    chandigarh: {
        city: 'Chandigarh',
        region: 'Tricity',
        pincode: '160017',
        landmark: 'Serving Sector 17, 34, 35, Manimajra & IT Park',
        headline: 'Premier Website Design & Digital Marketing Agency in Chandigarh',
        areas: ['Sector 17', 'Sector 34', 'Sector 35', 'Chandigarh IT Park', 'Sector 22', 'Industrial Area Phase 1 & 2'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    },
    panchkula: {
        city: 'Panchkula',
        region: 'Haryana / Tricity',
        pincode: '134109',
        landmark: 'Serving Sector 5, 8, 9, 20 & Industrial Area',
        headline: 'High-Converting Web Development & SEO Services in Panchkula',
        areas: ['Sector 5', 'Sector 8', 'Sector 9', 'Sector 20', 'MDC Panchkula', 'Industrial Area Phase 1 & 2'],
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    },
    zirakpur: {
        city: 'Zirakpur',
        region: 'Punjab',
        pincode: '140603',
        landmark: 'Serving VIP Road, Chandigarh-Ambala Highway & PR7 Airport Road',
        headline: 'Local SEO & Business Website Developers in Zirakpur',
        areas: ['VIP Road', 'PR7 Airport Road', 'Dhakoli', 'Baltana', 'Ambala Highway', 'High Ground'],
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    },
    himachal: {
        city: 'Himachal Pradesh',
        region: 'Himachal Pradesh',
        pincode: '171001',
        landmark: 'Serving Shimla, Kangra, Solan, Mandi, Kullu & Statewide Businesses',
        headline: 'Professional Website Development & Digital Marketing for Himachal Pradesh Businesses',
        areas: ['Hotels & Homestays', 'Tour & Travel Operators', 'Local Retail', 'Clinics & Healthcare', 'Educational Institutes', 'Industrial Units'],
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    },
    una: {
        city: 'Una',
        region: 'Himachal Pradesh',
        pincode: '174303',
        landmark: 'Serving Una Town, Mehatpur Industrial Area, Chandpur & Surrounding Regions',
        headline: 'Top Website Design & Local SEO Services in Una, Himachal Pradesh',
        areas: ['Una City Centre', 'Mehatpur Industrial Area', 'Gagret Road', 'Amb Road', 'Rakhkar', 'Jhalera'],
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    },
    amb: {
        city: 'Amb',
        region: 'Himachal Pradesh',
        pincode: '177203',
        landmark: 'Serving Amb Market, Chintpurni Road, Gagret & Industrial Corridor',
        headline: 'Custom Website Development & Google Maps SEO in Amb, Himachal Pradesh',
        areas: ['Amb Town Market', 'Chintpurni Road', 'Gagret Highway', 'Athwan', 'Pratap Nagar'],
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    },
    andaura: {
        city: 'Amb Andaura',
        region: 'Himachal Pradesh',
        pincode: '177204',
        landmark: 'Serving Amb Andaura Railway Station Corridor, Industrial Zone & Local Commercial Businesses',
        headline: 'Business Website Developers & Digital Growth Agency in Amb Andaura, HP',
        areas: ['Amb Andaura Station Area', 'Industrial Estate', 'Lohara', 'Chururu', 'Panoh'],
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    },
    nangal: {
        city: 'Nangal',
        region: 'Punjab',
        pincode: '140124',
        landmark: 'Serving Nangal Township, NFL Colony, Mehatpur Border & BBMB Area',
        headline: 'High-Performance Web Design & Local SEO Company in Nangal',
        areas: ['Nangal Township', 'Main Market', 'NFL Colony', 'BBMB Colony', 'Naya Nangal', 'Shivalik Avenue'],
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    },
    'anandpur-sahib': {
        city: 'Sri Anandpur Sahib',
        region: 'Punjab',
        pincode: '140118',
        landmark: 'Serving Anandpur Sahib City, Virasat-e-Khalsa Belt, Nurpur Bedi & Agampur',
        headline: 'Modern Website Development & Local Visibility Services in Anandpur Sahib',
        areas: ['Anandpur Sahib Market', 'Virasat-e-Khalsa Zone', 'Agampur Industrial Area', 'Nurpur Bedi Road', 'Bhallan'],
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    },
    haryana: {
        city: 'Haryana',
        region: 'Haryana',
        pincode: '134003',
        landmark: 'Serving Ambala, Kurukshetra, Karnal, Panipat, Sonipat & Statewide Enterprises',
        headline: 'Bespoke Website Development, MERN Stack Apps & SEO Services Across Haryana',
        areas: ['Manufacturing Units', 'Healthcare & Clinics', 'Logistics & Warehousing', 'Educational Academies', 'E-Commerce Brands'],
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    },
};
export default function LocalLanding({ slug = 'mohali' }) {
    const normalizedSlug = slug.toLowerCase();
    const data = LOCAL_DATA[normalizedSlug] || LOCAL_DATA.mohali;
    const s = useSettings();
    const wa = whatsappLink(s.whatsappNumber, `Hi RS Stack, I need website development / SEO services in ${data.city}.`);
    return (<>
      <Seo title={`${data.headline} | RS Stack`} description={`Professional website development, Google Business Profile ranking, and local SEO in ${data.city}, ${data.region}. Direct WhatsApp consultation with RS Stack (HQ: Phase 5 Mohali) at +91 98057 20962.`} path={`/locations/${normalizedSlug}`} keywords={[
            `website development company in ${data.city}`,
            `website designer in ${data.city}`,
            `local SEO services ${data.city}`,
            `Google Business Profile ranking ${data.city}`,
            `best digital marketing agency ${data.city} ${data.region}`,
            `affordable web design in ${data.city}`,
            `e-commerce website development ${data.region}`,
        ]} jsonLd={[
            breadcrumbLd([
                ['Home', '/'],
                ['Locations', '/locations/mohali'],
                [data.city, `/locations/${normalizedSlug}`],
            ]),
        ]}/>

      <PageHero eyebrow={`Local Search & Growth • ${data.city}, ${data.region}`} title={data.headline} text={`Dominate Google Search and Local Maps in ${data.city}. We engineer mobile-first responsive websites, local 3-Pack rankings, and targeted advertising funnels that convert visitors into paying clients.`}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to="/contact" className="btn-primary shadow-glow">
            Book Free Consultation in {data.city} <ArrowRight className="h-4 w-4"/>
          </Link>
          {wa && (<a href={wa} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 fill-current"/> WhatsApp Direct (+91 98057 20962)
            </a>)}
        </div>
      </PageHero>

      <Section className="pt-4">
        {/* Location Visual Hero Banner */}
        <div className="relative mb-12 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <div className="relative aspect-[21/9] w-full min-h-[260px] sm:min-h-[340px] bg-slate-100">
            <img src={data.image} alt={`${data.city} digital growth and web engineering`} className="h-full w-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"/>
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="bg-white/95 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm max-w-xl">
                <p className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0"/> Verified Local Growth Partner - {data.city}, {data.region}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  Engineering bespoke websites and optimizing Google Local Search across {data.areas.slice(0, 3).join(', ')}.
                </p>
              </div>
              <Link to="/contact" className="btn btn-primary">
                Get Local Quote
              </Link>
            </div>
          </div>
        </div>

        {/* Value Pillars with Imagery */}
        <div className="grid gap-6 md:grid-cols-3 mb-14">
          {[
            {
                title: `Google Maps Dominance in ${data.city}`,
                desc: `Optimize your Google Business Profile for high-intent searches in ${data.city} and surrounding areas to capture nearby customers looking for your exact services.`,
                image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=600&q=80',
            },
            {
                title: 'Ultra-Fast Responsive Websites',
                desc: `Modern React 18 & Vite architecture with sub-second mobile loading speeds, accessible UI, and conversion-optimized quotation forms.`,
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            },
            {
                title: 'ROI-Driven Targeted Campaigns',
                desc: `Deploy geo-fenced Google and Meta Ad campaigns targeting customers across ${data.city} and ${data.region} with zero wasted ad spend.`,
                image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=600&q=80',
            },
        ].map((item, i) => (<div key={i} className="card card-hover p-0 overflow-hidden flex flex-col">
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-80"/>
                <span className="absolute top-3 left-3 chip bg-white/95 backdrop-blur-md text-primary font-bold shadow-xs">
                  Capability 0{i + 1}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed flex-1">{item.desc}</p>
              </div>
            </div>))}
        </div>

        {/* Localized Details & Coverage */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12 mb-14 border border-white/10">
          <SectionHead eyebrow="Regional Reach" title={`Serving Ambitious Enterprises in ${data.city} & Surrounding Hubs`} center={false}/>
          <div className="grid gap-8 lg:grid-cols-2 mt-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-1"/>
                <div>
                  <h4 className="font-bold text-white">Agency Headquarters & Coverage</h4>
                  <p className="text-sm text-muted">
                    Phase 5, Mohali, SAS Nagar, Punjab 160059, India
                  </p>
                  <p className="text-xs text-secondary mt-1">Focus Coverage: {data.landmark}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0 mt-1"/>
                <div>
                  <h4 className="font-bold text-white">Direct Phone Support</h4>
                  <a href="tel:+919805720962" className="text-sm text-secondary hover:underline font-semibold">
                    +91 98057 20962
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-1"/>
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
                  {data.areas.map((a) => (<span key={a} className="chip">{a}</span>))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <iframe title={`Map of ${data.city}`} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13719.648118029517!2d76.71239846665798!3d30.718712316499834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fee0091ff1a77%3A0x6b107e3251c27891!2sPhase%205%2C%20Sector%2059%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab%20160059!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="260" style={{ border: 0 }} allowFullScreen={false} loading="lazy"/>
            </div>
          </div>
        </div>

        {/* Explore Other Locations Navigation */}
        <div className="mb-14">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
            <span className="h-2 w-2 rounded-xs bg-blue-600"/>
            Explore Other Service Regions
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {Object.entries(LOCAL_DATA).map(([slugKey, loc]) => (<Link key={slugKey} to={`/locations/${slugKey}`} className={`btn btn-sm text-xs transition ${slugKey === normalizedSlug
                ? 'bg-primary text-white shadow-glow'
                : 'border border-white/15 bg-white/5 text-muted hover:text-ink hover:border-white/30'}`}>
                {loc.city}
              </Link>))}
          </div>
        </div>

        {/* Local Consultation Form */}
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <h2 className="text-3xl font-bold mb-3">Claim Your Free Website & SEO Audit for {data.city}</h2>
          <p className="text-muted mb-8 max-w-xl text-sm">
            Leave your details or current website. We will inspect your search presence in {data.city} and provide an actionable strategy and quote.
          </p>
          <div className="max-w-3xl">
            <ContactForm source={`location-${normalizedSlug}`}/>
          </div>
        </div>
      </Section>
    </>);
}
