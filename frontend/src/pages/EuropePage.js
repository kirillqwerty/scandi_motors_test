import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { Search, FileCheck, Truck, CheckCircle, Globe, ShieldCheck, Clock, DollarSign } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const EUROPE_IMG = "https://images.unsplash.com/photo-1763405919443-1ef37159e0ce?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjYXIlMjBkcml2aW5nJTIwZXVyb3BlYW4lMjBhbHBzfGVufDB8fHx8MTc3NTgyMDU0N3ww&ixlib=rb-4.1.0&q=85";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const advantages = [
  { icon: DollarSign, title: "Цена ниже на 15-30%", desc: "Автомобили из Европы стоят значительно дешевле даже с учётом доставки и растаможки" },
  { icon: ShieldCheck, title: "Прозрачная история", desc: "Европейские автомобили имеют подробную сервисную историю и реальные пробеги" },
  { icon: Globe, title: "Широкий выбор", desc: "Доступ к тысячам автомобилей на площадках Германии, Бельгии, Нидерландов, Польши" },
  { icon: Clock, title: "Срок 10-21 день", desc: "От момента выбора до получения автомобиля в Минске — в среднем две-три недели" },
];

const steps = [
  { icon: Search, num: "01", title: "Подбор", desc: "Обсуждаем ваши пожелания: марка, бюджет, комплектация. Находим варианты на европейских площадках." },
  { icon: FileCheck, num: "02", title: "Проверка", desc: "Проверяем историю через CarVertical/AutoDNA, организуем выездной осмотр или видеоинспекцию." },
  { icon: Truck, num: "03", title: "Доставка", desc: "Выкупаем автомобиль, организуем автовоз, проходим таможню и оформляем все документы." },
  { icon: CheckCircle, num: "04", title: "Передача", desc: "Автомобиль проходит ТО, при необходимости — замена расходников. Передаём вам с гарантией." },
];

const countries = [
  { name: "Германия", flag: "DE", desc: "Mobile.de, AutoScout24. Крупнейший рынок б/у авто в Европе." },
  { name: "Бельгия", flag: "BE", desc: "2ememain.be. Низкие цены, хорошее состояние." },
  { name: "Нидерланды", flag: "NL", desc: "AutoTrack.nl. Минимальная коррозия, аккуратная эксплуатация." },
  { name: "Польша", flag: "PL", desc: "Otomoto.pl. Близкая логистика, быстрая доставка." },
];

export default function EuropePage() {
  return (
    <div className="page-container" data-testid="europe-page">
      <Header />

      {/* Hero */}
      <div className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={EUROPE_IMG} alt="European road" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
        </div>
        <div className="relative z-10 pt-16 pb-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="absolute inset-0 flex items-center pointer-events-none select-none opacity-[0.04]">
            <Marquee speed={30} gradient={false}>
              <span className="font-heading font-black text-[10rem] uppercase tracking-tighter whitespace-nowrap mx-8">
                MÜNCHEN &bull; STUTTGART &bull; BERLIN &bull; BRUXELLES &bull; AMSTERDAM &bull;
              </span>
            </Marquee>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-3">Пригон из Европы</p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6" data-testid="europe-page-title">
              Подбор и доставка<br />автомобилей из Европы
            </h1>
            <p className="text-base md:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
              Работаем напрямую с европейскими площадками и аукционами. Полный цикл: подбор, проверка, выкуп, доставка, растаможка, регистрация.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        {/* Advantages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {advantages.map((a, i) => (
            <motion.div key={a.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 border border-white/10 bg-brand-surface hover:border-brand-gold/30 transition-all duration-300" data-testid={`europe-advantage-${i}`}>
              <a.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">{a.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{a.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Этапы подбора</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          {steps.map((step, i) => (
            <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="relative p-6 border border-white/10 bg-brand-surface" data-testid={`europe-step-${i}`}>
              <span className="stat-number">{step.num}</span>
              <step.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4 relative z-10" />
              <h3 className="font-heading text-lg font-semibold mb-2 relative z-10">{step.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed relative z-10">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Countries */}
        <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Откуда привозим</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {countries.map((c, i) => (
            <motion.div key={c.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 border border-white/10 bg-brand-surface" data-testid={`country-${i}`}>
              <p className="font-heading text-xl font-bold mb-2">{c.name}</p>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-brand-gold/20 bg-brand-gold/5 p-8 md:p-12 text-center" data-testid="europe-cta">
          <h2 className="font-heading text-2xl font-bold mb-3">Хотите автомобиль из Европы?</h2>
          <p className="text-zinc-400 font-light mb-6 max-w-lg mx-auto">Расскажите, какой автомобиль вам нужен, и мы подберём лучший вариант</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+375291234567" className="btn-primary">Позвонить</a>
            <Link to="/#contact" className="btn-outline">Оставить заявку</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
