import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import backdrop from '../assets/illustrations/sequence-backdrop.svg';
import ipad1x from '../assets/images/ipad-sequence.webp';
import ipad2x from '../assets/images/ipad-sequence@2x.webp';
import acid from '../assets/images/sequence-anim/card-acid.webp';
import motility from '../assets/images/sequence-anim/card-motility.webp';
import persistence from '../assets/images/sequence-anim/card-persistence.webp';
import screenDims from '../assets/images/sequence-anim/screen-dims.webp';
import screenRajesh from '../assets/images/sequence-anim/screen-rajesh.webp';
import screenAnita from '../assets/images/sequence-anim/screen-anita.webp';
import L from '../assets/images/sequence-anim/layout.json';

/*
 * Sequence interaction, animated. Two cards swap places → the iPad shows the matching patient story.
 *   Persistence · Motility · Acid  → Same 3 Symptom Dimensions
 *   Acid · Motility · Persistence   → Rajesh Mehta (heartburn first)
 *   Motility · Acid · Persistence   → Anita Sharma (bloating first)
 * then the cards reshuffle back to the start and the loop repeats.
 */
const CARDS = {
  acid: { src: acid, label: 'Acid' },
  motility: { src: motility, label: 'Motility' },
  persistence: { src: persistence, label: 'Persistence' },
};
const STEPS = [
  { order: ['persistence', 'motility', 'acid'], screen: screenDims, label: 'Same 3 Symptom Dimensions' },
  { order: ['acid', 'motility', 'persistence'], screen: screenRajesh, label: 'Patient story: Rajesh Mehta, 42' },
  { order: ['motility', 'acid', 'persistence'], screen: screenAnita, label: 'Patient story: Anita Sharma, 37' },
];
const HOLD_MS = 2600;
const MOVE_MS = 850;
const FADE_MS = 500;

const pctW = (v, W) => `${(v / W) * 100}%`;

export default function SequenceAnimation({ alt }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // slide on screen
  const [order, setOrder] = useState(STEPS[0].order); // card ids by slot
  const [lift, setLift] = useState({}); // card id -> vertical arc offset while moving
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const stepRef = useRef(0);
  const swipeStartX = useRef(null);
  const timers = useRef([]);
  stepRef.current = step;

  const later = (fn, ms) => timers.current.push(window.setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const onSwipeStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
  const onSwipeEnd = (e) => {
    if (swipeStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(delta) < 40) return;
    goTo((stepRef.current + (delta < 0 ? 1 : -1) + STEPS.length) % STEPS.length);
  };

  const goTo = (next) => {
    if (next === stepRef.current) return;
    const from = STEPS[stepRef.current].order;
    const to = STEPS[next].order;
    if (reduce) {
      setOrder(to);
      setStep(next);
      return;
    }
    // moving cards arc: first one over the top, the others underneath
    const moving = Object.keys(CARDS).filter((id) => from.indexOf(id) !== to.indexOf(id));
    const arcs = {};
    moving.forEach((id, i) => (arcs[id] = i === 0 ? -1 : 1));
    setLift(arcs);
    setOrder(to);
    later(() => setLift({}), MOVE_MS * 0.5);
    later(() => setStep(next), MOVE_MS);
  };

  useEffect(() => {
    if (reduce || paused || !visible) return undefined;
    const t = window.setTimeout(() => goTo((stepRef.current + 1) % STEPS.length), HOLD_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paused, visible, reduce]);

  const { W, H, cw, ch, slots } = L.left;
  const ip = L.ipad;

  return (
    <div ref={rootRef}>
      <span className="sr-only">{alt}</span>
      <div
        className="grid w-full select-none touch-pan-y grid-cols-[226fr_262fr] items-stretch"
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* physical cards */}
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <img src={backdrop} alt="" draggable="false" className="absolute inset-0 h-full w-full" />
          {Object.entries(CARDS).map(([id, c]) => {
            const s = slots[order.indexOf(id)];
            const arc = lift[id] || 0;
            return (
              <img
                key={id}
                src={c.src}
                alt=""
                draggable="false"
                decoding="async"
                className="absolute [filter:drop-shadow(0_0.5vw_0.7vw_rgba(42,26,122,0.25))]"
                style={{
                  left: pctW(s.x, W),
                  top: pctW(s.y, H),
                  width: pctW(cw, W),
                  height: pctW(ch, H),
                  zIndex: arc ? 5 + arc : s.z,
                  transform: `translateY(${arc * 22}%) rotate(${s.rot}deg) scale(${arc ? 1.06 : 1})`,
                  transition: reduce
                    ? 'none'
                    : `left ${MOVE_MS}ms cubic-bezier(0.65,0,0.35,1), top ${MOVE_MS}ms cubic-bezier(0.65,0,0.35,1), transform ${MOVE_MS / 2}ms ease-in-out`,
                }}
              />
            );
          })}
          {/* fixed slot numbers: the order is read left to right */}
          {slots.map((s, i) => (
            <span
              key={i}
              className="absolute z-10 flex aspect-square w-[6.5%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[clamp(8px,1vw,13px)] font-extrabold text-[#5B2FD6] shadow-card ring-1 ring-[#E4E1F7]"
              style={{ left: pctW(s.x + 17, W), top: pctW(s.y + ch - 17, H) }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
          ))}
        </div>

        {/* iPad */}
        <div className="relative">
          <img
            src={ipad1x}
            srcSet={`${ipad1x} 524w, ${ipad2x} 1048w`}
            sizes="(min-width: 1280px) 340px, (min-width: 768px) 32vw, 50vw"
            alt=""
            width="524"
            height="366"
            decoding="async"
            draggable="false"
            className="h-auto w-full [mask-image:linear-gradient(to_right,black_90%,transparent)]"
          />
          {STEPS.map((s, i) => (
            <img
              key={s.label}
              src={s.screen}
              alt=""
              draggable="false"
              decoding="async"
              className="absolute"
              style={{
                left: pctW(ip.screen[0], ip.W),
                top: pctW(ip.screen[1], ip.H),
                width: pctW(ip.screen[2], ip.W),
                height: pctW(ip.screen[3], ip.H),
                opacity: i === step ? 1 : 0,
                transition: `opacity ${reduce ? 0 : FADE_MS}ms ease`,
              }}
            />
          ))}
        </div>
      </div>

      {/* step indicator (also lets visitors jump to an arrangement) */}
      <div className="mx-auto mt-2 flex w-fit rounded-full bg-[#F1F0FB] px-1">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show card order ${i + 1}: ${s.order.map((id) => CARDS[id].label).join(', ')} – ${s.label}`}
            aria-current={i === step ? 'true' : undefined}
            className="group flex h-6 items-center px-1"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-5 bg-brand-gradient' : 'w-2 bg-navy/25 group-hover:bg-navy/40'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
