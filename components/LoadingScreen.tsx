'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  progress: number;
  isLoaded: boolean;
}

export default function LoadingScreen({ progress, isLoaded }: Props) {
  const pct = Math.round(progress * 100);
  const circ = 2 * Math.PI * 20; // ~125.66

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center gap-8"
        >
          {/* Logo */}
          <img src="/logo.png" alt="SkyCielo" className="h-12 object-contain opacity-80" />

          {/* Spinner */}
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#e8e5e0" strokeWidth="1.5" />
              <motion.circle
                cx="25" cy="25" r="20"
                fill="none"
                stroke="#546B41"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
          </div>

          {/* Progress text */}
          <p className="text-stone-400 text-xs tracking-[0.25em] uppercase">
            Preparing your experience… {pct}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
