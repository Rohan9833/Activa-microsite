import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal.jsx';

/* Answers stick to what ActiVA is documented to do. Review before launch. */
const FAQS = [
  {
    q: 'What equipment does ActiVA need in the clinic?',
    a: 'The MR’s iPad for detailing, an iPhone or Android smartphone and the interaction materials.',
  },
  {
    q: 'Does ActiVA replace our existing iPad detailing?',
    a: 'No. ActiVA adds participation to the detailing your MRs already do: the doctor interacts with physical materials and the iPad responds with the relevant content.',
  },
  {
    q: 'Can the interactions be customised for our brand?',
    a: 'Yes. Each interaction is designed around your brand’s communication objective. Rotate, Sequence, Equalizer, Select and Animation are starting points, and new interaction formats can be developed when needed.',
  },
  {
    q: 'What does the doctor actually interact with?',
    a: 'Printed physical materials such as cards, literatures. Turning, arranging, sliding, choosing or moving them triggers the matching content on the iPad.',
  },
  {
    q: 'Can we use our existing detailing content?',
    a: 'Share your current brand story and detailing material at the briefing, and we will assess what can be adapted into the ActiVA experience.',
  },
  {
    q: 'How long does it take, and what does it cost?',
    a: 'It depends on the number of brands, interactions and materials involved. After a short briefing we share a proposed plan, timeline and estimate.',
  },
  {
    q: 'Is ActiVA meant for patients?',
    a: 'No. ActiVA is a detailing tool used by medical representatives with doctors during in-clinic visits.',
  },
];

function Item({ item, open, onToggle, id }) {
  return (
    <div className="rounded-2xl bg-white shadow-card ring-1 ring-[#ECE8FB]">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full min-h-[56px] items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-base font-bold text-navy sm:px-6 sm:text-[17px]"
        >
          {item.q}
          <ChevronDown
            size={20}
            className={`shrink-0 text-brand-violet transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-[17px] leading-relaxed text-navy-500 sm:px-6 lg:text-[15px]">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-14 sm:py-20" aria-labelledby="faq-title">
      <div className="container-site grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-12">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="section-title mt-2">Questions brand teams ask</h2>
          <p className="mt-4 text-lg text-navy-500">
            Something else on your mind?{' '}
            <a href="#request-demo" className="font-bold text-brand-violet underline-offset-4 hover:underline">
              Ask us in a demo
            </a>
            .
          </p>
        </Reveal>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <Item key={item.q} id={`faq-${i}`} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
