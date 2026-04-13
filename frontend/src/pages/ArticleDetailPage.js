import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArticle(id).then(setArticle).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page-container"><Header />
        <div className="pt-28 pb-20 max-w-3xl mx-auto px-6"><div className="animate-pulse h-[400px] bg-brand-surface" /></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-container"><Header />
        <div className="pt-28 pb-20 max-w-3xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/articles" className="text-brand-gold hover:text-brand-gold-hover">Вернуться к статьям</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Split content into paragraphs
  const paragraphs = article.content.split("\n").filter(p => p.trim());

  return (
    <div className="page-container" data-testid="article-detail-page">
      <Header />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 md:px-12">
        <Link to="/articles" data-testid="back-to-articles" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-brand-gold transition-colors mb-8">
          <ArrowLeft size={16} /> Назад к статьям
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <Calendar size={13} />
            {new Date(article.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-black tracking-tight mb-6" data-testid="article-detail-title">
            {article.title}
          </h1>

          {article.image_url && (
            <div className="mb-8 overflow-hidden">
              <img src={article.image_url} alt={article.title} className="w-full h-[300px] md:h-[400px] object-cover" data-testid="article-detail-image" />
            </div>
          )}

          <div className="prose-dark" data-testid="article-detail-content">
            {paragraphs.map((p, i) => {
              if (p.startsWith("- ") || p.startsWith("• ")) {
                return <ul key={i}><li>{p.replace(/^[-•]\s*/, '')}</li></ul>;
              }
              return <p key={i}>{p}</p>;
            })}
          </div>
        </motion.article>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link to="/articles" className="text-sm text-brand-gold hover:text-brand-gold-hover transition-colors uppercase tracking-wider font-semibold inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Все статьи
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
