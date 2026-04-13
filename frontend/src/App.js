import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import CatalogPage from "@/pages/CatalogPage";
import CarDetailPage from "@/pages/CarDetailPage";
import CreditPage from "@/pages/CreditPage";
import CommissionPage from "@/pages/CommissionPage";
import EuropePage from "@/pages/EuropePage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import AdminPage from "@/pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<CarDetailPage />} />
        <Route path="/credit" element={<CreditPage />} />
        <Route path="/commission" element={<CommissionPage />} />
        <Route path="/europe" element={<EuropePage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
