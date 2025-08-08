import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/hooks/useSiteContent';
import { LanguageSwitcher } from './LanguageSwitcher';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Globe,
  Save,
  Loader2,
  FileText,
  Settings
} from 'lucide-react';

interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  address: string;
  working_hours: string;
  website: string;
  language: string;
}

interface PageSEO {
  id?: string;
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
  language: string;
}

const ContactManagement = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    working_hours: '',
    website: '',
    language: 'ru'
  });

  const [pageSEO, setPageSEO] = useState<PageSEO>({
    page_slug: 'contact',
    page_title: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    h1_tag: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    language: 'ru'
  });

  const [siteContent, setSiteContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const { getContent, updateContent } = useSiteContent();

  useEffect(() => {
    fetchData();
  }, [currentLanguage]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch contact info
      const { data: contactData, error: contactError } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'contact')
        .eq('language', currentLanguage);

      if (contactError) throw contactError;

      // Convert site_content array to object
      const contentMap: Record<string, string> = {};
      contactData?.forEach(item => {
        contentMap[item.key] = item.value;
      });

      setContactInfo({
        email: contentMap.email || '',
        phone: contentMap.phone || '',
        address: contentMap.address || '',
        working_hours: contentMap.working_hours || '',
        website: contentMap.website || '',
        language: currentLanguage
      });

      setSiteContent(contentMap);

      // Fetch page SEO
      const { data: seoData, error: seoError } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_slug', 'contact')
        .eq('language', currentLanguage)
        .maybeSingle();

      if (seoError) throw seoError;

      if (seoData) {
        setPageSEO(seoData);
      } else {
        // Set default SEO values if no data exists
        setPageSEO({
          page_slug: 'contact',
          page_title: currentLanguage === 'en' ? 'Contact Us' : 'Контакты',
          meta_title: currentLanguage === 'en' ? 'Contact Us - Work4Studio' : 'Контакты - Work4Studio',
          meta_description: currentLanguage === 'en' ? 'Get in touch with Work4Studio for your web development needs' : 'Свяжитесь с Work4Studio для обсуждения ваших потребностей в веб-разработке',
          meta_keywords: currentLanguage === 'en' ? 'contact, web development, Work4Studio' : 'контакты, веб-разработка, Work4Studio',
          h1_tag: currentLanguage === 'en' ? 'Contact Us' : 'Свяжитесь с нами',
          canonical_url: '/contact',
          og_title: currentLanguage === 'en' ? 'Contact Us - Work4Studio' : 'Контакты - Work4Studio',
          og_description: currentLanguage === 'en' ? 'Get in touch with Work4Studio for your web development needs' : 'Свяжитесь с Work4Studio для обсуждения ваших потребностей в веб-разработке',
          og_image: '',
          language: currentLanguage
        });
      }

    } catch (error) {
      console.error('Error fetching contact data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные контактов",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactInfoSave = async () => {
    setSaving(true);
    try {
      // Save contact info as site_content
      const contactFields = ['email', 'phone', 'address', 'working_hours', 'website'];
      
      for (const field of contactFields) {
        await updateContent('contact', field, contactInfo[field as keyof ContactInfo] as string, currentLanguage);
      }

      // Save additional site content
      const contentFields = [
        'title', 'subtitle', 'form_title', 'form_subtitle', 
        'info_title', 'cta_title', 'cta_subtitle', 'cta_button'
      ];
      
      for (const field of contentFields) {
        if (siteContent[field]) {
          await updateContent('contact', field, siteContent[field], currentLanguage);
        }
      }

      // Save page SEO
      const { error: seoError } = await supabase
        .from('page_seo')
        .upsert(pageSEO, { onConflict: 'page_slug,language' });

      if (seoError) throw seoError;

      toast({
        title: "Успешно",
        description: "Данные контактов сохранены"
      });

    } catch (error) {
      console.error('Error saving contact data:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные контактов",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const updateContactField = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateSEOField = (field: keyof PageSEO, value: string) => {
    setPageSEO(prev => ({ ...prev, [field]: value }));
  };

  const updateContentField = (key: string, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <Mail className="h-8 w-8" />
            {currentLanguage === 'en' ? 'Contact Page Management' : 'Управление страницей контактов'}
          </h1>
          <p className="text-muted-foreground">
            {currentLanguage === 'en' 
              ? `Edit contact information and page content (${currentLanguage.toUpperCase()})`
              : `Редактирование контактной информации и содержимого страницы (${currentLanguage.toUpperCase()})`
            }
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      <Tabs defaultValue="contact-info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact-info">
            {currentLanguage === 'en' ? 'Contact Information' : 'Контактная информация'}
          </TabsTrigger>
          <TabsTrigger value="page-content">
            {currentLanguage === 'en' ? 'Page Content' : 'Контент страницы'}
          </TabsTrigger>
          <TabsTrigger value="seo">
            {currentLanguage === 'en' ? 'SEO Settings' : 'SEO настройки'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {currentLanguage === 'en' ? 'Contact Information' : 'Контактная информация'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'en' 
                  ? 'Basic contact information for the company'
                  : 'Основная информация для связи с компанией'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    value={contactInfo.email}
                    onChange={(e) => updateContactField('email', e.target.value)}
                    placeholder="contact@work4studio.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {currentLanguage === 'en' ? 'Phone' : 'Телефон'}
                  </Label>
                  <Input
                    value={contactInfo.phone}
                    onChange={(e) => updateContactField('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {currentLanguage === 'en' ? 'Address' : 'Адрес'}
                  </Label>
                  <Textarea
                    value={contactInfo.address}
                    onChange={(e) => updateContactField('address', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Moscow, Example Street, 1' : 'г. Москва, ул. Примерная, д. 1'}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {currentLanguage === 'en' ? 'Working Hours' : 'Часы работы'}
                  </Label>
                  <Textarea
                    value={contactInfo.working_hours}
                    onChange={(e) => updateContactField('working_hours', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Mon-Fri: 9:00-18:00, Sat-Sun: Closed' : 'Пн-Пт: 9:00-18:00, Сб-Вс: выходной'}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  {currentLanguage === 'en' ? 'Website' : 'Веб-сайт'}
                </Label>
                <Input
                  value={contactInfo.website}
                  onChange={(e) => updateContactField('website', e.target.value)}
                  placeholder="https://work4studio.com"
                  type="url"
                />
              </div>

              <Button onClick={handleContactInfoSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentLanguage === 'en' ? 'Saving...' : 'Сохранение...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {currentLanguage === 'en' ? 'Save Contact Info' : 'Сохранить контакты'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="page-content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {currentLanguage === 'en' ? 'Page Content' : 'Контент страницы'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'en' 
                  ? 'Headlines and text content for the contact page'
                  : 'Заголовки и текстовое содержимое страницы контактов'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'Page Title' : 'Заголовок страницы'}</Label>
                  <Input
                    value={siteContent.title || ''}
                    onChange={(e) => updateContentField('title', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Contact Us' : 'Свяжитесь с нами'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'Subtitle' : 'Подзаголовок'}</Label>
                  <Input
                    value={siteContent.subtitle || ''}
                    onChange={(e) => updateContentField('subtitle', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Ready to start your project?' : 'Готовы начать ваш проект?'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{currentLanguage === 'en' ? 'Form Title' : 'Заголовок формы'}</Label>
                <Input
                  value={siteContent.form_title || ''}
                  onChange={(e) => updateContentField('form_title', e.target.value)}
                  placeholder={currentLanguage === 'en' ? 'Send us a message' : 'Отправьте нам сообщение'}
                />
              </div>

              <div className="space-y-2">
                <Label>{currentLanguage === 'en' ? 'Form Subtitle' : 'Подзаголовок формы'}</Label>
                <Textarea
                  value={siteContent.form_subtitle || ''}
                  onChange={(e) => updateContentField('form_subtitle', e.target.value)}
                  placeholder={currentLanguage === 'en' ? 'Tell us about your project and we will get back to you' : 'Расскажите нам о вашем проекте, и мы свяжемся с вами'}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>{currentLanguage === 'en' ? 'Info Block Title' : 'Заголовок блока информации'}</Label>
                <Input
                  value={siteContent.info_title || ''}
                  onChange={(e) => updateContentField('info_title', e.target.value)}
                  placeholder={currentLanguage === 'en' ? 'Contact Information' : 'Контактная информация'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'CTA Title' : 'Заголовок CTA'}</Label>
                  <Input
                    value={siteContent.cta_title || ''}
                    onChange={(e) => updateContentField('cta_title', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Ready to get started?' : 'Готовы начать?'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'CTA Subtitle' : 'Подзаголовок CTA'}</Label>
                  <Input
                    value={siteContent.cta_subtitle || ''}
                    onChange={(e) => updateContentField('cta_subtitle', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Contact us today' : 'Свяжитесь с нами сегодня'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{currentLanguage === 'en' ? 'CTA Button Text' : 'Текст кнопки CTA'}</Label>
                <Input
                  value={siteContent.cta_button || ''}
                  onChange={(e) => updateContentField('cta_button', e.target.value)}
                  placeholder={currentLanguage === 'en' ? 'Get in touch' : 'Связаться'}
                />
              </div>

              <Button onClick={handleContactInfoSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentLanguage === 'en' ? 'Saving...' : 'Сохранение...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {currentLanguage === 'en' ? 'Save Page Content' : 'Сохранить контент'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {currentLanguage === 'en' ? 'SEO Settings' : 'SEO настройки'}
              </CardTitle>
              <CardDescription>
                {currentLanguage === 'en' 
                  ? 'Meta tags and SEO information for the contact page'
                  : 'Мета-теги и SEO информация для страницы контактов'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'Page Title' : 'Заголовок страницы (Title)'}</Label>
                  <Input
                    value={pageSEO.page_title}
                    onChange={(e) => updateSEOField('page_title', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Contact Us' : 'Контакты'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{currentLanguage === 'en' ? 'H1 Tag' : 'H1 тег'}</Label>
                  <Input
                    value={pageSEO.h1_tag}
                    onChange={(e) => updateSEOField('h1_tag', e.target.value)}
                    placeholder={currentLanguage === 'en' ? 'Contact Us' : 'Свяжитесь с нами'}
                  />
                </div>
              </div>

          <div className="space-y-2">
            <Label>Meta Title</Label>
            <Input
              value={pageSEO.meta_title}
              onChange={(e) => updateSEOField('meta_title', e.target.value)}
              placeholder={currentLanguage === 'en' ? 'Contact Us - Work4Studio' : 'Контакты - Work4Studio'}
            />
          </div>

          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea
              value={pageSEO.meta_description}
              onChange={(e) => updateSEOField('meta_description', e.target.value)}
              placeholder={currentLanguage === 'en' ? 'Get in touch with Work4Studio for your web development needs' : 'Свяжитесь с Work4Studio для обсуждения ваших потребностей в веб-разработке'}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Meta Keywords</Label>
            <Input
              value={pageSEO.meta_keywords}
              onChange={(e) => updateSEOField('meta_keywords', e.target.value)}
              placeholder={currentLanguage === 'en' ? 'contact, web development, Work4Studio' : 'контакты, веб-разработка, Work4Studio'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Canonical URL</Label>
              <Input
                value={pageSEO.canonical_url}
                onChange={(e) => updateSEOField('canonical_url', e.target.value)}
                placeholder="/contact"
              />
            </div>
            <div className="space-y-2">
              <Label>OG Image</Label>
              <Input
                value={pageSEO.og_image}
                onChange={(e) => updateSEOField('og_image', e.target.value)}
                placeholder="https://example.com/contact-og.jpg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>OG Title</Label>
            <Input
              value={pageSEO.og_title}
              onChange={(e) => updateSEOField('og_title', e.target.value)}
              placeholder={pageSEO.meta_title}
            />
          </div>

          <div className="space-y-2">
            <Label>OG Description</Label>
            <Textarea
              value={pageSEO.og_description}
              onChange={(e) => updateSEOField('og_description', e.target.value)}
              placeholder={pageSEO.meta_description}
              rows={2}
            />
          </div>
              <Button onClick={handleContactInfoSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentLanguage === 'en' ? 'Saving...' : 'Сохранение...'}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {currentLanguage === 'en' ? 'Save SEO Settings' : 'Сохранить SEO'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactManagement;