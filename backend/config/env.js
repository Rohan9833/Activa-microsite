import 'dotenv/config';

const toInt = (v, d) => (Number.isFinite(parseInt(v, 10)) ? parseInt(v, 10) : d);
const toBool = (v) => String(v).toLowerCase() === 'true';

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toInt(process.env.PORT, 5000),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  rateLimitWindowMin: toInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 15),
  rateLimitMax: toInt(process.env.RATE_LIMIT_MAX, 10),
  trustProxy: toInt(process.env.TRUST_PROXY, 0),
  serveFrontend: toBool(process.env.SERVE_FRONTEND),
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: toInt(process.env.SMTP_PORT, 587),
  smtpSecure: toBool(process.env.SMTP_SECURE),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  mailFrom: process.env.MAIL_FROM || process.env.SMTP_USER || '',
  demoRecipient: process.env.DEMO_RECIPIENT_EMAIL || '',
};

export const isProd = env.nodeEnv === 'production';
