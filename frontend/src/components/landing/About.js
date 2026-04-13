import { motion } from "framer-motion";
import { Shield, Truck, Award, Clock } from "lucide-react";

const ABOUT_IMG = "https://images.unsplash.com/photo-1770064747916-1efbb1973ec7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwxfHxzdGVlcmluZyUyMHdoZWVsJTIwbHV4dXJ5JTIwY2FyJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc1ODIwNTU4fDA&ixlib=rb-4.1.0&q=85";

const stats = [
  { number: "8+", label: "Лет на рынке" },
  { number: "500+", label: "Автомобилей продано" },
  { number: "200+", label: "Доставлено из Европы" },
];

const features = [
  { icon: Shield, title: "Гарантия качества", desc: "Каждый автомобиль проходит полную диагностику" },
  { icon: Truck, title: "Доставка из Европы", desc: "Подбор и доставка в течение 14 дней" },
  { icon: Award, title: "Прозрачные условия", desc: "Без скрытых комиссий и наценок" },
  { icon: Clock, title: "Быстрое оформление", desc: "Полное сопровождение сделки от А до Я" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-20">
          <motion.div className="md:col-span-7 relative overflow-hidden" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={0}>
            <img src={ABOUT_IMG} alt="Luxury car interior" className="w-full h-[400px] md:h-[500px] object-cover" data-testid="about-image" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          </motion.div>
          <div className="md:col-span-5 flex flex-col justify-center">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-4">О компании</motion.p>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="font-heading text-3xl md:text-4xl tracking-tight font-bold mb-6" data-testid="about-title">
              Scandi Motors — ваш надёжный партнёр в мире автомобилей
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="text-base leading-relaxed font-light text-zinc-300 mb-8" data-testid="about-description">
              Мы специализируемся на продаже проверенных автомобилей, профессиональном подборе машин из Европы, а также предлагаем услуги кредитования, лизинга и приёма авто на комиссию.
            </motion.p>
            <div className="flex gap-8 md:gap-12">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4 + i} className="relative" data-testid={`stat-${i}`}>
                  <span className="font-heading font-black text-3xl md:text-4xl text-brand-gold">{stat.number}</span>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div key={feat.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 border border-white/10 bg-brand-surface hover:border-brand-gold/30 transition-all duration-300" data-testid={`feature-${i}`}>
              <feat.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
