import { useState } from 'react';
import ContactFormModal from './ContactFormModal';

const ContactSection = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-on-scroll">
          <h2 className="mb-6">
            Обсудим ваш <span className="text-primary">проект</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Оставьте заявку, и мы свяжемся с вами для обсуждения деталей
          </p>
          
          <div className="pt-4">
            <button 
              className="btn-gold"
              onClick={() => setIsContactModalOpen(true)}
            >
              Обсудить проект
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