import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import CasesSection from '@/components/CasesSection';
import ContactForm from '@/components/ContactForm';
import Advantages from '@/components/Advantages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { SEOManager } from '@/components/SEOManager';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const { getContent } = useSiteContent();
  useScrollAnimation();
  
  return (
    <SEOManager 
      pageSlug="home"
      fallbackTitle={getContent('hero', 'title') || 'Work4Studio - Создание сайтов'}
      fallbackDescription={getContent('hero', 'subtitle') || 'Профессиональная разработка сайтов и веб-приложений'}
    >
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
    </SEOManager>
  );
};

export default Index;
