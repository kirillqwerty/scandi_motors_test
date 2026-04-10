import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fuel, Gauge, Calendar, ArrowRight } from "lucide-react";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  }),
};

function formatPrice(price) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

export default function Catalog() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        await api.seed();
      } catch (e) { /* already seeded */ }
      try {
        const data = await api.getCars();
        setCars(data);
      } catch (e) {
        console.error("Failed to load cars:", e);
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, []);

  return (
    <section id="catalog" data-testid="catalog-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-accent mb-4">
            Каталог
          </p>
          <h2
            data-testid="catalog-title"
            className="font-heading text-3xl md:text-4xl tracking-tight font-bold"
          >
            Автомобили в наличии
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="car-card animate-pulse h-[420px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="cars-grid">
            {cars.map((car, i) => (
              <motion.div
                key={car.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="car-card group cursor-pointer"
                data-testid={`car-card-${i}`}
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="car-card-image w-full h-full object-cover"
                  />
                  {car.is_from_europe && (
                    <div className="absolute top-4 left-4 bg-brand-accent px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      Из Европы
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold">
                        {car.brand}
                      </h3>
                      <p className="text-sm text-zinc-400">{car.model}</p>
                    </div>
                    <span className="font-heading text-xl font-black text-brand-accent">
                      ${formatPrice(car.price)}
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} strokeWidth={1.5} />
                      {car.year}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Gauge size={14} strokeWidth={1.5} />
                      {formatPrice(car.mileage)} км
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Fuel size={14} strokeWidth={1.5} />
                      {car.engine}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4 line-clamp-2">
                    {car.description}
                  </p>

                  <div className="flex items-center text-xs uppercase tracking-[0.15em] font-semibold text-brand-accent group-hover:text-brand-accent-hover transition-colors">
                    Подробнее
                    <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
