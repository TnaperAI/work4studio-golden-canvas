import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import CasesSection from '@/components/CasesSection';
import ContactSection from '@/components/ContactSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <CasesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
