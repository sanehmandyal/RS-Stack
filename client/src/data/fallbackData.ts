import { originalFaqs, originalProjects, originalServices } from './originalData';

export const fallbackServices = originalServices;
export const fallbackProjects = originalProjects;
export const fallbackTestimonials: any[] = [];
export const fallbackFaqs = originalFaqs;

export const fallbackSettings = {
  businessName: 'RS Stack',
  tagline: 'Websites, Local SEO & Digital Growth for Businesses.',
  contactEmail: 'contact@rs-stack.com',
  phone: '+91 98057 20962',
  whatsappNumber: '919805720962',
  address: 'Phase 5, Mohali, SAS Nagar, Punjab 160059, India',
  social: {
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    github: 'https://github.com'
  },
  home: {
    heroHeadline: 'Turn Your Business Into a High-Converting Digital Engine.',
    heroSubheadline: 'We design elite websites, dominate local search rankings across Mohali, Chandigarh & worldwide, and engineer scalable custom applications that drive verifiable business revenue.',
    primaryCta: 'Get Free Consultation',
    secondaryCta: 'Explore Services'
  },
  tracking: { ga: null, gtm: null, metaPixel: null }
};
