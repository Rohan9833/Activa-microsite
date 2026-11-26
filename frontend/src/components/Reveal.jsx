import { motion } from 'framer-motion';

/** Small entrance animation. Respects prefers-reduced-motion via <MotionConfig reducedMotion="user">. */
export default function Reveal({ children, delay = 0, y = 18, className = '', as = 'div' }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
