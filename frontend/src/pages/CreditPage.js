import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CreditCard, Percent, FileText, CheckCircle, Calculator, Building } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const creditFeatures = [
  { icon: Percent, title: "Ставки от 12% годовых", desc: "Работаем с ведущими банками Беларуси для получения лучших условий" },
  { icon: FileText, title: "Минимум документов", desc: "Паспорт и водительское удостоверение — всё, что нужно для оформления" },
  { icon: Calculator, title: "Первый взнос от 10%", desc: "Возможность приобрести автомобиль с минимальным первоначальным платежом" },
  { icon: Building, title: "Лизинг для юр. лиц", desc: "Специальные условия для компаний с налоговыми преимуществами" },
];

const steps = [
  { num: "01", title: "Выбор автомобиля", desc: "Выберите автомобиль из нашего каталога или закажите подбор" },
  { num: "02", title: "Расчёт условий", desc: "Наш менеджер подберёт оптимальную программу кредитования или лизинга" },
  { num: "03", title: "Подача заявки", desc: "Подаём заявки в несколько банков для получения лучшего предложения" },
  { num: "04", title: "Оформление", desc: "Полное сопровождение сделки, оформление документов и страховки" },
];

export default function CreditPage() {
  return (
    <div className="page-container" data-testid="credit-page">
      <Header />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-3">Финансирование</p>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter mb-6" data-testid="credit-page-title">
            Кредит и лизинг
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-light max-w-2xl mb-16 leading-relaxed">
            Помогаем приобрести автомобиль на выгодных условиях. Работаем с крупнейшими банками Беларуси и лизинговыми компаниями.
          </p>
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {creditFeatures.map((feat, i) => (
            <motion.div key={feat.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="p-6 border border-white/10 bg-brand-surface hover:border-brand-gold/30 transition-all duration-300" data-testid={`credit-feature-${i}`}>
              <feat.icon size={24} strokeWidth={1.5} className="text-brand-gold mb-4" />
              <h3 className="font-heading text-lg font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-10">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative p-6 border border-white/10 bg-brand-surface" data-testid={`credit-step-${i}`}>
                <span className="stat-number">{step.num}</span>
                <h3 className="font-heading text-lg font-semibold mb-2 relative z-10">{step.title}</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed relative z-10">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="border border-brand-gold/20 bg-brand-gold/5 p-8 md:p-12 text-center" data-testid="credit-cta">
          <CreditCard size={32} strokeWidth={1.5} className="text-brand-gold mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-3">Рассчитайте свой кредит</h2>
          <p className="text-zinc-400 font-light mb-6 max-w-lg mx-auto">Свяжитесь с нами для бесплатного расчёта условий кредитования или лизинга</p>
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
