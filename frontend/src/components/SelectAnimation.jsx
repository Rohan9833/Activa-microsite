import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import backdrop from '../assets/illustrations/select-backdrop.svg';
import ipad1x from '../assets/images/ipad-sequence.webp';
import ipad2x from '../assets/images/ipad-sequence@2x.webp';
import cardRajesh from '../assets/images/select-anim/card-rajesh.webp';
import cardMeera from '../assets/images/select-anim/card-meera.webp';
import cardSuresh from '../assets/images/select-anim/card-suresh.webp';
import screenDims from '../assets/images/sequence-anim/screen-dims.webp';
import screenMeera from '../assets/images/equalizer-anim/screen-meera.webp';
import screenRajesh from '../assets/images/sequence-anim/screen-rajesh.webp';
import screenSuresh from '../assets/images/select-anim/screen-suresh.webp';
import L from '../assets/images/select-anim/layout.json';

/*
 * Select interaction, animated. Three patient cards sit in a row.
 *   nothing picked     → Same 3 Symptom Dimensions
 *   middle card picked → Meera Sharma
 *   first card picked  → Rajesh Mehta
 *   third card picked  → Suresh Patil
 * then all cards go back in line and the loop repeats.
 */
const CARDS = [
  { src: cardRajesh, label: 'Rajesh Mehta' },
  { src: cardMeera, label: 'Meera Sharma' },
  { src: cardSuresh, label: 'Suresh Patil' },
];
const STEPS = [
  { pick: null, screen: screenDims, label: 'No card selected: Same 3 Symptom Dimensions' },
  { pick: 1, screen: screenMeera, label: 'Middle card selected: Meera Sharma, 42' },
  { pick: 0, screen: screenRajesh, label: 'First card selected: Rajesh Mehta, 42' },
  { pick: 2, screen: screenSuresh, label: 'Third card selected: Suresh Patil, 58' },
];
const HOLD_MS = 2600;
const MOVE_MS = 700;
const FADE_MS = 500;

const pct = (v, total) => `${(v / total) * 100}%`;

export default function SelectAnimation({ alt }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // slide on screen
  const [pick, setPick] = useState(null); // card currently lifted
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const stepRef = useRef(0);
  const swipeStartX = useRef(null);
  const timer = useRef(null);
  stepRef.current = step;

  useEffect(() => () => clearTimeout(timer.current), []);

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
    if (Math.abs(delta) < 25) return;
    goTo((stepRef.current + (delta < 0 ? 1 : -1) + STEPS.length) % STEPS.length);
  };

  const goTo = (next) => {
    if (next === stepRef.current) return;
    setPick(STEPS[next].pick);
    clearTimeout(timer.current);
    setStep(next);
  };

  useEffect(() => {
    if (reduce || paused || !visible) return undefined;
    const t = window.setTimeout(() => goTo((stepRef.current + 1) % STEPS.length), HOLD_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paused, visible, reduce]);

  const { W, H, cw, ch, lift, slots, ipad: ip } = L;
  const ease = 'cubic-bezier(0.34, 1.3, 0.64, 1)';
  const t = (prop, ms = MOVE_MS) => (reduce ? 'none' : `${prop} ${ms}ms ${ease}`);

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
        {/* patient cards */}
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <img src={backdrop} alt="" draggable="false" className="absolute inset-0 h-full w-full" />
          {CARDS.map((c, i) => {
            const s = slots[i];
            const picked = pick === i;
            const dimmed = pick !== null && !picked;
            return (
              <div
                key={c.label}
                className="absolute"
                style={{
                  left: pct(s.x, W),
                  top: pct(s.y, H),
                  width: pct(cw, W),
                  height: pct(ch, H),
                  zIndex: picked ? 3 : 1,
                  transform: `translateY(${picked ? (-lift * 100) / ch : 0}%) scale(${picked ? 1.08 : dimmed ? 0.95 : 1})`,
                  opacity: dimmed ? 0.5 : 1,
                  transition: `${t('transform')}, ${t('opacity', 400)}`,
                }}
              >
                {/* selection glow */}
                <div
                  className="absolute -inset-[18%] rounded-full bg-[radial-gradient(closest-side,rgba(150,90,255,0.55),transparent)]"
                  style={{ opacity: picked ? 1 : 0, transition: t('opacity', 400) }}
                  aria-hidden="true"
                />
                <img
                  src={c.src}
                  alt=""
                  draggable="false"
                  decoding="async"
                  className="relative h-full w-full rounded-[7%] [filter:drop-shadow(0_0.5vw_0.7vw_rgba(42,26,122,0.25))]"
                  style={{ outline: picked ? '2px solid #9B5CFF' : '2px solid transparent', transition: t('outline-color', 300) }}
                />
                {/* green tick */}
                <span
                  className="absolute -right-[14%] -top-[9%] flex aspect-square w-[32%] items-center justify-center rounded-full bg-[#18C27A] shadow-card ring-2 ring-white"
                  style={{ transform: `scale(${picked ? 1 : 0})`, transition: t('transform', 450) }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
              </div>
            );
          })}
          {/* pick-up arrow under the selected card */}
          {slots.map((s, i) => (
            <svg
              key={i}
              viewBox="0 0 20 60"
              className="absolute w-[4.4%]"
              style={{
                left: pct(s.x + cw / 2 - 10, W),
                top: pct(s.y + ch - lift + 14, H),
                height: pct(56, H),
                opacity: pick === i ? 1 : 0,
                transform: `translateY(${pick === i ? 0 : 20}%)`,
                transition: `${t('opacity', 400)}, ${t('transform', 500)}`,
              }}
              aria-hidden="true"
            >
              <path d="M10 58V16" stroke="#5B6CF0" strokeWidth="4" strokeLinecap="round" />
              <path d="M2 18L10 4L18 18Z" fill="#1E88E5" />
            </svg>
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
                left: pct(ip.screen[0], ip.W),
                top: pct(ip.screen[1], ip.H),
                width: pct(ip.screen[2], ip.W),
                height: pct(ip.screen[3], ip.H),
                opacity: i === step ? 1 : 0,
                transition: `opacity ${reduce ? 0 : FADE_MS}ms ease`,
              }}
            />
          ))}
        </div>
      </div>

      {/* step indicator (also lets visitors jump to a selection) */}
      <div className="mx-auto mt-2 flex w-fit rounded-full bg-[#F1F0FB] px-1">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show: ${s.label}`}
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
