const configuredSite = import.meta.env.SITE;
const base =
  typeof configuredSite === 'string' && configuredSite.length > 0
    ? configuredSite
    : 'https://www.victormol.com.br';

/** URL canónica de produção — defina `site` em astro.config ou SITE_URL no deploy */
export const SITE_URL = base.replace(/\/$/, '');

export const SITE_NAME = 'Dr. Victor Mol';
export const SITE_TAGLINE = 'Radiologista — Ultrassonografia e Segunda Opinião';
export const SITE_LOCALE = 'pt_BR';
export const SITE_LANGUAGE = 'pt-BR';

export const DEFAULT_OG_IMAGE = '/assets/Victor.png';

export const CONTACT = {
  email: 'contato@victormol.com.br',
  phoneE164: '+5521992347895',
  instagram: 'https://www.instagram.com/dr_victormol/',
} as const;

export const CLINIC = {
  name: 'Clínica Le Derme',
  streetAddress: 'Rua Ator Paulo Gustavo, 229 – Shopping Icaraí – sala 1601',
  addressLocality: 'Niterói',
  addressRegion: 'RJ',
  postalCode: '24230-063',
  addressCountry: 'BR',
  geo: {
    latitude: -22.9066053,
    longitude: -43.1106608,
  },
  mapsUrl:
    'https://www.google.com/maps/place/Shopping+Icara%C3%AD/@-22.9066003,-43.1132357,17z',
} as const;
