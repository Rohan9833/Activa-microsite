import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import bg from '../assets/images/rotate-anim/bg.webp';
import cardImg from '../assets/images/rotate-anim/card.webp';
import arrowsImg from '../assets/images/rotate-anim/arrows.webp';
import screen1 from '../assets/images/rotate-anim/screen-1.webp';
import screen2 from '../assets/images/rotate-anim/screen-2.webp';
import screen3 from '../assets/images/rotate-anim/screen-3.webp';
import L from '../assets/images/rotate-anim/layout.json';

/*
 * Rotate interaction, animated:
 * the card turns 90° clockwise → the iPad shows the next slide.
 * Symptom Dimensions → Meera Sharma → Suresh Patil → (turn back) → Symptom Dimensions …
 */
const STEPS = [
  { screen: screen1, label: 'Same 3 Symptom Dimensions' },
  { screen: screen2, label: 'Patient story: Meera Sharma, 42' },
  { screen: screen3, label: 'Patient story: Suresh Patil, 58' },
];
const HOLD_MS = 2600;
const TURN_MS = 900;
const FADE_MS = 500;

const pct = (v, total) => `${(v / total) * 100}%`;
const box = ([x, y, w, h]) => ({
  left: pct(x, L.W),
  top: pct(y, L.H),
  width: pct(w, L.W),
  height: pct(h, L.H),
});

export default function RotateAnimation({ alt }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // which slide is on screen
  const [angle, setAngle] = useState(0); // cumulative clockwise turn of the card
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const stepRef = useRef(0);
  stepRef.current = step;

  // Only animate while on screen and the tab is visible
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden && el.getBoundingClientRect().bottom > 0);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const [turnMs, setTurnMs] = useState(TURN_MS);
  const angleRef = useRef(0);

  const goTo = (next) => {
    if (next === stepRef.current) return;
    // card positions are 0°, 90°, 180° — always turn clockwise to reach the next one
    const target = next * 90;
    const delta = (((target - angleRef.current) % 360) + 360) % 360 || 360;
    angleRef.current += delta;
    setTurnMs(reduce ? 0 : delta > 90 ? TURN_MS * 1.4 : TURN_MS);
    setAngle(angleRef.current);
    setStep(next);
  };
\n  useEffect(() => {
    const onSwipe = (e) => goTo((stepRef.current + e.detail.direction + STEPS.length) % STEPS.length);
    window.addEventListener('interaction-preview-swipe', onSwipe);
    return () => window.removeEventListener('interaction-preview-swipe', onSwipe);
  }, []);

  useEffect(() => {
    if (reduce || paused || !visible) return undefined;
    const t = window.setTimeout(() => goTo((stepRef.current + 1) % STEPS.length), HOLD_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paused, visible, reduce]);

  return (
    <div>
      <div
        ref={rootRef}
        className="relative w-full select-none overflow-hidden touch-pan-y [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
        style={{ aspectRatio: `${L.W} / ${L.H}` }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <span className="sr-only">{alt}</span>
        <img src={bg} alt="" className="absolute inset-0 h-full w-full" draggable="false" decoding="async" />

        {/* iPad screen states */}
        {STEPS.map((s, i) => (
          <img
            key={s.label}
            src={s.screen}
            alt=""
            draggable="false"
            decoding="async"
            className="absolute"
            style={{
              ...box(L.screen),
              opacity: i === step ? 1 : 0,
              transition: `opacity ${reduce ? 0 : FADE_MS}ms ease`,
            }}
          />
        ))}

        {/* turning card */}
        <img
          src={cardImg}
          alt=""
          draggable="false"
          decoding="async"
          className="absolute [filter:drop-shadow(0.4vw_0.9vw_0.9vw_rgba(42,26,122,0.28))]"
          style={{
            left: pct(L.card.cx - L.card.w / 2, L.W),
            top: pct(L.card.cy - L.card.h / 2, L.H),
            width: pct(L.card.w, L.W),
            height: pct(L.card.h, L.H),
            transform: `rotate(${L.card.baseAngle + angle}deg)`,
            transition: `transform ${turnMs}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            willChange: 'transform',
          }}
        />

        {/* rotate arrows on top */}
        <img src={arrowsImg} alt="" draggable="false" className="absolute" style={box(L.arrows)} />
      </div>
      {/* step indicator (also lets visitors jump to a card position) */}
      <div className="mx-auto mt-2 flex w-fit rounded-full bg-[#F1F0FB] px-1">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show card position ${i + 1}: ${s.label}`}
            aria-current={i === step ? 'true' : undefined}
            className="group flex h-6 items-center px-1"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-brand-gradient' : 'w-2 bg-navy/25 group-hover:bg-navy/40'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
