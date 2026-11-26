import RotateAnimation from './RotateAnimation.jsx';
import SequenceAnimation from './SequenceAnimation.jsx';
import EqualizerAnimation from './EqualizerAnimation.jsx';
import SelectAnimation from './SelectAnimation.jsx';
import AnimationAnimation from './AnimationAnimation.jsx';
import ipad1x from '../assets/images/ipad-detailing.webp';
import ipad2x from '../assets/images/ipad-detailing@2x.webp';

export const IPAD_SRC = window.devicePixelRatio > 1 ? ipad2x : ipad1x;

/* Overlays drawn on the iPad screen (coordinates match the 262x183 iPad image). */
const Badge = ({ x, y, n }) => (
  <g>
    <circle cx={x} cy={y} r="8" fill="url(#ovBrand)" stroke="#FFFFFF" strokeWidth="1.5" />
    <text x={x} y={y + 3.3} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#FFFFFF" fontFamily="inherit">
      {n}
    </text>
  </g>
);

const OVERLAYS = {
  sequence: (
    <>
      <Badge x={172} y={25} n={2} />
      <Badge x={164} y={71} n={1} />
      <Badge x={155} y={118} n={3} />
    </>
  ),
  equalizer: (
    <>
      <rect x="16" y="88" width="34" height="58" rx="6" fill="#0B1338" opacity="0.55" />
      {[14, 24, 36, 22].map((h, i) => (
        <rect key={i} x={21 + i * 7.2} y={141 - h} width="5" height={h} rx="2" fill={i === 2 ? 'url(#ovBrand)' : '#6F86E8'} />
      ))}
    </>
  ),
  select: (
    <>
      <rect x="171" y="22" width="46" height="36" rx="4" fill="#0B1338" opacity="0.62" transform="rotate(-3 194 40)" />
      <rect x="153" y="114" width="49" height="40" rx="4" fill="#0B1338" opacity="0.62" transform="rotate(-3 177 134)" />
      <rect x="163" y="67" width="48" height="40" rx="5" fill="none" stroke="url(#ovBrand)" strokeWidth="3" transform="rotate(-3 187 87)" />
      <circle cx="210" cy="69" r="8" fill="#18C27A" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M206.5 69l2.5 2.5 4.5-5" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  animation: (
    <>
      <path d="M26 150C52 138 62 70 98 40S150 60 146 96" fill="none" stroke="#FFFFFF" strokeWidth="1.6" strokeDasharray="2.5 4" opacity="0.85" />
      <circle cx="44" cy="128" r="2.6" fill="#9DB6FF" opacity="0.5" />
      <circle cx="58" cy="96" r="3.2" fill="#B49BFF" opacity="0.7" />
      <circle cx="74" cy="64" r="3.8" fill="#D08CFF" opacity="0.85" />
      <circle cx="98" cy="40" r="9" fill="#DD10E8" opacity="0.35" className="motion-safe:animate-pulse" />
      <circle cx="98" cy="40" r="5" fill="#FFFFFF" />
    </>
  ),
};

/**
 * Rotate: the approved full illustration.
 * Others: card-side illustration + shared iPad photo + on-screen response overlay.
 * Both use the same 488:183 frame so the panel never jumps between tabs.
 */
export default function InteractionVisual({ item }) {
  if (item.animated === 'rotate') return <RotateAnimation alt={item.alt} />;
  if (item.animated === 'sequence') return <SequenceAnimation alt={item.alt} />;
  if (item.animated === 'equalizer') return <EqualizerAnimation alt={item.alt} />;
  if (item.animated === 'select') return <SelectAnimation alt={item.alt} />;
  if (item.animated === 'animation') return <AnimationAnimation alt={item.alt} />;

  if (item.image) {
    return (
      <img
        src={item.image.src}
        srcSet={item.image.srcSet}
        sizes="(min-width: 1280px) 620px, (min-width: 768px) 60vw, 92vw"
        alt={item.alt}
        width="488"
        height="183"
        loading="lazy"
        decoding="async"
        className="h-auto w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      />
    );
  }

  return (
    <div className="grid w-full grid-cols-[226fr_262fr] items-stretch" role="img" aria-label={item.alt}>
      <img src={item.cardSide} alt="" width="452" height="366" loading="lazy" decoding="async" className="h-auto w-full" />
      <div className="relative">
        <img
          src={item.ipad?.src ?? ipad1x}
          srcSet={item.ipad?.srcSet ?? `${ipad1x} 262w, ${ipad2x} 524w`}
          sizes="(min-width: 1280px) 340px, (min-width: 768px) 32vw, 50vw"
          alt=""
          width="262"
          height="183"
          loading="lazy"
          decoding="async"
          className="h-auto w-full [mask-image:linear-gradient(to_right,black_90%,transparent)]"
        />
        <svg viewBox="0 0 262 183" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="ovBrand" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#0866F5" />
              <stop offset="0.52" stopColor="#7434F5" />
              <stop offset="1" stopColor="#DD10E8" />
            </linearGradient>
          </defs>
          {item.overlay && OVERLAYS[item.overlay]}
        </svg>
      </div>
    </div>
  );
}
