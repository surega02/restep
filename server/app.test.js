import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from './catalog.json' with { type: 'json' };
import { createApp } from './app.js';

test('chat selects the configured catalog and validates the message', async t => {
  const secondStore = { ...catalog, product: 'Produk kedua', price: 'Rp500.000', size: '43' };
  const app = createApp({ catalogs: new Map([['restep', catalog], ['kedua', secondStore]]) });
  t.after(() => app.close());
  const chat = (message, store = 'restep') => app.inject({
    method: 'POST',
    url: '/api/chat',
    headers: { 'x-store-id': store },
    payload: { message }
  });
  const restep = await chat('Harga dan kondisi?');
  assert.equal(restep.statusCode, 200);
  assert.match(restep.json().reply, /Rp1\.250\.000[\s\S]*8\/10/);
  assert.match((await chat('Ukuran 42 dan 43 ready?')).json().reply, /EU 43 tidak tersedia[\s\S]*EU 42/);
  assert.match((await chat('Harga dan ukuran?', 'kedua')).json().reply, /Rp500\.000[\s\S]*EU 43/);
  assert.match((await chat('cara pesan')).json().reply, /Simulasi pemesanan/);
  assert.match((await chat('bahan organik?')).json().reply, /belum punya informasi/);
  assert.equal((await chat('harga?', 'lain')).statusCode, 404);
  assert.equal((await chat(' ')).statusCode, 400);
  assert.equal((await chat('a'.repeat(251))).statusCode, 400);
});
