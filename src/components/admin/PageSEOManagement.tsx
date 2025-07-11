import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Globe, Save } from 'lucide-react';

interface PageSEO {
  id: string;
  page_slug: string;
  page_title: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

interface ServicePage {
  slug: string;
  title: string;
}

const staticPages = [
  { slug: 'home', name: 'Главная страница' },
  { slug: 'services', name: 'Услуги' },
  { slug: 'cases', name: 'Кейсы' },
  { slug: 'contact', name: 'Контакты' },
  { slug: 'about', name: 'О нас' },
];

const PageSEOManagement = () => {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [servicePagesLoading, setServicePagesLoading] = useState(true);
  const [servicePages, setServicePages] = useState<ServicePage[]>([]);
  const [allPages, setAllPages] = useState(staticPages);

  useEffect(() => {
    fetchServicePages();
  }, []);

  const fetchServicePages = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('slug, title')
        .eq('is_active', true)
        .order('title');

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServicePages(data || []);
        // Объединяем статические страницы с страницами услуг
        const dynamicPages = (data || []).map(service => ({
          slug: `service-${service.slug}`,
          name: `Услуга: ${service.title}`
        }));
        setAllPages([...staticPages, ...dynamicPages]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setServicePagesLoading(false);
    }
  };

  useEffect(() => {
    fetchPageSEO();
  }, [selectedPage]);

  const fetchPageSEO = async () => {
    setLoading(true);
    try {
      let data = null;
      let error = null;

      if (selectedPage.startsWith('service-')) {
        // Это страница услуги - берем SEO данные из таблицы services
        const serviceSlug = selectedPage.replace('service-', '');
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select('meta_title, meta_description, meta_keywords, h1_tag, canonical_url, og_title, og_description, og_image, title')
          .eq('slug', serviceSlug)
          .maybeSingle();

        if (serviceError) {
          console.error('Error fetching service SEO:', serviceError);
        }

        if (serviceData) {
          data = {
            id: '',
            page_slug: selectedPage,
            page_title: serviceData.meta_title || serviceData.title,
            meta_title: serviceData.meta_title,
            meta_description: serviceData.meta_description,
            meta_keywords: serviceData.meta_keywords,
            h1_tag: serviceData.h1_tag,
            canonical_url: serviceData.canonical_url,
            og_title: serviceData.og_title,
            og_description: serviceData.og_description,
            og_image: serviceData.og_image
          };
        }
      } else {
        // Это обычная страница - берем SEO данные из таблицы page_seo
        const { data: pageData, error: pageError } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', selectedPage)
          .maybeSingle();

        data = pageData;
        error = pageError;

        if (error) {
          console.error('Error fetching page SEO:', error);
        }
      }

      if (data) {
        setPageSEO(data);
      } else {
        // Create empty SEO object for new page
        setPageSEO({
          id: '',
          page_slug: selectedPage,
          page_title: '',
          meta_title: '',
          meta_description: '',
          meta_keywords: '',
          h1_tag: '',
          canonical_url: '',
          og_title: '',
          og_description: '',
          og_image: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePageSEO = async () => {
    if (!pageSEO) return;

    setSaving(true);
    try {
      if (selectedPage.startsWith('service-')) {
        // Сохраняем SEO данные услуги в таблицу services
        const serviceSlug = selectedPage.replace('service-', '');
        const { error } = await supabase
          .from('services')
          .update({
            meta_title: pageSEO.meta_title,
            meta_description: pageSEO.meta_description,
            meta_keywords: pageSEO.meta_keywords,
            h1_tag: pageSEO.h1_tag,
            canonical_url: pageSEO.canonical_url,
            og_title: pageSEO.og_title,
            og_description: pageSEO.og_description,
            og_image: pageSEO.og_image
          })
          .eq('slug', serviceSlug);

        if (error) throw error;
      } else {
        // Сохраняем SEO данные обычной страницы в таблицу page_seo
        const seoData = {
          ...pageSEO,
          page_slug: selectedPage
        };

        const { error } = await supabase
          .from('page_seo')
          .upsert(seoData, { onConflict: 'page_slug' });

        if (error) throw error;
      }

      toast({
        title: 'Успешно',
        description: 'SEO настройки страницы сохранены',
      });

      // Refresh data to get the ID if it was a new record
      fetchPageSEO();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить SEO настройки',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedPageName = allPages.find(p => p.slug === selectedPage)?.name || selectedPage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Globe className="h-8 w-8" />
            SEO настройки страниц
          </h1>
          <p className="text-muted-foreground">
            Управление SEO параметрами для всех страниц сайта
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Выберите страницу для редактирования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Страница</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage} disabled={servicePagesLoading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem disabled value="">
                    {servicePagesLoading ? 'Загружаем страницы...' : 'Выберите страницу'}
                  </SelectItem>
                  {allPages.map((page) => (
                    <SelectItem key={page.slug} value={page.slug}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : pageSEO && (
        <Card>
          <CardHeader>
            <CardTitle>SEO настройки: {selectedPageName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Заголовок страницы (Page Title)</Label>
                <Input
                  value={pageSEO.page_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    page_title: e.target.value
                  })}
                  placeholder="Заголовок в браузере"
                />
              </div>
              <div className="space-y-2">
                <Label>H1 заголовок</Label>
                <Input
                  value={pageSEO.h1_tag || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    h1_tag: e.target.value
                  })}
                  placeholder="Основной заголовок на странице"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={pageSEO.meta_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    meta_title: e.target.value
                  })}
                  placeholder="SEO заголовок для поисковиков"
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords (через запятую)</Label>
                <Input
                  value={pageSEO.meta_keywords || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    meta_keywords: e.target.value
                  })}
                  placeholder="ключевые, слова, через, запятую"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={pageSEO.meta_description || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  meta_description: e.target.value
                })}
                placeholder="Краткое описание страницы для поисковых систем (до 160 символов)"
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Символов: {pageSEO.meta_description?.length || 0}/160
              </p>
            </div>

            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input
                value={pageSEO.canonical_url || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  canonical_url: e.target.value
                })}
                placeholder="https://yoursite.com/page-url"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Open Graph Title</Label>
                <Input
                  value={pageSEO.og_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    og_title: e.target.value
                  })}
                  placeholder="Заголовок для соцсетей"
                />
              </div>
              <div className="space-y-2">
                <Label>Open Graph Image URL</Label>
                <Input
                  value={pageSEO.og_image || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    og_image: e.target.value
                  })}
                  placeholder="https://yoursite.com/og-image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Open Graph Description</Label>
              <Textarea
                value={pageSEO.og_description || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  og_description: e.target.value
                })}
                placeholder="Описание для социальных сетей"
                rows={3}
              />
            </div>

            <Button onClick={savePageSEO} disabled={saving} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Сохранение...' : 'Сохранить SEO настройки'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageSEOManagement;