'use client';
import { useState, useCallback, useEffect } from 'react';
import { useScroll, useTransform, useMotionValue } from 'framer-motion';
import VillaScroll from '@/components/VillaScroll';
import TextOverlay from '@/components/TextOverlay';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom scroll progress scoped to the 600vh scroll zone only
  const scrollZoneProgress = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollZoneEnd = window.innerHeight * 5; // 500vh
      if (scrollZoneEnd > 0) {
        scrollZoneProgress.set(Math.min(window.scrollY / scrollZoneEnd, 1));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollZoneProgress]);

  const handleProgress = useCallback((p: number) => setLoadProgress(p), []);
  const handleLoaded = useCallback(() => setIsLoaded(true), []);

  return (
    <>
      <LoadingScreen progress={loadProgress} isLoaded={isLoaded} />
      <Navbar />

      {/* Cinematic scroll zone */}
      <VillaScroll onLoadProgress={handleProgress} onLoaded={handleLoaded} />

      {/* ── Story: Overlay 1 — Fireplace (visible from 0, fade out 12–18%) ── */}
      <TextOverlay
        scrollYProgress={scrollZoneProgress}
        fadeRange={[0, 0, 0.12, 0.18]}
        heading="This is what home feels like."
        subtext="SkyCielo finds you spaces that move you."
        align="center"
        initialOpacity={1}
        logoSrc="/logo.png"
      />

      {/* ── Story: Overlay 2 — Hall (22–43%) ── */}
      <TextOverlay
        scrollYProgress={scrollZoneProgress}
        fadeRange={[0.22, 0.27, 0.38, 0.43]}
        heading="Crafted for the way you live."
        subtext="Every property we represent is chosen for its soul, not just its size."
        align="left"
      />

      {/* ── Story: Overlay 3 — Hallway (47–68%) ── */}
      <TextOverlay
        scrollYProgress={scrollZoneProgress}
        fadeRange={[0.47, 0.52, 0.63, 0.68]}
        heading="Details that stay with you."
        subtext="From the hallway to the horizon, nothing is overlooked."
        align="right"
      />

      {/* ── Story: Overlay 4 — Exterior (72–98%) ── */}
      <TextOverlay
        scrollYProgress={scrollZoneProgress}
        fadeRange={[0.72, 0.77, 0.93, 0.98]}
        heading="Your next chapter starts here."
        subtext="SkyCielo represents exceptional homes across city. This is the standard we hold."
        align="center"
        showCta
      />

      {/* ── Logo Full Section — scrolls in as next page after animation ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ zIndex: 10, minHeight: '100vh', backgroundColor: '#111827' }}
      >
        <div className="flex items-center justify-center px-8">
          <img
            src="/logo-full.png"
            alt="SkyCielo Full Logo"
            className="w-[70vw] max-w-2xl object-contain"
          />
        </div>
      </section>

      {/* ── Footer — sits above fixed canvas ── */}
      <footer
        className="relative flex flex-col md:flex-row items-center justify-between px-8 lg:px-16 py-8 gap-4 bg-white border-t border-stone-100"
        style={{ zIndex: 10 }}
      >
        <img src="/logo.png" alt="SkyCielo" className="h-7 object-contain opacity-60" />
        <p className="text-stone-400 text-xs tracking-[0.2em] uppercase">
          © 2025 SkyCielo. All rights reserved.
        </p>
      </footer>
    </>
  );
}

