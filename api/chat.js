import catalog from '../server/catalog.json' with { type: 'json' };
import { replyTo } from '../server/reply.js';

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Gunakan POST.' }, {
        status: 405,
        headers: { Allow: 'POST' }
      });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return Response.json({ error: 'Format JSON tidak valid.' }, { status: 400 });
    }

    const message = payload?.message;
    if (typeof message !== 'string' || !message.trim() || [...message].length > 250) {
      return Response.json({ error: 'Pesan harus berisi 1–250 karakter.' }, { status: 400 });
    }

    return Response.json({ reply: replyTo(message, catalog) });
  }
};
