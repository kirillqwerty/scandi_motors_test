import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "О компании", href: "#about" },
  { label: "Каталог", href: "#catalog" },
  { label: "Из Европы", href: "#europe" },
  { label: "Контакты", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-header shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <a href="/" data-testid="logo-link" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-accent flex items-center justify-center">
            <span className="font-heading font-black text-white text-sm">A</span>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight text-white">
            AUTOMINSK
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-10" data-testid="desktop-nav">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              data-testid={`nav-${link.href.slice(1)}`}
              className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          data-testid="mobile-menu-toggle"
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-header border-t border-white/10"
          data-testid="mobile-menu"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                data-testid={`mobile-nav-${link.href.slice(1)}`}
                className="text-sm uppercase tracking-[0.15em] font-semibold text-zinc-300 hover:text-white text-left"
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
