import Hero from '@/components/Hero';
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
