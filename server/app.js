import Fastify from 'fastify';
import catalog from './catalog.json' with { type: 'json' };
import { replyTo } from './reply.js';

export function createApp({ logger = false, catalogs = new Map([['restep', catalog]]) } = {}) {
  const app = Fastify({ logger, bodyLimit: 4096 });

  app.get('/health', async () => ({ status: 'ok' }));
  app.post('/api/chat', {
    schema: {
      body: {
        type: 'object',
        required: ['message'],
        properties: { message: { type: 'string', minLength: 1, maxLength: 250, pattern: '\\S' } }
      }
    }
  }, async (request, response) => {
    const product = catalogs.get(request.headers['x-store-id'] ?? 'restep');
    if (!product) return response.code(404).send({ error: 'Toko tidak ditemukan.' });
    return { reply: replyTo(request.body.message, product) };
  });

  return app;
}
