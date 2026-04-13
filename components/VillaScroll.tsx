'use client';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SCROLL_ZONE_VH, SCROLL_ZONE_SCROLLABLE_FACTOR, asset } from '@/lib/constants';

const TOTAL = 240;
const BATCH_SIZE = 40; // Load 40 frames eagerly to dismiss loading screen

interface Props {
  onLoadProgress: (p: number) => void;
  onLoaded: () => void;
}

export default function VillaScroll({ onLoadProgress, onLoaded }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const frames: (HTMLImageElement | null)[] = Array(TOTAL).fill(null);
    let current = 0;
    let target  = 0;
    let raf     = 0;
    let loadedCount = 0;
    let active  = true;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    setSize();

    const drawFrame = (fi: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const idx = Math.max(0, Math.min(Math.round(fi), TOTAL - 1));
      const img = frames[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth  * scale;
      const h = img.naturalHeight * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;

      ctx.drawImage(img, x, y, w, h);
    };

    const loop = () => {
      if (shouldReduceMotion) return;
      const diff = target - current;
      if (Math.abs(diff) > 0.08) {
        current += diff * 0.12;
        drawFrame(current);
      }
      raf = requestAnimationFrame(loop);
    };
    if (!shouldReduceMotion) raf = requestAnimationFrame(loop);

    const onScroll = () => {
      if (shouldReduceMotion) return;
      const scrollZoneEnd = window.innerHeight * SCROLL_ZONE_SCROLLABLE_FACTOR;
      if (scrollZoneEnd > 0) {
        target = Math.min((window.scrollY / scrollZoneEnd) * (TOTAL - 1), TOTAL - 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      setSize();
      drawFrame(current);
    };
    window.addEventListener('resize', onResize);

    // ── Optimized Loader ──
    const loadFrame = (idx: number, priority: 'high' | 'low' = 'low'): Promise<void> => {
      return new Promise((resolve) => {
        const s = Math.floor(idx / 80);
        const f = idx % 80;
        const img = new Image();
        if (priority === 'high') (img as any).fetchPriority = 'high';
        
        img.onload = () => {
          if (!active) return;
          frames[idx] = img;
          loadedCount++;
          if (idx === 0) drawFrame(0);
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          resolve();
        };
        img.src = asset(`/frames/s${s + 1}_${String(f + 1).padStart(3, '0')}.jpg`);
      });
    };

    const UNLOCK_AT = Math.floor(TOTAL * 0.75); // release at 75% = 180 frames
    const CONCURRENCY = 12; // parallel requests at a time
    let unlocked = false;

    const runLoader = async () => {
      // Load frame 0 first so canvas has something to show immediately
      await loadFrame(0, 'high');
      onLoadProgress(1 / TOTAL);

      // Load the rest in parallel batches of CONCURRENCY
      const remaining = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);

      for (let b = 0; b < remaining.length; b += CONCURRENCY) {
        if (!active) break;
        const batch = remaining.slice(b, b + CONCURRENCY);
        await Promise.all(batch.map(i => loadFrame(i)));

        onLoadProgress(loadedCount / TOTAL);

        // Unlock the site once 75% of frames are ready
        if (!unlocked && loadedCount >= UNLOCK_AT) {
          unlocked = true;
          onLoaded();
        }
      }

      // Fallback: if somehow we never hit 75%, unlock anyway
      if (!unlocked) {
        unlocked = true;
        onLoaded();
      }
    };
    runLoader();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      for (let i = 0; i < frames.length; i++) {
        frames[i] = null;
      }
    };
  }, [onLoadProgress, onLoaded, shouldReduceMotion]);

  return (
    <>
      <div style={{ height: `${SCROLL_ZONE_VH}vh`, pointerEvents: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'block',
          background: '#0f0e0c',
          zIndex: 1,
        }}
      />
    </>
  );
}
