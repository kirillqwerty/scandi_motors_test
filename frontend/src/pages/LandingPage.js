import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Catalog from "@/components/landing/Catalog";
import EuropeService from "@/components/landing/EuropeService";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div data-testid="landing-page" className="min-h-screen bg-brand-bg">
      <Header />
      <Hero />
      <About />
      <Catalog />
      <EuropeService />
      <ContactForm />
      <Footer />
    </div>
  );
}
