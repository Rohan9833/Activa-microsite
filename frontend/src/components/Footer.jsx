import { Globe, Linkedin, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Logo from './Logo.jsx';
import { CONTACT } from '../data/contact.js';

export default function Footer() {
  const year = new Date().getFullYear();
  const c = CONTACT;
  const items = [
    c.address && { icon: MapPin, label: c.address },
    c.phone && { icon: Phone, label: c.phone, href: `tel:${c.phone.replace(/[^+\d]/g, '')}` },
    c.email && { icon: Mail, label: c.email, href: `mailto:${c.email}` },
    c.website && { icon: Globe, label: c.website.replace(/^https?:\/\//, ''), href: c.website, external: true },
    c.linkedin && { icon: Linkedin, label: 'LinkedIn', href: c.linkedin, external: true },
  ].filter(Boolean);

  return (
    <footer className="border-t border-[#ECEEF6] bg-white">
      <div className="container-site grid gap-8 py-10 md:grid-cols-[1.1fr_1fr] md:items-start">
        <div className="flex flex-col gap-3 text-center md:text-left">
          <div className="flex w-full items-center justify-between gap-4">
            <Logo variant="mark" className="w-[150px] shrink-0" />
            <img
              src="/assets/Productbydigilateral.png"
              alt="Product by Digilateral"
              className="w-[110px] max-w-[42%] shrink-0 object-contain"
            />
          </div>
          <p className="text-[15px] font-medium text-navy-500">Where Physical Interaction Meets Digital Detailing.</p>
          <p className="text-[15px] font-bold text-navy">A {c.company} Solution</p>
        </div>

        {(items.length > 0 || c.whatsapp) && (
          <div className="flex flex-col items-center gap-3 md:items-end">
            <ul className="flex flex-col items-center gap-2 text-sm text-navy-500 md:items-end">
              {items.map(({ icon: Icon, label, href, external }) => (
                <li key={label} className="flex max-w-xs items-start gap-2 text-center md:text-right">
                  <Icon size={16} className="mt-0.5 shrink-0 text-brand-violet" aria-hidden="true" />
                  {href ? (
                    <a
                      href={href}
                      className="hover:text-brand-violet"
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </li>
              ))}
            </ul>
            {c.whatsapp && (
              <a
                href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hi, I would like to know more about ActiVA.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn mt-1 min-h-[44px] bg-[#25D366] px-5 py-2.5 text-white hover:-translate-y-0.5 hover:brightness-105"
              >
                <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
      <div className="border-t border-[#F1F2F8]">
        <p className="container-site py-4 text-center text-sm text-navy-300 md:text-left">
          &copy; {year} {c.company}. All rights reserved.
        </p>
      </div>
      <div className="h-1.5 w-full bg-brand-gradient" aria-hidden="true" />
    </footer>
  );
}
