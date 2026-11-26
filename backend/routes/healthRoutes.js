import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM && process.env.DEMO_RECIPIENT_EMAIL);
  res.status(configured ? 200 : 503).json({
    success: configured,
    status: configured ? 'ok' : 'not_configured',
    service: 'email',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
