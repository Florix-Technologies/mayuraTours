import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const booking = {
  slug: 'goa', packageName: 'Goa Beach Getaway', travelDate: '2026-10-30',
  travellers: '1', accommodation: 'deluxe', leadEmail: 'manual@example.com', leadPhone: '9876543210',
  travellerDetails: [{ fullName: 'Manually Edited Name', age: '40', gender: 'other' }],
};

function load(file, globals, mocks = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, { exports, URL, require: name => mocks[name], ...globals });
  return exports;
}

function harness(environment = 'development', host = 'localhost:3000', entries = new Map()) {
  const window = { location: { host }, sessionStorage: {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
  } };
  return { entries, api: load('src/lib/booking/development-payment.ts', { window, process: { env: { NODE_ENV: environment } } }) };
}

test('local preview preserves actual booking data, refreshes safely, and never writes a paid transaction', () => {
  const { api, entries } = harness();
  const original = JSON.stringify(booking);
  assert.equal(api.hasDevelopmentConfirmationPreview(booking), false);
  api.startDevelopmentConfirmationPreview(booking);
  assert.equal(api.hasDevelopmentConfirmationPreview(booking), true);
  assert.equal(JSON.stringify(booking), original);
  assert.equal(entries.size, 1);
  assert.equal(entries.has('mayura-booking-intent'), false);
  assert.deepEqual(JSON.parse([...entries.values()][0]), booking);
  const refreshed = harness('development', 'localhost:3000', entries);
  assert.equal(refreshed.api.hasDevelopmentConfirmationPreview(booking), true);
  assert.equal(api.hasDevelopmentConfirmationPreview({ ...booking, travellers: '2' }), false);
  assert.equal(api.hasDevelopmentConfirmationPreview({ ...booking, leadEmail: 'other@example.com' }), false);
});

test('production, test mode and non-loopback development hosts cannot start or replay previews', () => {
  const { api, entries } = harness();
  api.startDevelopmentConfirmationPreview(booking);
  for (const [environment, host] of [
    ['production', 'localhost:3000'], ['test', 'localhost:3000'],
    ['development', 'example.com'], ['development', '192.168.0.7:3000'],
    ['development', 'localhost.example.com'], ['development', 'localhost@evil.example'],
  ]) {
    const blocked = harness(environment, host, entries).api;
    assert.equal(blocked.hasDevelopmentConfirmationPreview(booking), false);
    assert.throws(() => blocked.startDevelopmentConfirmationPreview(booking));
  }
  assert.equal(api.isLocalDevelopmentHost('127.0.0.1:3000'), true);
  assert.equal(api.isLocalDevelopmentHost('[::1]:3000'), true);
});

test('preview requires a complete, valid booking and does not pretend to accept unpublished terms', () => {
  const { api } = harness();
  for (const invalid of [
    { ...booking, leadPhone: '' }, { ...booking, travelDate: '2026-02-30' },
    { ...booking, travellers: '2' }, { ...booking, accommodation: '' },
    { ...booking, travellerDetails: [{ ...booking.travellerDetails[0], age: '' }] },
  ]) assert.throws(() => api.startDevelopmentConfirmationPreview(invalid));
  assert.equal(api.isCompletePreviewBooking(booking), true);
  assert.equal('termsAccepted' in booking, false);
});

test('server confirmation route fails closed in production, regardless of client storage or query flags', async () => {
  const { api } = harness();
  for (const [environment, host, allowed] of [
    ['production', 'localhost:3000', false],
    ['development', 'example.com', false],
    ['development', 'localhost:3000', true],
  ]) {
    const helper = harness(environment, host).api;
    const { default: Page } = load('src/app/booking/confirmation/page.tsx', {
      process: { env: { NODE_ENV: environment } },
    }, {
      'next/headers': { headers: async () => ({ get: () => host }) },
      'next/navigation': { redirect: path => { throw new Error(`redirect:${path}`); } },
      '@/lib/booking/development-payment': helper,
      './BookingConfirmationPreview': { default: 'DevelopmentPreview' },
      'react/jsx-runtime': { jsx: type => ({ type }) },
    });
    if (allowed) assert.equal((await Page()).type, 'DevelopmentPreview');
    else await assert.rejects(Page(), /redirect:\/booking\/payment/);
  }
  assert.equal(api.isLocalDevelopmentHost('localhost'), true);
});
