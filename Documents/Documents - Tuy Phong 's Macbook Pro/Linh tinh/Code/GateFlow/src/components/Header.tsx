import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Models', href: '#models' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b flex-col flex border-gray-800' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 w-full flex items-center justify-between">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-mono font-bold text-white tracking-widest text-[14px]">
            <span className="text-cyan-500 mr-2 opacity-80">//</span>GATEFLOW
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[12px] font-mono font-bold uppercase tracking-widest text-gray-500 hover:text-cyan-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[12px] font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-cyan-500 hover:text-black transition-colors rounded-none"
          >
            [ GET API KEY ]
          </a>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden text-white hover:text-cyan-500 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black border-b border-gray-800 pb-4 flex flex-col items-center">
          <div className="flex flex-col w-full px-6 pt-4 space-y-4">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-[13px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-cyan-500 transition-colors text-center"
              >
                {l.label}
              </a>
            ))}
            <div className="h-px bg-gray-800 w-full my-2" />
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="py-3 px-4 text-[13px] font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-cyan-500 text-center w-full transition-colors"
            >
              [ GET API KEY ]
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
