import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Zap } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ContactFormModal from '@/components/ContactFormModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/integrations/supabase/client';
interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number;
  price_to: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}
interface PageSEO {
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}
const Services = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    getContent
  } = useSiteContent();
  const { language } = useLanguage();
  useScrollAnimation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Starting to fetch services...');

        // Fetch services
        const { data: baseServices, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching services:', error);
          setServices([]);
        } else {
          let merged = baseServices || [];

          // Merge EN translations if needed
          if (language === 'en' && merged.length > 0) {
            const ids = merged.map((s) => s.id);
            const { data: tr, error: tErr } = await supabase
              .from('service_translations')
              .select('service_id, title, short_description, description, features')
              .eq('language', 'en')
              .in('service_id', ids);

            if (tErr) {
              console.warn('Translations load error:', tErr);
            } else if (tr && tr.length) {
              const map: Record<string, any> = {};
              tr.forEach((row: any) => { map[row.service_id] = row; });
              merged = merged.map((s) => {
                const t = map[s.id];
                return t ? {
                  ...s,
                  title: t.title ?? s.title,
                  short_description: t.short_description ?? s.short_description,
                  description: t.description ?? s.description,
                  features: t.features ?? s.features,
                } : s;
              });
            }
          }

          console.log('✅ Successfully loaded services (merged if EN):', merged);
          setServices(merged);
        }

        // Fetch SEO data (limit to avoid multiple rows error)
        const { data: seoData, error: seoError } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', 'services')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (seoError) {
          console.error('SEO error:', seoError);
        } else {
          setPageSEO(seoData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [language]);

  // Обновляем SEO теги когда загружаются данные
  useEffect(() => {
    if (pageSEO) {
      // Обновляем title
      if (pageSEO.page_title) {
        document.title = pageSEO.page_title;
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
      if (pageSEO.canonical_url) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = pageSEO.canonical_url;
      }

      // Устанавливаем мета теги
      updateMetaTag('description', pageSEO.meta_description);
      updateMetaTag('keywords', pageSEO.meta_keywords);
      updatePropertyTag('og:title', pageSEO.og_title);
      updatePropertyTag('og:description', pageSEO.og_description);
      updatePropertyTag('og:image', pageSEO.og_image);
      updatePropertyTag('og:type', 'website');
      updatePropertyTag('og:url', window.location.href);
    }
  }, [pageSEO]);
  const formatPrice = (from: number | null, to: number | null) => {
    const noPriceText = language === 'en' ? 'Price not specified' : 'Цена не указана';
    if (!from) return noPriceText;
    return `${from.toLocaleString()}$`;
  };
  return <div className="min-h-screen">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <LocalizedLink to="/">{getContent('services_page', 'breadcrumb_home') || (language === 'en' ? 'Home' : 'Главная')}</LocalizedLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getContent('services_page', 'breadcrumb_services') || (language === 'en' ? 'Services' : 'Услуги')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('services', 'title') || 'Разрабатываем сайты под ключ'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              {getContent('services', 'subtitle') || 'Выбираем подходящий формат — от посадочной страницы до интернет-магазина. Настраиваем под ваши цели и задачи.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border/50 px-6 py-3 rounded-2xl">
                <Target className="h-6 w-6 mr-3 text-primary" />
                {getContent('services', 'badge_1_text') || 'От 3 дней до запуска'}
              </div>
              <div className="flex items-center text-lg text-muted-foreground bg-card border border-border/50 px-6 py-3 rounded-2xl">
                <Zap className="h-6 w-6 mr-3 text-primary" />
                {getContent('services', 'badge_2_text') || 'Открытый код и доступ'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20 animate-on-scroll">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('services', 'grid_title') || 'Выберите формат'}
              </span>{' '}
              
            </h2>
            <p className="text-muted-foreground text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
              {getContent('services', 'grid_subtitle') || 'Дизайн, код и запуск — всё, что нужно для старта онлайн. Выбираем формат под ваши цели.'}
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {loading && <div className="col-span-full flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="ml-4 text-foreground">Загружаем...</p>
              </div>}
            
            {services && services.length > 0 && services.map((service, index) => <div key={service.id} className="bg-card border border-border p-6 rounded-2xl hover:bg-secondary/80 transition-all">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.short_description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">
                    {service.price_from
                      ? `${language === 'en' ? 'from' : 'от'} ${service.price_from.toLocaleString()}$`
                      : (language === 'en' ? 'Price not set' : 'Цена не указана')}
                  </span>
                  <LocalizedLink to={`/services/${service.slug}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/80">
                      Подробнее
                    </Button>
                  </LocalizedLink>
                </div>
              </div>)}
            
            {!loading && (!services || services.length === 0) && <div className="col-span-full text-center py-16">
                <p className="text-foreground text-xl">Услуги не найдены</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Данные: {JSON.stringify(services?.length || 'нет')}
                </p>
              </div>}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-on-scroll">
            <div className="p-12 md:p-16 bg-background border-2 border-primary/20 rounded-3xl shadow-2xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-8 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('services', 'cta_title') || 'Не знаете, какой формат подойдёт?'}
              </h2>
              <p className="text-muted-foreground mb-10 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
                {getContent('services', 'cta_subtitle') || 'Расскажите о своих задачах — поможем выбрать оптимальное решение и запустим проект в кратчайшие сроки'}
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-base md:text-xl px-6 py-4 md:px-10 md:py-6 hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => setIsContactModalOpen(true)}>
                {getContent('services', 'cta_button') || 'Получить консультацию'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      <BackToTop />
      
      <ContactFormModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} source="services_page" />
    </div>;
};
export default Services;