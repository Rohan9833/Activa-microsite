import Reveal from './Reveal.jsx';
import { BENEFITS } from '../data/content.js';

export default function WhyActiVA() {
  return (
    <section id="why-activa" className="py-14 sm:py-20" aria-labelledby="why-title">
      <div className="container-site grid gap-10 xl:grid-cols-[350px_1fr] xl:items-center xl:gap-12">
        <Reveal>
          <span className="accent-bar mb-5" aria-hidden="true" />
          <h2 id="why-title" className="section-title">Why ActiVA?</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-500">
            Make your in-clinic detailing more participative, memorable and impactful.
          </p>
        </Reveal>

        <ul className="grid grid-cols-6 gap-3 sm:gap-4">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            const cardGridClass = i < 3 ? 'col-span-2' : 'col-span-3';
            return (
              <Reveal as="li" key={b.title} delay={i * 0.06} className={cardGridClass}>
                <div className={`flex h-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${b.tint} px-4 py-6 text-center shadow-card ring-1 ring-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}>
                  <Icon size={40} strokeWidth={1.7} className={b.iconColor} aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-extrabold text-navy">{b.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-snug text-navy-500">{b.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
