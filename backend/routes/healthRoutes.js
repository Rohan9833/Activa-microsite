import { Router } from 'express';
import { dbState } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  const db = dbState();
  res.status(db === 'connected' ? 200 : 503).json({
    success: db === 'connected',
    status: db === 'connected' ? 'ok' : 'degraded',
    database: db,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default router;
