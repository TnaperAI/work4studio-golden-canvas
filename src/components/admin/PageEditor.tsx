import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';
import { ArrowLeft } from 'lucide-react';

interface PageEditorProps {
  pageSlug: string;
  onBack: () => void;
}

interface PageSeoData {
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

const PageEditor = ({ pageSlug, onBack }: PageEditorProps) => {
  const { content, getContent, updateContent } = useSiteContent();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState<PageSeoData>({
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

  // Content states for different sections
  const [contentFields, setContentFields] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPageData = async () => {
      // Fetch SEO data
      const { data: seoData, error } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_slug', pageSlug)
        .single();

      if (error) {
        console.error('Error fetching SEO data:', error);
      } else if (seoData) {
        setSeoData({
          page_title: seoData.page_title || '',
          meta_title: seoData.meta_title || '',
          meta_description: seoData.meta_description || '',
          meta_keywords: seoData.meta_keywords || '',
          h1_tag: seoData.h1_tag || '',
          canonical_url: seoData.canonical_url || '',
          og_title: seoData.og_title || '',
          og_description: seoData.og_description || '',
          og_image: seoData.og_image || ''
        });
      }

      setLoading(false);
    };

    fetchPageData();
  }, [pageSlug]);

  useEffect(() => {
    // Load content fields when content is available
    if (content.length > 0) {
      const pageContent: Record<string, string> = {};
      
      // Get content for this page section
      const sectionKey = pageSlug === 'home' ? 'hero' : pageSlug;
      content
        .filter(c => c.section === sectionKey)
        .forEach(c => {
          pageContent[c.key] = c.value;
        });

      setContentFields(pageContent);
    }
  }, [content, pageSlug]);

  const handleSeoSave = async () => {
    try {
      const { error } = await supabase
        .from('page_seo')
        .update(seoData)
        .eq('page_slug', pageSlug);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'SEO данные обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить SEO данные',
        variant: 'destructive',
      });
    }
  };

  const handleContentSave = async () => {
    try {
      const sectionKey = pageSlug === 'home' ? 'hero' : pageSlug;
      
      await Promise.all(
        Object.entries(contentFields).map(([key, value]) =>
          updateContent(sectionKey, key, value)
        )
      );

      toast({
        title: 'Успешно',
        description: 'Контент обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контент',
        variant: 'destructive',
      });
    }
  };

  const updateContentField = (key: string, value: string) => {
    setContentFields(prev => ({ ...prev, [key]: value }));
  };

  const updateSeoField = (field: keyof PageSeoData, value: string) => {
    setSeoData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Редактирование: {seoData.page_title}
          </h1>
          <p className="text-muted-foreground">
            Управление контентом и SEO для страницы /{pageSlug}
          </p>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Контент страницы</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pageSlug === 'home' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Основной заголовок"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок</Label>
                    <Textarea
                      value={contentFields.subtitle || ''}
                      onChange={(e) => updateContentField('subtitle', e.target.value)}
                      placeholder="Описание под заголовком"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Текст кнопки</Label>
                    <Input
                      value={contentFields.cta_button || ''}
                      onChange={(e) => updateContentField('cta_button', e.target.value)}
                      placeholder="Обсудить проект"
                    />
                  </div>
                </>
              )}

              {pageSlug === 'services' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок страницы</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Разрабатываем сайты. Быстро, по делу, под задачи бизнеса."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок</Label>
                    <Textarea
                      value={contentFields.subtitle || ''}
                      onChange={(e) => updateContentField('subtitle', e.target.value)}
                      placeholder="Выберите подходящий формат — от простого лендинга до интернет-магазина."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Заголовок CTA секции</Label>
                    <Input
                      value={contentFields.cta_title || ''}
                      onChange={(e) => updateContentField('cta_title', e.target.value)}
                      placeholder="Не знаете, какой формат подойдёт?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Подзаголовок CTA секции</Label>
                    <Textarea
                      value={contentFields.cta_subtitle || ''}
                      onChange={(e) => updateContentField('cta_subtitle', e.target.value)}
                      placeholder="Расскажите о своих задачах — поможем выбрать оптимальное решение"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Текст кнопки CTA</Label>
                    <Input
                      value={contentFields.cta_button || ''}
                      onChange={(e) => updateContentField('cta_button', e.target.value)}
                      placeholder="Получить консультацию"
                    />
                  </div>
                </>
              )}

              {pageSlug === 'about' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок страницы</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="О нас"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={contentFields.description || ''}
                      onChange={(e) => updateContentField('description', e.target.value)}
                      placeholder="Описание компании"
                      rows={4}
                    />
                  </div>
                </>
              )}

              {pageSlug === 'contact' && (
                <>
                  <div className="space-y-2">
                    <Label>Заголовок страницы</Label>
                    <Input
                      value={contentFields.title || ''}
                      onChange={(e) => updateContentField('title', e.target.value)}
                      placeholder="Контакты"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Описание</Label>
                    <Textarea
                      value={contentFields.description || ''}
                      onChange={(e) => updateContentField('description', e.target.value)}
                      placeholder="Свяжитесь с нами"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {!['home', 'services', 'about', 'contact'].includes(pageSlug) && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Контент для страницы "{pageSlug}" пока не настроен.</p>
                  <p className="text-sm mt-2">Добавьте поля контента в компонент PageEditor.</p>
                </div>
              )}
              
              <Button onClick={handleContentSave}>
                Сохранить контент
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>H1 заголовок</Label>
                  <Input
                    value={seoData.h1_tag}
                    onChange={(e) => updateSeoField('h1_tag', e.target.value)}
                    placeholder="Основной H1 заголовок страницы"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Мета заголовок</Label>
                  <Input
                    value={seoData.meta_title}
                    onChange={(e) => updateSeoField('meta_title', e.target.value)}
                    placeholder="Title для поисковиков"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Мета описание</Label>
                  <Textarea
                    value={seoData.meta_description}
                    onChange={(e) => updateSeoField('meta_description', e.target.value)}
                    placeholder="Описание страницы для поисковиков"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ключевые слова</Label>
                  <Input
                    value={seoData.meta_keywords}
                    onChange={(e) => updateSeoField('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canonical URL</Label>
                  <Input
                    value={seoData.canonical_url}
                    onChange={(e) => updateSeoField('canonical_url', e.target.value)}
                    placeholder="https://site.com/page"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG заголовок</Label>
                  <Input
                    value={seoData.og_title}
                    onChange={(e) => updateSeoField('og_title', e.target.value)}
                    placeholder="Заголовок для соцсетей"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG изображение</Label>
                  <Input
                    value={seoData.og_image}
                    onChange={(e) => updateSeoField('og_image', e.target.value)}
                    placeholder="URL изображения для соцсетей"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>OG описание</Label>
                  <Textarea
                    value={seoData.og_description}
                    onChange={(e) => updateSeoField('og_description', e.target.value)}
                    placeholder="Описание для соцсетей"
                    rows={3}
                  />
                </div>
              </div>
              
              <Button onClick={handleSeoSave}>
                Сохранить SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageEditor;