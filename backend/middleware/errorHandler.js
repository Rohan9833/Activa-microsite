import { isProd } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Not found.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Payload too large.' });
  }
  if (err.message === 'CORS_NOT_ALLOWED') {
    return res.status(403).json({ success: false, message: 'Origin not allowed.' });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return res.status(422).json({ success: false, message: 'Please correct the highlighted fields.', errors });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error('[error]', err);
  return res.status(status).json({
    success: false,
    message: status >= 500 ? 'Something went wrong on our side. Please try again later.' : err.message,
    ...(isProd || status < 500 ? {} : { detail: err.message }),
  });
}
