'use client';
import { motion, MotionValue, useTransform } from 'framer-motion';

interface Props {
  scrollYProgress: MotionValue<number>;
  fadeRange: [number, number, number, number];
  heading: string;
  subtext: string;
  align?: 'left' | 'center' | 'right';
  showCta?: boolean;
  initialOpacity?: number; // output[0] — default 0 for late-appear overlays, 1 for first
  logoSrc?: string;        // optional logo image above heading
}

export default function TextOverlay({
  scrollYProgress,
  fadeRange,
  heading,
  subtext,
  align = 'center',
  showCta = false,
  initialOpacity = 0,
  logoSrc,
}: Props) {
  const opacity = useTransform(
    scrollYProgress,
    [fadeRange[0], fadeRange[1], fadeRange[2], fadeRange[3]],
    [initialOpacity, 1, 1, 0]
  );

  const justifyMap = { left: 'justify-start', center: 'justify-center', right: 'justify-end' };
  const textAlignMap = { left: 'text-left', center: 'text-center', right: 'text-right' };
  const paddingMap = {
    left: 'pl-8 pr-8 lg:pl-20 lg:pr-0',
    center: 'px-8 lg:px-0',
    right: 'pr-8 pl-8 lg:pr-20 lg:pl-0',
  };

  return (
    <motion.div
      style={{ opacity }}
      className={`fixed inset-0 z-20 flex items-center pointer-events-none ${justifyMap[align]}`}
    >
      <div
        className={`max-w-lg ${paddingMap[align]} ${textAlignMap[align]} flex flex-col items-center`}
        style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
      >
        {logoSrc && (
          <img
            src={logoSrc}
            alt="SkyCielo"
            className="mb-8 h-16 md:h-20 lg:h-24 object-contain"
            style={{
              filter: 'brightness(0) invert(1)',
              dropShadow: '0 2px 20px rgba(0,0,0,0.4)',
            } as React.CSSProperties}
          />
        )}
        <h2
          className="text-white/90 text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.08em] leading-tight mb-5"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          {heading}
        </h2>
        <p className="text-white/60 text-sm md:text-base tracking-[0.12em] leading-loose font-light">
          {subtext}
        </p>
        {showCta && (
          <motion.a
            href="#"
            className="pointer-events-auto inline-block mt-10 px-10 py-4 bg-[#546B41] text-white text-xs tracking-[0.2em] uppercase rounded-full font-medium hover:bg-[#61804c] transition-colors duration-300 w-full md:w-auto text-center"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            Explore Our Properties
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}
