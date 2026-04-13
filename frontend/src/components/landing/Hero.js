import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_BG = "https://images.unsplash.com/photo-1760713170685-b67abc3be5ad?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxsdXh1cnklMjBjYXIlMjBkYXJrJTIwc3R1ZGlvJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzc1ODIwNTQ3fDA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  return (
    <section data-testid="hero-section" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="Luxury car" className="w-full h-full object-cover object-center" />
        <div className="gradient-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-28 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-brand-gold mb-4" data-testid="hero-tagline">
            Scandi Motors / Минск
          </p>
          <h1 data-testid="hero-title" className="font-heading text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Продажа и подбор
            <br />
            <span className="text-brand-gold">автомобилей</span>
          </h1>
          <p data-testid="hero-subtitle" className="text-base md:text-lg text-zinc-400 font-light max-w-lg mb-10 leading-relaxed">
            Продажа, подбор из Европы, кредит, лизинг, комиссия.
            Профессиональный подход к каждому клиенту.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog" data-testid="hero-catalog-btn" className="btn-primary inline-block text-center">
              Каталог авто
            </Link>
            <button
              data-testid="hero-contact-btn"
              onClick={() => {
                const el = document.querySelector("#contact");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-outline"
            >
              Связаться с нами
            </button>
          </div>
        </motion.div>
      </div>

      <motion.button
        data-testid="scroll-down-btn"
        onClick={() => {
          const el = document.querySelector("#about");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-zinc-500 hover:text-brand-gold transition-colors"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}
