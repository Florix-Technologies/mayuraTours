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

test('every existing destination uses three distinct original SVG highlights without photos', () => {
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const { resolveHighlightIllustrations } = load('src/lib/data/highlight-illustrations.ts');
  const { packageDemoContent } = load('src/lib/data/package-demo-content.ts');
  for (const pkg of packages) {
    const highlights = pkg.highlights?.length ? pkg.highlights : packageDemoContent[pkg.slug]?.highlights;
    if (!highlights?.length) continue;
    const scenes = resolveHighlightIllustrations(highlights, `${pkg.destination || ''} ${pkg.name} ${pkg.slug}`);
    assert.equal(new Set(scenes).size, highlights.length, pkg.slug);
    const html = renderToStaticMarkup(React.createElement(Experience, { pkg }));
    const section = html.split('id="highlights"')[1].split('</section>')[0];
    assert.equal((section.match(/class="illustration"/g) || []).length, highlights.length, pkg.slug);
    assert.equal(section.split('class="grid"')[1].includes('<img'), false, pkg.slug);
    for (const theme of ['blue', 'pink', 'yellow']) assert.ok(section.includes(`data-theme="${theme}"`), pkg.slug);
  }
});

test('admin highlights render explicit custom images and select distinct fallback scenes', () => {
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const { resolveHighlightIllustrations } = load('src/lib/data/highlight-illustrations.ts');
  for (const titles of [['Experience one', 'Experience two', 'Experience three'], ['Mountain views', 'Mountain walk', 'Mountain peaks']]) {
    const highlights = titles.map(title => ({ title, image: '/uploads/highlight-photo.jpg', theme: 'pink' }));
    assert.equal(new Set(resolveHighlightIllustrations(highlights, 'Ladakh')).size, 3);
    const html = renderToStaticMarkup(React.createElement(Experience, { pkg: { ...base, tags: [], price: 'On request', highlights } }));
    const section = html.split('id="highlights"')[1].split('</section>')[0];
    assert.ok(section.includes('/uploads/highlight-photo.jpg'));
    assert.equal((section.match(/src="\/uploads\/highlight-photo.jpg"/g) || []).length, 3);
    for (const theme of ['blue', 'pink', 'yellow']) assert.ok(section.includes(`data-theme="${theme}"`));
  }
});

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
  assert.match(visual.avatar.src, /travel-journal/);
  assert.equal(visual.video, undefined);
  assert.equal(visual.feature, undefined);
  assert.match(visual.hero.src, /travel-journal/);
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
  assert.match(visual.avatar.src, /travel-journal/);
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

const { stateArtwork, resolveArtwork } = load('src/lib/data/state-artwork.ts');
test('28 states and 36 slots register only existing approved public assets', () => {
  assert.equal(Object.keys(stateArtwork).length, 28);
  assert.equal(Object.values(stateArtwork).flat().length, 36);
  for (const slots of Object.values(stateArtwork)) for (const slot of slots) {
    if (slot.image) {
      assert.equal(slot.status, 'approved');
      assert.ok(fs.existsSync(`public${slot.image.src}`));
    }
  }
});
test('existing packages select approved state artwork or original destination fallbacks', () => {
  for (const pkg of packages) {
    const result = resolvePackageVisuals(pkg);
    const activated = {
      'mysore-srirangapatna': '/images/package-artwork/overrides/mysore-palace-cutout.png',
      coorg: '/images/package-artwork/karnataka/nature.webp',
      chikmagalur: '/images/destinations/chikmagalur-avatar-3d.webp',
      'kerala-munnar': '/images/package-artwork/overrides/kerala-cultural.png',
      'ooty-coonoor': '/images/package-artwork/tamil-nadu/hills.webp',
    };
    const expected = activated[pkg.slug] || load('src/lib/data/destination-artwork.ts').destinationArtwork[pkg.slug].src;
    assert.equal(result.avatar.src, expected);
    assert.equal(resolvePackageVisuals(pkg).avatar.src, result.avatar.src);
  }
});
test('missing, unknown, aliases and manual overrides use safe deterministic selection', () => {
  for (const stateKey of Object.keys(stateArtwork)) {
    const image = resolveArtwork({ ...base, stateKey, experienceKey: 'not-supplied' }, 'unknown');
    assert.ok(fs.existsSync(`public${image.src}`));
  }
  assert.match(resolveArtwork({ ...base, stateKey: 'Karnataka', experienceKey: 'heritage' }, 'unknown').src, /karnataka\/heritage/);
  assert.equal(resolveArtwork({ ...base, stateKey: 'kerala', experienceKey: 'mountains' }, 'kerala-munnar').src, '/images/package-artwork/kerala/hills.webp');
  assert.equal(resolveArtwork({ ...base, artworkOverride: { src: '/custom.webp', alt: 'Custom' } }, 'unknown').src, '/custom.webp');
  assert.match(resolveArtwork({ ...base, artworkOverride: { src: 'javascript:bad', alt: '' } }, 'unknown').src, /travel-journal/);
  assert.match(resolveArtwork({ ...base, stateKey: 'goa', artworkOverride: { src: '/custom.webp', alt: '' } }, 'unknown').src, /goa-new-avatar/);
});
test('cover and separate hero are independent of artwork with safe invalid-source fallback', () => {
  const coverImage = { src: '/cover.webp', alt: 'Cover' };
  const heroImage = { src: 'https://cdn.example.com/hero.webp', alt: 'Hero' };
  assert.equal(resolvePackageVisuals({ ...base, coverImage }).hero.src, coverImage.src);
  assert.equal(resolvePackageVisuals({ ...base, coverImage, heroImage }).hero.src, heroImage.src);
  assert.equal(resolvePackageVisuals({ ...base, coverImage, heroImage: { src: 'javascript:bad', alt: '' } }).hero.src, coverImage.src);
});
test('highlight explicit categories survive repetition and invalid custom sources use SVGs', () => {
  const { resolveHighlightIllustrations } = load('src/lib/data/highlight-illustrations.ts');
  assert.deepEqual(Array.from(resolveHighlightIllustrations([{ title: 'A', category: 'tea' }, { title: 'B', illustration: 'tea' }])), ['tea', 'tea']);
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const html = renderToStaticMarkup(React.createElement(Experience, { pkg: { ...base, tags: [], highlights: [{ title: 'Tea', image: 'javascript:bad' }] } }));
  assert.ok(html.includes('class="illustration"'));
  assert.ok(!html.includes('javascript:bad'));
});

test('approved variations activate for future packages without changing their heroes', () => {
  for (const [stateKey, experienceKey] of [['kerala', 'hills'], ['karnataka', 'nature'], ['karnataka', 'wildlife'], ['kerala', 'backwaters'], ['kerala', 'coastal'], ['tamil-nadu', 'hills'], ['tamil-nadu', 'heritage'], ['tamil-nadu', 'coastal']]) {
    const pkg = { ...base, stateKey, experienceKey };
    const visual = resolvePackageVisuals(pkg);
    assert.equal(visual.avatar.src, `/images/package-artwork/${stateKey}/${experienceKey}.webp`);
    assert.equal(visual.hero.src, base.image);
    assert.equal(resolvePackageVisuals(pkg).avatar.src, visual.avatar.src);
  }
});
test('pending, rejected and missing variations never register production URLs', () => {
  assert.equal(Object.values(stateArtwork).flat().filter(slot => slot.status === 'approved').length, 9);
  for (const [stateKey, experienceKey, status] of [['andhra-pradesh', 'heritage', 'rejected'], ['andhra-pradesh', 'nature', 'missing']]) {
    const slot = stateArtwork[stateKey].find(slot => slot.experienceKey === experienceKey);
    assert.equal(slot.status, status);
    assert.equal(slot.image, undefined);
    assert.equal(fs.existsSync(`public/images/package-artwork/${stateKey}/${experienceKey}.webp`), false);
    assert.match(resolveArtwork({ ...base, stateKey, experienceKey }, 'unknown').src, /travel-journal/);
  }
  assert.equal(resolveArtwork({ ...base, stateKey: 'kerala', experienceKey: 'hills' }, 'kerala-munnar').src, '/images/package-artwork/kerala/hills.webp');
});

test('Karnataka package identity stays stable without substituting unrelated wildlife', () => {
  const before = JSON.stringify(stateArtwork);
  for (const slug of ['coorg', 'chikmagalur']) {
    const pkg = packages.find(item => item.slug === slug);
    const expected = pkg.artworkOverride?.src || '/images/package-artwork/karnataka/nature.webp';
    assert.equal(pkg.experienceKey, 'nature');
    assert.equal(resolvePackageVisuals(pkg).avatar.src, expected);
    assert.equal(resolvePackageVisuals({ ...pkg }).avatar.src, expected);
    assert.equal(resolveArtwork({ ...base, slug }, slug).src, '/images/package-artwork/karnataka/nature.webp');
  }
  assert.equal(resolveArtwork({ ...base, stateKey: 'karnataka', experienceKey: 'wildlife' }, 'unknown').src,
    '/images/package-artwork/karnataka/wildlife.webp');
  assert.equal(JSON.stringify(stateArtwork), before);
});

test('package-specific approved overrides remain independent of the 36 state slots', () => {
  const before = JSON.stringify(stateArtwork);
  for (const slug of ['chikmagalur', 'kerala-munnar']) {
    const pkg = packages.find(item => item.slug === slug);
    const original = resolvePackageVisuals(pkg);
    // Hypothetical approved upload: no candidate is installed or referenced by package data.
    const artworkOverride = { src: '/uploads/approved-package-specific.webp', alt: 'Approved package artwork' };
    const visual = resolvePackageVisuals({ ...pkg, artworkOverride });
    assert.equal(visual.avatar.src, artworkOverride.src);
    assert.equal(visual.hero.src, original.hero.src);
    assert.equal(resolvePackageVisuals(pkg).avatar.src, original.avatar.src);
  }
  assert.equal(JSON.stringify(stateArtwork), before);
  assert.equal(Object.values(stateArtwork).flat().length, 36);
});

test('activated package artwork is distinct and Mysore has no duplicate palace backdrop', () => {
  const bySlug = Object.fromEntries(packages.map(pkg => [pkg.slug, pkg]));
  const expected = {
    'mysore-srirangapatna': '/images/package-artwork/overrides/mysore-palace-cutout.png',
    'kerala-munnar': '/images/package-artwork/overrides/kerala-cultural.png',
    chikmagalur: '/images/destinations/chikmagalur-avatar-3d.webp',
    coorg: '/images/package-artwork/karnataka/nature.webp',
  };
  for (const [slug, src] of Object.entries(expected)) {
    assert.equal(resolvePackageVisuals(bySlug[slug]).avatar.src, src);
    assert.ok(fs.existsSync(`public${src}`));
  }
  assert.notEqual(resolvePackageVisuals(bySlug.coorg).avatar.src, resolvePackageVisuals(bySlug.chikmagalur).avatar.src);
  const Experience = load('src/components/packages/PackageExperience.tsx').default;
  const html = renderToStaticMarkup(React.createElement(Experience, { pkg: bySlug['mysore-srirangapatna'] }));
  assert.ok(html.includes(expected['mysore-srirangapatna']));
  assert.ok(!html.includes('class="mysorePalace"'));
  assert.ok(!html.includes('artworkStage mysoreStage'));
  assert.equal(Object.values(stateArtwork).flat().length, 36);
});


test('Munnar reusable hills slot preserves the cultural package override', () => {
  const future = { ...base, slug: 'future-munnar', stateKey: 'kerala', experienceKey: 'hills' };
  assert.equal(resolvePackageVisuals(future).avatar.src, '/images/package-artwork/kerala/hills.webp');
  assert.equal(resolvePackageVisuals(packages.find(pkg => pkg.slug === 'kerala-munnar')).avatar.src, '/images/package-artwork/overrides/kerala-cultural.png');
  assert.equal(Object.values(stateArtwork).flat().length, 36);
});
