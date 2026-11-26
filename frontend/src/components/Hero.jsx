import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import hero1x from '../assets/images/hero-clinic.webp';
import hero2x from '../assets/images/hero-clinic@2x.webp';
import heroJpg from '../assets/images/hero-clinic@2x.jpg';

const HERO_ALT =
  'A pharmaceutical medical representative details an Esomeprazole brand presentation on an iPad to a doctor in his clinic, with ActiVA symptom cards (acid, motility and persistence) on the desk.';

function HeroPicture({ className, imgClassName, sizes }) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={`${hero1x} 1138w, ${hero2x} 2276w`} sizes={sizes} />
      <img
        src={heroJpg}
        alt={HERO_ALT}
        width="1138"
        height="694"
        className={imgClassName}
        fetchpriority="high"
        decoding="async"
      />
    </picture>
  );
}

function HeroWave() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px] w-full sm:h-[160px] lg:h-[190px]"
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroWaveA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0866F5" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#7434F5" stopOpacity="0.45" />
          <stop offset="1" stopColor="#DD10E8" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="heroWaveB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#58A2FF" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#B07BFF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#F37CF5" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M0 110C240 40 420 170 720 120S1200 30 1440 90V200H0Z" fill="url(#heroWaveB)" />
      <path d="M0 150C260 80 520 190 820 150S1260 90 1440 130V200H0Z" fill="url(#heroWaveA)" />
      <path d="M0 176C300 130 560 200 860 176S1280 140 1440 164V200H0Z" fill="#FFFFFF" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8F9FF] to-white pb-16 sm:pb-24 lg:pb-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(116,52,245,0.12),transparent_65%)]" aria-hidden="true" />
      {/* Desktop: image bleeds to the right edge and fades into the page */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute bottom-[70px] right-0 top-0 hidden w-[53%] lg:block xl:w-[55%]"
      >
        <HeroPicture
          className="block h-full w-full"
          sizes="55vw"
          imgClassName="h-full w-full object-cover object-[45%_center] [mask-image:linear-gradient(to_right,transparent,black_24%)]"
        />
      </motion.div>

      <div className="container-site relative grid items-center gap-8 pt-10 sm:pt-14 lg:min-h-[540px] lg:grid-cols-2 lg:gap-6 lg:pt-6 xl:min-h-[590px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-xl lg:max-w-none"
        >
          <span className="accent-bar mb-6" aria-hidden="true" />
          <h1 className="text-[2.35rem] font-extrabold leading-[1.06] tracking-tight text-navy min-[400px]:text-[2.6rem] sm:text-5xl lg:text-[2.7rem] xl:text-[3.3rem]">
            Don&rsquo;t Just Show.
            <span className="text-gradient block pb-1 lg:whitespace-nowrap">Let the Doctor Interact.</span>
          </h1>
          <p className="mt-5 max-w-[30rem] text-lg leading-relaxed text-navy-500 sm:text-xl">
            Transform conventional iPad detailing into participative physical-to-digital brand experiences.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row">
            <a href="#request-demo" className="btn-primary w-full min-[480px]:w-auto">
              Request a Demo <ChevronRight size={18} aria-hidden="true" />
            </a>
            <a href="#experiences" className="btn-secondary w-full min-[480px]:w-auto">
              Explore Experiences <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </motion.div>

        {/* Mobile / tablet: image below the copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="-mx-5 sm:-mx-8 lg:hidden"
        >
          <HeroPicture
            sizes="100vw"
            imgClassName="h-auto w-full [mask-image:linear-gradient(to_bottom,black_75%,transparent)]"
          />
        </motion.div>
      </div>
      <HeroWave />
    </section>
  );
}
