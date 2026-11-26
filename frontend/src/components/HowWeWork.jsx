import { ClipboardList, PenTool, Printer, Smartphone, Rocket } from 'lucide-react';
import Reveal from './Reveal.jsx';

const STEPS = [
  { icon: ClipboardList, title: 'Brief', text: 'We understand your brand, therapy area and the key message the doctor should take away.' },
  { icon: PenTool, title: 'Interaction design', text: 'We select or create the physical interaction that best brings that message to life.' },
  { icon: Printer, title: 'Content & cards', text: 'We build the iPad content and produce the printed interaction materials.' },
  { icon: Smartphone, title: 'Set-up & orientation', text: 'iPads and scanner phones are configured, and MRs are oriented on running the experience.' },
  { icon: Rocket, title: 'Field rollout', text: 'The experience goes live in clinics, with support as your team starts detailing.' },
];

export default function HowWeWork() {
  return (
    <section id="process" className="py-14 sm:py-20" aria-labelledby="process-title">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-start lg:text-center">How we work</p>
          <h2 id="process-title" className="section-title mt-2 text-start lg:text-center">From brief to clinic</h2>
          <p className="text-start mt-2 text-lg text-navy-500 lg:text-center lg:mt-4">A clear, collaborative path from your brand objective to the field.</p>
        </Reveal>

        <ol className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5 lg:gap-5">
          <span
            className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-0.5 bg-gradient-to-r from-brand-blue via-brand-violet to-brand-magenta opacity-30 lg:block"
            aria-hidden="true"
          />
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal as="li" key={s.title} delay={i * 0.06} className="relative">
                <div className="flex h-full flex-col items-center rounded-3xl bg-white px-5 pb-6 text-center lg:bg-transparent lg:px-2">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                    <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-brand-violet shadow-card">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold text-navy">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-navy-500">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
