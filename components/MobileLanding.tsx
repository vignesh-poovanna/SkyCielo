'use client';
import { useState, useEffect, useRef } from 'react';
import { asset } from '@/lib/constants';

const PANELS = [
  {
    src: asset('/frames/s2_001.jpg'),
    label: 'Interior',
    number: '01',
    heading: 'This is what\nhome feels like.',
    sub: 'SkyCielo finds you spaces that move you.',
    collapsedX: '20%',
  },
  {
    src: asset('/frames/s3_001.jpg'),
    label: 'Hallway',
    number: '02',
    heading: 'Crafted for the\nway you live.',
    sub: 'Every property chosen for its soul, not just its size.',
    collapsedX: '50%',
  },
  {
    src: asset('/frames/s3_080.jpg'),
    label: 'Exterior',
    number: '03',
    heading: 'Your next chapter\nstarts here.',
    sub: 'SkyCielo represents exceptional homes across the city.',
    collapsedX: '80%',
  },
];

const GOLD = '#b59a72';
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const ANIM = `700ms ${EASE}`;

export default function MobileLanding({ onLoaded }: { onLoaded: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [textVisible, setTextVisible] = useState(false);
  const loadedRef = useRef(0);
  const textTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload all 3 images
  useEffect(() => {
    PANELS.forEach((p) => {
      const img = new Image();
      img.src = p.src;
      img.onload = img.onerror = () => {
        loadedRef.current++;
        if (loadedRef.current >= PANELS.length) onLoaded();
      };
    });
  }, [onLoaded]);

  const handleTap = (i: number) => {
    if (expanded === i) {
      // Collapse
      setTextVisible(false);
      setTimeout(() => setExpanded(null), 150);
    } else {
      setTextVisible(false);
      setExpanded(i);
      if (textTimer.current) clearTimeout(textTimer.current);
      textTimer.current = setTimeout(() => setTextVisible(true), 550);
    }
  };

  // Compute left% and width% for each panel
  const getPanelPos = (i: number): { left: string; width: string } => {
    if (expanded === null) {
      return { left: `${(i / 3) * 100}%`, width: '33.333%' };
    }
    if (i === expanded) {
      return { left: '0%', width: '100%' };
    }
    if (i < expanded) {
      // Slide left off screen
      return { left: '-34%', width: '33.333%' };
    }
    // Slide right off screen
    return { left: '101%', width: '33.333%' };
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100svh',
        overflow: 'hidden',
        background: '#0f0e0c',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400&display=swap');
        .shutter-panel { -webkit-tap-highlight-color: transparent; }
        .shutter-panel:active { opacity: 0.92; }
        @keyframes scrollBob { 0%,100% { transform: translateY(0); opacity:0.6; } 50% { transform: translateY(5px); opacity:1; } }
      `}</style>

      {/* ── Panels ── */}
      {PANELS.map((panel, i) => {
        const { left, width } = getPanelPos(i);
        const isExpanded = expanded === i;
        const isOther = expanded !== null && !isExpanded;

        return (
          <div
            key={i}
            className="shutter-panel"
            onClick={() => handleTap(i)}
            style={{
              position: 'absolute',
              top: 0,
              height: '100%',
              left,
              width,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: `left ${ANIM}, width ${ANIM}`,
              zIndex: isExpanded ? 3 : 2,
            }}
          >
            {/* Image — pans from slice to full on expand */}
            <img
              src={panel.src}
              alt={panel.label}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${isExpanded ? '50%' : panel.collapsedX} center`,
                transition: `object-position ${ANIM}, transform ${ANIM}`,
                transform: isExpanded ? 'scale(1.04)' : 'scale(1.0)',
                display: 'block',
                userSelect: 'none',
                WebkitUserSelect: 'none',
              }}
            />

            {/* Dark vignette — heavier when collapsed */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isExpanded
                  ? 'linear-gradient(to bottom, rgba(10,9,8,0.45) 0%, rgba(10,9,8,0.05) 40%, rgba(10,9,8,0.75) 100%)'
                  : 'linear-gradient(to bottom, rgba(10,9,8,0.7) 0%, rgba(10,9,8,0.3) 50%, rgba(10,9,8,0.8) 100%)',
                transition: `background ${ANIM}`,
              }}
            />

            {/* Collapsed state: vertical divider line on right (not last) */}
            {!isExpanded && i < 2 && (
              <div
                style={{
                  position: 'absolute',
                  top: '10%',
                  right: 0,
                  width: 1,
                  height: '80%',
                  background: `linear-gradient(to bottom, transparent, ${GOLD}55, transparent)`,
                  opacity: isOther ? 0 : 1,
                  transition: `opacity ${ANIM}`,
                }}
              />
            )}

            {/* Collapsed state: panel label (vertical text + number) */}
            {!isExpanded && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 40,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  opacity: isOther ? 0 : 1,
                  transform: isOther ? 'translateY(10px)' : 'translateY(0)',
                  transition: `opacity 400ms ease, transform 400ms ease`,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    transform: 'rotate(180deg)',
                  }}
                >
                  {panel.label}
                </span>
                <span
                  style={{
                    width: 1,
                    height: 24,
                    background: `linear-gradient(to bottom, ${GOLD}, transparent)`,
                    display: 'block',
                  }}
                />
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.2em',
                    color: 'rgba(245,240,232,0.4)',
                  }}
                >
                  {panel.number}
                </span>
              </div>
            )}

            {/* Expanded state: full text overlay */}
            {isExpanded && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '0 28px 80px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 500ms ease, transform 500ms ease',
                  pointerEvents: 'none',
                }}
              >
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: GOLD,
                    margin: 0,
                  }}
                >
                  Sky Cielo · {panel.label}
                </p>
                <h1
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 'clamp(2.2rem, 9vw, 3rem)',
                    fontWeight: 300,
                    lineHeight: 1.1,
                    margin: 0,
                    color: '#f5f0e8',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {panel.heading}
                </h1>
                <div style={{ width: 40, height: 1, background: GOLD, margin: '4px 0' }} />
                <p
                  style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.65,
                    margin: 0,
                    color: 'rgba(245,240,232,0.72)',
                    maxWidth: 300,
                  }}
                >
                  {panel.sub}
                </p>
                {/* Close hint */}
                <p
                  style={{
                    fontSize: 9,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,240,232,0.3)',
                    margin: '12px 0 0',
                  }}
                >
                  Tap to close
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* ── Logo — top center, always visible ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          paddingTop: 22,
          pointerEvents: 'none',
        }}
      >
        <img
          src={asset('/logo.png')}
          alt="SkyCielo"
          style={{
            height: 56,
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: expanded !== null ? 0.6 : 1,
            transition: `opacity ${ANIM}`,
          }}
        />
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{
        position: 'absolute', bottom: 54, left: 0, right: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        pointerEvents: 'none',
        opacity: expanded !== null ? 0 : 1,
        transition: 'opacity 400ms ease',
      }}>
        <p style={{ fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.3)', margin: 0 }}>Scroll</p>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" style={{ animation: 'scrollBob 1.6s ease-in-out infinite' }}>
          <path d="M7 1v12M2 9l5 5 5-5" stroke="rgba(181,154,114,0.6)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* ── Disclaimer ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 14,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: expanded !== null ? 0 : 0.45,
          transition: 'opacity 400ms ease',
          padding: '0 24px',
        }}
      >
        <p style={{ fontSize: 8.5, letterSpacing: '0.1em', textAlign: 'center', color: 'rgba(245,240,232,0.5)', margin: 0, lineHeight: 1.5 }}>
          Visuals are for representational purposes only. Actual properties may vary.
        </p>
      </div>

      {/* ── Collapsed hint: "select a space" ── */}
      <div
        style={{
          position: 'absolute',
          top: 72,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: expanded !== null ? 0 : 1,
          transition: `opacity 400ms ease`,
        }}
      >
        <p
          style={{
            fontSize: 9,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.35)',
            margin: 0,
          }}
        >
          Select a space
        </p>
      </div>
    </div>
  );
}
