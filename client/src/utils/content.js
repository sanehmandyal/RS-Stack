/** Static marketing copy. No invented statistics, clients, ratings or years of experience. */
export const INDUSTRIES = [
    {
        slug: 'cleaning-services', name: 'Cleaning Services', short: 'Quote requests and service areas that turn searches into bookings.',
        intro: 'Most people look for a cleaner on their phone, compare two or three options and contact whoever looks reliable and responds first.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
        features: ['Quote-request form with service type and property details', 'Service-area pages for each locality you cover', 'Google Business Profile set-up with accurate hours and areas', 'WhatsApp click-to-chat for quick questions', 'Before/after gallery using your own photos'],
        benefits: ['Be easy to find for “cleaning near me” searches', 'Reduce back-and-forth by collecting details up front'],
        services: ['business-website-development', 'local-seo-optimization'],
    },
    {
        slug: 'travel-agencies', name: 'Travel & Tourism Agencies', short: 'Tour listings and enquiry forms that capture travellers while they plan.',
        intro: 'Travellers research a lot before they ask for a quote. A clear site with tour details and an easy enquiry route keeps you in the running.',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
        features: ['Tour and package listing pages', 'Enquiry forms with dates and group size', 'Landing pages for ad campaigns', 'Blog content around destinations you actually sell', 'Consent-aware conversion tracking'],
        benefits: ['Give each tour its own searchable page', 'Send ad traffic to focused landing pages'],
        services: ['business-website-development', 'google-meta-advertising'],
    },
    {
        slug: 'cafes-restaurants', name: 'Cafes & Fine Dining', short: 'Interactive menus, reservation systems and location details.',
        intro: 'Diners check opening hours, menu and location before they come. Wrong details cost visits.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        features: ['Mobile-friendly menu pages', 'Location, hours and directions', 'Links to your reservation or ordering platform', 'Google Business Profile and listing accuracy', 'Photo-led social ad creative briefs'],
        benefits: ['Consistent hours and contact details across the web', 'A site that loads fast on mobile data'],
        services: ['business-website-development', 'local-seo-optimization'],
        note: 'Reservation and ordering links point to third-party systems. They are only shown as working once they are integrated and tested.',
    },
    {
        slug: 'hotels', name: 'Hotels & Luxury Stays', short: 'Room showcases, amenities and clear direct booking channels.',
        intro: 'Guests compare properties on photos, amenities, location and trust. A strong direct website supports every other channel.',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        features: ['Room and amenity pages', 'Enquiry form or link to your booking engine', 'Location and nearby-attractions content', 'Local SEO and Maps visibility work', 'Review-response workflow'],
        benefits: ['Present your property clearly in your own words', 'Provide a direct enquiry route'],
        services: ['business-website-development', 'local-seo-optimization'],
        note: 'Third-party booking engines and payment gateways require their own accounts and are connected only after testing.',
    },
    {
        slug: 'salons', name: 'Aesthetic Salons & Spas', short: 'Treatment menus, specialist profiles and easy appointment scheduling.',
        intro: 'Clients pick salons from photos, reviews and convenience. Show your work and make contacting you effortless.',
        image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
        features: ['Service and price menu pages', 'Gallery of your own work', 'Appointment enquiry form and WhatsApp link', 'Google Business Profile optimisation', 'Instagram/Facebook ad support'],
        benefits: ['Show services clearly and professionally', 'Be visible to people searching nearby'],
        services: ['business-website-development', 'google-meta-advertising'],
    },
    {
        slug: 'local-businesses', name: 'Retailers & Boutique Stores', short: 'Get found locally, showcase inventory and sell online seamlessly.',
        intro: 'Local shops compete with big online stores. Being easy to find nearby and easy to contact is a real advantage.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
        features: ['Product or category pages', 'Optional online store', 'Local SEO and directory listings', 'Store hours, map and contact details', 'Promotional landing pages'],
        benefits: ['Bring nearby customers through the door', 'Grow beyond walk-ins at your own pace'],
        services: ['business-website-development', 'local-seo-optimization'],
    },
    {
        slug: 'professional-services', name: 'Consultants & Corporate Firms', short: 'Authority-building portals for consultants, clinics, firms and executives.',
        intro: 'Clients choose professionals on trust. Clear service descriptions, honest information and easy contact build it.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
        features: ['Service and approach pages', 'Enquiry or consultation request form', 'Credentials shown only where real and verifiable', 'Local and technical SEO', 'Insight articles that answer client questions'],
        benefits: ['Present your expertise clearly', 'Qualify enquiries with the right questions'],
        services: ['business-website-development', 'conversion-rate-optimization'],
    },
];
export const PROCESS = [
    ['Discovery & business analysis', 'We learn about your business, customers, competitors and goals.'],
    ['Strategy & planning', 'We agree scope, priorities and a realistic plan in writing.'],
    ['UI/UX design', 'We design clear, mobile-first layouts and review them with you.'],
    ['Development & integration', 'We build, connect forms, tracking and any agreed integrations.'],
    ['Testing, launch & optimisation', 'We test across devices, launch carefully and measure what happens.'],
    ['Ongoing maintenance & growth', 'We keep things secure and updated and improve based on real data.'],
];
export const PORTFOLIO_FILTERS = [
    ['', 'All'],
    ['websites', 'Websites'],
    ['local_seo', 'Local SEO'],
    ['ecommerce', 'E-commerce'],
    ['digital_marketing', 'Digital Marketing'],
];
export const NAV = [
    ['/', 'Home'],
    ['/services', 'Services'],
    ['/industries', 'Industries'],
    ['/locations', 'Locations'],
    ['/portfolio', 'Portfolio'],
    ['/about', 'About'],
    ['/blog', 'Blog'],
    ['/contact', 'Contact'],
];
export const DELIVERY_LABEL = {
    direct: 'Delivered directly by RS Stack',
    mixed: 'RS Stack work + third-party accounts',
    third_party_required: 'Requires third-party subscription',
};
