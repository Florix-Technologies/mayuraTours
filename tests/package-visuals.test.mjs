import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { createRequire } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const nativeRequire = createRequire(import.meta.url);

const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, URL, require: id => {
    if (id.endsWith('.css')) return { __esModule: true, default: new Proxy({}, { get: (_, key) => String(key) }) };
    if (id === 'next/image') return { __esModule: true, default: ({ src, alt }) => React.createElement('img', { src, alt }) };
    if (id === 'next/link') return { __esModule: true, default: ({ children, href }) => React.createElement('a', { href }, children) };
    if (!id.startsWith('.') && !id.startsWith('@/')) return nativeRequire(id);
    const target = id.startsWith('@/') ? path.resolve('src', id.slice(2)) : path.resolve(path.dirname(file), id);
    return load([`${target}.ts`, `${target}.tsx`].find(candidate => fs.existsSync(candidate)));
  } });
  return exports;
}
const { resolvePackageVisuals, isImageSource, needsUnoptimizedImage } = load('src/lib/data/package-visuals.ts');
const { packages } = load('src/lib/data/packages.ts');
const base = { slug: 'new-package', name: 'New journey', image: '/uploads/cover.jpg', imageAlt: 'Uploaded destination' };

test('original destinations retain their approved avatars, backgrounds and special media', () => {
  for (const pkg of packages) {
    const visual = resolvePackageVisuals(pkg);
    assert.ok(fs.existsSync(`public${visual.avatar.src}`));
    assert.ok(fs.existsSync(`public${visual.backgroundImage}`));
    assert.equal(visual.hero.src, pkg.slug === 'goa' ? '/video/posters/beaches.jpg' : pkg.image);
  }
  assert.equal(resolvePackageVisuals(packages.find(p => p.slug === 'mysore-srirangapatna')).feature.title, 'A different perspective on Mysore.');
  assert.equal(resolvePackageVisuals(packages[0]).illustrations.length, 3);
});

test('another package reuses destination artwork without inheriting the old cover or booking content', () => {
  const pkg = { ...base, destinationKey: 'goa' };
  const visual = resolvePackageVisuals(pkg);
  assert.match(visual.avatar.src, /goa-new-avatar/);
  assert.equal(visual.hero.src, base.image);
  for (const field of ['demoContent', 'itinerary', 'price', 'highlights']) assert.equal(visual[field], undefined);
  assert.equal(pkg.image, base.image);
});

test('new destinations get neutral presentation, including when the cover is missing', () => {
  const visual = resolvePackageVisuals({ ...base, destination: 'Ladakh', image: '' });
  assert.equal(visual.name, 'Ladakh');
  assert.equal(visual.avatar, undefined);
  assert.equal(visual.video, undefined);
  assert.equal(visual.feature, undefined);
  assert.equal(visual.hero.src, '');
  assert.match(visual.backgroundImage, /travel-journal/);
});

test('explicit uploads override presets and legacy fields without changing package prices', () => {
  const visual = resolvePackageVisuals({ ...base, destinationKey: 'mysore', avatar: { src: '/old.png', alt: 'Old' }, visuals: { avatar: { src: '/new.png', alt: 'New' }, hero: { src: '/hero.png', alt: 'Hero' }, backgroundImage: '/art.svg', label: 'Custom label' } });
  assert.equal(visual.avatar.src, '/new.png');
  assert.equal(visual.hero.src, '/hero.png');
  assert.equal(visual.backgroundImage, '/art.svg');
  assert.equal(visual.label, 'Custom label');
});

test('unknown explicit destination never inherits artwork from a matching legacy URL', () => {
  const visual = resolvePackageVisuals({ ...base, slug: 'goa', destinationKey: 'new-destination' });
  assert.equal(visual.avatar, undefined);
  assert.equal(visual.hero.src, base.image);
});

test('uploaded assets allow local paths and valid HTTP URLs, reject unsafe or malformed sources', () => {
  for (const src of ['', '//other.example/a.png', 'javascript:alert(1)', 'https://', 'data:image/png;base64,abc']) assert.equal(isImageSource(src), false);
  assert.equal(isImageSource('/uploads/hero.webp'), true);
  assert.equal(isImageSource('https://cdn.example.com/hero.webp'), true);
  assert.equal(needsUnoptimizedImage('https://cdn.example.com/hero.webp'), true);
  assert.equal(needsUnoptimizedImage('https://images.unsplash.com/photo-example'), false);
});

test('new destination renders actual content, gallery and text highlights in the shared premium sections', () => {
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const pkg = { ...base, destination: 'Ladakh', description: 'Published Ladakh trip', tags: ['3 Days'], price: 'On request',
    highlights: [{ title: 'Local experiences', description: 'Published highlight' }],
    itinerary: [{ title: 'Arrival in Leh', description: 'Published day one' }, { title: 'Return' }],
    included: ['Local guide'], excluded: ['Flights'], gallery: [{ src: '/uploads/leh.jpg', alt: 'Leh gallery photo' }] };
  const html = renderToStaticMarkup(React.createElement(Experience, { pkg }));
  for (const text of ['Ladakh', 'Published highlight', 'Arrival in Leh', 'Local guide', 'Flights', '/uploads/leh.jpg']) assert.ok(html.includes(text), text);
  for (const id of ['overview', 'highlights', 'itinerary', 'included', 'photos', 'related']) assert.ok(html.includes(`id="${id}"`));
  const mainContent = html.split('id="related"')[0];
  assert.equal(mainContent.includes('goa-new-avatar'), false);
  assert.equal(mainContent.includes('mysore-illustration'), false);
});

test('missing new-package content renders explicit placeholders rather than destination sample data', () => {
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const html = renderToStaticMarkup(React.createElement(Experience, { pkg: { ...base, image: '', description: '', tags: [], price: 'On request' } }));
  assert.ok(html.includes('Destination highlights will be published soon'));
  assert.ok(html.includes('day-by-day itinerary has not been published'));
  assert.ok(html.includes('Package-specific inclusions have not been published'));
  assert.ok(html.includes('Package-specific exclusions have not been published'));
});
