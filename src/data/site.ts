export const site = {
  name: 'AV Infotech',
  legalName: 'Aashirwad Dubey',
  tradeName: 'AV INFOTECH',
  gstin: '23GLJPD1335K1Z9',
  url: 'https://avinfotechsolutions.in',
  email: 'hello@avinfotechsolutions.in',
  careersEmail: 'careers@avinfotechsolutions.in',
  phone: '+91 91794 32212',
  phoneHref: '+919179432212',
  tagline: 'AI · Software · Consulting',
  description:
    'Trusted technology partner for government and public-sector institutions. AI consulting, generative AI, and custom software — secure, compliant, made in India.',
  address: {
    street: 'Plot No. 4, Lake View Society, Bal Bharti School, Ratibad Road',
    locality: 'Neelbad',
    city: 'Bhopal',
    region: 'Madhya Pradesh',
    postalCode: '462044',
    country: 'IN',
  },
  registrationDate: '2025-11-19',
  social: {
    linkedin: '',
    twitter: '',
    github: '',
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const nav: NavItem[] = [
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services/ai-consulting',
    children: [
      { label: 'AI Consulting', href: '/services/ai-consulting' },
      { label: 'Generative AI', href: '/services/generative-ai' },
      { label: 'Custom Software', href: '/services/custom-software' },
    ],
  },
  { label: 'Capabilities', href: '/capabilities' },
  {
    label: 'Work',
    href: '/case-studies',
    children: [
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Certifications', href: '/certifications' },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    children: [
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];
