import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ru');
  const [isTranslating, setIsTranslating] = useState(false);

  // Auto-detect language based on geolocation
  useEffect(() => {
    const detectLanguage = async () => {
      try {
        console.log('🌍 Starting language detection...');
        
        // Check saved preference first
        const savedLang = localStorage.getItem('preferred-language') as Language;
        console.log('💾 Saved language:', savedLang);
        
        if (savedLang && ['ru', 'en'].includes(savedLang)) {
          console.log('✅ Using saved language:', savedLang);
          setLanguageState(savedLang);
          return;
        }

        // Try to detect by browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('en')) {
          setLanguageState('en');
          return;
        }

        // Try geolocation API for more accurate detection
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use a free IP geolocation service as fallback
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                
                // English-speaking countries
                const englishCountries = ['US', 'GB', 'CA', 'AU', 'NZ', 'IE', 'ZA'];
                if (englishCountries.includes(data.country_code)) {
                  setLanguageState('en');
                }
              } catch (error) {
                console.log('Geolocation detection failed, using default');
              }
            },
            () => {
              console.log('Geolocation permission denied, using default');
            }
          );
        }
      } catch (error) {
        console.log('Language detection failed, using default');
      }
    };

    detectLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    console.log('🔄 Switching language to:', lang);
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
  };

  const translateText = async (text: string): Promise<string> => {
    if (!text || language === 'ru') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}_${language}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsTranslating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: {
          text,
          targetLang: language,
          sourceLang: 'ru'
        }
      });

      if (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
      }

      if (data && data.success) {
        const translatedText = data.translatedText;
        // Cache the translation
        translationCache.set(cacheKey, translatedText);
        return translatedText;
      } else {
        console.error('Translation failed:', data);
        return text;
      }
    } catch (error) {
      console.error('Translation request failed:', error);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      translateText,
      isTranslating
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};