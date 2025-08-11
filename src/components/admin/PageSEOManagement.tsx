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
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';

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
  language?: 'ru' | 'en';
}

interface ServicePage {
  slug: string;
  title: string;
}

const getStaticPages = (getContent: any, language: string) => [
  { slug: 'home', name: getContent('admin_seo', 'page_home') || (language === 'en' ? 'Home Page' : 'Главная страница') },
  { slug: 'services', name: getContent('admin_seo', 'page_services') || (language === 'en' ? 'Services' : 'Услуги') },
  { slug: 'cases', name: getContent('admin_seo', 'page_cases') || (language === 'en' ? 'Cases' : 'Кейсы') },
  { slug: 'contact', name: getContent('admin_seo', 'page_contact') || (language === 'en' ? 'Contact' : 'Контакты') },
  { slug: 'about', name: getContent('admin_seo', 'page_about') || (language === 'en' ? 'About Us' : 'О нас') },
];

const PageSEOManagement = () => {
  const { toast } = useToast();
  const { getContent } = useSiteContent();
  const { language } = useLanguage();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [servicePagesLoading, setServicePagesLoading] = useState(true);
  const [servicePages, setServicePages] = useState<ServicePage[]>([]);
  const [allPages, setAllPages] = useState(getStaticPages(getContent, language));
  const [selectedLanguage, setSelectedLanguage] = useState<'ru' | 'en'>('ru');

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
          name: `${getContent('admin_seo', 'service_prefix') || (language === 'en' ? 'Service:' : 'Услуга:')} ${service.title}`
        }));
        setAllPages([...getStaticPages(getContent, language), ...dynamicPages]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setServicePagesLoading(false);
    }
  };

  useEffect(() => {
    fetchPageSEO();
  }, [selectedPage, selectedLanguage]);

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
          .eq('language', selectedLanguage)
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
        const seoData: any = {
          ...pageSEO,
          page_slug: selectedPage,
          language: selectedLanguage
        };

        // Убираем id если он пустой для корректного создания записи
        if (!seoData.id) {
          delete seoData.id;
        }

        const { error } = await supabase
          .from('page_seo')
          .upsert(seoData, { onConflict: 'page_slug,language' });

        if (error) throw error;
      }

      toast({
        title: getContent('admin_seo', 'success_title') || (language === 'en' ? 'Success' : 'Успешно'),
        description: getContent('admin_seo', 'save_success') || (language === 'en' ? 'Page SEO settings saved' : 'SEO настройки страницы сохранены'),
      });

      // Refresh data to get the ID if it was a new record
      fetchPageSEO();
    } catch (error: any) {
      toast({
        title: getContent('admin_seo', 'error_title') || (language === 'en' ? 'Error' : 'Ошибка'),
        description: getContent('admin_seo', 'save_error') || (language === 'en' ? 'Failed to save SEO settings' : 'Не удалось сохранить SEO настройки'),
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
            {getContent('admin_seo', 'title') || (language === 'en' ? 'Page SEO Settings' : 'SEO настройки страниц')}
          </h1>
          <p className="text-muted-foreground">
            {getContent('admin_seo', 'description') || (language === 'en' ? 'Manage SEO parameters for all website pages' : 'Управление SEO параметрами для всех страниц сайта')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getContent('admin_seo', 'select_page_title') || (language === 'en' ? 'Select page to edit' : 'Выберите страницу для редактирования')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>{getContent('admin_seo', 'page_label') || (language === 'en' ? 'Page' : 'Страница')}</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage} disabled={servicePagesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={servicePagesLoading ? (getContent('admin_seo', 'loading_pages') || (language === 'en' ? 'Loading pages...' : 'Загружаем страницы...')) : (getContent('admin_seo', 'select_page_placeholder') || (language === 'en' ? 'Select page' : 'Выберите страницу'))} />
                </SelectTrigger>
                <SelectContent>
                  {allPages.map((page) => (
                    <SelectItem key={page.slug} value={page.slug}>
                      {page.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{getContent('admin_seo', 'language_label') || (language === 'en' ? 'Language' : 'Язык')}</Label>
              <Select value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as 'ru' | 'en')}>
                <SelectTrigger>
                  <SelectValue placeholder={getContent('admin_seo', 'select_language') || (language === 'en' ? 'Select language' : 'Выберите язык')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">{getContent('admin_seo', 'russian_lang') || (language === 'en' ? 'Russian' : 'Русский')}</SelectItem>
                  <SelectItem value="en">{getContent('admin_seo', 'english_lang') || (language === 'en' ? 'English' : 'English')}</SelectItem>
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
            <CardTitle>{getContent('admin_seo', 'seo_settings_for') || (language === 'en' ? 'SEO Settings:' : 'SEO настройки:')} {selectedPageName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'page_title_label') || (language === 'en' ? 'Page Title' : 'Заголовок страницы (Page Title)')}</Label>
                <Input
                  value={pageSEO.page_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    page_title: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'page_title_placeholder') || (language === 'en' ? 'Browser title' : 'Заголовок в браузере')}
                />
              </div>
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'h1_label') || (language === 'en' ? 'H1 Heading' : 'H1 заголовок')}</Label>
                <Input
                  value={pageSEO.h1_tag || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    h1_tag: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'h1_placeholder') || (language === 'en' ? 'Main heading on page' : 'Основной заголовок на странице')}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'meta_title_label') || (language === 'en' ? 'Meta Title' : 'Meta Title')}</Label>
                <Input
                  value={pageSEO.meta_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    meta_title: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'meta_title_placeholder') || (language === 'en' ? 'SEO title for search engines' : 'SEO заголовок для поисковиков')}
                />
              </div>
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'meta_keywords_label') || (language === 'en' ? 'Meta Keywords (comma separated)' : 'Meta Keywords (через запятую)')}</Label>
                <Input
                  value={pageSEO.meta_keywords || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    meta_keywords: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'meta_keywords_placeholder') || (language === 'en' ? 'keyword, phrases, comma, separated' : 'ключевые, слова, через, запятую')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{getContent('admin_seo', 'meta_description_label') || (language === 'en' ? 'Meta Description' : 'Meta Description')}</Label>
              <Textarea
                value={pageSEO.meta_description || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  meta_description: e.target.value
                })}
                placeholder={getContent('admin_seo', 'meta_description_placeholder') || (language === 'en' ? 'Brief page description for search engines (up to 160 characters)' : 'Краткое описание страницы для поисковых систем (до 160 символов)')}
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                {getContent('admin_seo', 'characters_count') || (language === 'en' ? 'Characters:' : 'Символов:')} {pageSEO.meta_description?.length || 0}/160
              </p>
            </div>

            <div className="space-y-2">
              <Label>{getContent('admin_seo', 'canonical_url_label') || (language === 'en' ? 'Canonical URL' : 'Canonical URL')}</Label>
              <Input
                value={pageSEO.canonical_url || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  canonical_url: e.target.value
                })}
                placeholder={getContent('admin_seo', 'canonical_url_placeholder') || (language === 'en' ? 'https://yoursite.com/page-url' : 'https://yoursite.com/page-url')}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'og_title_label') || (language === 'en' ? 'Open Graph Title' : 'Open Graph Title')}</Label>
                <Input
                  value={pageSEO.og_title || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    og_title: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'og_title_placeholder') || (language === 'en' ? 'Title for social media' : 'Заголовок для соцсетей')}
                />
              </div>
              <div className="space-y-2">
                <Label>{getContent('admin_seo', 'og_image_label') || (language === 'en' ? 'Open Graph Image URL' : 'Open Graph Image URL')}</Label>
                <Input
                  value={pageSEO.og_image || ''}
                  onChange={(e) => setPageSEO({
                    ...pageSEO,
                    og_image: e.target.value
                  })}
                  placeholder={getContent('admin_seo', 'og_image_placeholder') || (language === 'en' ? 'https://yoursite.com/og-image.jpg' : 'https://yoursite.com/og-image.jpg')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{getContent('admin_seo', 'og_description_label') || (language === 'en' ? 'Open Graph Description' : 'Open Graph Description')}</Label>
              <Textarea
                value={pageSEO.og_description || ''}
                onChange={(e) => setPageSEO({
                  ...pageSEO,
                  og_description: e.target.value
                })}
                placeholder={getContent('admin_seo', 'og_description_placeholder') || (language === 'en' ? 'Description for social media' : 'Описание для социальных сетей')}
                rows={3}
              />
            </div>

            <Button onClick={savePageSEO} disabled={saving} className="w-full md:w-auto">
              <Save className="h-4 w-4 mr-2" />
              {saving ? (getContent('admin_seo', 'saving') || (language === 'en' ? 'Saving...' : 'Сохранение...')) : (getContent('admin_seo', 'save_button') || (language === 'en' ? 'Save SEO Settings' : 'Сохранить SEO настройки'))}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PageSEOManagement;