'use client';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function EnquireModal() {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // Slide state
  const [slideX, setSlideX] = useState(0);
  const [sliding, setSliding] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const TRACK_W = 320; // px — matches slider width below
  const THUMB_W = 52;
  const MAX = TRACK_W - THUMB_W - 4; // 4 = 2*border

  // Open on every load after 4s delay
  useEffect(() => { const t = setTimeout(() => setOpen(true), 4000); return () => clearTimeout(t); }, []);

  // ── Slide handlers ──────────────────────────────────────────────
  const onDown = (clientX: number) => {
    setSliding(true);
    startX.current = clientX - slideX;
  };
  const onMove = (clientX: number) => {
    if (!sliding) return;
    const nx = Math.max(0, Math.min(clientX - startX.current, MAX));
    setSlideX(nx);
    if (nx >= MAX) {
      setSliding(false);
      window.open('https://wa.me/919036078155', '_blank');
      setTimeout(() => setSlideX(0), 600);
    }
  };
  const onUp = () => {
    setSliding(false);
    if (slideX < MAX) setSlideX(0);
  };

  useEffect(() => {
    if (!sliding) return;
    const mm = (e: MouseEvent) => onMove(e.clientX);
    const tm = (e: TouchEvent) => onMove(e.touches[0].clientX);
    const mu = () => onUp();
    window.addEventListener('mousemove', mm);
    window.addEventListener('touchmove', tm);
    window.addEventListener('mouseup', mu);
    window.addEventListener('touchend', mu);
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('touchmove', tm);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('touchend', mu);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sliding, slideX]);

  // ── Email send ──────────────────────────────────────────────────
  const formRef = useRef<HTMLFormElement>(null);
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      await emailjs.sendForm(
        'service_1su27qd',
        'template_er8s48d',
        e.currentTarget,
        'BZzrfOZicjofLmCvV'
      );
      alert('Thank you! Your enquiry has been received.');
      formRef.current?.reset();
    } catch {
      alert('Failed to send. Please try again or contact us directly.');
    } finally {
      setIsSending(false);
    }
  };

  if (!open) return null;

  const progress = slideX / MAX; // 0–1

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(15,14,12,0.72)',
          backdropFilter: 'blur(6px)',
          animation: 'eq-fade .35s ease',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          pointerEvents: 'auto',
          width: 'min(92vw, 480px)',
          background: '#D3BBAF',
          color: '#0f0e0c',
          padding: '48px 40px 40px',
          position: 'relative',
          fontFamily: "'Inter', sans-serif",
          animation: 'eq-rise .45s cubic-bezier(.22,1,.36,1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.48)',
        }}>
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: 'absolute', top: 16, right: 20,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 22, color: 'rgba(15,14,12,0.5)',
              lineHeight: 1, padding: 4,
              transition: 'color .2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0f0e0c')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(15,14,12,0.5)')}
            aria-label="Close modal"
          >×</button>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
            fontWeight: 300, textAlign: 'center',
            margin: '0 0 8px', color: '#0f0e0c', letterSpacing: '-0.01em',
          }}>Enquire Now</h2>
          <div style={{ width: 36, height: 1, background: '#b59a72', margin: '0 auto 28px' }} />

          {/* Form */}
          <form ref={formRef} onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <input type="hidden" name="title" value="SkyCielo Modal Enquiry" />
            <input type="hidden" name="time"  value={new Date().toLocaleString()} />
            <input type="hidden" name="name"  value="" />
            <input type="hidden" name="email" value="" />

            {([
              { type: 'text',  name: 'from_name',    placeholder: 'Name',         sync: 'name' },
              { type: 'tel',   name: 'phone_number', placeholder: 'Phone Number', sync: '' },
              { type: 'email', name: 'reply_to',     placeholder: 'Email',        sync: 'email' },
            ] as { type: string; name: string; placeholder: string; sync: string }[]).map(f => (
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                required
                onChange={f.sync ? e => {
                  const hidden = e.currentTarget.form?.elements.namedItem(f.sync) as HTMLInputElement | null;
                  if (hidden) hidden.value = e.currentTarget.value;
                } : undefined}
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', borderBottom: '1px solid rgba(15,14,12,0.2)',
                  padding: '8px 0', fontSize: '0.95rem', color: '#0f0e0c',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.currentTarget.style.borderBottomColor = '#0f0e0c')}
                onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(15,14,12,0.2)')}
              />
            ))}

            <textarea
              name="message"
              placeholder="Your Query"
              required
              rows={3}
              style={{
                width: '100%', background: 'transparent',
                border: 'none', borderBottom: '1px solid rgba(15,14,12,0.2)',
                padding: '8px 0', fontSize: '0.95rem', color: '#0f0e0c',
                outline: 'none', resize: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              onFocus={e => (e.currentTarget.style.borderBottomColor = '#0f0e0c')}
              onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(15,14,12,0.2)')}
            />

            <button
              type="submit"
              disabled={isSending}
              style={{
                marginTop: 4,
                padding: '12px 0',
                background: '#0f0e0c',
                color: '#f5f0e8',
                border: 'none', cursor: 'pointer',
                fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.05em',
                opacity: isSending ? 0.5 : 1,
                transition: 'opacity .2s',
                fontFamily: 'inherit',
              }}
            >
              {isSending ? 'Sending…' : 'Enquire Now'}
            </button>
          </form>

          {/* WhatsApp Slide */}
          <div style={{ marginTop: 20 }}>
            <div
              ref={sliderRef}
              style={{
                position: 'relative', width: '100%', height: 52,
                background: `linear-gradient(to right, #25D366 ${progress * 100}%, rgba(15,14,12,0.08) ${progress * 100}%)`,
                borderRadius: 26, overflow: 'hidden',
                userSelect: 'none', cursor: 'default',
                transition: sliding ? 'none' : 'background .3s',
                border: '1px solid rgba(15,14,12,0.12)',
              }}
            >
              {/* Label */}
              <span style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em',
                color: progress > 0.5 ? '#fff' : 'rgba(15,14,12,0.5)',
                pointerEvents: 'none',
                transition: 'color .2s',
                paddingLeft: THUMB_W,
              }}>
                {progress >= 1 ? '✓ Opening WhatsApp…' : 'Slide to Enquire on WhatsApp ➜'}
              </span>

              {/* Thumb */}
              <div
                ref={thumbRef}
                onMouseDown={e => onDown(e.clientX)}
                onTouchStart={e => onDown(e.touches[0].clientX)}
                style={{
                  position: 'absolute', top: 2, left: 2 + slideX,
                  width: THUMB_W - 4, height: THUMB_W - 4,
                  borderRadius: '50%',
                  background: '#25D366',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'grab', boxShadow: '0 2px 12px rgba(37,211,102,0.4)',
                  transition: sliding ? 'none' : 'left .3s cubic-bezier(.22,1,.36,1)',
                  zIndex: 2,
                }}
              >
                {/* WhatsApp SVG icon */}
                <svg width="22" height="22" viewBox="0 0 32 32" fill="#fff">
                  <path d="M16 3C8.82 3 3 8.82 3 16c0 2.36.63 4.6 1.74 6.54L3 29l6.64-1.73A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm7.11 18.11c-.3.84-1.76 1.6-2.41 1.7-.65.1-1.26.46-4.26-.89-3.6-1.6-5.9-5.26-6.08-5.51-.17-.24-1.42-1.89-1.42-3.6 0-1.71.9-2.55 1.22-2.9.3-.33.67-.41.9-.41.22 0 .45.01.64.01.21 0 .5-.08.78.6.3.71 1.02 2.48 1.11 2.66.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.37.37-.16.73.21.36.93 1.54 2 2.5 1.37 1.22 2.53 1.6 2.89 1.78.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1 .99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.21 1.71Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes eq-fade { from { opacity:0 } to { opacity:1 } }
        @keyframes eq-rise { from { opacity:0; transform:translateY(28px) scale(.97) } to { opacity:1; transform:none } }
        input::placeholder, textarea::placeholder { color: rgba(15,14,12,0.4); }
      `}</style>
    </>
  );
}
