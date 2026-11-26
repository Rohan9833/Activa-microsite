import { ChevronDown, ChevronRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { BRAND_STEPS } from '../data/content.js';

export default function BrandStory() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="brand-title">
      <div className="container-site grid items-center gap-10 xl:grid-cols-[350px_1fr] xl:gap-12">
        <Reveal>
          <h2 id="brand-title" className="section-title xl:text-[2.4rem]">
            Your Brand Story.
            <span className="text-gradient pb-1">Your Interaction.</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Custom interactions designed around your brand&rsquo;s communication objective.
          </p>
        </Reveal>

        <ol className="grid gap-4 md:grid-cols-3 md:gap-10">
          {BRAND_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal as="li" key={step.title} delay={i * 0.08} className="relative">
                <div className={`flex h-full flex-col items-center rounded-3xl bg-gradient-to-br ${step.tint} px-5 py-7 text-center shadow-card ring-1 ring-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}>
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card">
                    <Icon size={32} strokeWidth={1.8} className={step.iconColor} aria-hidden="true" />
                  </span>
                  <span className="mt-4 text-xs font-extrabold tracking-[0.14em] text-navy-300">STEP {i + 1}</span>
                  <h3 className="mt-1 text-lg font-extrabold text-navy">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-snug text-navy-500">{step.text}</p>
                </div>
                {i < BRAND_STEPS.length - 1 && (
                  <>
                    <ChevronRight className="absolute -right-[34px] top-1/2 hidden -translate-y-1/2 text-brand-violet md:block" size={28} strokeWidth={2.5} aria-hidden="true" />
                    <ChevronDown className="mx-auto -mb-2 mt-2 text-brand-violet md:hidden" size={24} strokeWidth={2.5} aria-hidden="true" />
                  </>
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
