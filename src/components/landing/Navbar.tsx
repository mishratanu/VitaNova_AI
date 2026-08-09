import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { label: 'How It Works', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'Safety', href: '#safety' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-card border-b border-gray-100' : 'bg-transparent'
      }`}
      role="banner"
    >
      <nav className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Logo />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-ink-muted rounded-lg hover:text-primary hover:bg-primary-50 transition-all duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/app" className="btn-primary text-sm py-2.5 px-5">
            Try VitaNova AI →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          id="mobile-menu-btn"
          className="md:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} className="text-ink" /> : <Menu size={22} className="text-ink" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-card px-4 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-ink-muted rounded-xl hover:text-primary hover:bg-primary-50 transition-all"
            >
              {link.label}
            </a>
          ))}
          <Link to="/app" className="btn-primary text-sm mt-2" onClick={() => setMenuOpen(false)}>
            Try VitaNova AI →
          </Link>
        </div>
      )}
    </header>
  );
}
