import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Small entrance animation. Respects prefers-reduced-motion via <MotionConfig reducedMotion="user">. */
export default function Reveal({
  children,
  delay = 0,
  y = 18,
  className = '',
  as = 'div',
  disableMobileAnimation = false,
}) {
  const Tag = motion[as] ?? motion.div;
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 767px)').matches
      : false
  );

  useEffect(() => {
    if (!disableMobileAnimation) return undefined;

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateMobileState = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateMobileState);

    return () => mediaQuery.removeEventListener('change', updateMobileState);
  }, [disableMobileAnimation]);

  const skipEntrance = disableMobileAnimation && isMobile;

  return (
    <Tag
      className={className}
      initial={skipEntrance ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
