import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight } from 'lucide-react';

interface PageSeo {
  id: string;
  page_slug: string;
  page_title: string;
  h1_tag: string;
}

interface ContentManagementProps {
  onPageSelect: (pageSlug: string) => void;
}

const ContentManagement = ({ onPageSelect }: ContentManagementProps) => {
  const [pages, setPages] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      const { data, error } = await supabase
        .from('page_seo')
        .select('id, page_slug, page_title, h1_tag')
        .order('page_slug');

      if (error) {
        console.error('Error fetching pages:', error);
      } else {
        setPages(data || []);
      }
      setLoading(false);
    };

    fetchPages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Управление контентом</h1>
        <p className="text-muted-foreground">
          Выберите страницу для редактирования контента и SEO
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card 
            key={page.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPageSelect(page.page_slug)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg">{page.page_title}</CardTitle>
              <CardDescription>
                Slug: /{page.page_slug}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">H1:</span>
                  <p className="text-muted-foreground truncate">
                    {page.h1_tag || 'Не задано'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Действия</CardTitle>
          <CardDescription>
            Дополнительные возможности управления контентом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              Добавить новую страницу
            </Button>
            <Button variant="outline">
              Экспорт контента
            </Button>
            <Button variant="outline">
              Импорт контента
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;