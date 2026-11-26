import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { FLOW_STEPS } from '../data/content.js';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-14 sm:py-20" aria-labelledby="how-title">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="how-title" className="section-title">See. Interact. Discover.</h2>
          <p className="mt-3 text-lg text-navy-500">A simple, powerful flow for in-clinic engagement.</p>
        </Reveal>

        <ol className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-10">
          {FLOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="relative">
                <div className={`group flex h-full items-center gap-5 rounded-3xl bg-gradient-to-br ${step.tint} p-5 shadow-card ring-1 ring-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-6 md:flex-col md:items-start lg:flex-row lg:items-center`}>
                  <span className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.iconBg} text-white shadow-glow`}>
                    <Icon size={34} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className={`text-2xl font-extrabold ${step.titleColor}`}>{step.title}</h3>
                    <p className="mt-1 text-[15px] leading-snug text-navy-500">{step.text}</p>
                  </div>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ChevronRight
                    className="absolute -right-[34px] top-1/2 hidden -translate-y-1/2 text-brand-violet md:block"
                    size={28}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
