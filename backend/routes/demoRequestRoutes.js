import { Router } from 'express';
import { createDemoRequest } from '../controllers/demoRequestController.js';
import { validateDemoRequest } from '../middleware/validateDemoRequest.js';
import { demoRequestLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Write-only: there is intentionally no GET/list endpoint for enquiries.
router.post('/', demoRequestLimiter, validateDemoRequest, createDemoRequest);

export default router;
