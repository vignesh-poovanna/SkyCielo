'use client';
import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import VillaScroll from '@/components/VillaScroll';
import TextOverlay from '@/components/TextOverlay';
import MobileLanding from '@/components/MobileLanding';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { asset, SCROLL_ZONE_SCROLLABLE_FACTOR } from '@/lib/constants';

const COMMIT_ITEMS = [
  { icon: '⌂', text: 'Curating thoughtfully planned layouts for future-ready homes' },
  { icon: '✦', text: 'Creating customizable villas inspired by European sophistication' },
  { icon: '◈', text: 'Blending luxury, comfort, and functionality in every space' },
  { icon: '◇', text: 'Upholding transparency, quality, and trust at every step' },
  { icon: '❋', text: 'Building communities that inspire a sense of belonging' },
];

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile once on mount (SSR-safe)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Desktop: scroll progress scoped to scroll zone
  const scrollZoneProgress = useMotionValue(0);
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const scrollZoneEnd = window.innerHeight * SCROLL_ZONE_SCROLLABLE_FACTOR;
      if (scrollZoneEnd > 0) {
        scrollZoneProgress.set(Math.min(window.scrollY / scrollZoneEnd, 1));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, scrollZoneProgress]);

  const handleProgress = useCallback((p: number) => setLoadProgress(p), []);
  const handleLoaded = useCallback(() => setIsLoaded(true), []);
  // Mobile loaded callback — just unlock immediately
  const handleMobileLoaded = useCallback(() => setIsLoaded(true), []);

  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
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
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      alert('Failed to send enquiry. Please try again or reach out through phone/email directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <LoadingScreen progress={loadProgress} isLoaded={isLoaded} />

      {/* ── MOBILE: fullscreen image slideshow, no scroll animation ── */}
      {isMobile ? (
        <MobileLanding onLoaded={handleMobileLoaded} />
      ) : (
        <>
          <Navbar />

          {/* ── DESKTOP: cinematic scroll animation ── */}
          <VillaScroll onLoadProgress={handleProgress} onLoaded={handleLoaded} />

          {/* Overlay 1 — Fireplace */}
          <TextOverlay
            scrollYProgress={scrollZoneProgress}
            fadeRange={[0, 0, 0.12, 0.18]}
            heading="This is what home feels like."
            subtext="SkyCielo finds you spaces that move you."
            align="center"
            initialOpacity={1}
            logoSrc={asset('/logo.png')}
          />

          {/* Overlay 2 — Hall */}
          <TextOverlay
            scrollYProgress={scrollZoneProgress}
            fadeRange={[0.22, 0.27, 0.38, 0.43]}
            heading="Crafted for the way you live."
            subtext="Every property we represent is chosen for its soul, not just its size."
            align="left"
          />

          {/* Overlay 3 — Hallway */}
          <TextOverlay
            scrollYProgress={scrollZoneProgress}
            fadeRange={[0.47, 0.52, 0.63, 0.68]}
            heading="Details that stay with you."
            subtext="From the hallway to the horizon, nothing is overlooked."
            align="right"
          />

          {/* Overlay 4 — Exterior */}
          <TextOverlay
            scrollYProgress={scrollZoneProgress}
            fadeRange={[0.72, 0.77, 0.93, 0.98]}
            heading="Your next chapter starts here."
            subtext="SkyCielo represents exceptional homes across city. This is the standard we hold."
            align="center"
          />
        </>
      )}

      {/* ── Logo Full Section — scrolls in as next page after animation ── */}
      <section
        className="relative hidden md:flex items-center justify-center overflow-hidden"
        style={{ zIndex: 10, minHeight: '100vh', backgroundColor: '#D3BBAF' }}
      >
        <div className="flex items-center justify-center px-8">
          <img
            src={asset('/logo-full.png')}
            alt="SkyCielo Full Logo"
            className="w-[70vw] max-w-2xl object-contain"
          />
        </div>
      </section>

      {/* ── About Us Sections ── */}
      <div id="about" style={{ zIndex: 10, position: 'relative', background: '#0f0e0c', color: '#f5f0e8', fontFamily: "'Inter', sans-serif" }}>
        {/* ── Hero banner ─────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          height: '38vh',
          minHeight: 280,
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #1a1a14 0%, #2b3326 60%, #546B41 100%)',
            opacity: 0.9,
          }} />
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04,
            backgroundImage: 'repeating-linear-gradient(0deg,#f5f0e8 0,#f5f0e8 1px,transparent 1px,transparent 80px), repeating-linear-gradient(90deg,#f5f0e8 0,#f5f0e8 1px,transparent 1px,transparent 80px)',
          }} />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ position: 'relative', zIndex: 1, padding: '0 8vw 56px' }}
          >
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: '#b59a72', textTransform: 'uppercase', marginBottom: 12 }}>
              Sky Cielo · Our Story
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.6rem, 5vw, 5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              margin: 0,
              color: '#f5f0e8',
            }}>
              About Us
            </h1>
          </motion.div>
        </section>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #b59a72 40%, transparent)', margin: '0 8vw' }} />

        {/* ── PAGE 1: Vision ──────────────────────────────────────── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100vh',
          gap: 0,
        }}>
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 520 }}>
            <Image
              src={asset('/about-vision.webp')}
              alt="Sky Cielo Vision — European-inspired community"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to right, transparent 70%, #0f0e0c 100%)',
            }} />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(48px, 7vw, 110px) clamp(40px, 6vw, 96px)',
          }}>
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: '#546B41', textTransform: 'uppercase', marginBottom: 20 }}>
              01 · Vision
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 3.2vw, 3.2rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              margin: '0 0 32px',
              color: '#f5f0e8',
            }}>
              Timeless communities.<br />
              <em style={{ color: '#b59a72', fontStyle: 'italic' }}>Enduring legacies.</em>
            </h2>
            <div style={{ width: 48, height: 1, background: '#b59a72', marginBottom: 32 }} />
            <p style={{
              fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
              lineHeight: 1.85,
              color: 'rgba(245,240,232,0.75)',
              maxWidth: 480,
            }}>
              At Sky Cielo, we envision crafting timeless, European-inspired communities where land, architecture,
              and lifestyle exist in perfect harmony. Inspired by classical French elegance, we transform every
              plot into the foundation of a legacy and every residence into a statement of refined living.
            </p>
          </motion.div>
        </section>

        {/* ── PAGE 2a: Mission ────────────────────────────────────── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100vh',
          gap: 0,
          direction: 'rtl',
        }}>
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 520 }}>
            <Image
              src={asset('/about-mission.webp')}
              alt="Sky Cielo Mission — premium European villa"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to left, transparent 70%, #0f0e0c 100%)',
            }} />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
            direction: 'ltr',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(48px, 7vw, 110px) clamp(40px, 6vw, 96px)',
          }}>
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: '#546B41', textTransform: 'uppercase', marginBottom: 20 }}>
              02 · Mission
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 3.2vw, 3.2rem)',
              fontWeight: 300,
              lineHeight: 1.2,
              margin: '0 0 32px',
              color: '#f5f0e8',
            }}>
              Design excellence.<br />
              <em style={{ color: '#b59a72', fontStyle: 'italic' }}>Lasting value.</em>
            </h2>
            <div style={{ width: 48, height: 1, background: '#b59a72', marginBottom: 32 }} />
            <p style={{
              fontSize: 'clamp(0.95rem, 1.1vw, 1.1rem)',
              lineHeight: 1.85,
              color: 'rgba(245,240,232,0.75)',
              maxWidth: 480,
            }}>
              To deliver premium plotted developments, bespoke villas, and elegant residences that embody
              design excellence and lasting value.
            </p>
          </motion.div>
        </section>

        {/* ── PAGE 2b: We Commit To ───────────────────────────────── */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <Image
              src={asset('/about-commit.webp')}
              alt="Sky Cielo commitment — refined villa interior"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(15,14,12,0.78) 0%, rgba(15,14,12,0.92) 100%)',
            }} />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
            position: 'relative', zIndex: 1,
            padding: 'clamp(64px, 8vw, 120px) 8vw',
            maxWidth: 1100,
            margin: '0 auto',
            width: '100%',
          }}>
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: '#546B41', textTransform: 'uppercase', marginBottom: 20 }}>
              03 · We Commit To
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3.6rem)',
              fontWeight: 300,
              lineHeight: 1.15,
              margin: '0 0 16px',
              color: '#f5f0e8',
            }}>
              Our promise to you —<br />
              <em style={{ color: '#b59a72', fontStyle: 'italic' }}>in every detail.</em>
            </h2>
            <div style={{ width: 48, height: 1, background: '#b59a72', margin: '28px 0 52px' }} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1px',
              background: 'rgba(181,154,114,0.15)',
              border: '1px solid rgba(181,154,114,0.15)',
            }}>
              {COMMIT_ITEMS.map((item, i) => (
                <div
                  key={i}
                  style={{
                    padding: '36px 32px',
                    background: 'rgba(15,14,12,0.55)',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.3s',
                    display: 'flex',
                    gap: 20,
                    alignItems: 'flex-start',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(84,107,65,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(15,14,12,0.55)')}
                >
                  <span style={{
                    fontSize: '1.4rem',
                    color: '#b59a72',
                    lineHeight: 1,
                    marginTop: 2,
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </span>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.75,
                    color: 'rgba(245,240,232,0.8)',
                    margin: 0,
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #b59a72 40%, transparent)', margin: '0 8vw' }} />

        {/* ── Our Property Section ─────────────────────────────────────────── */}
        <section style={{
          background: '#0f0e0c', padding: 'clamp(60px,8vw,100px) 8vw',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ textAlign: 'center' }}
          >
            <p style={{ letterSpacing: '0.3em', fontSize: 11, color: '#546B41', textTransform: 'uppercase', marginBottom: 14 }}>
              Find Us Here
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2rem,3.5vw,3.2rem)', fontWeight: 300,
              color: '#f5f0e8', margin: '0 0 16px', lineHeight: 1.15,
            }}>
              Our Property
            </h2>
            <div style={{ width: 40, height: 1, background: '#b59a72', margin: '0 auto' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 900 }}
          >
            <div style={{
              width: '100%', aspectRatio: '16/9',
              border: '1px solid rgba(181,154,114,0.2)',
              overflow: 'hidden', boxShadow: '0 16px 60px rgba(0,0,0,0.5)',
            }}>
              <iframe
                title="SkyCielo Property Location"
                src="https://maps.google.com/maps?q=13.1948125,77.4885625&z=16&output=embed"
                width="100%" height="100%"
                style={{ border: 0, display: 'block', filter: 'grayscale(20%) contrast(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 16 }}>
              <p style={{ fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.35)', textAlign: 'center', margin: 0 }}>
                Sky Cielo Realty Ventures Plots, Sonnenahalli - 560089
              </p>
              <a
                href="https://maps.app.goo.gl/7Yym4rJS64xnQmWS9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px',
                  border: '1px solid rgba(181,154,114,0.4)',
                  color: '#b59a72', fontSize: '0.8rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background .2s, border-color .2s, color .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(181,154,114,0.12)'; e.currentTarget.style.borderColor = '#b59a72'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(181,154,114,0.4)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b59a72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        </section>

        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #b59a72 40%, transparent)', margin: '0 8vw' }} />

        {/* ── Contact Section (Matched to Image Layout) ────────────────────── */}
        <section 
          id="contact"
          className="relative bg-[#D3BBAF] text-[#0f0e0c] grid items-start grid-cols-1 md:grid-cols-[minmax(250px,1fr)_minmax(400px,1.5fr)] gap-[60px] md:gap-[clamp(40px,6vw,80px)]"
          style={{ padding: 'clamp(60px, 8vw, 120px) 8vw clamp(30px, 4vw, 60px) 8vw' }}
        >
           {/* Left side: Heading */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="flex flex-col md:h-full"
           >
              <div style={{ flexGrow: 1 }}>
                 <h2 style={{
                   fontFamily: "'Inter', sans-serif",
                   fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                   fontWeight: 400,
                   letterSpacing: '-0.02em',
                   margin: '0 0 24px',
                   color: '#0f0e0c',
                 }}>
                   Contact us
                 </h2>
                 <p style={{
                   fontSize: '1rem',
                   lineHeight: 1.5,
                   color: 'rgba(15, 14, 12, 0.7)',
                   maxWidth: 280,
                 }}>
                   Get in touch with us for any enquiries<br />and questions
                 </p>

                  {/* Contact Form */}
                  <form 
                    onSubmit={handleSendEmail}
                    style={{ display: 'flex', flexDirection: 'column', gap: 24, margin: '40px 0', maxWidth: 360 }}
                  >
                     {/* Hidden variables mapped to your template tags */}
                     <input type="hidden" name="title" value="SkyCielo Website Enquiry" />
                     <input type="hidden" name="time" value={new Date().toLocaleString()} />
                     <input type="hidden" name="name" value="" />
                     <input type="hidden" name="email" value="" />

                     <input 
                       type="text" 
                       name="from_name" // Maps to {{from_name}}
                       placeholder="Name" 
                       required
                       className="w-full bg-transparent border-0 border-b border-[#0f0e0c]/20 py-2 text-[0.95rem] text-[#0f0e0c] outline-none focus:border-[#0f0e0c] focus:ring-0 transition-colors placeholder:text-[#0f0e0c]/40"
                       onChange={(e) => {
                         const form = e.currentTarget.form;
                         if (form) (form.elements.namedItem('name') as HTMLInputElement).value = e.currentTarget.value;
                       }}
                     />
                     <input 
                       type="tel" 
                       name="phone_number"
                       placeholder="Phone Number" 
                       required
                       className="w-full bg-transparent border-0 border-b border-[#0f0e0c]/20 py-2 text-[0.95rem] text-[#0f0e0c] outline-none focus:border-[#0f0e0c] focus:ring-0 transition-colors placeholder:text-[#0f0e0c]/40"
                     />
                     <input 
                       type="email" 
                       name="reply_to" // Maps to {{reply_to}}
                       placeholder="Email" 
                       required
                       className="w-full bg-transparent border-0 border-b border-[#0f0e0c]/20 py-2 text-[0.95rem] text-[#0f0e0c] outline-none focus:border-[#0f0e0c] focus:ring-0 transition-colors placeholder:text-[#0f0e0c]/40"
                       onChange={(e) => {
                         const form = e.currentTarget.form;
                         if (form) (form.elements.namedItem('email') as HTMLInputElement).value = e.currentTarget.value;
                       }}
                     />
                     <textarea 
                       name="message" // Maps to {{message}}
                       placeholder="Your Query"
                       required
                       rows={3} 
                       className="w-full bg-transparent border-0 border-b border-[#0f0e0c]/20 py-2 text-[0.95rem] text-[#0f0e0c] outline-none focus:border-[#0f0e0c] focus:ring-0 transition-colors resize-none placeholder:text-[#0f0e0c]/40"
                     />
                     <button 
                       type="submit" 
                       disabled={isSending}
                       className="self-start mt-2 px-8 py-3 bg-[#0f0e0c] text-[#f5f0e8] text-[0.9rem] font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                     >
                       {isSending ? 'Sending...' : 'Send Message'}
                     </button>
                  </form>
              </div>

              {/* Bottom Left: Copyright */}
              <div className="mt-8 md:mt-auto">
                 <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(15,14,12,0.5)', margin: 0 }}>
                    © 2025 SkyCielo. All rights reserved.
                 </p>
              </div>
           </motion.div>
           
           {/* Right side: 2x2 Grid + Image */}
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             style={{ display: 'flex', flexDirection: 'column', gap: 60 }}
           >
              
              {/* 2x2 Grid using CSS Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-[32px] sm:gap-y-[40px] gap-x-[20px]">
                 {/* Item 1: Phone/General (adapted to Phone) */}
                 <div>
                    <h3 style={{ fontSize: '0.85rem', color: 'rgba(15, 14, 12, 0.5)', fontWeight: 400, marginBottom: 12 }}>phone</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                       <a href="tel:+919036078155" style={{ textDecoration: 'none', color: 'inherit' }}>+91 90360 78155</a>
                    </p>
                 </div>

                 {/* Item 2: Email */}
                 <div>
                    <h3 style={{ fontSize: '0.85rem', color: 'rgba(15, 14, 12, 0.5)', fontWeight: 400, marginBottom: 12 }}>email</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
                       <a href="mailto:skycielo.realtyventure@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>skycielo.realtyventure@gmail.com</a>
                    </p>
                 </div>

                 {/* Item 3: Social/Collaborations */}
                 <div>
                    <h3 style={{ fontSize: '0.85rem', color: 'rgba(15, 14, 12, 0.5)', fontWeight: 400, marginBottom: 12 }}>social</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                       {/* Instagram */}
                       <a
                         href="https://www.instagram.com/skycielo.realtyventures"
                         target="_blank" rel="noopener noreferrer"
                         style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                         </svg>
                         @skycielo.realtyventures
                       </a>
                       {/* WhatsApp */}
                       <a
                         href="https://api.whatsapp.com/send?phone=919036078155&text=Hi%20I%27m%20interested%20in%20Learning%20more%20About%20Prestige%20New%20Launch%20Varthur%20(Bangalore).%20Please%20Share%20Details"
                         target="_blank" rel="noopener noreferrer"
                         style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit', fontSize: '0.95rem', fontWeight: 500 }}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                         </svg>
                         WhatsApp Us
                       </a>
                    </div>
                 </div>

                 {/* Item 4: Address */}
                 <div>
                    <h3 style={{ fontSize: '0.85rem', color: 'rgba(15, 14, 12, 0.5)', fontWeight: 400, marginBottom: 12 }}>address</h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6, maxWidth: 220 }}>
                       No.30, CK plaza, 1st Floor, Gangappa Block, Bellary Main Road, Gangenahalli, Bangalore - 560032
                    </p>
                 </div>
              </div>

              {/* The Image from the layout */}
              <div style={{ position: 'relative', width: '100%', height: 320, marginTop: 20 }}>
                 <Image
                    src={asset('/contact-image.webp')}
                    alt="Minimalist luxury interior"
                    fill
                    style={{ objectFit: 'cover' }}
                 />
              </div>

           </motion.div>
        </section>
      </div>

    </>
  );
}
