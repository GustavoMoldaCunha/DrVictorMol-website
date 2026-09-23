import assert from 'node:assert/strict';
import fs from 'node:fs';
import sharp from 'sharp';
import { gzipSync } from 'node:zlib';

const route = '/ultrassonografia-domiciliar/';
const html = fs.readFileSync(`dist${route}index.html`, 'utf8');
const canonical = 'https://www.victormol.com.br' + route;
assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
assert.ok(html.includes('content="index, follow, max-image-preview:large"'));
assert.ok(html.includes('property="og:url" content="' + canonical + '"'));
assert.ok(fs.readFileSync('dist/sitemap-0.xml', 'utf8').includes(canonical));
assert.ok(fs.readFileSync('dist/robots.txt', 'utf8').includes('Allow: /'));

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const graph = schema['@graph'];
assert.ok(graph.some(node => node['@type'] === 'MedicalWebPage'));
const service = graph.find(node => node['@type'] === 'Service');
assert.equal(service.areaServed.length, 4);
assert.ok(graph.some(node => node['@id'] === service.provider['@id']));
assert.ok(!graph.some(node => node['@type'] === 'FAQPage'));

const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
for (const image of images) {
  assert.ok(/\balt="[^"]*"/.test(image), 'Missing image alt');
  assert.ok(/\bwidth="\d+"/.test(image), 'Missing image width');
  assert.ok(/\bheight="\d+"/.test(image), 'Missing image height');
}
const hero = images.find(image => image.includes('HeroUltrassomDomiciliar.webp'));
const imagePath = 'public/assets/service-pages/HeroUltrassomDomiciliar.webp';
const metadata = await sharp(imagePath).metadata();
assert.ok(hero.includes(`width="${metadata.width}"`));
assert.ok(hero.includes(`height="${metadata.height}"`));
assert.ok(hero.includes('fetchpriority="high"'));
assert.ok(hero.includes('loading="eager"'));
console.log(JSON.stringify({
  checks: 'passed', canonical, imageCount: images.length,
  hero: { format: metadata.format, width: metadata.width, height: metadata.height, bytes: fs.statSync(imagePath).size },
  htmlBytes: Buffer.byteLength(html), htmlGzipBytes: gzipSync(html).length,
  analyticsDetected: /gtag\(|GTM-[A-Z0-9]+|googletagmanager\.com|google-analytics\.com/.test(html),
}, null, 2));
