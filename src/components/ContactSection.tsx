import { useState } from 'react';
import ContactFormModal from './ContactFormModal';
import { useSiteContent } from '@/hooks/useSiteContent';

const ContactSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { getContent } = useSiteContent();

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Обсудим ваш
            </span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">проект</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            {getContent('hero', 'cta_description') || 'Оставьте заявку, и мы свяжемся с вами для обсуждения деталей'}
          </p>
          
          <div className="pt-4">
            <button 
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-10 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => setIsContactModalOpen(true)}
            >
              {getContent('hero', 'cta_button') || 'Обсудить проект'}
            </button>
          </div>
        </div>
      </div>
      
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        source="homepage_cta"
      />
    </section>
  );
};

export default ContactSection;