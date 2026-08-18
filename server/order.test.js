import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateOrderSummary } from './server.js';

test('calculateOrderSummary totals subtotal, shipping, and total', () => {
  const result = calculateOrderSummary([
    { id: 'p-1', name: 'Demo', price: 100, quantity: 2 },
    { id: 'p-2', name: 'Demo 2', price: 50, quantity: 1 }
  ]);

  assert.equal(result.subtotal, 250);
  assert.equal(result.shipping, 18);
  assert.equal(result.total, 268);
});

test('calculateOrderSummary applies free shipping override when subtotal exceeds threshold', () => {
  const result = calculateOrderSummary([
    { id: 'p-1', name: 'Premium', price: 200, quantity: 2 }
  ]);

  assert.equal(result.shipping, 0);
  assert.equal(result.total, 400);
});
