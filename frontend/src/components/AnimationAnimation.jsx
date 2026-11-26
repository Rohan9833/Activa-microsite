import backdrop from '../assets/illustrations/animation-backdrop.svg';
import ipad1x from '../assets/images/ipad-animation.webp';
import ipad2x from '../assets/images/ipad-animation@2x.webp';
import cardImg from '../assets/images/animation-anim/card.webp';
import manImg from '../assets/images/animation-anim/man-left.webp';
import L from '../assets/images/animation-anim/layout.json';

/*
 * Animation interaction, looping: the character card slides right towards the iPad and,
 * in step, the same character walks along the grey line on the slide; then both return.
 * Pure CSS keyframes (see index.css), so the two motions stay in sync and respect
 * prefers-reduced-motion. Hovering pauses it.
 */
const pct = (v, total) => `${(v / total) * 100}%`;

export default function AnimationAnimation({ alt }) {
  const { W, H, card, cardEndX } = L.left;
  const { W: IW, H: IH, man } = L.ipad;
  const [lx, ly, lw, lh] = man.left;
  const [rx, ry, rw, rh] = man.right;
  const scale = rh / lh;
  // translate so the man's feet (bottom-left corner) land on the right end of the line
  const manVars = {
    '--tx': `${((rx - lx) / lw) * 100}%`,
    '--ty': `${((ry + rh - (ly + lh)) / lh) * 100}%`,
    '--s': scale,
  };

  return (
    <div className="group/anim">
      <span className="sr-only">{alt}</span>
      <div className="grid w-full select-none grid-cols-[226fr_262fr] items-stretch">
        {/* physical card sliding towards the iPad */}
        <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
          <img src={backdrop} alt="" draggable="false" className="absolute inset-0 h-full w-full" />
          <img
            src={cardImg}
            alt=""
            draggable="false"
            decoding="async"
            className="activa-slide absolute rounded-[9%] [filter:drop-shadow(0_0.5vw_0.7vw_rgba(42,26,122,0.25))] group-hover/anim:[animation-play-state:paused]"
            style={{
              left: pct(card.x, W),
              top: pct(card.y, H),
              width: pct(card.w, W),
              height: pct(card.h, H),
              '--tx': `${((cardEndX - card.x) / card.w) * 100}%`,
              '--ty': '0%',
              '--s': 1,
            }}
          />
        </div>

        {/* iPad: the character walks along the line in step with the card */}
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
          <img
            src={manImg}
            alt=""
            draggable="false"
            decoding="async"
            className="activa-slide absolute origin-bottom-left group-hover/anim:[animation-play-state:paused]"
            style={{ left: pct(lx, IW), top: pct(ly, IH), width: pct(lw, IW), height: pct(lh, IH), ...manVars }}
          />
        </div>
      </div>
    </div>
  );
}
