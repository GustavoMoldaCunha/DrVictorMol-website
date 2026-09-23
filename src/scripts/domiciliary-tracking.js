const PAGE_PATH = '/ultrassonografia-domiciliar/';

const placements = [
  ['.service-hero', 'hero'],
  ['[aria-labelledby="quais-exames-domicilio"]', 'lista_exames'],
  ['[aria-labelledby="doppler-venoso-domiciliar"]', 'doppler_venoso'],
  ['[aria-labelledby="atendimento-particular-domiciliar"]', 'atendimento_particular'],
  ['[aria-labelledby="regioes-atendimento-domiciliar"]', 'regioes_atendidas'],
  ['[aria-labelledby="como-funciona-agendamento"]', 'como_funciona'],
  ['.service-final-cta', 'final_pagina'],
  ['.service-inline-cta', 'apos_introducao'],
  ['.navbar__mobile-menu', 'menu_mobile'],
  ['.navbar', 'menu'],
  ['footer', 'rodape'],
];

export function initDomiciliaryTracking(win = window, doc = document) {
  if (win.location.pathname.replace(/\/$/, '') !== PAGE_PATH.slice(0, -1)) return;
  if (win.__domiciliaryTrackingInitialized) return;
  win.__domiciliaryTrackingInitialized = true;
  // Preserve the existing queue and GTM's patched push method.
  win.dataLayer = win.dataLayer || [];

  const emit = (event, parameters = {}) => {
    win.dataLayer.push({
      event,
      service_name: 'ultrassonografia_domiciliar',
      page_path: PAGE_PATH,
      // Do not collect query strings, WhatsApp messages or patient information.
      page_location: win.location.origin + PAGE_PATH,
      cta_location: null,
      contact_method: null,
      is_primary_conversion: false,
      is_scheduling_cta: false,
      interaction_id: null,
      ...parameters,
    });
  };

  // Custom dataLayer event: does not duplicate GA4's automatic page_view.
  emit('domiciliary_page_view');

  doc.addEventListener('click', (event) => {
    const element = event.target?.closest?.('a, button');
    if (!element) return;
    const label = element.textContent || '';
    const scheduling = /\bagendar\b/i.test(label);
    let method = null;
    const href = element.getAttribute('href');
    if (href) {
      try {
        const url = new URL(href, win.location.origin);
        if (url.protocol === 'tel:') method = 'phone';
        if (['https:', 'http:'].includes(url.protocol) &&
          ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com'].includes(url.hostname)) {
          method = 'whatsapp';
        }
      } catch { /* Ignore malformed links without interfering with navigation. */ }
    }
    if (!method && !scheduling) return;

    const location = element.closest('.whatsapp-float')
      ? (win.matchMedia('(max-width: 768px)').matches ? 'fixo_mobile' : 'fixo_desktop')
      : placements.find(([selector]) => element.closest(selector))?.[1] || 'outro';
    const parameters = {
      cta_location: location,
      contact_method: method,
      is_scheduling_cta: scheduling,
      interaction_id: win.crypto.randomUUID(),
    };

    if (method === 'whatsapp') {
      emit('domiciliary_whatsapp_click', { ...parameters, is_primary_conversion: true });
    } else if (method === 'phone') {
      emit('domiciliary_phone_click', parameters);
    }
    if (scheduling) emit('domiciliary_schedule_click', parameters);
  }, { capture: true });
}
