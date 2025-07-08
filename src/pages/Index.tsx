import { useEffect } from 'react';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Services from '@/components/Services';
import Cases from '@/components/Cases';
import CTA from '@/components/CTA';
import ContactForm from '@/components/ContactForm';
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
        <Advantages />
        <Services />
        <Cases />
        <CTA />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
