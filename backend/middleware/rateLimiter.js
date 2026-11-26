import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const demoRequestLimiter = rateLimit({
  windowMs: env.rateLimitWindowMin * 60 * 1000,
  limit: env.rateLimitMax,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please wait a few minutes and try again.' },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests.' },
});
