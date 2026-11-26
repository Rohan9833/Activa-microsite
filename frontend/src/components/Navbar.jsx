import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';
import { NAV_LINKS } from '../data/content.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  // On mobile, collapse the menu first, then scroll, so the layout change doesn't cancel the scroll.
  const goTo = (e, href) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.history?.replaceState) window.history.replaceState(null, '', href);
    }, 280);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300 ${
        scrolled || open ? 'shadow-[0_6px_24px_-12px_rgba(7,27,75,0.25)]' : ''
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Skip to content
      </a>
      <nav className="container-site flex h-[72px] items-center justify-between gap-6 lg:h-20" aria-label="Main">
        <a href="#top" className="shrink-0" aria-label="ActiVA home" onClick={close}>
          <Logo eager className="w-[150px] sm:w-[178px] lg:w-[210px]" />
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-[15px] font-semibold text-navy transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-brand-gradient after:transition-all hover:text-brand-violet hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a href="#request-demo" className="btn-primary min-h-[44px] px-5 py-2.5">
            Request Demo <ChevronRight size={18} aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-navy hover:bg-navy/5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-navy/5 bg-white lg:hidden"
          >
            <ul className="container-site flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => goTo(e, l.href)}
                    className="flex min-h-[48px] items-center justify-between rounded-xl px-3 text-base font-semibold text-navy hover:bg-[#F3F1FF]"
                  >
                    {l.label} <ChevronRight size={18} className="text-brand-violet" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a href="#request-demo" onClick={(e) => goTo(e, '#request-demo')} className="btn-primary w-full">
                  Request Demo <ChevronRight size={18} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
