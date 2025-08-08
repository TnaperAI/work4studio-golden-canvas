import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import telegramLogo from '@/assets/telegram-logo.svg';

interface Service {
  id: string;
  title: string;
  slug: string;
}

interface LegalDocument {
  id: string;
  title: string;
  type: string;
}

const Footer = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocument[]>([]);
  const { currentLanguage } = useLanguage();

  const navigation = currentLanguage === 'en' ? [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Cases', href: '/cases' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ] : [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/services' },
    { name: 'Кейсы', href: '/cases' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contact' },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, title, slug')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(4);

      if (data) {
        setServices(data);
      }
    };

    const fetchLegalDocuments = async () => {
      const { data } = await supabase
        .from('legal_documents')
        .select('id, title, type')
        .in('type', ['privacy_policy', 'terms_of_service']);

      if (data) {
        setLegalDocuments(data);
      }
    };

    fetchServices();
    fetchLegalDocuments();
  }, []);

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-2">
          <div className="mb-6">
            <span className="font-logo font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Work<span className="text-primary">4</span>Studio
            </span>
          </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              {currentLanguage === 'en' 
                ? 'Next-generation website development — from idea to launch in 3 days. No bureaucracy, only results.'
                : 'Разработка сайтов нового поколения — от идеи до запуска за 3 дня. Никакой бюрократии, только результат.'
              }
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:info@work4studio.com"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium text-card-foreground">
                  {currentLanguage === 'en' ? 'Email us' : 'Написать нам'}
                </span>
              </a>
              <a
                href="https://t.me/work4studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <img src={telegramLogo} alt="Telegram" className="w-5 h-5 mr-3" />
                <span className="font-medium text-card-foreground">Telegram</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-foreground">
              {currentLanguage === 'en' ? 'Navigation' : 'Навигация'}
            </h4>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {currentLanguage === 'en' ? 'Services' : 'Услуги'}
            </h4>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                  >
                    {service.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section with enhanced styling */}
        <div className="border-t border-gradient-to-r from-transparent via-border to-transparent pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-lg">
              {currentLanguage === 'en' ? '© 2024 Work4Studio. All rights reserved.' : '© 2024 Work4Studio. Все права защищены.'}
            </p>
            <div className="flex items-center space-x-6">
              {legalDocuments.map((doc) => {
                const getDocTitle = (type: string) => {
                  if (currentLanguage === 'en') {
                    return type === 'privacy_policy' ? 'Privacy Policy' : 'Terms of Service';
                  }
                  return type === 'privacy_policy' ? 'Политика конфиденциальности' : 'Пользовательское соглашение';
                };
                
                return (
                  <Link 
                    key={doc.id}
                    to={`/legal/${doc.type}`} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
                  >
                    {getDocTitle(doc.type)}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground">
                {currentLanguage === 'en' ? 'Developed by' : 'Разработано'}
              </span>
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <span className="font-logo font-bold text-lg bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Work<span className="text-primary">4</span>Studio
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;