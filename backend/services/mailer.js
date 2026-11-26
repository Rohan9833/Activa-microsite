import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPass || !env.demoRecipient || !env.mailFrom) {
    throw new Error('Email service is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM, and DEMO_RECIPIENT_EMAIL.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export async function sendDemoRequestEmail(data) {
  const transport = getTransporter();
  const text = [
    'New ActiVA demo request',
    '',
    `Name: ${data.fullName}`,
    `Designation: ${data.designation}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    '',
    'Message:',
    data.message || '(No message provided)',
  ].join('\n');

  const messageHtml = escapeHtml(data.message || '(No message provided)').replace(/\n/g, '<br>');
  await transport.sendMail({
    from: env.mailFrom,
    to: env.demoRecipient,
    replyTo: { name: data.fullName, address: data.email },
    subject: `ActiVA Demo Request — ${data.company}`,
    text,
    html: `<h2>New ActiVA demo request</h2><table cellpadding="8" cellspacing="0"><tr><td><b>Name</b></td><td>${escapeHtml(data.fullName)}</td></tr><tr><td><b>Designation</b></td><td>${escapeHtml(data.designation)}</td></tr><tr><td><b>Company</b></td><td>${escapeHtml(data.company)}</td></tr><tr><td><b>Email</b></td><td>${escapeHtml(data.email)}</td></tr><tr><td><b>Phone</b></td><td>${escapeHtml(data.phone)}</td></tr></table><h3>Message</h3><p>${messageHtml}</p>`,
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
}
