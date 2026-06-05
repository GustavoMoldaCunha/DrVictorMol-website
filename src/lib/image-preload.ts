/** MIME para `<link rel="preload" as="image">` a partir da extensão do arquivo. */
export function preloadImageType(src: string): string | undefined {
  const ext = src.split('?')[0].split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'webp':
      return 'image/webp';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'svg':
      return 'image/svg+xml';
    default:
      return undefined;
  }
}
