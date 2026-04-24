'use client';
import { useState, useEffect, useRef } from 'react';
import { asset } from '@/lib/constants';

const SLIDES = [
  {
    src: asset('/frames/s1_001.jpg'),
    heading: 'This is what\nhome feels like.',
    sub: 'SkyCielo finds you spaces that move you.',
    accent: '#b59a72',
  },
  {
    src: asset('/frames/s2_001.jpg'),
    heading: 'Crafted for the\nway you live.',
    sub: 'Every property chosen for its soul, not just its size.',
    accent: '#b59a72',
  },
  {
    src: asset('/frames/s3_001.jpg'),
    heading: 'Your next chapter\nstarts here.',
    sub: 'SkyCielo represents exceptional homes across the city.',
    accent: '#b59a72',
  },
];

const DURATION = 4000; // ms per slide

export default function MobileLanding({ onLoaded }: { onLoaded: () => void }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(0);

  // Preload all 3 images then call onLoaded
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
      img.onload = img.onerror = () => {
        loadedRef.current++;
        if (loadedRef.current >= SLIDES.length) onLoaded();
      };
    });
  }, [onLoaded]);

  const goTo = (next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setPrev(active);
    setActive(next);
    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 900);
  };

  // Auto-cycle
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((active + 1) % SLIDES.length);
    }, DURATION);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, transitioning]); // eslint-disable-line

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100svh', overflow: 'hidden', background: '#0f0e0c' }}>

      {/* Previous slide fading out */}
      {prev !== null && (
        <div key={`prev-${prev}`} style={imgWrap(false)}>
          <img src={SLIDES[prev].src} alt="" style={imgStyle} />
        </div>
      )}

      {/* Active slide fading in */}
      <div key={`active-${active}`} style={imgWrap(true)}>
        <img src={SLIDES[active].src} alt="" style={imgStyle} />
      </div>

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(10,9,8,0.55) 0%, rgba(10,9,8,0.15) 45%, rgba(10,9,8,0.72) 100%)',
      }} />

      {/* Logo top-center */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center', paddingTop: 20,
      }}>
        <img src={asset('/logo.png')} alt="SkyCielo" style={{ height: 44, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
      </div>

      {/* Text block */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
        padding: '0 28px 90px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        {/* Eyebrow label */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: SLIDES[active].accent, margin: 0,
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.5s ease 0.4s',
        }}>
          Sky Cielo · {['Home', 'Living', 'Legacy'][active]}
        </p>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(2.4rem, 10vw, 3.2rem)',
          fontWeight: 300, lineHeight: 1.1, margin: 0,
          color: '#f5f0e8',
          whiteSpace: 'pre-line',
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.55s ease 0.35s, transform 0.55s ease 0.35s',
        }}>
          {SLIDES[active].heading}
        </h1>

        {/* Subtext */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.88rem', lineHeight: 1.6, margin: 0,
          color: 'rgba(245,240,232,0.72)',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.5s ease 0.45s',
        }}>
          {SLIDES[active].sub}
        </p>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { if (i !== active) goTo(i); }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === active ? 28 : 8, height: 8,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                background: i === active ? SLIDES[active].accent : 'rgba(255,255,255,0.3)',
                padding: 0,
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, zIndex: 11, background: 'rgba(255,255,255,0.1)' }}>
        <div
          key={active}
          style={{
            height: '100%',
            background: SLIDES[active].accent,
            animation: `mobileProgress ${DURATION}ms linear forwards`,
          }}
        />
      </div>

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes mobileProgress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}

const imgWrap = (isActive: boolean): React.CSSProperties => ({
  position: 'absolute', inset: 0, zIndex: 1,
  opacity: isActive ? 1 : 0,
  transition: isActive ? 'opacity 0.9s ease' : 'opacity 0.6s ease',
});

const imgStyle: React.CSSProperties = {
  width: '100%', height: '100%',
  objectFit: 'cover', objectPosition: 'center',
  display: 'block',
};
