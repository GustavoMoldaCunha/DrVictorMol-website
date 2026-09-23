import test from 'node:test';
import assert from 'node:assert/strict';
import { initDomiciliaryTracking } from '../src/scripts/domiciliary-tracking.js';

function setup({ mobile = false, path = '/ultrassonografia-domiciliar/' } = {}) {
  const queue = [{ event: 'existing_event', id: 'preserved' }];
  const listeners = [];
  const win = {
    location: { pathname: path, origin: 'https://www.victormol.com.br', search: '?patient=private' },
    dataLayer: queue, crypto: { randomUUID: () => 'interaction-test' },
    matchMedia: () => ({ matches: mobile }),
  };
  const doc = { addEventListener: (name, listener) => listeners.push(listener) };
  initDomiciliaryTracking(win, doc);
  return {
    win, doc, queue, listeners,
    click({ href = 'https://wa.me/5521992347895?text=private', text = '', parents = [] } = {}) {
      const element = {
        textContent: text,
        getAttribute: () => href,
        closest: selector => parents.includes(selector) ? element : null,
      };
      // Simulate an icon nested inside a CTA.
      listeners[0]({ target: { closest: () => element } });
    },
  };
}

test('preserves queue and initializes only once on the target page', () => {
  const app = setup();
  initDomiciliaryTracking(app.win, app.doc);
  assert.equal(app.win.dataLayer, app.queue);
  assert.deepEqual(app.queue[0], { event: 'existing_event', id: 'preserved' });
  assert.equal(app.queue.filter(e => e.event === 'domiciliary_page_view').length, 1);
  assert.equal(app.listeners.length, 1);
  assert.equal(setup({ path: '/ultrassonografia-geral/' }).queue.length, 1);
});

test('all current CTA placements are distinguished', () => {
  for (const [selector, expected] of [
    ['.service-hero', 'hero'],
    ['[aria-labelledby="quais-exames-domicilio"]', 'lista_exames'],
    ['[aria-labelledby="doppler-venoso-domiciliar"]', 'doppler_venoso'],
    ['[aria-labelledby="atendimento-particular-domiciliar"]', 'atendimento_particular'],
    ['[aria-labelledby="regioes-atendimento-domiciliar"]', 'regioes_atendidas'],
    ['[aria-labelledby="como-funciona-agendamento"]', 'como_funciona'],
    ['.service-final-cta', 'final_pagina'], ['.service-inline-cta', 'apos_introducao'],
    ['.navbar', 'menu'], ['footer', 'rodape'],
  ]) {
    const app = setup();
    app.click({ parents: [selector] });
    assert.equal(app.queue.at(-1).cta_location, expected);
    assert.equal(app.queue.at(-1).is_primary_conversion, true);
  }
});

test('scheduling click has one primary conversion and a secondary event', () => {
  const app = setup();
  app.click({ text: 'AGENDAR PELO WHATSAPP', parents: ['.service-hero'] });
  assert.deepEqual(app.queue.slice(2).map(e => e.event), ['domiciliary_whatsapp_click', 'domiciliary_schedule_click']);
  assert.equal(app.queue.filter(e => e.is_primary_conversion).length, 1);
  assert.equal(app.queue.at(-1).is_primary_conversion, false);
  assert.equal(app.queue.at(-1).interaction_id, app.queue.at(-2).interaction_id);
  assert.ok(!JSON.stringify(app.queue).includes('private'));
  assert.ok(!JSON.stringify(app.queue).includes('5521992347895'));
});

test('fixed button identifies mobile and desktop; mobile menu takes precedence', () => {
  for (const mobile of [false, true]) {
    const app = setup({ mobile });
    app.click({ parents: ['.whatsapp-float'] });
    assert.equal(app.queue.at(-1).cta_location, mobile ? 'fixo_mobile' : 'fixo_desktop');
  }
  const app = setup({ mobile: true });
  app.click({ parents: ['.navbar', '.navbar__mobile-menu'] });
  assert.equal(app.queue.at(-1).cta_location, 'menu_mobile');
});

test('telephone and standalone scheduling are secondary, unrelated URLs ignored', () => {
  const app = setup();
  app.click({ href: 'tel:+5521992347895' });
  assert.equal(app.queue.at(-1).event, 'domiciliary_phone_click');
  assert.equal(app.queue.at(-1).is_primary_conversion, false);
  app.click({ href: null, text: 'Agendar' });
  assert.equal(app.queue.at(-1).event, 'domiciliary_schedule_click');
  const count = app.queue.length;
  app.click({ href: 'https://wa.me.example.com/' });
  app.click({ href: '/outra-pagina/' });
  assert.equal(app.queue.length, count);
});
