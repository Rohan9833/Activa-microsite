import 'dotenv/config';

const toInt = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || '',
  // Comma-separated list of allowed browser origins, e.g. "https://activa.digilateral.com,http://localhost:5173"
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  rateLimitWindowMin: toInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 15),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 10),
  // Number of reverse proxies in front of the app (Nginx, a PaaS load balancer, ...). 0 = none.
  trustProxy: toInt(process.env.TRUST_PROXY, 0),
  // When "true", Express also serves the built frontend from ../frontend/dist
  serveFrontend: String(process.env.SERVE_FRONTEND).toLowerCase() === 'true',
};

export const isProd = env.nodeEnv === 'production';
