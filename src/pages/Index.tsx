import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Hero from '@/components/Hero';
import ServicesSection from '@/components/ServicesSection';
import CasesSection from '@/components/CasesSection';
import ContactForm from '@/components/ContactForm';
import Advantages from '@/components/Advantages';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { updateHreflangForCurrentPath } from '@/utils/seo';

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

const Index = () => {
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  useScrollAnimation();

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        // Определяем язык из URL
        const urlLanguage = window.location.pathname.startsWith('/en') ? 'en' : 'ru';
        console.log('🔍 Fetching SEO for home page, language:', urlLanguage);
        
        const { data: seoData, error } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', 'home')
          .eq('language', urlLanguage)
          .maybeSingle();

        if (error) {
          console.error('❌ SEO error:', error);
        } else {
          console.log('✅ SEO data loaded:', seoData);
          setPageSEO(seoData);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    fetchSEO();
  }, []);

  // Обновляем SEO теги когда загружаются данные
  useEffect(() => {
    console.log('🎯 Applying SEO tags:', pageSEO);
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
      updateHreflangForCurrentPath();
    }
  }, [pageSEO]);
  
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
