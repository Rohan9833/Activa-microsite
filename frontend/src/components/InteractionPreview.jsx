import { AnimatePresence, motion } from 'framer-motion';
import InteractionVisual from './InteractionVisual.jsx';
import { useRef } from 'react';

export default function InteractionPreview({ item, index, total }) {
  const swipeStartX = useRef(null);
  const onTouchStart = (e) => { swipeStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (swipeStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(delta) < 25) return;
    window.dispatchEvent(new CustomEvent('interaction-preview-swipe', {
      detail: { direction: delta < 0 ? 1 : -1 },
    }));
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-white/90 shadow-card ring-1 ring-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="grid h-full items-center gap-2 p-5 sm:p-7 md:grid-cols-[0.5fr_1.5fr] md:gap-6 touch-pan-y select-none"\n          onTouchStart={onTouchStart}\n          onTouchEnd={onTouchEnd}
        >
          <div className="md:pl-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-300">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </p>
            <h3 className="mt-2 text-[1.75rem] font-extrabold leading-tight text-navy sm:text-3xl">{item.title}</h3>
            <p className="mt-2 max-w-[17rem] text-base leading-relaxed text-navy-500 sm:text-[17px]">{item.description}</p>
          </div>
          <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className="min-w-0">
            <InteractionVisual item={item} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
