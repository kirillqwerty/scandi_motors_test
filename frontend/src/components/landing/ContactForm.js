import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle } from "lucide-react";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

const contactInfo = [
  { icon: Phone, label: "+375 (29) 123-45-67", href: "tel:+375291234567" },
  { icon: Mail, label: "info@scandimotors.by", href: "mailto:info@scandimotors.by" },
  { icon: MapPin, label: "Минск, ул. Автомобильная, 42", href: null },
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", message: "", service_type: "general" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Заполните имя и телефон"); return; }
    setError("");
    setSending(true);
    try {
      await api.createSubmission(form);
      setSent(true);
      setForm({ name: "", phone: "", message: "", service_type: "general" });
    } catch { setError("Ошибка отправки"); }
    finally { setSending(false); }
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-4">Контакты</motion.p>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} data-testid="contact-title" className="font-heading text-3xl md:text-4xl tracking-tight font-bold mb-6">Свяжитесь с нами</motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-base leading-relaxed font-light text-zinc-300 mb-10">
              Оставьте заявку или позвоните — ответим в течение 30 минут.
            </motion.p>
            <div className="flex flex-col gap-5">
              {contactInfo.map((item, i) => (
                <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3 + i} className="flex items-center gap-4" data-testid={`contact-info-${i}`}>
                  <div className="w-10 h-10 bg-brand-surface border border-white/10 flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} strokeWidth={1.5} className="text-brand-gold" />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-zinc-300 hover:text-white transition-colors">{item.label}</a>
                  ) : (
                    <span className="text-sm text-zinc-300">{item.label}</span>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6} className="mt-10 p-5 border border-white/10 bg-brand-surface" data-testid="work-hours">
              <p className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2">Режим работы</p>
              <p className="text-sm text-zinc-300">Пн-Пт: 9:00 — 19:00</p>
              <p className="text-sm text-zinc-300">Сб: 10:00 — 16:00</p>
              <p className="text-sm text-zinc-500">Вс: выходной</p>
            </motion.div>
          </div>
          <motion.div className="lg:col-span-7" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-white/10 bg-brand-surface" data-testid="form-success">
                <CheckCircle size={48} className="text-brand-gold mb-4" />
                <h3 className="font-heading text-2xl font-bold mb-2">Заявка отправлена</h3>
                <p className="text-zinc-400 font-light mb-6">Мы свяжемся с вами в ближайшее время</p>
                <button data-testid="form-reset-btn" onClick={() => setSent(false)} className="text-sm text-brand-gold hover:text-brand-gold-hover transition-colors uppercase tracking-wider font-semibold">Отправить ещё</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2 block">Тип услуги</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-testid="service-type-selector">
                    {[
                      { value: "general", label: "Общий вопрос" },
                      { value: "buy", label: "Покупка" },
                      { value: "europe", label: "Из Европы" },
                      { value: "credit", label: "Кредит / Лизинг" },
                    ].map((opt) => (
                      <button key={opt.value} type="button" data-testid={`service-type-${opt.value}`}
                        onClick={() => setForm({ ...form, service_type: opt.value })}
                        className={`p-3 text-xs uppercase tracking-wider font-semibold border transition-all duration-200 ${
                          form.service_type === opt.value ? "border-brand-gold text-brand-gold bg-brand-gold/10" : "border-white/10 text-zinc-500 hover:border-white/25"
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2 block">Ваше имя *</label>
                  <input data-testid="contact-name" type="text" placeholder="Иван Иванов" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2 block">Телефон *</label>
                  <input data-testid="contact-phone" type="tel" placeholder="+375 (XX) XXX-XX-XX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] font-semibold text-zinc-500 mb-2 block">Сообщение</label>
                  <textarea data-testid="contact-message" rows={4} placeholder="Расскажите, какой автомобиль вас интересует..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-dark resize-none" />
                </div>
                {error && <p className="text-sm text-red-400" data-testid="form-error">{error}</p>}
                <button data-testid="contact-submit-btn" type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                  {sending ? "Отправка..." : (<><Send size={16} strokeWidth={1.5} />Отправить заявку</>)}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
