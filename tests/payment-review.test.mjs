import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const exports = {};
const code = ts.transpileModule(fs.readFileSync('src/lib/booking/payment-review.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
vm.runInNewContext(code, { exports });
const { getPaymentReview, formatRupees } = exports;

test('checkout retains the existing per-person calculation without extra charges', () => {
  const intent = { travellers: '2', travelDate: '2026-10-30', accommodation: 'deluxe' };
  const review = getPaymentReview(intent, { priceValue: 6475, tags: ['2 Nights · 3 Days'] });
  assert.equal(review.pricePerPerson, 6475);
  assert.equal(review.travellerCount, 2);
  assert.equal(review.totalAmount, 12950);
  assert.equal(formatRupees(review.totalAmount), '₹12,950');
  assert.equal(review.startDate, '30 Oct 2026');
  assert.equal(review.endDate, '1 Nov 2026');
  assert.equal(intent.accommodation, 'deluxe');
});

test('unknown prices and dates remain unconfirmed; demo content is never used', () => {
  const review = getPaymentReview({ travellers: '3', travelDate: '2026-02-30' }, {
    tags: [], demoContent: { duration: '3 Days', priceValue: 100 },
  });
  assert.equal(review.totalAmount, null);
  assert.equal(formatRupees(review.totalAmount), 'On request');
  assert.equal(review.startDate, 'To be confirmed');
  assert.equal(review.endDate, 'To be confirmed');
  assert.equal(review.duration, 'To be confirmed');
});

test('same-day packages and leap-year month boundaries show correct dates', () => {
  const dayTrip = getPaymentReview({ travellers: '1', travelDate: '2026-10-23' }, { tags: ['Same-day return'] });
  assert.equal(dayTrip.startDate, dayTrip.endDate);
  const leapTrip = getPaymentReview({ travellers: '1', travelDate: '2028-02-28' }, { tags: ['2 Nights · 3 Days'] });
  assert.equal(leapTrip.endDate, '1 Mar 2028');
});
