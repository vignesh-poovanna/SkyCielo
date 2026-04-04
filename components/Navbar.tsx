export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-6 pointer-events-none">
      <a href="/" className="pointer-events-auto">
        <img
          src="/logo.png"
          alt="SkyCielo"
          className="h-8 object-contain"
          style={{
            filter: 'brightness(0) invert(1)',
            dropShadow: '0 2px 8px rgba(0,0,0,0.4)',
          } as React.CSSProperties}
        />
      </a>
      <div className="flex items-center gap-10 pointer-events-auto">
        {['Properties', 'Contact'].map((label) => (
          <a
            key={label}
            href="#"
            className="text-white/70 text-xs tracking-[0.2em] uppercase font-light hover:text-white transition-colors duration-300"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
