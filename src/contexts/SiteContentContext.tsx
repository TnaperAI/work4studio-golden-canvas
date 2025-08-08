import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, type Language } from './LanguageContext';

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
  getContent: (section: string, key: string, language?: Language) => string;
  updateContent: (section: string, key: string, value: string, language?: Language) => Promise<void>;
  copyContentToLanguage: (fromLanguage: Language, toLanguage: Language) => Promise<void>;
  getContentByLanguage: (section: string, key: string, language: Language) => string;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

interface SiteContentProviderProps {
  children: ReactNode;
}

export const SiteContentProvider: React.FC<SiteContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();

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

  const getContentByLanguage = (section: string, key: string, language: Language): string => {
    const item = content.find(c => c.section === section && c.key === key && c.language === language);
    return item?.value || '';
  };

  const getContent = (section: string, key: string, language?: Language): string => {
    const targetLanguage = language || currentLanguage;
    
    // Try to get content in target language
    let item = content.find(c => c.section === section && c.key === key && c.language === targetLanguage);
    
    // If not found and target language is not Russian, fallback to Russian
    if (!item && targetLanguage !== 'ru') {
      item = content.find(c => c.section === section && c.key === key && c.language === 'ru');
    }
    
    return item?.value || '';
  };

  const updateContent = async (section: string, key: string, value: string, language?: Language): Promise<void> => {
    const targetLanguage = language || currentLanguage;
    
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { section, key, value, language: targetLanguage },
        { onConflict: 'section,key,language' }
      );

    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const copyContentToLanguage = async (fromLanguage: Language, toLanguage: Language): Promise<void> => {
    try {
      // Get all content for the source language
      const sourceContent = content.filter(c => c.language === fromLanguage);
      
      // Prepare data for batch insert
      const contentToCopy = sourceContent.map(item => ({
        section: item.section,
        key: item.key,
        value: item.value,
        language: toLanguage
      }));

      if (contentToCopy.length === 0) {
        throw new Error(`No content found for language: ${fromLanguage}`);
      }

      const { error } = await supabase
        .from('site_content')
        .upsert(contentToCopy, { onConflict: 'section,key,language' });

      if (error) {
        console.error('Error copying content:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in copyContentToLanguage:', error);
      throw error;
    }
  };

  const value = {
    content,
    loading,
    getContent,
    updateContent,
    copyContentToLanguage,
    getContentByLanguage,
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