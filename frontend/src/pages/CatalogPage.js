import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Gauge, Fuel, Search, X } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

function formatPrice(p) { return new Intl.NumberFormat("ru-RU").format(p); }

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }),
};

export default function CatalogPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.getCars().then(setCars).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = cars.filter((car) => {
    const matchSearch = `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    if (filter === "europe") return matchSearch && car.is_from_europe;
    if (filter === "commission") return matchSearch && car.is_commission;
    return matchSearch;
  });

  return (
    <div className="page-container" data-testid="catalog-page">
      <Header />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-3">Каталог</p>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter mb-6" data-testid="catalog-page-title">
            Автомобили в наличии
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                data-testid="catalog-search"
                type="text"
                placeholder="Поиск по марке или модели..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-dark pl-10"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2" data-testid="catalog-filters">
              {[
                { value: "all", label: "Все" },
                { value: "europe", label: "Из Европы" },
                { value: "commission", label: "Комиссия" },
              ].map((f) => (
                <button
                  key={f.value}
                  data-testid={`filter-${f.value}`}
                  onClick={() => setFilter(f.value)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all ${
                    filter === f.value ? "border-brand-gold text-brand-gold bg-brand-gold/10" : "border-white/10 text-zinc-500 hover:border-white/25"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="car-card animate-pulse h-[400px]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500" data-testid="no-results">
            <p className="text-lg">Автомобилей не найдено</p>
            <p className="text-sm mt-2">Попробуйте изменить критерии поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="catalog-grid">
            {filtered.map((car, i) => (
              <motion.div key={car.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={`/catalog/${car.id}`} className="car-card group block" data-testid={`catalog-car-${car.id}`}>
                  <div className="relative overflow-hidden h-52">
                    <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="car-card-image w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      {car.is_from_europe && <span className="bg-brand-gold text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Европа</span>}
                      {car.is_commission && <span className="bg-brand-blue text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Комиссия</span>}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-heading text-lg font-bold">{car.brand} {car.model}</h3>
                      </div>
                      <span className="font-heading text-lg font-black text-brand-gold whitespace-nowrap">${formatPrice(car.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Calendar size={13} />{car.year}</span>
                      <span className="flex items-center gap-1"><Gauge size={13} />{formatPrice(car.mileage)} км</span>
                      <span className="flex items-center gap-1"><Fuel size={13} />{car.engine}</span>
                    </div>
                    {car.transmission && <p className="text-xs text-zinc-500 mb-2">{car.transmission} {car.drive_type && `/ ${car.drive_type}`}</p>}
                    <p className="text-sm text-zinc-400 font-light line-clamp-2">{car.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
