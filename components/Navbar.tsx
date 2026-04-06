'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar() {
  const { scrollY } = useScroll();
  
  // Animate background opacity from 0 to 0.8 over the first 100px of scroll
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const blurValue = useTransform(scrollY, [0, 100], [0, 12]);

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-6"
      style={{ 
        backgroundColor: useTransform(bgOpacity, (o) => `rgba(15,14,12,${o})`),
        backdropFilter: useTransform(blurValue, (b) => `blur(${b}px)`),
        WebkitBackdropFilter: useTransform(blurValue, (b) => `blur(${b}px)`),
      }}
    >
      <a href="/" className="pointer-events-auto">
        <img
          src="/logo.png"
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
    </motion.nav>
  );
}
