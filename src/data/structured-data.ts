import {
  CLINIC,
  CONTACT,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
} from '../config/site';
import { absoluteUrl } from '../lib/seo';

const physicianId = `${SITE_URL}/#physician`;
const clinicId = `${SITE_URL}/#clinic`;
const websiteId = `${SITE_URL}/#website`;

export const physicianSchema = {
  '@type': 'Physician',
  '@id': physicianId,
  name: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl('/assets/hero/Victor.webp'),
  medicalSpecialty: ['Radiology', 'Neuroradiology'],
  telephone: CONTACT.phoneE164,
  email: CONTACT.email,
  sameAs: [CONTACT.instagram],
  worksFor: { '@id': clinicId },
} as const;

const clinicSchema = {
  '@type': 'MedicalClinic',
  '@id': clinicId,
  name: CLINIC.name,
  url: CLINIC.mapsUrl,
  image: absoluteUrl('/assets/locations/Maps.webp'),
  telephone: CONTACT.phoneE164,
  email: CONTACT.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: CLINIC.streetAddress,
    addressLocality: CLINIC.addressLocality,
    addressRegion: CLINIC.addressRegion,
    postalCode: CLINIC.postalCode,
    addressCountry: CLINIC.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: CLINIC.geo.latitude,
    longitude: CLINIC.geo.longitude,
  },
  parentOrganization: { '@id': physicianId },
} as const;

export function homeStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: SITE_LANGUAGE,
        publisher: { '@id': physicianId },
      },
      physicianSchema,
      clinicSchema,
    ],
  };
}

export function serviceStructuredData(options: {
  pathname: string;
  name: string;
  description: string;
  imagePath?: string;
  breadcrumbLabel: string;
}) {
  const pageUrl = absoluteUrl(options.pathname);
  const procedure: Record<string, unknown> = {
    '@type': 'MedicalProcedure',
    name: options.name,
    description: options.description,
    url: pageUrl,
    provider: { '@id': physicianId },
  };
  if (options.imagePath) {
    procedure.image = absoluteUrl(options.imagePath);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      procedure,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Serviços',
            item: `${SITE_URL}#servicos`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: options.breadcrumbLabel,
            item: pageUrl,
          },
        ],
      },
      physicianSchema,
    ],
  };
}
