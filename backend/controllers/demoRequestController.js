import mongoose from 'mongoose';
import { DemoRequest } from '../models/DemoRequest.js';

export async function createDemoRequest(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Our enquiry service is temporarily unavailable. Please try again shortly.',
      });
    }

    const doc = await DemoRequest.create({
      ...req.validated,
      meta: {
        ip: req.ip || '',
        userAgent: String(req.get('user-agent') || '').slice(0, 400),
        referrer: String(req.get('referer') || '').slice(0, 400),
      },
    });

    // Only a reference + timestamp is returned; enquiry records are never exposed publicly.
    return res.status(201).json({
      success: true,
      message: 'Thank you. Your demo request has been received.',
      data: { id: doc._id, submittedAt: doc.createdAt },
    });
  } catch (err) {
    return next(err);
  }
}
