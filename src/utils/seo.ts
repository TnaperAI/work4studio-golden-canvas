import { getAlternativeLanguageUrls, getLanguageFromPath } from '@/utils/languageRouting';

/**
 * Updates hreflang alternate links and sets html lang.
 * English is x-default and primary.
 */
export const updateHreflangForCurrentPath = () => {
  try {
    const path = window.location.pathname;
    const lang = getLanguageFromPath(path);

    // Set <html lang="..."> attribute (default to 'en')
    document.documentElement.lang = lang || 'en';

    // Remove existing alternate links to avoid duplicates
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((el) => el.parentElement?.removeChild(el));

    const urls = getAlternativeLanguageUrls(path, window.location.origin);

    // en
    const linkEn = document.createElement('link');
    linkEn.setAttribute('rel', 'alternate');
    linkEn.setAttribute('hreflang', 'en');
    linkEn.setAttribute('href', urls.en);
    document.head.appendChild(linkEn);

    // ru
    const linkRu = document.createElement('link');
    linkRu.setAttribute('rel', 'alternate');
    linkRu.setAttribute('hreflang', 'ru');
    linkRu.setAttribute('href', urls.ru);
    document.head.appendChild(linkRu);

    // x-default should point to English since it's primary
    const linkDefault = document.createElement('link');
    linkDefault.setAttribute('rel', 'alternate');
    linkDefault.setAttribute('hreflang', 'x-default');
    linkDefault.setAttribute('href', urls.en);
    document.head.appendChild(linkDefault);
  } catch (e) {
    console.warn('SEO hreflang update error:', e);
  }
};
