import { createApp } from './app.js';

const app = createApp({ logger: true });
try {
  await app.listen({ host: '127.0.0.1', port: 3000 });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
