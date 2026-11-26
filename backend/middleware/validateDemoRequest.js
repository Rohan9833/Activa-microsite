import validator from 'validator';

const FIELDS = {
  fullName: { label: 'Full name', required: true, min: 2, max: 100 },
  designation: { label: 'Designation', required: true, min: 2, max: 100 },
  company: { label: 'Company', required: true, min: 2, max: 150 },
  email: { label: 'Business email', required: true, max: 254 },
  phone: { label: 'Phone number', required: true, max: 20 },
  message: { label: 'Message', required: false, max: 1000 },
};

// Remove HTML tags and control characters (newlines kept for the message).
const clean = (value, keepNewLines = false) =>
  validator.stripLow(String(value).replace(/<[^>]*>/g, ''), keepNewLines).replace(/[ \t]+/g, ' ').trim();

/**
 * Validates and sanitises the Request a Demo payload.
 * Only whitelisted string fields reach the controller (blocks operator injection like {"$gt": ""}).
 */
export function validateDemoRequest(req, res, next) {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};

  // Honeypot field: real users never fill it.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(400).json({ success: false, message: 'Your request could not be processed.' });
  }

  const errors = [];
  const data = {};

  for (const [field, rule] of Object.entries(FIELDS)) {
    const raw = body[field];
    if (raw !== undefined && raw !== null && typeof raw !== 'string') {
      errors.push({ field, message: `${rule.label} must be text.` });
      continue;
    }
    const value = raw ? clean(raw, field === 'message') : '';
    if (rule.required && !value) {
      errors.push({ field, message: `${rule.label} is required.` });
      continue;
    }
    if (value && rule.min && value.length < rule.min) {
      errors.push({ field, message: `${rule.label} must be at least ${rule.min} characters.` });
      continue;
    }
    if (value.length > rule.max) {
      errors.push({ field, message: `${rule.label} must be ${rule.max} characters or fewer.` });
      continue;
    }
    data[field] = value;
  }

  if (data.email !== undefined && !errors.some((e) => e.field === 'email')) {
    if (!validator.isEmail(data.email)) errors.push({ field: 'email', message: 'Please enter a valid email address.' });
    else data.email = data.email.toLowerCase();
  }

  if (data.phone !== undefined && !errors.some((e) => e.field === 'phone')) {
    const digits = data.phone.replace(/\D/g, '');
    if (!/^\+?[0-9\s\-()]+$/.test(data.phone) || digits.length < 7 || digits.length > 15) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number (7–15 digits).' });
    }
  }

  if (errors.length) {
    return res.status(422).json({ success: false, message: 'Please correct the highlighted fields.', errors });
  }

  req.validated = data;
  return next();
}
