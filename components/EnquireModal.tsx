'use client';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function EnquireModal() {
  const [open, setOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Open on every load after 4s delay
  useEffect(() => { const t = setTimeout(() => setOpen(true), 4000); return () => clearTimeout(t); }, []);

  // ── Email send ──────────────────────────────────────────────────
  const formRef = useRef<HTMLFormElement>(null);
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);

    const form = e.currentTarget;
    const getData = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value ?? '';

    const templateParams = {
      from_name:    getData('from_name'),
      name:         getData('from_name'),
      phone_number: getData('phone_number'),
      reply_to:     getData('reply_to'),
      email:        getData('reply_to'),
      message:      getData('message'),
      time:         new Date().toLocaleString(),
      title:        'SkyCielo Modal Enquiry',
    };

    try {
      await emailjs.send(
        'service_xxtgucx',
        'template_qvxehgi',
        templateParams,
        'fXXCajCjxetSFxcUz'
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
            {([
              { type: 'text',  name: 'from_name',    placeholder: 'Name',         },
              { type: 'tel',   name: 'phone_number', placeholder: 'Phone Number', },
              { type: 'email', name: 'reply_to',     placeholder: 'Email',        },
            ] as { type: string; name: string; placeholder: string }[]).map(f => (
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                required
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
