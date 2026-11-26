import { Router } from 'express';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  const configured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.mailFrom && env.demoRecipient);
  res.status(configured ? 200 : 503).json({
    success: configured,
    status: configured ? 'ok' : 'not_configured',
    service: 'email',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
