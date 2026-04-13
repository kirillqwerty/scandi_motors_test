import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, Gauge, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try { await api.seed(); } catch (e) { /* seeded */ }
      try {
        const data = await api.getCars();
        setCars(data.slice(0, 3));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadCars();
  }, []);

  return (
    <section id="catalog" data-testid="catalog-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-4">Каталог</p>
            <h2 data-testid="catalog-title" className="font-heading text-3xl md:text-4xl tracking-tight font-bold">Автомобили в наличии</h2>
          </div>
          <Link to="/catalog" data-testid="catalog-view-all" className="hidden md:flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-hover transition-colors font-semibold uppercase tracking-wider">
            Все авто <ArrowRight size={16} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (<div key={i} className="car-card animate-pulse h-[420px]" />))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="cars-grid">
            {cars.map((car, i) => (
              <motion.div key={car.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={`/catalog/${car.id}`} className="car-card group block" data-testid={`car-card-${i}`}>
                  <div className="relative overflow-hidden h-56">
                    <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-card-image w-full h-full object-cover" />
                    {car.is_from_europe && (
                      <div className="absolute top-4 left-4 bg-brand-gold text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">Из Европы</div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-lg font-bold">{car.brand}</h3>
                        <p className="text-sm text-zinc-400">{car.model}</p>
                      </div>
                      <span className="font-heading text-xl font-black text-brand-gold">${formatPrice(car.price)}</span>
                    </div>
                    <div className="flex gap-4 mb-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} strokeWidth={1.5} />{car.year}</span>
                      <span className="flex items-center gap-1.5"><Gauge size={14} strokeWidth={1.5} />{formatPrice(car.mileage)} км</span>
                      <span className="flex items-center gap-1.5"><Fuel size={14} strokeWidth={1.5} />{car.engine}</span>
                    </div>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-2">{car.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <Link to="/catalog" data-testid="catalog-view-all-mobile" className="md:hidden mt-8 btn-outline inline-flex items-center gap-2">
          Смотреть все авто <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
