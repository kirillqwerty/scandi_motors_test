import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { Search, FileCheck, Truck, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const EUROPE_IMG = "https://images.unsplash.com/photo-1763405919443-1ef37159e0ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjYXIlMjBkcml2aW5nJTIwZXVyb3BlYW4lMjBhbHBzfGVufDB8fHx8MTc3NTgyMDU0N3ww&ixlib=rb-4.1.0&q=85";

const steps = [
  { icon: Search, num: "01", title: "Подбор", desc: "Находим автомобиль по вашим критериям на европейских площадках" },
  { icon: FileCheck, num: "02", title: "Проверка", desc: "Полная проверка истории, пробега и технического состояния" },
  { icon: Truck, num: "03", title: "Доставка", desc: "Логистика, таможенное оформление и доставка до Минска" },
  { icon: CheckCircle, num: "04", title: "Передача", desc: "Передаём автомобиль с полным пакетом документов" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

export default function EuropeService() {
  return (
    <section id="europe-preview" data-testid="europe-section" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center pointer-events-none select-none opacity-[0.03]">
        <Marquee speed={40} gradient={false}>
          <span className="font-heading font-black text-[12rem] uppercase tracking-tighter whitespace-nowrap mx-8">
            MÜNCHEN &bull; STUTTGART &bull; BERLIN &bull; BRUXELLES &bull; AMSTERDAM &bull;
          </span>
        </Marquee>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-5">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-4">Подбор из Европы</motion.p>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} data-testid="europe-title" className="font-heading text-3xl md:text-4xl tracking-tight font-bold mb-6">
              Автомобиль вашей мечты — из Европы в Минск
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-base leading-relaxed font-light text-zinc-300 mb-8" data-testid="europe-description">
              Работаем напрямую с европейскими дилерами и аукционами. Прозрачная история, реальный пробег, цена ниже рыночной.
            </motion.p>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
              <Link to="/europe" data-testid="europe-cta-btn" className="btn-primary inline-block">Подробнее</Link>
            </motion.div>
          </div>
          <motion.div className="lg:col-span-7 relative overflow-hidden" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}>
            <img src={EUROPE_IMG} alt="Car on European road" className="w-full h-[350px] md:h-[450px] object-cover" data-testid="europe-image" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#050505]" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="europe-steps">
          {steps.map((step, i) => (
            <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="relative p-6 border border-white/10 bg-brand-surface hover:border-brand-gold/30 transition-all duration-300" data-testid={`step-${i}`}>
              <span className="stat-number">{step.num}</span>
              <step.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4 relative z-10" />
              <h3 className="font-heading text-lg font-semibold mb-2 relative z-10">{step.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
