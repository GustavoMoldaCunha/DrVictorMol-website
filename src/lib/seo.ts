import { SITE_URL } from '../config/site';

/** URL absoluta para meta tags, canonical e Schema.org */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, SITE_URL).href;
}

/** Canonical da página atual (normaliza trailing slash) */
export function canonicalFromPath(path: string): string {
  const url = new URL(path, SITE_URL);
  if (!url.pathname.endsWith('/') && url.pathname !== '') {
    url.pathname = `${url.pathname}/`;
  }
  return url.href;
}
