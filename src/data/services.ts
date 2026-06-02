export const SERVICES = [
  {
    href: '/segunda-opiniao-exames-radiologicos/',
    title: 'Segunda Opinião de Exames Radiológicos',
    image: '/assets/services/SegundaOpiniao.webp',
    imageAlt: 'Segunda Opinião de Exames Radiológicos',
    overlayLighter: false,
  },
  {
    href: '/ultrassonografia-geral/',
    title: 'Ultrassonografia Geral',
    image: '/assets/services/UltrassonografiaGeral.webp',
    imageAlt: 'Ultrassonografia geral — exames com Doppler colorido',
    overlayLighter: true,
  },
  {
    href: '/ultrassonografia-domiciliar/',
    title: 'Ultrassonografia Domiciliar',
    image: '/assets/services/UltrassonografiaDomiciliar.webp',
    imageAlt: 'Ultrassonografia domiciliar no conforto da sua casa',
    overlayLighter: true,
  },
  {
    href: '/ultrassonografia-dermatologica/',
    title: 'Ultrassonografia Dermatológica',
    image: '/assets/services/UltrassonografiaDermatologica.webp',
    imageAlt: 'Ultrassonografia dermatológica de alta precisão',
    overlayLighter: true,
  },
  {
    href: '/ultrassonografia-para-guiar-procedimentos/',
    title: 'Ultrassonografia para Guiar Procedimentos',
    image: '/assets/services/UltrassonografiaParaGuiar.webp',
    imageAlt: 'Ultrassonografia para guiar procedimentos estéticos e cirúrgicos',
    overlayLighter: true,
  },
  {
    href: '/estetica-intima-masculina/',
    title: 'Estética Íntima Masculina',
    image: '/assets/services/EsteticaIntima.webp',
    imageAlt: 'Estética íntima masculina com segurança e naturalidade',
    overlayLighter: true,
  },
  {
    href: '/doppler-peniano-com-injecao-cavernosa/',
    title: 'Doppler Peniano com Injeção Cavernosa',
    image: '/assets/services/DopplerPeniano.webp',
    imageAlt: 'Doppler peniano com injeção cavernosa',
    overlayLighter: true,
  },
] as const;

export function serviceHref(path: string, base: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalized}`;
}
