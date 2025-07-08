import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import CasesSection from '@/components/CasesSection';
import ContactForm from '@/components/ContactForm';
import Advantages from '@/components/Advantages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();
  
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <Advantages />
        <CasesSection />
        <ContactForm />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
