import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useRef, useState } from "react";
import Reveal from "./Reveal.jsx";

import cardAcid from "../assets/images/sequence-anim/card-acid.webp";
import cardMotility from "../assets/images/sequence-anim/card-motility.webp";
import cardPersistence from "../assets/images/sequence-anim/card-persistence.webp";

import ipadDims from "../assets/images/ipad-sequence.webp";
import ipadDims2x from "../assets/images/ipad-sequence@2x.webp";
import ipadRajesh from "../assets/images/ipad-rajesh.webp";
import ipadRajesh2x from "../assets/images/ipad-rajesh@2x.webp";

function SymptomCards() {
  return (
    <div
      className="relative mx-auto flex h-full max-w-[260px] items-center justify-center py-4"
      aria-hidden="true"
    >
      {[
        [cardAcid, "-rotate-[10deg] translate-x-[38%]"],
        [cardMotility, "z-10"],
        [cardPersistence, "rotate-[10deg] -translate-x-[38%]"],
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
    tag: "Brand objective",
    title: "Look beyond acid alone",
    text: "GERD patients describe the same three symptom dimensions (acid, motility and persistence) in a different order. What comes first can change the management approach.",
    visual: <SymptomCards />,
  },
  {
    tag: "Physical interaction",
    title: "The doctor arranges the cards",
    text: "The doctor places the three symptom cards in the order that best reflects the patient in front of them, while the MR guides the discussion on iPad.",
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
    tag: "ActiVA experience",
    title: "The matching patient story appears",
    text: "Each order reveals a different patient profile (for example, heartburn first for Rajesh, bloating first for Anita), so the conversation moves to the patient the doctor actually sees.",
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
  const [trackPosition, setTrackPosition] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const goToStep = (step) => {
    const next = (step + STEPS.length) % STEPS.length;

    setActiveStep(next);

    // Seamless loop using cloned boundary slides.
    if (activeStep === STEPS.length - 1 && next === 0) {
      setTrackPosition(STEPS.length + 1);
    } else if (activeStep === 0 && next === STEPS.length - 1) {
      setTrackPosition(0);
    } else {
      setTrackPosition(next + 1);
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    // Only trigger when the gesture is clearly horizontal.
    if (
      Math.abs(deltaX) > 45 &&
      Math.abs(deltaX) > Math.abs(deltaY)
    ) {
      goToStep(activeStep + (deltaX < 0 ? 1 : -1));
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleTrackTransitionEnd = (event) => {
    // Ignore transitions bubbling from child elements.
    if (
      event.target !== event.currentTarget ||
      !transitionEnabled
    ) {
      return;
    }

    // If we reached the clone of the last slide,
    // silently jump to the real last slide.
    if (trackPosition === 0) {
      setTransitionEnabled(false);
      setTrackPosition(STEPS.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }

    // If we reached the clone of the first slide,
    // silently jump to the real first slide.
    else if (trackPosition === STEPS.length + 1) {
      setTransitionEnabled(false);
      setTrackPosition(1);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  };

  // Clone last slide before the real slides,
  // and clone first slide after the real slides.
  const carouselSlides = [
    STEPS[STEPS.length - 1],
    ...STEPS,
    STEPS[0],
  ];

  return (
    <section
      id="example"
      className="py-14 sm:py-20"
      aria-labelledby="example-title"
    >
      <div className="container-site">

        {/* Section heading */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Example concept</p>

          <h2 id="example-title" className="text-start section-title mt-2 lg:text-center">
            One brand story.{" "}
            <span className="text-gradient">
              Many patient conversations.
            </span>
          </h2>

          <p className="text-start mt-4 text-lg text-navy-500 lg:text-center">
            How a single ActiVA interaction can turn GERD symptom
            profiling into a participative discussion.
          </p>
        </Reveal>

        {/* Carousel viewport */}
        <div
          className="example-carousel-viewport"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
        >
          {/* Sliding track */}
          <ol
            className={`example-slides mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-10 ${
              transitionEnabled ? "" : "example-no-transition"
            }`}
            style={{
              "--active-slide": trackPosition,
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {carouselSlides.map((s, trackIndex) => {
              const isClone =
                trackIndex === 0 ||
                trackIndex === STEPS.length + 1;

              const stepIndex =
                (trackIndex - 1 + STEPS.length) %
                STEPS.length;

              return (
                <Reveal
                  as="li"
                  key={`${trackIndex}-${s.tag}`}
                  delay={isClone ? 0 : stepIndex * 0.08}
                  disableMobileAnimation
                  className={
                    isClone
                      ? "relative example-slide-clone"
                      : "relative"
                  }
                  aria-hidden={isClone}
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-[#ECE8FB]">

                    {/* Visual */}
                    <div className="flex h-[210px] items-center justify-center bg-gradient-to-br from-[#F2F5FF] via-[#F6F2FF] to-[#FCF1FD] px-5">
                      {s.visual}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-violet">
                        {String(stepIndex + 1).padStart(2, "0")}{" "}
                        · {s.tag}
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold text-navy">
                        {s.title}
                      </h3>

                      <p className="mt-2 text-[15px] leading-relaxed text-navy-500">
                        {s.text}
                      </p>
                    </div>
                  </div>

                  {/* Desktop arrow between cards */}
                  {stepIndex < STEPS.length - 1 && !isClone && (
                    <ChevronRight
                      className="absolute -right-[34px] top-[105px] hidden -translate-y-1/2 text-brand-violet lg:block"
                      size={28}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  )}
                </Reveal>
              );
            })}
          </ol>
        </div>

        {/* Carousel controls */}
        <div
          className="example-carousel-controls"
          aria-label="Example concept slides"
        >
          {/* Previous */}
          <button
            type="button"
            onClick={() => goToStep(activeStep - 1)}
            aria-label="Previous example"
            className="example-arrow"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          {/* Dots */}
          <div
            className="example-dots"
            role="tablist"
            aria-label="Choose example concept"
          >
            {STEPS.map((step, i) => (
              <button
                key={step.tag}
                type="button"
                role="tab"
                aria-label={`Show slide ${i + 1}: ${step.tag}`}
                aria-selected={activeStep === i}
                onClick={() => goToStep(i)}
                className={
                  activeStep === i
                    ? "example-dot active"
                    : "example-dot"
                }
              />
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() => goToStep(activeStep + 1)}
            aria-label="Next example"
            className="example-arrow"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="mx-auto mt-6 flex max-w-3xl justify-center items-start justify-center gap-2 text-center text-sm text-navy-300">
          <Info
            size={16}
            className="mt-0.5 shrink-0"
            aria-hidden="true "
          />

          Illustrative concept. It is
          not a client case study, patient profiles are
          fictional.
        </p>
      </div>
    </section>
  );
}