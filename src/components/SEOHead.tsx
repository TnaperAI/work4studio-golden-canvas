import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  pageSlug?: string;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  pageSlug
}) => {
  const { currentLanguage, availableLanguages } = useLanguage();
  const location = useLocation();
  
  const baseUrl = window.location.origin;
  const currentPath = location.pathname;
  
  // Generate language-specific URLs for hreflang
  const generateLanguageUrls = () => {
    return availableLanguages.map(lang => {
      const langPath = lang.code === 'ru' ? currentPath : `/en${currentPath}`;
      return {
        language: lang.code,
        url: `${baseUrl}${langPath}`
      };
    });
  };

  const languageUrls = generateLanguageUrls();
  
  // Default canonical URL with language prefix
  const defaultCanonical = currentLanguage === 'ru' 
    ? `${baseUrl}${currentPath}`
    : `${baseUrl}/en${currentPath}`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Language and locale */}
      <html lang={currentLanguage} />
      <meta property="og:locale" content={currentLanguage === 'ru' ? 'ru_RU' : 'en_US'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical || defaultCanonical} />
      
      {/* Hreflang tags for SEO */}
      {languageUrls.map(({ language, url }) => (
        <link
          key={language}
          rel="alternate"
          hrefLang={language}
          href={url}
        />
      ))}
      
      {/* Default language fallback */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${currentPath}`} />
      
      {/* Open Graph meta tags */}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || defaultCanonical} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      {ogTitle && <meta name="twitter:title" content={ogTitle} />}
      {ogDescription && <meta name="twitter:description" content={ogDescription} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Additional language alternates for Open Graph */}
      {languageUrls
        .filter(({ language }) => language !== currentLanguage)
        .map(({ language, url }) => (
          <meta
            key={`og-alt-${language}`}
            property="og:locale:alternate"
            content={language === 'ru' ? 'ru_RU' : 'en_US'}
          />
        ))
      }
    </Helmet>
  );
};