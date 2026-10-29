/**
 * Script to seed all website catalog data directly into the live Render MongoDB database.
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE_URL = 'https://rs-stack-api.onrender.com/api';
const ADMIN_EMAIL = 'admin@rs-stack.com';
const ADMIN_PASSWORD = 'RsStackAdmin@2026!#Secure';

const SERVICES = [
  {
    title: 'Website Creation & Development',
    slug: 'business-website-development',
    category: 'development',
    delivery: 'direct',
    order: 10,
    published: true,
    summary: 'Custom responsive, mobile-first websites designed to clearly present your services and turn visitors into enquiries.',
    description: 'We design and engineer bespoke business websites built with modern technologies (React, Vite, Tailwind CSS). Every site is built around clean navigation, speed, accessibility, and clear inquiry routes (forms, WhatsApp, phone).',
    audience: ['Local service businesses', 'Retailers and traders', 'Consultants and professional firms'],
    deliverables: ['Custom responsive design across all screens', 'Clean semantic HTML and on-page SEO setup', 'Direct WhatsApp & phone integration', 'Lead capture inquiry form with instant email alerts', 'Full source code ownership upon completion'],
    benefits: ['Fast loading on mobile data', 'Credible online presence you fully own', 'Direct conversion routes for clients'],
    limitations: ['Content and photos are provided by client or coordinated as a separate content plan', 'Domain and hosting are separate third-party costs'],
    timeline: 'Typically 1-3 weeks depending on number of pages and content readiness.',
    faqs: [
      { q: 'Will I own my website and code?', a: 'Yes. You receive 100% ownership of your source code and design upon handover.' },
      { q: 'Is the website mobile-friendly?', a: 'Yes, every layout is tested on mobile, tablet, and desktop viewports.' }
    ]
  },
  {
    title: 'Local Page SEO & Google Business Profile',
    slug: 'local-seo-optimization',
    category: 'local',
    delivery: 'direct',
    order: 20,
    published: true,
    summary: 'Improve your local visibility on Google Search and Maps across your target service areas.',
    description: 'We audit and optimize your local search presence: Google Business Profile configuration, NAP (Name, Address, Phone) citation consistency, local schema markup, and geo-targeted service area pages.',
    audience: ['Local service providers', 'Clinics, salons, restaurants, and retail stores in Mohali, Punjab & HP'],
    deliverables: ['Google Business Profile complete audit and setup', 'Local schema markup implementation (LocalBusiness/ProfessionalService)', 'NAP citation consistency checks', 'Service area page strategy', 'Review response guidance'],
    benefits: ['Easier for nearby customers searching on mobile to find and call you', 'Accurate hours, address, and contact details everywhere'],
    limitations: ['Google search algorithms change regularly; no ethical agency guarantees specific rank positions'],
    timeline: 'Initial setup in 1-2 weeks, with indexing updates taking 3-6 weeks.',
    faqs: [
      { q: 'Do you guarantee #1 ranking on Google?', a: 'No. Nobody can honestly guarantee a #1 Google ranking. We apply evidence-based technical and on-page best practices to maximize your visibility.' }
    ]
  },
  {
    title: 'On-Page SEO & Content Architecture',
    slug: 'on-page-seo-optimization',
    category: 'seo',
    delivery: 'direct',
    order: 30,
    published: true,
    summary: 'Structured heading hierarchies, semantic HTML5, Core Web Vitals speed tuning, and high-intent keyword optimization.',
    description: 'We engineer your site pages so Google and search engines crawl, index, and understand your content effortlessly, boosting organic discovery.',
    audience: ['Businesses needing higher organic search traffic', 'E-commerce and professional service pages'],
    deliverables: ['Semantic HTML5 structure audit', 'Meta titles, descriptions & OpenGraph tags', 'Core Web Vitals sub-second speed optimization', 'Structured schema markup (JSON-LD)'],
    benefits: ['Higher organic rankings on Google', 'Better click-through rates from search results'],
    limitations: ['Ranking reflects domain history and competitive landscape over time'],
    timeline: '1-2 weeks for full technical optimization.',
    faqs: [
      { q: 'What is On-Page SEO?', a: 'It includes optimizing your code, headings, meta tags, and internal link structure directly on your website pages.' }
    ]
  },
  {
    title: 'Off-Page SEO & Authority Link Building',
    slug: 'off-page-seo-backlinks',
    category: 'seo',
    delivery: 'direct',
    order: 40,
    published: true,
    summary: 'Reputable directory listings, industry citations, and white-hat digital PR to boost domain authority.',
    description: 'Ethical off-page SEO strategies to build genuine domain credibility, high-authority backlink profiles, and trust signals across web indexes.',
    audience: ['Growing companies looking to outperform established competitors', 'Regional brands aiming for regional authority'],
    deliverables: ['High-authority citation development', 'Local business directory inclusion', 'Brand mention monitoring', 'Competitor backlink gap analysis'],
    benefits: ['Strengthened domain rating (DR)', 'Sustainable organic ranking defense against algorithm updates'],
    limitations: ['Strictly zero black-hat or spam links; all outreach is quality-screened'],
    timeline: 'Ongoing monthly strategy with quarterly milestone reports.',
    faqs: [
      { q: 'Do you use spam link networks?', a: 'Never. We only pursue legitimate citations and high-trust business directories.' }
    ]
  },
  {
    title: 'Google Ads & PPC Campaign Management',
    slug: 'google-meta-advertising',
    category: 'ads',
    delivery: 'mixed',
    order: 50,
    published: true,
    summary: 'Targeted pay-per-click (PPC) and search advertising campaigns to reach prospective clients actively searching for your services.',
    description: 'We set up and manage search and social ad campaigns with targeted keyword intent, ad copy, dedicated landing pages, and conversion tracking.',
    audience: ['Businesses seeking immediate inbound inquiries', 'Brands launching new services or locations'],
    deliverables: ['Target audience & keyword research', 'Ad copy drafting and creative banners', 'Conversion tracking and analytics integration', 'Transparent performance reporting'],
    benefits: ['Immediate targeted traffic', 'Full control over daily advertising budget'],
    limitations: ['Ad spend budget is paid directly to Google/Meta by the client'],
    timeline: 'Campaign setup launched within 3-5 business days.',
    faqs: [
      { q: 'How much ad budget should I start with?', a: 'We recommend starting with a manageable test budget suited to your local market competition.' }
    ]
  },
  {
    title: 'Domain, Cloud Hosting & SSL Setup',
    slug: 'cloud-hosting-devops',
    category: 'infrastructure',
    delivery: 'direct',
    order: 60,
    published: true,
    summary: 'Domain DNS configuration, fast edge cloud hosting, automated daily backups, and SSL HTTPS security certificates.',
    description: 'We configure high-speed cloud infrastructure, SSL encryption certificates, DNS routing, and uptime monitoring so your website stays secure and blazing fast 24/7.',
    audience: ['Business owners wanting reliable website uptime and zero hosting headaches'],
    deliverables: ['DNS and nameserver configuration', 'Cloud hosting deployment', 'Automated SSL security (HTTPS)', 'Daily automated backups & security patches'],
    benefits: ['99.9% uptime reliability', 'Lightning-fast edge caching worldwide'],
    limitations: ['Domain and cloud provider registration fees are billed directly by registrars'],
    timeline: 'Configured and active in 1-2 business days.',
    faqs: [
      { q: 'Will you manage the DNS configuration?', a: 'Yes, we handle complete domain verification, DNS records, and email forwarding.' }
    ]
  },
  {
    title: 'Business Directory & Maps Listing Management',
    slug: 'business-listing-setup',
    category: 'local',
    delivery: 'direct',
    order: 70,
    published: true,
    summary: 'Complete Google Maps, Apple Maps, Bing Places, and verified local business directory submission.',
    description: 'Ensuring your business NAP (Name, Address, Phone number) is 100% consistent across all tier-1 search engines and map navigation platforms.',
    audience: ['Brick-and-mortar storefronts', 'Service area businesses across Mohali, Chandigarh, Punjab & HP'],
    deliverables: ['Google Business Profile verification assistance', 'Bing Places for Business setup', 'Apple Maps Places listing', 'Tier-1 local directory submissions'],
    benefits: ['Zero customer confusion from mismatched phone numbers or addresses', 'Higher local citation trust score'],
    limitations: ['Google postcard or video verification depends on Google guidelines'],
    timeline: 'Submissions completed in 3-7 business days.',
    faqs: [
      { q: 'Why is NAP consistency important?', a: 'Search engines use matching Name, Address, and Phone numbers across sites to verify your business authenticity.' }
    ]
  }
];

const PROJECTS = [
  {
    title: 'Local Service Business Platform',
    slug: 'demo-local-service-website',
    industry: 'Cleaning & Property Maintenance',
    category: 'websites',
    isDemo: true,
    published: true,
    order: 10,
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    thumbnailAlt: 'Local service business platform sample',
    summary: 'A mobile-first quote-request website engineered for local service companies.',
    problem: 'Local service businesses often rely solely on word-of-mouth and lack a streamlined mobile quote-request route.',
    solution: 'Engineered a fast responsive website with dedicated service-area pages, WhatsApp click-to-chat, and an inquiry form that triggers instant notifications.',
    technologies: ['React 18', 'Tailwind CSS', 'Vite', 'Node.js'],
    services: ['business-website-development', 'local-seo-optimization'],
    results: ['Demonstration sample showing our standard mobile-first layout and conversion flow.']
  },
  {
    title: 'Cafe & Restaurant Visibility Framework',
    slug: 'demo-hospitality-local-presence',
    industry: 'Cafes & Hospitality',
    category: 'local_seo',
    isDemo: true,
    published: true,
    order: 20,
    thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    thumbnailAlt: 'Hospitality website sample',
    summary: 'Digital menu display and local Google Business Profile setup for dining venues.',
    problem: 'Venues often face lost visits due to inconsistent opening hours or hard-to-read PDF menus on mobile.',
    solution: 'Built an accessible mobile menu structure with direct table reservation links and structured LocalBusiness schema.',
    technologies: ['React 18', 'Local SEO', 'JSON-LD Schema'],
    services: ['local-seo-optimization', 'business-listing-setup'],
    results: ['Demonstration layout engineered for rapid mobile menu browsing and direct reservation calls.']
  },
  {
    title: 'Travel Agency Inquiry Platform',
    slug: 'demo-tour-agency-platform',
    industry: 'Travel & Tourism',
    category: 'digital_marketing',
    isDemo: true,
    published: true,
    order: 30,
    thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    thumbnailAlt: 'Travel agency inquiry platform',
    summary: 'Tour package presentation with dedicated inquiry routes and ad-ready conversion pages.',
    problem: 'Tour operators need ad visitors to reach specific tour itineraries rather than a confusing generic home page.',
    solution: 'Engineered itinerary landing pages with WhatsApp chat, inquiry capture, and consent-aware analytics.',
    technologies: ['React 18', 'Google Analytics 4', 'Meta Pixel'],
    services: ['google-meta-advertising', 'business-website-development'],
    results: ['Demonstration tour layout engineered for PPC campaign traffic and direct booking inquiries.']
  }
];

const SETTINGS = {
  businessName: 'Growora',
  tagline: 'Websites, Local SEO & Digital Growth for Businesses.',
  contactEmail: 'contact@growora.com',
  phone: '+91 98057 20962',
  whatsappNumber: '919805720962',
  address: 'Phase 5, Mohali, SAS Nagar, Punjab 160059, India',
  social: {
    linkedin: 'https://linkedin.com',
    x: 'https://twitter.com'
  },
  home: {
    heroHeadline: 'Turn Your Business Into a High-Converting Digital Engine.',
    heroSubheadline: 'We design elite websites, dominate local search rankings across Mohali, Chandigarh & worldwide, and engineer scalable custom applications that drive verifiable business revenue.',
    primaryCta: 'Get Free Consultation',
    secondaryCta: 'Explore Services'
  }
};

async function main() {
  console.log('Logging in as super admin...');
  const loginRes = await fetch(`${BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  }

  const cookie = loginRes.headers.get('set-cookie');
  const loginData = await loginRes.json();
  const csrf = loginData.csrfToken;
  console.log('Logged in successfully as', loginData.user.email);

  const authHeaders = {
    'Content-Type': 'application/json',
    'Cookie': cookie,
    'X-CSRF-Token': csrf
  };

  // 1. Seed Services
  console.log('\n--- Seeding 7 Services ---');
  for (const s of SERVICES) {
    try {
      const res = await fetch(`${BASE_URL}/admin/services`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(s)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✓ Created service: "${s.title}" (${s.slug})`);
      } else {
        console.log(`- Service "${s.slug}" notice: ${data.error || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(`x Error seeding service ${s.slug}:`, err.message);
    }
  }

  // 2. Seed Projects
  console.log('\n--- Seeding Projects ---');
  for (const p of PROJECTS) {
    try {
      const res = await fetch(`${BASE_URL}/admin/projects`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(p)
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✓ Created project: "${p.title}" (${p.slug})`);
      } else {
        console.log(`- Project "${p.slug}" notice: ${data.error || JSON.stringify(data)}`);
      }
    } catch (err) {
      console.error(`x Error seeding project ${p.slug}:`, err.message);
    }
  }

  // 3. Update Site Settings
  console.log('\n--- Updating Site Settings ---');
  try {
    const res = await fetch(`${BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(SETTINGS)
    });
    console.log('Settings update status:', res.status, (await res.json()).businessName || 'Updated');
  } catch (err) {
    console.error('Settings update error:', err.message);
  }

  // 4. Verify Services Count
  const verifyRes = await fetch(`${BASE_URL}/admin/services`, { headers: authHeaders });
  const verifyData = await verifyRes.json();
  console.log('\n=== FINAL VERIFICATION ===');
  console.log(`Admin Services Count in Database: ${verifyData.total} items`);
  console.log(verifyData.items.map(s => ` - [${s.category}] ${s.title} (${s.slug})`).join('\n'));

  const pubRes = await fetch(`${BASE_URL}/public/services`);
  const pubData = await pubRes.json();
  console.log(`\nPublic Services Count from API: ${pubData.items?.length || 0} items`);
}

main().catch(console.error);
