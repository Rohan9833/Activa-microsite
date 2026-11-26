import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import InteractionPreview from './InteractionPreview.jsx';
import { IPAD_SRC } from './InteractionVisual.jsx';
import { INTERACTIONS } from '../data/content.js';

export default function InteractionExperiences() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef([]);
  const listRef = useRef(null);
  const touchStartX = useRef(null);

  // Warm the cache for the other illustrations so tab switches are instant.
  useEffect(() => {
    const warm = () =>
      [IPAD_SRC, ...INTERACTIONS.filter((it) => !it.animated).flatMap((it) => [it.cardSide || it.image?.src, it.ipad?.src])].filter(Boolean).forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    const id = 'requestIdleCallback' in window ? window.requestIdleCallback(warm) : setTimeout(warm, 1500);
    return () => ('cancelIdleCallback' in window ? window.cancelIdleCallback(id) : clearTimeout(id));
  }, []);

  const select = (i, focus = false) => {
    const next = (i + INTERACTIONS.length) % INTERACTIONS.length;
    setActive(next);
    const el = tabRefs.current[next];
    if (el && focus) el.focus({ preventScroll: true });
  };


  const onKeyDown = (e) => {
    const map = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: INTERACTIONS.length - 1 };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key], true);
    }
  };

  const current = INTERACTIONS[active];

  return (
    <section id="experiences" className="py-8 sm:py-12" aria-labelledby="exp-title">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F3F5FF] via-[#F7F3FF] to-[#FCF1FD] p-5 ring-1 ring-[#ECE8FB] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(221,16,232,0.12),transparent_70%)]" aria-hidden="true" />

          <div className="relative grid gap-3 md:gap-8 lg:grid-cols-[220px_1fr] lg:gap-8 xl:grid-cols-[260px_1fr] xl:gap-10">
            <Reveal className="lg:pt-2">
              <p className="eyebrow">Explore ActiVA</p>
              <span className="accent-bar mt-2" aria-hidden="true" />
              <h2 id="exp-title" className="section-title mt-5">Interaction Experiences</h2>
              <p className="mt-4 text-lg leading-relaxed text-navy-500">
                Five ways to bring a brand story to life through physical interaction.
              </p>
            </Reveal>

            <div className="min-w-0">
              <div
                ref={listRef}
                role="tablist"
                aria-label="Interaction types"
                onKeyDown={onKeyDown}
                className="relative flex flex-wrap justify-center gap-2 px-0 pb-1 sm:gap-2.5 xl:justify-end"
              >
                {INTERACTIONS.map((it, i) => {
                  const Icon = it.icon;
                  const selected = i === active;
                  return (
                    <button
                      key={it.id}
                      ref={(el) => (tabRefs.current[i] = el)}
                      id={`tab-${it.id}`}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      aria-controls={`panel-${it.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => select(i)}
                      className={`inline-flex min-h-[42px] shrink items-center gap-1.5 whitespace-nowrap rounded-2xl px-2.5 text-[11px] font-bold transition-all duration-200 sm:min-h-[46px] sm:gap-2 sm:px-4 sm:text-sm lg:px-3.5 lg:text-[13px] xl:px-4 xl:text-sm ${
                        selected
                          ? 'bg-brand-gradient text-white shadow-glow'
                          : 'bg-white text-navy ring-1 ring-[#DCDFF5] hover:-translate-y-0.5 hover:text-brand-violet hover:ring-brand-violet/50'
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" className={selected ? 'shrink-0 text-white' : 'shrink-0 text-brand-violet'} />
                      {it.label}
                    </button>
                  );
                })}
              </div>

              <div
                id={`panel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                tabIndex={0}
                className="mt-5"
              >
                <InteractionPreview item={current} index={active} total={INTERACTIONS.length} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
