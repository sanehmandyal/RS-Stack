import { Helmet } from 'react-helmet-async';
import { useSettings } from '../hooks/useSettings';
export function Seo({ title, description, path = '/', noindex = false, type = 'website', image = '/logo.png', jsonLd = [], keywords = [
    'website development company in Mohali',
    'website designer SAS Nagar',
    'local SEO services Mohali Chandigarh',
    'Google Business Profile optimization Mohali',
    'custom web development agency',
    'MERN stack web application development',
    'Google Ads management',
    'affordable business websites',
], }) {
    const settings = useSettings();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rs-stack.com';
    const canonical = path !== undefined ? `${origin}${path === '/' ? '' : path}` : origin;
    const fullImage = image.startsWith('http') ? image : `${origin}${image}`;
    // Schema for LocalBusiness + ProfessionalService with NAP in Mohali SAS Nagar
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${origin}/#organization`,
        name: settings.businessName || 'RS Stack',
        url: origin,
        logo: `${origin}/logo.png`,
        image: fullImage,
        description: description,
        telephone: '+919805720962',
        email: settings.contactEmail || 'contact@rs-stack.com',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Phase 5',
            addressLocality: 'Mohali',
            addressRegion: 'Punjab',
            postalCode: '160059',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '30.7187',
            longitude: '76.7179',
        },
        areaServed: [
            { '@type': 'City', name: 'Mohali' },
            { '@type': 'City', name: 'Chandigarh' },
            { '@type': 'City', name: 'Panchkula' },
            { '@type': 'City', name: 'Zirakpur' },
            { '@type': 'Country', name: 'India' },
            { '@type': 'Country', name: 'United States' },
            { '@type': 'Country', name: 'United Kingdom' },
            { '@type': 'Country', name: 'Canada' },
            { '@type': 'Country', name: 'Australia' },
        ],
        sameAs: Object.values(settings.social).filter(Boolean),
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '19:00',
            },
        ],
    };
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: settings.businessName || 'RS Stack',
        description: 'Bespoke Website Development, Local SEO & Digital Growth Agency in Mohali, Punjab and Global.',
        publisher: { '@id': `${origin}/#organization` },
    };
    const combinedLd = [localBusinessSchema, websiteSchema, ...jsonLd];
    return (<Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title}/>
      <meta name="description" content={description}/>
      <meta name="keywords" content={keywords.join(', ')}/>
      <meta name="author" content="RS Stack"/>
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}/>
      {canonical && <link rel="canonical" href={canonical}/>}

      {/* Geo Location Tags for Local SEO - Phase 5 Mohali SAS Nagar */}
      <meta name="geo.region" content="IN-PB"/>
      <meta name="geo.placename" content="Phase 5, Mohali, SAS Nagar, Punjab 160059"/>
      <meta name="geo.position" content="30.7187;76.7179"/>
      <meta name="ICBM" content="30.7187, 76.7179"/>

      {/* Open Graph / Facebook / WhatsApp Preview */}
      <meta property="og:type" content={type}/>
      <meta property="og:url" content={canonical}/>
      <meta property="og:title" content={title}/>
      <meta property="og:description" content={description}/>
      <meta property="og:image" content={fullImage}/>
      <meta property="og:site_name" content="RS Stack"/>
      <meta property="og:locale" content="en_IN"/>

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:url" content={canonical}/>
      <meta name="twitter:title" content={title}/>
      <meta name="twitter:description" content={description}/>
      <meta name="twitter:image" content={fullImage}/>

      {/* JSON-LD Schemas */}
      {combinedLd.map((ld, i) => (<script key={i} type="application/ld+json">
          {JSON.stringify(ld).replace(/</g, '\\u003c')}
        </script>))}
    </Helmet>);
}
export const breadcrumbLd = (items) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rs-stack.com';
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map(([name, path], i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name,
            item: `${origin}${path === '/' ? '' : path}`,
        })),
    };
};
