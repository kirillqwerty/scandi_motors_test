import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_cars-minsk/artifacts/c8ngemgr_photo_2026-04-13_10-04-22.jpg";

const navLinks = [
  { label: "Каталог", href: "/catalog" },
  { label: "Кредит и лизинг", href: "/credit" },
  { label: "Комиссия", href: "/commission" },
  { label: "Из Европы", href: "/europe" },
  { label: "Статьи", href: "/articles" },
  { label: "Контакты", href: "/#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname === "/") {
        const el = document.querySelector(href.slice(1));
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-header shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <Link to="/" data-testid="logo-link" className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Scandi Motors" className="h-12 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" data-testid="desktop-nav">
          {navLinks.map((link) => (
            link.href.startsWith("/#") ? (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                data-testid={`nav-${link.href.replace(/[/#]/g, '')}`}
                className="text-xs uppercase tracking-[0.18em] font-semibold text-zinc-400 hover:text-brand-gold transition-colors duration-300"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                data-testid={`nav-${link.href.slice(1)}`}
                className={`text-xs uppercase tracking-[0.18em] font-semibold transition-colors duration-300 ${
                  location.pathname === link.href ? "text-brand-gold" : "text-zinc-400 hover:text-brand-gold"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <button
          data-testid="mobile-menu-toggle"
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden glass-header border-t border-white/10"
          data-testid="mobile-menu"
        >
          <div className="px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              link.href.startsWith("/#") ? (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-sm uppercase tracking-[0.15em] font-semibold text-zinc-300 hover:text-brand-gold text-left"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] font-semibold text-zinc-300 hover:text-brand-gold"
                >
                  {link.label}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
