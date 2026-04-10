export default function Footer() {
  return (
    <footer data-testid="site-footer" className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-brand-accent flex items-center justify-center">
            <span className="font-heading font-black text-white text-[10px]">A</span>
          </div>
          <span className="font-heading font-bold text-sm tracking-tight text-white">
            AUTOMINSK
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} AutoMinsk. Все права защищены.
        </p>
        <a
          href="/admin"
          data-testid="admin-link"
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Панель управления
        </a>
      </div>
    </footer>
  );
}
