import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, CircleAlert, CircleCheck, LoaderCircle, ShieldCheck, Smartphone, Wifi } from 'lucide-react';
import Reveal from './Reveal.jsx';
import ipad1x from '../assets/images/ipad-sequence.webp';
import ipad2x from '../assets/images/ipad-sequence@2x.webp';
import cardAcid from '../assets/images/sequence-anim/card-acid.webp';
import cardMotility from '../assets/images/sequence-anim/card-motility.webp';
import cardPersistence from '../assets/images/sequence-anim/card-persistence.webp';
import { submitDemoRequest } from '../services/api.js';

const EMPTY = { fullName: '', designation: '', company: '', email: '', phone: '', message: '', website: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

function validate(v) {
  const e = {};
  if (v.fullName.trim().length < 2) e.fullName = 'Please enter your full name.';
  if (v.designation.trim().length < 2) e.designation = 'Please enter your designation.';
  if (v.company.trim().length < 2) e.company = 'Please enter your company name.';
  if (!v.email.trim()) e.email = 'Please enter your business email.';
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) e.phone = 'Please enter your phone number.';
  else if (!PHONE_RE.test(v.phone.trim()) || digits.length < 7 || digits.length > 15)
    e.phone = 'Please enter a valid phone number (7–15 digits).';
  if (v.message.length > 1000) e.message = 'Please keep your message under 1000 characters.';
  return e;
}

function Field({ id, label, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label} {required && <span className="text-brand-magenta" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-[#D92D50]">
          <CircleAlert size={15} aria-hidden="true" /> {error}
        </p>
      )}
    </div>
  );
}

const inputCls = (err) =>
  `block w-full rounded-xl border bg-white px-4 py-3 text-base text-navy placeholder:text-navy-300 transition focus:outline-none focus:ring-4 ${
    err ? 'border-[#D92D50] focus:ring-[#D92D50]/15' : 'border-[#D5DAEA] hover:border-[#B8BFDB] focus:border-brand-violet focus:ring-brand-violet/15'
  }`;

export default function DemoRequestForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMessage, setServerMessage] = useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus('idle');
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus('loading');
    setServerMessage('');
    try {
      await submitDemoRequest({
        fullName: values.fullName.trim(),
        designation: values.designation.trim(),
        company: values.company.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        website: values.website,
      });
      setStatus('success');
      setValues(EMPTY);
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setServerMessage(err.message);
      setStatus('error');
    }
  };

  const describedBy = (name) => (errors[name] ? `${name}-error` : undefined);

  return (
    <section id="request-demo" className="relative overflow-hidden pb-20 pt-10 sm:pb-28 sm:pt-16" aria-labelledby="demo-title">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F5F1FF] to-transparent" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-10 lg:grid-cols-2 lg:gap-0">
        <Reveal className="order-2 lg:order-1 lg:pr-12">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#EEF3FF] via-[#F5F0FF] to-[#FCEFFD] px-3 pb-5 pt-14 ring-1 ring-white shadow-card sm:px-6 sm:pb-8 sm:pt-16">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(8,102,245,0.14),transparent_70%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(221,16,232,0.14),transparent_70%)]" aria-hidden="true" />
            <ul className="absolute left-4 right-4 top-4 flex flex-wrap gap-2 sm:left-6 sm:top-5" aria-label="Set-up">
              {[
                { icon: Smartphone, text: 'iOS & Android scanner' },
                { icon: Wifi, text: 'Same Wi-Fi network' },
                { icon: ShieldCheck, text: 'Secure login' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-navy shadow-card sm:text-[13px]">
                  <Icon size={14} className="text-brand-violet" aria-hidden="true" /> {text}
                </li>
              ))}
            </ul>
            <div className="relative mt-4 pb-[16%] pl-[22%] sm:mt-6">
              <img
                src={ipad1x}
                srcSet={`${ipad1x} 524w, ${ipad2x} 1048w`}
                sizes="(min-width: 1024px) 420px, 75vw"
                alt="iPad showing the Same 3 Symptom Dimensions slide, triggered by the printed symptom cards."
                width="524"
                height="366"
                loading="lazy"
                decoding="async"
                className="h-auto w-full mix-blend-multiply [mask-image:radial-gradient(ellipse_75%_70%_at_55%_48%,black_62%,transparent_100%)]"
              />
              <div className="absolute bottom-0 left-0 flex w-[50%] items-end" aria-hidden="true">
                {[
                  [cardAcid, '-rotate-[12deg] translate-x-[30%] translate-y-[4%]'],
                  [cardMotility, 'z-10 -rotate-[2deg]'],
                  [cardPersistence, 'rotate-[9deg] -translate-x-[30%] translate-y-[3%]'],
                ].map(([src, cls], i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`relative w-1/3 rounded-[8px] ring-2 ring-white shadow-[0_14px_30px_-10px_rgba(42,26,122,0.45)] ${cls}`}
                  />
                ))}
              </div>
            </div>
            <p className="relative mt-4 text-center text-sm font-semibold text-navy-500">
              The MR arranges the cards. The iPad responds.
            </p>
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2 lg:border-l lg:border-[#E3E6F2] lg:pl-12">
          <h2 id="demo-title" className="section-title">Request a Demo</h2>
          <p className="mt-3 text-lg text-navy-500">See how ActiVA can bring your brand story to life in the clinic.</p>

          <AnimatePresence mode="wait" initial={false}>
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="status"
                aria-live="polite"
                className="mt-8 rounded-3xl bg-gradient-to-br from-[#EFFAF4] to-[#F4F7FF] p-7 ring-1 ring-[#CFEEDC]"
              >
                <CircleCheck size={44} className="text-[#18A864]" aria-hidden="true" />
                <h3 className="mt-3 text-2xl font-extrabold text-navy">Thank you — request received.</h3>
                <p className="mt-2 text-navy-500">
                  The ActiVA team at digiLATERAL will get in touch with you shortly to schedule your demo.
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-secondary mt-6">
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                noValidate
                onSubmit={onSubmit}
                className="mt-7 space-y-4"
                aria-busy={status === 'loading'}
              >
                {status === 'error' && serverMessage && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-2xl bg-[#FFF1F3] p-4 text-sm font-medium text-[#B4233F] ring-1 ring-[#FBD0D9]">
                    <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{serverMessage}</span>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="fullName" label="Full Name" required error={errors.fullName}>
                    <input id="fullName" name="fullName" type="text" autoComplete="name" required maxLength={100}
                      value={values.fullName} onChange={onChange} className={inputCls(errors.fullName)}
                      aria-invalid={!!errors.fullName} aria-describedby={describedBy('fullName')} />
                  </Field>
                  <Field id="designation" label="Designation" required error={errors.designation}>
                    <input id="designation" name="designation" type="text" autoComplete="organization-title" required maxLength={100}
                      placeholder="e.g. Brand Manager" value={values.designation} onChange={onChange} className={inputCls(errors.designation)}
                      aria-invalid={!!errors.designation} aria-describedby={describedBy('designation')} />
                  </Field>
                  <Field id="company" label="Company" required error={errors.company}>
                    <input id="company" name="company" type="text" autoComplete="organization" required maxLength={150}
                      value={values.company} onChange={onChange} className={inputCls(errors.company)}
                      aria-invalid={!!errors.company} aria-describedby={describedBy('company')} />
                  </Field>
                  <Field id="email" label="Business Email" required error={errors.email}>
                    <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254}
                      value={values.email} onChange={onChange} className={inputCls(errors.email)}
                      aria-invalid={!!errors.email} aria-describedby={describedBy('email')} />
                  </Field>
                </div>
                <Field id="phone" label="Phone Number" required error={errors.phone}>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={20}
                    value={values.phone} onChange={onChange} className={inputCls(errors.phone)}
                    aria-invalid={!!errors.phone} aria-describedby={describedBy('phone')} />
                </Field>
                <Field id="message" label="Message (optional)" error={errors.message}>
                  <textarea id="message" name="message" rows={4} maxLength={1000}
                    placeholder="Tell us about your brand and requirement"
                    value={values.message} onChange={onChange} className={`${inputCls(errors.message)} resize-y`}
                    aria-invalid={!!errors.message} aria-describedby={describedBy('message')} />
                </Field>

                {/* Honeypot: hidden from people, catches simple bots */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} />
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-primary w-full sm:w-auto sm:min-w-[260px]" disabled={status === 'loading'}>
                    {status === 'loading' ? (
                      <>
                        <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> Sending…
                      </>
                    ) : (
                      <>
                        Request a Demo 
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-xs text-navy-300">Fields marked * are required.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
