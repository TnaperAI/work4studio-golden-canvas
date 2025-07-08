import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export const useSiteContent = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
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
      setLoading(false);
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

  const getContent = (section: string, key: string) => {
    const item = content.find(c => c.section === section && c.key === key);
    return item?.value || '';
  };

  const updateContent = async (section: string, key: string, value: string) => {
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { section, key, value },
        { onConflict: 'section,key' }
      );

    if (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  return {
    content,
    loading,
    getContent,
    updateContent,
  };
};