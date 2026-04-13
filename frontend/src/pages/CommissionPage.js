import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Handshake, Camera, BarChart3, Shield, ArrowRight } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const benefits = [
  { icon: Camera, title: "Профессиональная фотосъёмка", desc: "Делаем качественные фото вашего автомобиля для максимальной привлекательности" },
  { icon: BarChart3, title: "Размещение на площадках", desc: "Публикуем объявления на всех крупных автомобильных площадках Беларуси" },
  { icon: Shield, title: "Безопасная сделка", desc: "Обеспечиваем юридическую чистоту и безопасность при продаже" },
  { icon: Handshake, title: "Честная оценка", desc: "Проводим рыночную оценку стоимости вашего автомобиля" },
];

const howItWorks = [
  { num: "01", title: "Оценка", desc: "Вы привозите автомобиль, мы проводим осмотр и оценку рыночной стоимости" },
  { num: "02", title: "Договор", desc: "Заключаем договор комиссии с фиксированными условиями и комиссией" },
  { num: "03", title: "Продвижение", desc: "Фотосъёмка, размещение объявлений, показы потенциальным покупателям" },
  { num: "04", title: "Продажа", desc: "Проводим сделку, оформляем документы и переводим деньги на ваш счёт" },
];

export default function CommissionPage() {
  return (
    <div className="page-container" data-testid="commission-page">
      <Header />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-3">Комиссия</p>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter mb-6" data-testid="commission-page-title">
            Приём авто на комиссию
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-light max-w-2xl mb-16 leading-relaxed">
            Продадим ваш автомобиль быстро и по выгодной цене. Берём на себя все заботы — от фотосъёмки до оформления сделки.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((b, i) => (
            <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 border border-white/10 bg-brand-surface hover:border-brand-gold/30 transition-all duration-300" data-testid={`commission-benefit-${i}`}>
              <b.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Steps */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative p-6 border border-white/10 bg-brand-surface" data-testid={`commission-step-${i}`}>
                <span className="stat-number">{step.num}</span>
                <h3 className="font-heading text-lg font-semibold mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Conditions */}
        <div className="border border-white/10 bg-brand-surface p-8 md:p-12 mb-20" data-testid="commission-conditions">
          <h2 className="font-heading text-2xl font-bold mb-6">Условия комиссии</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="font-heading text-3xl font-black text-brand-gold mb-1">3-5%</p>
              <p className="text-sm text-zinc-400">Комиссия от стоимости</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-black text-brand-gold mb-1">14 дней</p>
              <p className="text-sm text-zinc-400">Средний срок продажи</p>
            </div>
            <div>
              <p className="font-heading text-3xl font-black text-brand-gold mb-1">0 BYN</p>
              <p className="text-sm text-zinc-400">Стоимость хранения</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border border-brand-gold/20 bg-brand-gold/5 p-8 md:p-12 text-center" data-testid="commission-cta">
          <h2 className="font-heading text-2xl font-bold mb-3">Хотите продать свой автомобиль?</h2>
          <p className="text-zinc-400 font-light mb-6 max-w-lg mx-auto">Привезите автомобиль на оценку или позвоните — мы всё организуем</p>
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
