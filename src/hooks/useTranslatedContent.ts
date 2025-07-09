import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslatedContent = (originalText: string) => {
  const { translateText, language } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performTranslation = async () => {
      if (!originalText) {
        setTranslatedText('');
        return;
      }

      if (language === 'ru') {
        setTranslatedText(originalText);
        return;
      }

      setIsLoading(true);
      try {
        const translated = await translateText(originalText);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(originalText); // Fallback to original
      } finally {
        setIsLoading(false);
      }
    };

    performTranslation();
  }, [originalText, language, translateText]);

  return { translatedText, isLoading };
};

export const useTranslatedSiteContent = (section: string, key: string, defaultValue: string = '') => {
  const { useSiteContent } = require('@/hooks/useSiteContent');
  const { getContent } = useSiteContent();
  const originalContent = getContent(section, key) || defaultValue;
  
  return useTranslatedContent(originalContent);
};