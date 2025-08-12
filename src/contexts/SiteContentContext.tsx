import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from './LanguageContext';

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  language: string;
  created_at: string;
  updated_at: string;
}

interface SiteContentContextType {
  content: SiteContent[];
  loading: boolean;
  getContent: (section: string, key: string, lang?: string) => string;
  updateContent: (section: string, key: string, value: string, lang?: string) => Promise<void>;
  language: string;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

interface SiteContentProviderProps {
  children: ReactNode;
}

export const SiteContentProvider: React.FC<SiteContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('*')
          .order('section', { ascending: true })
          .order('key', { ascending: true });

        if (error) {
          console.error('Error fetching site content:', error);
        } else {
          setContent(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching site content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();

    // Set up real-time subscription
    const channel = supabase
      .channel('site_content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_content'
        },
        () => {
          // Refetch content when changes occur
          fetchContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getContent = (section: string, key: string, lang?: string): string => {
    const currentLang = lang || language;
    let item = content.find(c => c.section === section && c.key === key && c.language === currentLang);
    
    // Если контент не найден для текущего языка, попробуем fallback на русский
    if (!item && currentLang !== 'ru') {
      item = content.find(c => c.section === section && c.key === key && c.language === 'ru');
    }
    
    return item?.value || '';
  };

  const updateContent = async (section: string, key: string, value: string, lang?: string): Promise<void> => {
    const currentLang = lang || language;
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { section, key, value, language: currentLang },
        { onConflict: 'section,key,language' }
      );

    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const value = {
    content,
    loading,
    getContent,
    updateContent,
    language,
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};