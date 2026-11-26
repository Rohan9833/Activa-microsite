import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import backdrop from '../assets/illustrations/equalizer-backdrop.svg';
import ipad1x from '../assets/images/ipad-sequence.webp';
import ipad2x from '../assets/images/ipad-sequence@2x.webp';
import cardImg from '../assets/images/equalizer-anim/card.webp';
import screenDims from '../assets/images/sequence-anim/screen-dims.webp';
import screenRupam from '../assets/images/equalizer-anim/screen-rupam.webp';
import screenMeera from '../assets/images/equalizer-anim/screen-meera.webp';
import L from '../assets/images/equalizer-anim/layout.json';

/*
 * Equalizer interaction, animated:
 *   card in the centre → Same 3 Symptom Dimensions
 *   card moves up      → Rupam Hazarika
 *   card moves down    → Meera Sharma
 *   card back to centre → Same 3 Symptom Dimensions … (loops)
 */
const STEPS = [
  { pos: 0, screen: screenDims, label: 'Centre: Same 3 Symptom Dimensions' },
  { pos: -1, screen: screenRupam, label: 'Up: Patient story, Rupam Hazarika, 50' },
  { pos: 1, screen: screenMeera, label: 'Down: Patient story, Meera Sharma, 42' },
];
const HOLD_MS = 2600;
const MOVE_MS = 900;
const FADE_MS = 500;

const pct = (v, total) => `${(v / total) * 100}%`;

export default function EqualizerAnimation({ alt }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0); // slide on screen
  const [pos, setPos] = useState(0); // card position: -1 up, 0 centre, 1 down
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const rootRef = useRef(null);
  const stepRef = useRef(0);
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

  const goTo = (next) => {
    if (next === stepRef.current) return;
    setPos(STEPS[next].pos);
    clearTimeout(timer.current);
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

  const { W, H, x, yc, cw, ch, travel } = L.left;
  const ip = L.ipad;

  return (
    <div ref={rootRef}>
      <span className="sr-only">{alt}</span>
      <div
        className="grid w-full select-none touch-pan-y grid-cols-[226fr_262fr] items-stretch"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* physical card on its up/down track */}
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <img src={backdrop} alt="" draggable="false" className="absolute inset-0 h-full w-full" />
          <img
            src={cardImg}
            alt=""
            draggable="false"
            decoding="async"
            className="absolute [filter:drop-shadow(0_0.4vw_0.6vw_rgba(42,26,122,0.28))]"
            style={{
              left: pct(x, W),
              top: pct(yc, H),
              width: pct(cw, W),
              height: pct(ch, H),
              transform: `translateY(${(pos * travel * 100) / ch}%)`,
              transition: reduce ? 'none' : `transform ${MOVE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
              willChange: 'transform',
            }}
          />
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

      {/* step indicator (also lets visitors jump to a card position) */}
      <div className="mx-auto mt-2 flex w-fit rounded-full bg-[#F1F0FB] px-1">
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show card position: ${s.label}`}
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
