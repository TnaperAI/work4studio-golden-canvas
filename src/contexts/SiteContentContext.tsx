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
  getContentByLanguage: (section: string, key: string, language: Language) => string;
  translateContent: (fromLanguage: Language, toLanguage: Language, section?: string) => Promise<void>;
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

  // Define all functions using useCallback to prevent recreation on every render
  const getContentByLanguage = React.useCallback((section: string, key: string, language: Language): string => {
    const item = content.find(c => c.section === section && c.key === key && c.language === language);
    return item?.value || '';
  }, [content]);

  const getContent = React.useCallback((section: string, key: string, language?: Language): string => {
    const targetLanguage = language || currentLanguage;
    
    // Try to get content in target language
    let item = content.find(c => c.section === section && c.key === key && c.language === targetLanguage);
    
    // If not found and target language is not Russian, fallback to Russian
    if (!item && targetLanguage !== 'ru') {
      item = content.find(c => c.section === section && c.key === key && c.language === 'ru');
    }
    
    return item?.value || '';
  }, [content, currentLanguage]);

  const updateContent = React.useCallback(async (section: string, key: string, value: string, language?: Language): Promise<void> => {
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
  }, [currentLanguage]);

  const translateContent = React.useCallback(async (fromLanguage: Language, toLanguage: Language, section?: string): Promise<void> => {
    try {
      // Get content to translate
      let sourceContent = content.filter(c => c.language === fromLanguage);
      
      // Filter by section if specified
      if (section) {
        sourceContent = sourceContent.filter(c => c.section === section);
      }

      if (sourceContent.length === 0) {
        throw new Error(`No content found for language: ${fromLanguage}${section ? ` in section: ${section}` : ''}`);
      }

      // Translate content in batches to avoid rate limits
      const batchSize = 5;
      const translatedContent = [];

      for (let i = 0; i < sourceContent.length; i += batchSize) {
        const batch = sourceContent.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (item) => {
          try {
            const { data, error } = await supabase.functions.invoke('translate-content', {
              body: {
                text: item.value,
                fromLanguage,
                toLanguage
              }
            });

            if (error) {
              console.error('Translation error for item:', item.key, error);
              return null;
            }

            if (!data.success) {
              console.error('Translation failed for item:', item.key, data.error);
              return null;
            }

            return {
              section: item.section,
              key: item.key,
              value: data.translatedText,
              language: toLanguage
            };
          } catch (error) {
            console.error('Error translating item:', item.key, error);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(result => result !== null);
        translatedContent.push(...validResults);

        // Small delay between batches to respect rate limits
        if (i + batchSize < sourceContent.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      if (translatedContent.length === 0) {
        throw new Error('Failed to translate any content');
      }

      // Save translated content to database
      const { error } = await supabase
        .from('site_content')
        .upsert(translatedContent, { onConflict: 'section,key,language' });

      if (error) {
        console.error('Error saving translated content:', error);
        throw error;
      }

      console.log(`Successfully translated ${translatedContent.length} items from ${fromLanguage} to ${toLanguage}`);
      
    } catch (error) {
      console.error('Error in translateContent:', error);
      throw error;
    }
  }, [content]);

  const value = React.useMemo(() => ({
    content,
    loading,
    getContent,
    updateContent,
    getContentByLanguage,
    translateContent,
  }), [content, loading, getContent, updateContent, getContentByLanguage, translateContent]);

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