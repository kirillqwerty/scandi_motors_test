import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArticles().then(setArticles).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container" data-testid="articles-page">
      <Header />
      <div className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-gold mb-3">Блог</p>
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tighter" data-testid="articles-page-title">
            Статьи и новости
          </h1>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="car-card animate-pulse h-[300px]" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 text-zinc-500" data-testid="no-articles">
            <p className="text-lg">Статей пока нет</p>
            <p className="text-sm mt-2">Скоро здесь появятся интересные материалы</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="articles-grid">
            {articles.map((article, i) => (
              <motion.div key={article.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={`/articles/${article.id}`} className="car-card group block" data-testid={`article-card-${article.id}`}>
                  {article.image_url && (
                    <div className="relative overflow-hidden h-48">
                      <img src={article.image_url} alt={article.title} className="car-card-image w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                      <Calendar size={13} />
                      {new Date(article.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-brand-gold transition-colors">{article.title}</h3>
                    {article.excerpt && <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">{article.excerpt}</p>}
                    <div className="mt-4 flex items-center text-xs uppercase tracking-[0.15em] font-semibold text-brand-gold group-hover:text-brand-gold-hover transition-colors">
                      Читать <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
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
