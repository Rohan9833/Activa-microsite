import { sendDemoRequestEmail } from '../services/mailer.js';

export async function createDemoRequest(req, res, next) {
  try {
    await sendDemoRequestEmail(req.validated);
    return res.status(200).json({
      success: true,
      message: 'Thank you. Your demo request has been sent.',
    });
  } catch (err) {
    return next(err);
  }
}
