// Re-export services, real services offered by Growora with zero fabricated claims
export const originalServices = [
    {
        slug: 'business-website-development',
        title: 'Website Creation & Development',
        category: 'development',
        delivery: 'direct',
        order: 10,
        published: true,
        summary: 'Custom responsive, mobile-first websites designed to clearly present your services and turn visitors into enquiries.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        description: 'We design and engineer bespoke business websites built with modern technologies (React, Vite, Tailwind CSS). Every site is built around clean navigation, speed, accessibility, and clear inquiry routes (forms, WhatsApp, phone).',
        audience: ['Local service businesses', 'Retailers and traders', 'Consultants and professional firms'],
        deliverables: ['Custom responsive design across all screens', 'Clean semantic HTML and on-page SEO setup', 'Direct WhatsApp & phone integration', 'Lead capture inquiry form with instant email alerts', 'Full source code ownership upon completion'],
        benefits: ['Fast loading on mobile data', 'Credible online presence you fully own', 'Direct conversion routes for clients'],
        limitations: ['Content and photos are provided by client or coordinated as a separate content plan', 'Domain and hosting are separate third-party costs'],
        timeline: 'Typically 1-3 weeks depending on number of pages and content readiness.',
        faqs: [
            ['Will I own my website and code?', 'Yes. You receive 100% ownership of your source code and design upon handover.'],
            ['Is the website mobile-friendly?', 'Yes, every layout is tested on mobile, tablet, and desktop viewports.']
        ],
        related: ['local-seo-optimization', 'google-meta-advertising']
    },
    {
        slug: 'local-seo-optimization',
        title: 'Local Page SEO & Google Business Profile',
        category: 'local',
        delivery: 'direct',
        order: 20,
        published: true,
        summary: 'Improve your local visibility on Google Search and Maps across your target service areas.',
        image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
        description: 'We audit and optimize your local search presence: Google Business Profile configuration, NAP (Name, Address, Phone) citation consistency, local schema markup, and geo-targeted service area pages.',
        audience: ['Local service providers', 'Clinics, salons, restaurants, and retail stores in Mohali, Punjab & HP'],
        deliverables: ['Google Business Profile complete audit and setup', 'Local schema markup implementation (LocalBusiness/ProfessionalService)', 'NAP citation consistency checks', 'Service area page strategy', 'Review response guidance'],
        benefits: ['Easier for nearby customers searching on mobile to find and call you', 'Accurate hours, address, and contact details everywhere'],
        limitations: ['Google search algorithms change regularly; no ethical agency guarantees specific rank positions'],
        timeline: 'Initial setup in 1-2 weeks, with indexing updates taking 3-6 weeks.',
        faqs: [
            ['Do you guarantee #1 ranking on Google?', 'No. Nobody can honestly guarantee a #1 Google ranking. We apply evidence-based technical and on-page best practices to maximize your visibility.']
        ],
        related: ['business-website-development', 'google-meta-advertising']
    },
    {
        slug: 'on-page-seo-optimization',
        title: 'On-Page SEO & Content Architecture',
        category: 'seo',
        delivery: 'direct',
        order: 30,
        published: true,
        summary: 'Structured heading hierarchies, semantic HTML5, Core Web Vitals speed tuning, and high-intent keyword optimization.',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        description: 'We engineer your site pages so Google and search engines crawl, index, and understand your content effortlessly, boosting organic discovery.',
        audience: ['Businesses needing higher organic search traffic', 'E-commerce and professional service pages'],
        deliverables: ['Semantic HTML5 structure audit', 'Meta titles, descriptions & OpenGraph tags', 'Core Web Vitals sub-second speed optimization', 'Structured schema markup (JSON-LD)'],
        benefits: ['Higher organic rankings on Google', 'Better click-through rates from search results'],
        limitations: ['Ranking reflects domain history and competitive landscape over time'],
        timeline: '1-2 weeks for full technical optimization.',
        faqs: [
            ['What is On-Page SEO?', 'It includes optimizing your code, headings, meta tags, and internal link structure directly on your website pages.']
        ],
        related: ['off-page-seo-backlinks', 'business-website-development']
    },
    {
        slug: 'off-page-seo-backlinks',
        title: 'Off-Page SEO & Authority Link Building',
        category: 'seo',
        delivery: 'direct',
        order: 40,
        published: true,
        summary: 'Reputable directory listings, industry citations, and white-hat digital PR to boost domain authority.',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
        description: 'Ethical off-page SEO strategies to build genuine domain credibility, high-authority backlink profiles, and trust signals across web indexes.',
        audience: ['Growing companies looking to outperform established competitors', 'Regional brands aiming for regional authority'],
        deliverables: ['High-authority citation development', 'Local business directory inclusion', 'Brand mention monitoring', 'Competitor backlink gap analysis'],
        benefits: ['Strengthened domain rating (DR)', 'Sustainable organic ranking defense against algorithm updates'],
        limitations: ['Strictly zero black-hat or spam links; all outreach is quality-screened'],
        timeline: 'Ongoing monthly strategy with quarterly milestone reports.',
        faqs: [
            ['Do you use spam link networks?', 'Never. We only pursue legitimate citations and high-trust business directories.']
        ],
        related: ['on-page-seo-optimization', 'local-seo-optimization']
    },
    {
        slug: 'google-meta-advertising',
        title: 'Google Ads & PPC Campaign Management',
        category: 'ads',
        delivery: 'mixed',
        order: 50,
        published: true,
        summary: 'Targeted pay-per-click (PPC) and search advertising campaigns to reach prospective clients actively searching for your services.',
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
        description: 'We set up and manage search and social ad campaigns with targeted keyword intent, ad copy, dedicated landing pages, and conversion tracking.',
        audience: ['Businesses seeking immediate inbound inquiries', 'Brands launching new services or locations'],
        deliverables: ['Target audience & keyword research', 'Ad copy drafting and creative banners', 'Conversion tracking and analytics integration', 'Transparent performance reporting'],
        benefits: ['Immediate targeted traffic', 'Full control over daily advertising budget'],
        limitations: ['Ad spend budget is paid directly to Google/Meta by the client'],
        timeline: 'Campaign setup launched within 3-5 business days.',
        faqs: [
            ['How much ad budget should I start with?', 'We recommend starting with a manageable test budget suited to your local market competition.']
        ],
        related: ['local-seo-optimization', 'business-website-development']
    },
    {
        slug: 'cloud-hosting-devops',
        title: 'Domain, Cloud Hosting & SSL Setup',
        category: 'infrastructure',
        delivery: 'direct',
        order: 60,
        published: true,
        summary: 'Domain DNS configuration, fast edge cloud hosting, automated daily backups, and SSL HTTPS security certificates.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        description: 'We configure high-speed cloud infrastructure, SSL encryption certificates, DNS routing, and uptime monitoring so your website stays secure and blazing fast 24/7.',
        audience: ['Business owners wanting reliable website uptime and zero hosting headaches'],
        deliverables: ['DNS and nameserver configuration', 'Cloud hosting deployment', 'Automated SSL security (HTTPS)', 'Daily automated backups & security patches'],
        benefits: ['99.9% uptime reliability', 'Lightning-fast edge caching worldwide'],
        limitations: ['Domain and cloud hosting provider fees are paid directly to providers'],
        timeline: 'Configured in 1-2 business days.',
        faqs: [
            ['Do you manage DNS configuration?', 'Yes, we handle complete domain verification, DNS records, and email forwarding.']
        ],
        related: ['business-website-development', 'business-listing-setup']
    },
    {
        slug: 'business-listing-setup',
        title: 'Business Directory & Maps Listing Management',
        category: 'local',
        delivery: 'direct',
        order: 70,
        published: true,
        summary: 'Complete Google Maps, Apple Maps, Bing Places, and verified local business directory submission.',
        image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
        description: 'Ensuring your business NAP (Name, Address, Phone number) is 100% consistent across all tier-1 search engines and map navigation platforms.',
        audience: ['Brick-and-mortar storefronts', 'Service area businesses across Mohali, Chandigarh, Punjab & HP'],
        deliverables: ['Google Business Profile verification assistance', 'Bing Places for Business setup', 'Apple Maps Places listing', 'Tier-1 local directory submissions'],
        benefits: ['Zero customer confusion from mismatched phone numbers or addresses', 'Higher local citation trust score'],
        limitations: ['Google postcard or video verification depends on Google guidelines'],
        timeline: 'Submissions completed in 3-7 business days.',
        faqs: [
            ['Why is NAP consistency important?', 'Search engines use matching Name, Address, and Phone numbers across sites to verify your business authenticity.']
        ],
        related: ['local-seo-optimization', 'cloud-hosting-devops']
    }
];
// Honest, genuine demonstration projects clearly labeled as architectural samples
export const originalProjects = [
    {
        slug: 'demo-local-service-website',
        title: 'Local Service Business Platform',
        industry: 'Cleaning & Property Maintenance',
        category: 'websites',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'Local service business platform sample',
        summary: 'Sample implementation: a mobile-first quote-request website engineered for local service companies.',
        problem: 'Local service businesses often rely solely on word-of-mouth and lack a streamlined mobile quote-request route.',
        solution: 'Engineered a fast responsive website with dedicated service-area pages, WhatsApp click-to-chat, and an inquiry form that triggers instant notifications.',
        technologies: ['React 18', 'Tailwind CSS', 'Vite', 'Node.js'],
        services: ['business-website-development', 'local-seo-optimization'],
        results: ['Demonstration sample showing our standard mobile-first layout and conversion flow.']
    },
    {
        slug: 'demo-hospitality-local-presence',
        title: 'Cafe & Restaurant Visibility Framework',
        industry: 'Cafes & Hospitality',
        category: 'local_seo',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'Hospitality website sample',
        summary: 'Sample implementation: digital menu display and local Google Business Profile setup for dining venues.',
        problem: 'Venues often face lost visits due to inconsistent opening hours or hard-to-read PDF menus on mobile.',
        solution: 'Built an accessible mobile menu structure with direct table reservation links and structured LocalBusiness schema.',
        technologies: ['React', 'Local Schema Markup', 'Vite'],
        services: ['local-seo-optimization', 'business-website-development'],
        results: ['Demonstration sample showing our approach to local NAP consistency and mobile menu UX.']
    },
    {
        slug: 'demo-tour-agency-platform',
        title: 'Travel & Tour Operator Showcase',
        industry: 'Travel & Tourism',
        category: 'ecommerce',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'Travel agency showcase sample',
        summary: 'Sample implementation: tour package showcase pages with date/group inquiry forms and direct WhatsApp concierge.',
        problem: 'Tour packages require clear itinerary presentation and immediate inquiry channels for prospective travelers.',
        solution: 'Designed an editorial layout highlighting destination itineraries, inclusions, and direct one-click WhatsApp chat.',
        technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
        services: ['business-website-development', 'google-meta-advertising'],
        results: ['Demonstration sample showing our approach to itinerary display and inquiry capture.']
    },
    {
        slug: 'demo-ecommerce-boutique-store',
        title: 'Modern E-Commerce & Retail Showcase',
        industry: 'Retail & Fashion Boutique',
        category: 'ecommerce',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'Retail store and e-commerce platform sample',
        summary: 'Sample implementation: lightning-fast mobile catalog with instant WhatsApp checkout and localized inventory filtering.',
        problem: 'Independent retail stores face high customer drop-off on clunky checkout forms and slow e-commerce templates.',
        solution: 'Built a lightweight, responsive catalog with filtered category browsing, visual lookbooks, and direct WhatsApp / UPI checkout.',
        technologies: ['React 18', 'Tailwind CSS', 'Vite', 'Stripe & WhatsApp Flow'],
        services: ['business-website-development', 'conversion-rate-optimization'],
        results: ['Demonstration sample showing high-velocity mobile product browsing and instant lead conversion.']
    },
    {
        slug: 'demo-healthcare-clinic-portal',
        title: 'Healthcare & Aesthetic Clinic Presence',
        industry: 'Medical & Aesthetic Clinics',
        category: 'websites',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'Healthcare and clinic patient portal sample',
        summary: 'Sample implementation: HIPAA-aware appointment scheduling portal with verified doctor profiles and treatment guides.',
        problem: 'Patients seek clear treatment information and instant appointment slots rather than phone call queues.',
        solution: 'Designed an approachable clinic portal featuring clinician credentials, localized service areas, and direct booking inquiries.',
        technologies: ['React', 'MERN Stack', 'Node.js', 'Schema.org MedicalBusiness'],
        services: ['business-website-development', 'local-seo-optimization'],
        results: ['Demonstration sample showing streamlined patient booking flows and high-trust medical presentation.']
    },
    {
        slug: 'demo-corporate-consulting-hub',
        title: 'B2B Consulting & Legal Advisory Portal',
        industry: 'Corporate Advisory & Finance',
        category: 'websites',
        isDemo: true,
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'B2B corporate consulting portal sample',
        summary: 'Sample implementation: authority-focused digital portal with downloadable whitepapers, case briefs, and qualified lead scoring.',
        problem: 'Professional advisory firms struggle to separate themselves from generic commodity service providers online.',
        solution: 'Architected an editorial B2B portal highlighting verified domain expertise, client roadmaps, and confidential discovery intake forms.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
        services: ['business-website-development', 'conversion-rate-optimization'],
        results: ['Demonstration sample showing executive authority branding and enterprise lead qualification.']
    }
];
// Genuine FAQ addressing real questions without false claims
export const originalFaqs = [
    {
        _id: '1',
        question: 'Where is Growora located?',
        answer: 'Our registered headquarters is located at Phase 5, Mohali, SAS Nagar, Punjab 160059, India. We serve clients locally across Mohali, Chandigarh, Panchkula, Himachal Pradesh, Haryana, and globally.'
    },
    {
        _id: '2',
        question: 'How can I contact Growora directly?',
        answer: 'You can call or WhatsApp us directly at +91 98057 20962, email contact@growora.com, or submit the consultation form on our website.'
    },
    {
        _id: '3',
        question: 'Do you guarantee #1 ranking on Google?',
        answer: 'No. We strictly adhere to Google Search Essentials and never promise guaranteed #1 ranking. We implement evidence-based technical SEO, structured schema markup, and Google Business Profile optimization to maximize your eligibility to rank prominently.'
    },
    {
        _id: '4',
        question: 'Do I own the website and source code?',
        answer: 'Yes, 100%. Upon project handover, all source code, assets, and design files belong entirely to you with zero recurring proprietary lock-in.'
    },
    {
        _id: '5',
        question: 'What are the typical project timelines?',
        answer: 'Standard business websites are typically delivered within 1 to 3 weeks. Custom web applications and MERN stack systems range from 3 to 8 weeks depending on scope.'
    }
];
