import { Link } from "react-router-dom";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_cars-minsk/artifacts/c8ngemgr_photo_2026-04-13_10-04-22.jpg";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={LOGO_URL} alt="Scandi Motors" className="h-10" />
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Продажа и подбор автомобилей в Минске. Пригон из Европы, кредит, лизинг, комиссия.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-3">Услуги</h4>
            <div className="flex flex-col gap-2">
              <Link to="/catalog" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Каталог авто</Link>
              <Link to="/europe" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Пригон из Европы</Link>
              <Link to="/credit" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Кредит и лизинг</Link>
              <Link to="/commission" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Комиссия</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-3">Информация</h4>
            <div className="flex flex-col gap-2">
              <Link to="/articles" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Статьи</Link>
              <a href="/#contact" className="text-sm text-zinc-500 hover:text-brand-gold transition-colors">Контакты</a>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-zinc-400 mb-3">Контакты</h4>
            <p className="text-sm text-zinc-500 mb-1">+375 (29) 123-45-67</p>
            <p className="text-sm text-zinc-500 mb-1">info@scandimotors.by</p>
            <p className="text-sm text-zinc-500">Минск, ул. Автомобильная, 42</p>
          </div>
        </div>
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} Scandi Motors. Все права защищены.</p>
          <Link to="/admin" data-testid="admin-link" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Панель управления</Link>
        </div>
      </div>
    </footer>
  );
}
