import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();
const server = app.listen(env.port, () => {
  console.log(`[api] ActiVA API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down…`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
