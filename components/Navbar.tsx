'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { asset } from '@/lib/constants';

export default function Navbar() {
  const { scrollY } = useScroll();

  // Only use a subtle blur on scroll, avoiding solid heavy backgrounds
  const blurValue = useTransform(scrollY, [0, 100], [0, 8]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Background layer with feathered edges */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          // A smooth cinematic vignette at the top edge for text readability
          background: 'linear-gradient(to bottom, rgba(15,14,12,0.6) 0%, rgba(15,14,12,0) 100%)',
          backdropFilter: useTransform(blurValue, (b) => `blur(${b}px)`),
          WebkitBackdropFilter: useTransform(blurValue, (b) => `blur(${b}px)`),
          // Feathers out the blur so there is no sharp horizontal edge at the bottom
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />

      <div className="relative flex items-center justify-between px-8 lg:px-16 py-6 w-full">
        <a
          href="/"
          className="pointer-events-auto"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img
            src={asset('/logo.png')}
            alt="SkyCielo"
            className="h-8 object-contain"
            style={{
              filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
            }}
          />
        </a>
        <div className="flex items-center gap-10 pointer-events-auto">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/70 text-xs tracking-[0.2em] uppercase font-light hover:text-white transition-colors duration-300"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            About Us
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white/70 text-xs tracking-[0.2em] uppercase font-light hover:text-white transition-colors duration-300"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
