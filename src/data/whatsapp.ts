/** Número exibido no site */
export const WHATSAPP_PHONE_DISPLAY = '(21) 99234-7895';

/** Dígitos com código do país (55) — usado em wa.me e tel */
export const WHATSAPP_PHONE_E164 = '5521992347895';

/** Link oficial do WhatsApp */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE_E164}`;

/** Mensagem padrão do botão flutuante */
export const WHATSAPP_DEFAULT_MESSAGE = 'Olá, vim pelo site.';

export function getWhatsAppMessage(pathname: string): string | undefined {
  if (pathname.replace(/\/$/, '') === '/ultrassonografia-domiciliar') {
    return 'Olá! Gostaria de informações sobre ultrassom domiciliar. Posso enviar meu pedido médico e minha localização para consultar disponibilidade e valor?';
  }
}

export function buildWhatsAppUrl(message?: string): string {
  if (!message) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

/** Link do botão flutuante (com mensagem pré-preenchida) */
export const WHATSAPP_FLOAT_URL = buildWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE);
