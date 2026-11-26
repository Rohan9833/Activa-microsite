import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import cardAcid from '../assets/images/sequence-anim/card-acid.webp';
import cardMotility from '../assets/images/sequence-anim/card-motility.webp';
import cardPersistence from '../assets/images/sequence-anim/card-persistence.webp';
import ipadDims from '../assets/images/ipad-sequence.webp';
import ipadDims2x from '../assets/images/ipad-sequence@2x.webp';
import ipadRajesh from '../assets/images/ipad-rajesh.webp';
import ipadRajesh2x from '../assets/images/ipad-rajesh@2x.webp';

function SymptomCards() {
  return (
    <div className="relative mx-auto flex h-full max-w-[260px] items-center justify-center py-4" aria-hidden="true">
      {[
        [cardAcid, '-rotate-[10deg] translate-x-[38%]', 1],
        [cardMotility, 'z-10', 2],
        [cardPersistence, 'rotate-[10deg] -translate-x-[38%]', 1],
      ].map(([src, cls], i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          className={`relative w-[38%] rounded-[8px] shadow-[0_10px_24px_-10px_rgba(42,26,122,0.4)] ${cls}`}
        />
      ))}
    </div>
  );
}

const STEPS = [
  {
    tag: 'Brand objective',
    title: 'Look beyond acid alone',
    text: 'GERD patients describe the same three symptom dimensions (acid, motility and persistence) in a different order. What comes first can change the management approach.',
    visual: <SymptomCards />,
  },
  {
    tag: 'Physical interaction',
    title: 'The doctor arranges the cards',
    text: 'The doctor places the three symptom cards in the order that best reflects the patient in front of them, while the MR guides the discussion on iPad.',
    visual: (
      <img
        src={ipadDims}
        srcSet={`${ipadDims} 524w, ${ipadDims2x} 1048w`}
        sizes="(min-width: 1024px) 320px, 80vw"
        alt="iPad showing the Same 3 Symptom Dimensions slide."
        loading="lazy"
        className="mx-auto h-auto w-full max-w-[320px]"
      />
    ),
  },
  {
    tag: 'ActiVA experience',
    title: 'The matching patient story appears',
    text: 'Each order reveals a different patient profile (for example, heartburn first for Rajesh, bloating first for Anita), so the conversation moves to the patient the doctor actually sees.',
    visual: (
      <img
        src={ipadRajesh}
        srcSet={`${ipadRajesh} 524w, ${ipadRajesh2x} 1048w`}
        sizes="(min-width: 1024px) 320px, 80vw"
        alt="iPad showing the patient story of Rajesh Mehta, 42, whose main complaint is heartburn after meals."
        loading="lazy"
        className="mx-auto h-auto w-full max-w-[320px]"
      />
    ),
  },
];

export default function WorkedExample() {
  const [activeStep, setActiveStep] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const goToStep = (step) => setActiveStep(Math.max(0, Math.min(STEPS.length - 1, step)));

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Only change slides for a deliberate horizontal swipe, not vertical scrolling.
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setActiveStep((current) => {\n        if (deltaX < 0) return Math.min(current + 1, STEPS.length - 1);\n        return Math.max(current - 1, 0);\n      });
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section id="example" className="py-14 sm:py-20" aria-labelledby="example-title">
      <div className="container-site">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Example concept</p>
          <h2 id="example-title" className="section-title mt-2">
            One brand story. <span className="text-gradient">Many patient conversations.</span>
          </h2>
          <p className="mt-4 text-lg text-navy-500">
            How a single ActiVA interaction can turn GERD symptom profiling into a participative discussion.
          </p>
        </Reveal>

        <div
          className="example-carousel-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          <ol className="example-slides mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-10" style={{ "--active-slide": activeStep }}>
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.tag} delay={i * 0.08} className="relative">
              <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-[#ECE8FB]">
                <div className="flex h-[210px] items-center justify-center bg-gradient-to-br from-[#F2F5FF] via-[#F6F2FF] to-[#FCF1FD] px-5">
                  {s.visual}
                </div>
                <div className="flex-1 p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-violet">
                    {String(i + 1).padStart(2, '0')} · {s.tag}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-navy">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-navy-500">{s.text}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  className="absolute -right-[34px] top-[105px] hidden -translate-y-1/2 text-brand-violet lg:block"
                  size={28}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              )}
            </Reveal>
          ))}
          </ol>
        </div>

        <div className="example-carousel-controls" aria-label="Example concept slides">
          <button type="button" onClick={() => goToStep(activeStep - 1)} aria-label="Previous example" className="example-arrow">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <div className="example-dots" role="tablist" aria-label="Choose example concept">
            {STEPS.map((step, i) => (
              <button
                key={step.tag}
                type="button"
                role="tab"
                aria-label={`Show slide ${i + 1}: ${step.tag}`}
                aria-selected={activeStep === i}
                onClick={() => goToStep(i)}
                className={activeStep === i ? 'example-dot active' : 'example-dot'}
              />
            ))}
          </div>
          <button type="button" onClick={() => goToStep(activeStep + 1)} aria-label="Next example" className="example-arrow">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="mx-auto mt-6 flex max-w-3xl items-start justify-center gap-2 text-center text-sm text-navy-300">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Illustrative concept created to demonstrate ActiVA. It is not a client case study, and the patient profiles are
          fictional.
        </p>
      </div>
    </section>
  );
}
