import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import demoRequestRoutes from './routes/demoRequestRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (env.trustProxy > 0) app.set('trust proxy', env.trustProxy);

  app.use(helmet());

  const isSameOrigin = (origin, req) => {
    try {
      return new URL(origin).host === req.get('host');
    } catch {
      return false;
    }
  };

  // Allowed: no Origin (server-to-server), same origin (site served by this server),
  // or an origin listed in CORS_ORIGINS.
  const corsMw = cors((req, cb) => {
    const origin = req.get('origin');
    if (!origin || isSameOrigin(origin, req) || env.corsOrigins.includes(origin)) {
      return cb(null, {
        origin: true,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Accept'],
        maxAge: 86400,
      });
    }
    return cb(new Error('CORS_NOT_ALLOWED'));
  });

  app.use('/api', corsMw, apiLimiter, express.json({ limit: '10kb' }));
  app.use('/api/health', healthRoutes);
  app.use('/api/demo-requests', demoRequestRoutes);
  app.use('/api', notFound);

  // Optional: serve the built React app from the same server.
  const dist = path.resolve(__dirname, '../frontend/dist');
  if (env.serveFrontend && fs.existsSync(dist)) {
    app.use(
      helmet.contentSecurityPolicy({
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
        },
      })
    );
    app.use(express.static(dist, { maxAge: '7d', index: false }));
    app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    app.use(notFound);
  }

  app.use(errorHandler);
  return app;
}
