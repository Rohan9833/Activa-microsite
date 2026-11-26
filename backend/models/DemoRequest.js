import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    designation: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    company: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    meta: {
      ip: { type: String, default: '' },
      userAgent: { type: String, default: '', maxlength: 400 },
      referrer: { type: String, default: '', maxlength: 400 },
    },
  },
  { timestamps: true } // createdAt = submission timestamp
);

demoRequestSchema.index({ createdAt: -1 });
demoRequestSchema.index({ email: 1 });

export const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);
