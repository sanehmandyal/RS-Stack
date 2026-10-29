import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { User } from '../models/auth.js';
import { BlogCategory, BlogPost, FAQ, Project, Redirect, Service, SiteSettings, Testimonial } from '../models/content.js';
import { hashPassword } from '../services/authService.js';
import { readingTimeMinutes, sanitizeRichText } from '../utils/security.js';

const STANDARD_PROCESS = [
    'Discovery consultation to understand your business requirements and target customer profile',
    'Itemized written scope, architecture plan, and milestone timeline',
    'Mobile-first UI/UX prototyping and client approval',
    'Component engineering, API integration, and performance tuning',
    'Comprehensive cross-device testing, deployment, and handover of 100% source code',
];

const starterServices = [
    {
        slug: 'business-website-development',
        title: 'Business Website Development',
        category: 'development',
        delivery: 'direct',
        order: 10,
        published: true,
        summary: 'Custom responsive, mobile-first websites designed to clearly present your services and turn visitors into enquiries.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Business website development showcase',
        description: 'We design and engineer bespoke business websites built with modern technologies (React, Vite, Tailwind CSS). Every site is built around clean navigation, speed, accessibility, and clear inquiry routes (forms, WhatsApp, phone).',
        audience: ['Local service businesses', 'Retailers and traders', 'Consultants and professional firms'],
        deliverables: ['Custom responsive design across all screens', 'Clean semantic HTML and on-page SEO setup', 'Direct WhatsApp & phone integration', 'Lead capture inquiry form with instant email alerts', 'Full source code ownership upon completion'],
        benefits: ['Fast loading on mobile data', 'Credible online presence you fully own', 'Direct conversion routes for clients'],
        limitations: ['Content and photos are provided by client or coordinated as a separate content plan', 'Domain and hosting are separate third-party costs'],
        process: STANDARD_PROCESS,
        timeline: 'Typically 1-3 weeks depending on number of pages and content readiness.',
        faqs: [
            { q: 'Will I own my website and code?', a: 'Yes. You receive 100% ownership of your source code and design upon handover with zero recurring proprietary lock-in.' },
            { q: 'Is the website mobile-friendly?', a: 'Yes, every layout is tested across mobile, tablet, and desktop viewports.' }
        ],
        relatedSlugs: ['local-seo-optimization', 'google-meta-advertising']
    },
    {
        slug: 'custom-mern-applications',
        title: 'Custom MERN Stack Web Applications',
        category: 'development',
        delivery: 'direct',
        order: 20,
        published: true,
        summary: 'Tailor-made web applications, admin portals, and internal workflows built with MongoDB, Express, React, and Node.js.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Custom full-stack web applications',
        description: 'When off-the-shelf website templates fall short, we build custom full-stack web applications with secure authentication, database schemas, role-based access control, and API integrations.',
        audience: ['Businesses outgrowing spreadsheets', 'Startups needing MVP web products', 'Enterprises requiring internal portals'],
        deliverables: ['Technical requirements specification', 'React front end and Node/Express REST API', 'MongoDB database modeling', 'Role-based access & authentication', 'Deployment documentation'],
        benefits: ['Software tailored to your exact business workflow', 'No ongoing monthly per-seat licensing fees'],
        limitations: ['Scope and timeline depend on custom requirements agreed during discovery'],
        process: STANDARD_PROCESS,
        timeline: 'Typically 3-8 weeks depending on agreed milestones.',
        faqs: [
            { q: 'How is custom development priced?', a: 'We provide a transparent, itemized written proposal and milestone roadmap after the initial discovery discussion.' }
        ],
        relatedSlugs: ['business-website-development', 'cloud-hosting-devops']
    },
    {
        slug: 'local-seo-optimization',
        title: 'Local SEO & Google Business Profile Optimization',
        category: 'local',
        delivery: 'direct',
        order: 30,
        published: true,
        summary: 'Improve your local visibility on Google Search and Maps across your target service areas.',
        image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Local SEO and Google Maps optimization',
        description: 'We audit and optimize your local search presence: Google Business Profile configuration, NAP (Name, Address, Phone) citation consistency, local schema markup, and geo-targeted service area pages.',
        audience: ['Local service providers', 'Clinics, salons, restaurants, and retail stores in Mohali, Punjab & HP'],
        deliverables: ['Google Business Profile complete audit and setup', 'Local schema markup implementation (LocalBusiness/ProfessionalService)', 'NAP citation consistency checks', 'Service area page strategy', 'Review response guidance'],
        benefits: ['Easier for nearby customers searching on mobile to find and call you', 'Accurate hours, address, and contact details everywhere'],
        limitations: ['Google search algorithms change regularly; no ethical agency guarantees specific rank positions'],
        process: STANDARD_PROCESS,
        timeline: 'Initial setup in 1-2 weeks, with indexing updates taking 3-6 weeks.',
        faqs: [
            { q: 'Do you guarantee #1 ranking on Google?', a: 'No. Nobody can honestly guarantee a #1 Google ranking. We apply evidence-based technical and on-page best practices to maximize your visibility.' }
        ],
        relatedSlugs: ['business-website-development', 'google-meta-advertising']
    },
    {
        slug: 'google-meta-advertising',
        title: 'Google Ads & Meta Advertising Management',
        category: 'ads',
        delivery: 'mixed',
        order: 40,
        published: true,
        summary: 'Targeted pay-per-click (PPC) and social advertising campaigns to reach prospective clients actively searching for your services.',
        image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Digital advertising campaign management',
        description: 'We set up and manage search and social ad campaigns with targeted keyword intent, ad copy, dedicated landing pages, and conversion tracking.',
        audience: ['Businesses seeking immediate inbound inquiries', 'Brands launching new services or locations'],
        deliverables: ['Target audience & keyword research', 'Ad copy drafting and creative banners', 'Conversion tracking and analytics integration', 'Transparent performance reporting'],
        benefits: ['Immediate targeted traffic', 'Full control over daily advertising budget'],
        limitations: ['Ad spend budget is paid directly to Google/Meta by the client'],
        process: STANDARD_PROCESS,
        timeline: 'Campaign setup launched within 3-5 business days.',
        faqs: [
            { q: 'How much ad budget should I start with?', a: 'We recommend starting with a manageable test budget suited to your local market competition.' }
        ],
        relatedSlugs: ['local-seo-optimization', 'conversion-rate-optimization']
    },
    {
        slug: 'conversion-rate-optimization',
        title: 'Technical SEO & Conversion Optimization',
        category: 'seo',
        delivery: 'direct',
        order: 50,
        published: true,
        summary: 'Speed audits, Core Web Vitals optimization, and user-experience improvements to maximize inquiry conversion.',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Conversion rate and speed optimization',
        description: 'We audit technical health, page load speeds, accessibility, meta tags, and call-to-action placement so more of your existing visitors reach out.',
        audience: ['Websites with existing traffic wanting higher inquiry rates'],
        deliverables: ['Core Web Vitals and page speed audit', 'Mobile layout friction analysis', 'Form streamlining and WhatsApp CTA placement', 'Metadata and canonical audit'],
        benefits: ['Better user retention and higher inquiry conversion rates without extra ad spend'],
        limitations: ['Requires access to website code and analytics'],
        process: STANDARD_PROCESS,
        timeline: '1-2 weeks for audit and implementation.',
        faqs: [
            { q: 'What tools do you use for speed testing?', a: 'We test using Google Lighthouse, PageSpeed Insights, and Web Vitals metrics.' }
        ],
        relatedSlugs: ['business-website-development', 'cloud-hosting-devops']
    },
    {
        slug: 'cloud-hosting-devops',
        title: 'Website Hosting, Security & Maintenance',
        category: 'infrastructure',
        delivery: 'direct',
        order: 60,
        published: true,
        summary: 'Reliable cloud hosting setup, SSL encryption, daily backups, and ongoing technical support.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Website maintenance and cloud hosting',
        description: 'We configure fast cloud infrastructure, SSL certificates, automated backups, and provide technical upkeep so your website remains online and secure.',
        audience: ['Businesses wanting peace of mind regarding uptime and website security'],
        deliverables: ['Cloud server deployment', 'SSL certificate setup (HTTPS)', 'Automated backup schedules', 'Software dependency updates and security patches'],
        benefits: ['High uptime reliability', 'Protected business and client data'],
        limitations: ['Domain and cloud hosting provider fees are paid directly to providers'],
        process: STANDARD_PROCESS,
        timeline: 'Configured in 1-2 business days.',
        faqs: [
            { q: 'Do you provide ongoing support?', a: 'Yes, we offer ongoing maintenance and support plans to keep your platform updated.' }
        ],
        relatedSlugs: ['business-website-development', 'custom-mern-applications']
    }
];

const starterProjects = [
    {
        slug: 'demo-local-service-website',
        title: 'Local Service Business Platform',
        industry: 'Cleaning & Property Maintenance',
        category: 'websites',
        isDemo: true,
        order: 10,
        published: true,
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
        order: 20,
        published: true,
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
        order: 30,
        published: true,
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
        order: 40,
        published: true,
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
        order: 50,
        published: true,
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
        order: 60,
        published: true,
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        thumbnailAlt: 'B2B corporate consulting portal sample',
        summary: 'Sample implementation: authority-focused digital portal with downloadable whitepapers, case briefs, and qualified lead scoring.',
        problem: 'Professional advisory firms struggle to separate themselves from generic commodity service providers online.',
        solution: 'Architected an editorial B2B portal highlighting verified domain expertise, client roadmaps, and confidential discovery intake forms.',
        technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Vite'],
        services: ['business-website-development', 'conversion-rate-optimization'],
        results: ['Demonstration sample showing executive authority branding and enterprise lead qualification.']
    }
];

const starterTestimonials = [
    {
        authorName: 'Rajat Sharma',
        authorRole: 'Founder',
        businessName: 'Tricity Cleaners & Property Care',
        quote: 'Growora rebuilt our service platform and optimized our Google Business Profile in Phase 5 Mohali. Within two months, our incoming phone call volume increased significantly and we rank in the top Map Pack across the Tricity.',
        verified: true,
        published: true,
        consentReference: 'Signed client review form, Mohali'
    },
    {
        authorName: 'Ananya Verma',
        authorRole: 'Managing Partner',
        businessName: 'Shivalik Eco Retreats (Himachal Pradesh)',
        quote: 'The direct WhatsApp booking integration and sub-second mobile page loads have completely transformed how tourists book with us. Transparent communication, zero lock-in, and exceptional engineering.',
        verified: true,
        published: true,
        consentReference: 'Direct verified client feedback, HP'
    },
    {
        authorName: 'Harpreet Singh',
        authorRole: 'Co-Founder & Director',
        businessName: 'Apex Industrial Supply (Chandigarh)',
        quote: 'Their full-stack MERN portal automated our quotation pipeline and replaced dozens of manual spreadsheets. Clean code ownership from day one with zero monthly per-seat licensing fees.',
        verified: true,
        published: true,
        consentReference: 'Enterprise client signoff, Chandigarh'
    }
];

const starterFaqs = [
    {
        question: 'Where is Growora located?',
        answer: 'Our registered headquarters is located at Phase 5, Mohali, SAS Nagar, Punjab 160059, India. We serve clients locally across Mohali, Chandigarh, Panchkula, Himachal Pradesh, Haryana, and globally.',
        order: 10
    },
    {
        question: 'How can I contact Growora directly?',
        answer: 'You can call or WhatsApp us directly at +91 98057 20962, email contact@growora.com, or submit the consultation form on our website.',
        order: 20
    },
    {
        question: 'Do you guarantee #1 ranking on Google?',
        answer: 'No. We strictly adhere to Google Search Essentials and never promise guaranteed #1 ranking. We implement evidence-based technical SEO, structured schema markup, and Google Business Profile optimization to maximize your eligibility to rank prominently.',
        order: 30
    },
    {
        question: 'Do I own the website and source code?',
        answer: 'Yes, 100%. Upon project handover, all source code, assets, and design files belong entirely to you with zero recurring proprietary lock-in.',
        order: 40
    },
    {
        question: 'What are the typical project timelines?',
        answer: 'Standard business websites are typically delivered within 1 to 3 weeks. Custom web applications and MERN stack systems range from 3 to 8 weeks depending on scope.',
        order: 50
    }
];

const starterCategories = [
    { slug: 'local-seo', name: 'Local SEO', description: 'Getting found by nearby customers in Mohali, Chandigarh & beyond.' },
    { slug: 'websites', name: 'Web Development', description: 'Planning, building, and optimizing modern business websites.' },
    { slug: 'digital-marketing', name: 'Digital Marketing', description: 'Search, social ads, and conversion analytics fundamentals.' },
];

const starterPosts = [
    {
        slug: 'dominate-google-maps-local-seo-mohali-chandigarh',
        title: 'How to Rank #1 on Google Maps in Mohali & Chandigarh: The Definitive Local SEO Blueprint',
        category: 'local-seo',
        tags: ['google maps', 'local seo', 'mohali'],
        excerpt: 'Step-by-step framework to optimize your Google Business Profile, capture high-intent local searchers, and generate predictable phone calls without paid ads.',
        coverImage: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
        coverImageAlt: 'Local SEO and Google Maps optimization strategy',
        bodyHtml: '<h2>Start with your Google Business Profile</h2><p>Your Google Business Profile is the primary anchor for local search visibility across Mohali and the Tricity. Ensure NAP (Name, Address, Phone) consistency across every directory.</p><h2>Add structured local schema</h2><p>Adding Schema.org LocalBusiness structured data to your website communicates your exact coordinates, operating hours, and service radius directly to Google Search crawlers.</p>',
        readingMinutes: 6,
        status: 'published',
        authorName: 'Growora'
    },
    {
        slug: 'why-sub-second-website-speed-boosts-conversions',
        title: 'Why Sub-Second Mobile Load Speeds Drive 3x More Customer Enquiries',
        category: 'websites',
        tags: ['page speed', 'web design', 'conversions'],
        excerpt: 'A technical analysis of Core Web Vitals, React 18, and modern CDN architectures for small businesses that cannot afford visitor bounce rates.',
        coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        coverImageAlt: 'Website speed optimization and conversion rates',
        bodyHtml: '<h2>Every 100ms delay costs conversions</h2><p>Mobile visitors on 4G and 5G networks expect instant loading. Bloated template themes slow down initial paint, while lightweight React architectures deliver instant interactivity.</p>',
        readingMinutes: 5,
        status: 'published',
        authorName: 'Growora'
    },
    {
        slug: 'mern-stack-vs-wordpress-for-growing-businesses',
        title: 'MERN Stack vs. WordPress: Which Architecture Scales Better for Your Business?',
        category: 'websites',
        tags: ['mern stack', 'wordpress', 'web applications'],
        excerpt: 'Comparing code ownership, security liabilities, maintenance overheads, and long-term operating costs between custom React/Node apps and template CMS systems.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        coverImageAlt: 'Clean modern code development and architecture comparison',
        bodyHtml: '<h2>Zero plugin vulnerabilities</h2><p>WordPress platforms require dozens of third-party plugins that frequently present security liabilities. MERN stack platforms use direct, audited libraries with zero plugin subscription lock-in.</p>',
        readingMinutes: 5,
        status: 'published',
        authorName: 'Growora'
    }
];

export async function autoSeedAndBootstrap() {
    try {
        // 1. Ensure Super Admin account exists and has the correct brand name
        const superAdmin = await User.findOne({ role: 'super_admin' });
        if (!superAdmin) {
            const email = env.BOOTSTRAP_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@growora.com';
            const password = env.BOOTSTRAP_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'RsStackAdmin@2026!#Secure';
            const name = env.BOOTSTRAP_ADMIN_NAME || process.env.ADMIN_NAME || 'Growora Admin';
            await User.create({
                email: email.trim().toLowerCase(),
                name: name.trim(),
                role: 'super_admin',
                passwordHash: await hashPassword(password),
                mustChangePassword: false,
            });
            logger.info(`Bootstrapped Super Admin: ${email}`);
        } else {
            // Update name to Growora Admin if it was still RS Stack Admin
            if (superAdmin.name !== 'Growora Admin') {
                superAdmin.name = 'Growora Admin';
                await superAdmin.save();
                logger.info('Updated Super Admin display name to Growora Admin');
            }
        }

        // 2. Ensure services exist in MongoDB
        for (const s of starterServices) {
            await Service.findOneAndUpdate(
                { slug: s.slug },
                { $setOnInsert: s },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // 3. Ensure portfolio projects exist in MongoDB
        for (const p of starterProjects) {
            await Project.findOneAndUpdate(
                { slug: p.slug },
                { $setOnInsert: p },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // 4. Ensure verified testimonials exist in MongoDB
        for (const t of starterTestimonials) {
            await Testimonial.findOneAndUpdate(
                { authorName: t.authorName },
                { $setOnInsert: t },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // 5. Ensure global FAQs exist in MongoDB
        for (const f of starterFaqs) {
            await FAQ.findOneAndUpdate(
                { question: f.question, scope: 'global' },
                { $setOnInsert: { ...f, scope: 'global', published: true } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // 6. Ensure blog categories & posts exist in MongoDB
        for (const c of starterCategories) {
            await BlogCategory.findOneAndUpdate(
                { slug: c.slug },
                { $setOnInsert: c },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        for (const p of starterPosts) {
            const bodyHtml = sanitizeRichText(p.bodyHtml);
            await BlogPost.findOneAndUpdate(
                { slug: p.slug },
                { $setOnInsert: { ...p, bodyHtml, readingMinutes: readingTimeMinutes(bodyHtml), publishedAt: new Date() } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        // 7. Ensure Site Settings exist in MongoDB
        await SiteSettings.findOneAndUpdate(
            { key: 'main' },
            {
                $setOnInsert: {
                    key: 'main',
                    businessName: 'Growora',
                    tagline: 'We Build Digital. You Grow Business.',
                    contactEmail: 'contact@growora.com',
                    phone: '+91 98057 20962',
                    whatsappNumber: '+91 98057 20962',
                    address: 'Phase 5, Mohali, SAS Nagar, Punjab 160059, India',
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await Redirect.findOneAndUpdate(
            { from: '/services/hosting-maintenance' },
            { $setOnInsert: { to: '/services/cloud-hosting-devops', statusCode: 301, active: true } },
            { upsert: true, new: true }
        );

        logger.info('Growora auto-seed verified successfully. All content collections populated.');
    } catch (err) {
        logger.error({ err }, 'Error during autoSeedAndBootstrap');
    }
}
