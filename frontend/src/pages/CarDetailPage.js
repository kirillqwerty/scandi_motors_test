import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Gauge, Fuel, Cog, Car, Palette, Zap, MapPin } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

function formatPrice(p) { return new Intl.NumberFormat("ru-RU").format(p); }

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCar(id).then(setCar).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <Header />
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="animate-pulse h-[500px] bg-brand-surface" />
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="page-container">
        <Header />
        <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Автомобиль не найден</h1>
          <Link to="/catalog" className="text-brand-gold hover:text-brand-gold-hover">Вернуться в каталог</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: "Год выпуска", value: car.year },
    { icon: Gauge, label: "Пробег", value: `${formatPrice(car.mileage)} км` },
    { icon: Fuel, label: "Двигатель", value: car.engine },
    { icon: Cog, label: "Коробка", value: car.transmission },
    { icon: Zap, label: "Мощность", value: car.power },
    { icon: Car, label: "Кузов", value: car.body_type },
    { icon: Palette, label: "Цвет", value: car.color },
    { icon: MapPin, label: "Привод", value: car.drive_type },
  ].filter(s => s.value);

  return (
    <div className="page-container" data-testid="car-detail-page">
      <Header />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <Link to="/catalog" data-testid="back-to-catalog" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-gold transition-colors mb-8">
          <ArrowLeft size={16} /> Назад в каталог
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden bg-brand-surface">
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-[350px] md:h-[500px] object-cover"
                data-testid="car-detail-image"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                {car.is_from_europe && <span className="bg-brand-gold text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">Из Европы</span>}
                {car.is_commission && <span className="bg-brand-blue text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Комиссия</span>}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-2" data-testid="car-detail-brand">{car.brand}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tight mb-4" data-testid="car-detail-model">{car.model}</h1>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-heading text-4xl font-black text-brand-gold" data-testid="car-detail-price">${formatPrice(car.price)}</span>
            </div>

            {car.fuel_type && <p className="text-sm text-zinc-400 mb-6">{car.fuel_type}</p>}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-8" data-testid="car-specs-grid">
              {specs.map((spec) => (
                <div key={spec.label} className="p-3 border border-white/10 bg-brand-surface">
                  <div className="flex items-center gap-2 mb-1">
                    <spec.icon size={14} strokeWidth={1.5} className="text-brand-gold" />
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500">{spec.label}</span>
                  </div>
                  <p className="text-sm font-medium">{spec.value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="mb-8" data-testid="car-detail-description">
                <h3 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">Описание</h3>
                <p className="text-sm text-zinc-300 leading-relaxed font-light">{car.description}</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <a href="tel:+375291234567" data-testid="car-call-btn" className="btn-primary text-center">
                Позвонить
              </a>
              <Link to="/#contact" data-testid="car-inquiry-btn" className="btn-outline text-center">
                Оставить заявку
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
