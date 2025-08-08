import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageSEO {
  id: string;
  page_slug: string;
  page_title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  h1_tag: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  language: string;
}

interface SEOManagerProps {
  pageSlug: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  children?: React.ReactNode;
}

export const SEOManager: React.FC<SEOManagerProps> = ({
  pageSlug,
  fallbackTitle,
  fallbackDescription,
  children
}) => {
  const { currentLanguage } = useLanguage();
  const [seoData, setSeoData] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        // Try to get SEO data for current language
        let { data, error } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', pageSlug)
          .eq('language', currentLanguage)
          .maybeSingle();

        // If no data found for current language and it's not Russian, try Russian as fallback
        if (!data && currentLanguage !== 'ru') {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('page_seo')
            .select('*')
            .eq('page_slug', pageSlug)
            .eq('language', 'ru')
            .maybeSingle();

          if (!fallbackError) {
            data = fallbackData;
          }
        }

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching SEO data:', error);
        }

        setSeoData(data);
      } catch (error) {
        console.error('Unexpected error fetching SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [pageSlug, currentLanguage]);

  useEffect(() => {
    if (loading) return;

    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Generate language-specific URLs for hreflang
    const generateHreflangTags = () => {
      const languages = ['ru', 'en'];
      const links: HTMLLinkElement[] = [];
      
      // Remove existing hreflang and canonical links
      document.querySelectorAll('link[rel="alternate"], link[rel="canonical"]').forEach(link => {
        link.remove();
      });
      
      // Add hreflang for each language
      languages.forEach(lang => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = lang === 'ru' ? `${baseUrl}${currentPath}` : `${baseUrl}/en${currentPath}`;
        document.head.appendChild(link);
        links.push(link);
      });
      
      // Add x-default
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = `${baseUrl}${currentPath}`;
      document.head.appendChild(defaultLink);
      links.push(defaultLink);
      
      // Add canonical
      const canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = seoData?.canonical_url || (currentLanguage === 'ru' 
        ? `${baseUrl}${currentPath}`
        : `${baseUrl}/en${currentPath}`);
      document.head.appendChild(canonical);
      links.push(canonical);
      
      return links;
    };

    // Update document title and meta tags
    const title = seoData?.meta_title || seoData?.page_title || fallbackTitle || 'Work4Studio';
    const description = seoData?.meta_description || fallbackDescription || '';
    
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
    
    // Update or create meta keywords
    if (seoData?.meta_keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = seoData.meta_keywords;
    }
    
    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    
    updateOGTag('og:title', seoData?.og_title || title);
    updateOGTag('og:description', seoData?.og_description || description);
    updateOGTag('og:type', 'website');
    updateOGTag('og:locale', currentLanguage === 'ru' ? 'ru_RU' : 'en_US');
    
    if (seoData?.og_image) {
      updateOGTag('og:image', seoData.og_image);
    }
    
    // Generate and add hreflang tags
    const hreflangLinks = generateHreflangTags();
    
    // Update html lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Cleanup function
    return () => {
      hreflangLinks.forEach(link => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [seoData, loading, currentLanguage, pageSlug, fallbackTitle, fallbackDescription]);

  if (loading) {
    return <>{children}</>;
  }

  return <>{children}</>;
};