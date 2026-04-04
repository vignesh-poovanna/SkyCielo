'use client';
import { useEffect, useRef } from 'react';

const TOTAL = 240;          // 80 frames × 3 scenes
const LOGO_FADE_START = 155;
const LOGO_FADE_END   = 175;

interface Props {
  onLoadProgress: (p: number) => void;
  onLoaded: () => void;
}

export default function VillaScroll({ onLoadProgress, onLoaded }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Local state — lives entirely inside this one effect ──
    const frames: (HTMLImageElement | null)[] = Array(TOTAL).fill(null);
    let logoImg: HTMLImageElement | null = null;
    let current = 0;
    let target  = 0;
    let raf     = 0;
    let loadedCount = 0;
    let active  = true; // guard against StrictMode double-invoke cleanup

    // ── Canvas sizing ──
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    setSize();

    // ── Cover-fill draw (no clearRect — previous frame persists if current missing) ──
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

      // ── Logo overlay ──
      if (logoImg?.complete && logoImg.naturalWidth > 0) {
        let alpha = 1;
        if (idx >= LOGO_FADE_END) {
          alpha = 0;
        } else if (idx >= LOGO_FADE_START) {
          alpha = 1 - (idx - LOGO_FADE_START) / (LOGO_FADE_END - LOGO_FADE_START);
        }
        if (alpha > 0) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const pad = 28 * dpr;
          const lh  = Math.min(44 * dpr, cw * 0.065);
          const lw  = (logoImg.naturalWidth / logoImg.naturalHeight) * lh;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.filter = 'brightness(0) invert(1)';
          ctx.drawImage(logoImg, pad, pad, lw, lh);
          ctx.restore();
        }
      }
    };

    // ── RAF loop: lerp current → target, draw every changed frame ──
    const loop = () => {
      const diff = target - current;
      if (Math.abs(diff) > 0.08) {
        current += diff * 0.12;
        drawFrame(current);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // ── Scroll listener ──
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        target = (window.scrollY / maxScroll) * (TOTAL - 1);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Resize listener ──
    const onResize = () => {
      setSize();
      drawFrame(current);
    };
    window.addEventListener('resize', onResize);

    // ── Preload all 240 frames ──
    for (let s = 0; s < 3; s++) {
      for (let f = 0; f < 80; f++) {
        const idx = s * 80 + f;
        const img = new Image();

        img.onload = () => {
          if (!active) return;
          frames[idx] = img;
          loadedCount++;

          // Report progress
          if (loadedCount % 12 === 0 || loadedCount === TOTAL) {
            onLoadProgress(loadedCount / TOTAL);
          }
          // Draw frame 0 immediately so something shows behind the loading screen
          if (idx === 0) drawFrame(0);
          // Signal ready
          if (loadedCount === TOTAL) onLoaded();
        };

        img.onerror = () => {
          if (!active) return;
          loadedCount++;
          if (loadedCount === TOTAL) onLoaded();
        };

        img.src = `/frames/s${s + 1}_${String(f + 1).padStart(3, '0')}.png`;
      }
    }

    // ── Load logo ──
    const logo = new Image();
    logo.onload = () => { if (active) logoImg = logo; };
    logo.src = '/logo.png';

    // ── Cleanup ──
    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [onLoadProgress, onLoaded]);

  return (
    <>
      {/* Scroll distance — 600vh of scrollable space */}
      <div style={{ height: '600vh', pointerEvents: 'none' }} />

      {/* Canvas always fixed to viewport — never affected by overflow or sticky bugs */}
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
