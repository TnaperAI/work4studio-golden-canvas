import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import ContactFormModal from '@/components/ContactFormModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number;
  price_to: number;
  features: string[];
  advantages: string[];
  faq: { question: string; answer: string; }[];
  is_active: boolean;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

const ServiceDetail = () => {
  const { service } = useParams();
  const [showContactForm, setShowContactForm] = useState(false);
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchService = async () => {
      if (!service) {
        setLoading(false);
        return;
      }

      const { data: base, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', service)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching service:', error);
        setServiceData(null);
      } else if (base) {
        let merged: any = base;

        if (language === 'en') {
          const { data: t, error: tErr } = await supabase
            .from('service_translations')
            .select('*')
            .eq('service_id', base.id)
            .eq('language', 'en')
            .maybeSingle();

          if (tErr) {
            console.warn('Translation load error:', tErr);
          } else if (t) {
            merged = {
              ...base,
              title: t.title ?? base.title,
              short_description: t.short_description ?? base.short_description,
              description: t.description ?? base.description,
              features: t.features ?? base.features,
              advantages: t.advantages ?? base.advantages,
              faq: Array.isArray(t.faq) ? t.faq : base.faq,
              meta_title: t.meta_title ?? base.meta_title,
              meta_description: t.meta_description ?? base.meta_description,
              meta_keywords: t.meta_keywords ?? base.meta_keywords,
              h1_tag: t.h1_tag ?? base.h1_tag,
              canonical_url: t.canonical_url ?? base.canonical_url,
              og_title: t.og_title ?? base.og_title,
              og_description: t.og_description ?? base.og_description,
              og_image: t.og_image ?? base.og_image,
            };
          }
        }

        setServiceData({
          ...merged,
          faq: Array.isArray((merged as any).faq)
            ? (merged as any).faq.map((item: any) => ({
                question: item.question || '',
                answer: item.answer || '',
              }))
            : [],
        });
      }
      setLoading(false);
    };

    fetchService();
  }, [service, language]);

  // Обновляем SEO теги когда загружается услуга
  useEffect(() => {
    if (serviceData) {
      // Обновляем title
      if (serviceData.meta_title) {
        document.title = serviceData.meta_title;
      } else {
        document.title = `${serviceData.title} - Work4Studio`;
      }

      // Обновляем meta теги
      const updateMetaTag = (name: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      const updatePropertyTag = (property: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Обновляем canonical URL
      if (serviceData.canonical_url) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = serviceData.canonical_url;
      }

      // Устанавливаем мета теги
      updateMetaTag('description', serviceData.meta_description || serviceData.short_description);
      updateMetaTag('keywords', serviceData.meta_keywords);
      updatePropertyTag('og:title', serviceData.og_title || serviceData.title);
      updatePropertyTag('og:description', serviceData.og_description || serviceData.short_description);
      updatePropertyTag('og:image', serviceData.og_image);
      updatePropertyTag('og:type', 'website');
    }
  }, [serviceData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загружаем услугу...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Услуга не найдена</h1>
          <p className="text-muted-foreground mb-8">Услуга с адресом "{service}" не существует</p>
          <Link to="/services">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к услугам
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/services">Услуги</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{serviceData.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Back Button Section */}
      <section className="py-4 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Назад к услугам</span>
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Badge variant="secondary" className="mb-4">
                {serviceData.title}
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                {serviceData.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {serviceData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setShowContactForm(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Заказать {serviceData.title?.toLowerCase()}
                </Button>
              </div>
            </div>
            
            {/* Sidebar with Price */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-card border-border">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      от {serviceData.price_from?.toLocaleString() || 'Цена не указана'}$
                    </div>
                    <div className="text-muted-foreground">Стоимость работ</div>
                  </div>
                  
                  <Button 
                    className="w-full mb-4"
                    onClick={() => setShowContactForm(true)}
                  >
                    Обсудить проект
                  </Button>
                  
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {serviceData.advantages && serviceData.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{advantage}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {serviceData.features && serviceData.features.length > 0 && (
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Что входит в работу
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serviceData.features.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {serviceData.faq && serviceData.faq.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Частые вопросы
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {serviceData.faq.map((faqItem, index) => (
                <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 text-foreground">
                      {faqItem.question}
                    </h3>
                    <p className="text-muted-foreground">
                      {faqItem.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}


      <Footer />
      <BackToTop />
      
      <ContactFormModal 
        isOpen={showContactForm} 
        onClose={() => setShowContactForm(false)} 
        source="service_detail_page"
      />
    </div>
  );
};

export default ServiceDetail;