import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, Save } from 'lucide-react';

interface Service {
  id?: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number | '';
  price_to: number | '';
  features: string[];
  advantages: string[];
  faq: { question: string; answer: string; }[];
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

interface ServiceTranslation {
  title: string;
  description: string;
  short_description: string;
  features: string[];
  advantages: string[];
  faq: { question: string; answer: string; }[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

interface ServiceEditorTabsProps {
  serviceId?: string;
  onBack: () => void;
}

const ServiceEditorTabs = ({ serviceId, onBack }: ServiceEditorTabsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!serviceId);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [formData, setFormData] = useState<Service>({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    price_from: '',
    price_to: '',
    features: [],
    advantages: [],
    faq: [],
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    h1_tag: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: ''
  });

  const [enData, setEnData] = useState<ServiceTranslation>({
    title: '',
    description: '',
    short_description: '',
    features: [],
    advantages: [],
    faq: [],
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    h1_tag: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: ''
  });

  useEffect(() => {
    if (serviceId) {
      fetchService();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const fetchService = async () => {
    if (!serviceId) return;

    try {
      // Fetch base service
      const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .maybeSingle();

      if (error) throw error;

      if (service) {
        setFormData({
          ...service,
          price_from: service.price_from || '',
          price_to: service.price_to || '',
          faq: Array.isArray(service.faq) ? service.faq.map((item: any) => ({
            question: item.question || '',
            answer: item.answer || ''
          })) : []
        });

        // Fetch EN translation
        const { data: translation } = await supabase
          .from('service_translations')
          .select('*')
          .eq('service_id', serviceId)
          .eq('language', 'en')
          .maybeSingle();

        if (translation) {
          setEnData({
            title: translation.title || '',
            description: translation.description || '',
            short_description: translation.short_description || '',
            features: translation.features || [],
            advantages: translation.advantages || [],
            faq: Array.isArray(translation.faq) ? translation.faq.map((item: any) => ({
              question: item.question || '',
              answer: item.answer || ''
            })) : [],
            meta_title: translation.meta_title || '',
            meta_description: translation.meta_description || '',
            meta_keywords: translation.meta_keywords || '',
            h1_tag: translation.h1_tag || '',
            canonical_url: translation.canonical_url || '',
            og_title: translation.og_title || '',
            og_description: translation.og_description || '',
            og_image: translation.og_image || ''
          });
        }
      }
    } catch (error: any) {
      console.error('Error fetching service:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить услугу',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (match) => {
        const map: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ы': 'y', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      let savedId = serviceId;

      if (serviceId) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('services')
          .update({
            ...formData,
            price_from: formData.price_from ? Number(formData.price_from) : null,
            price_to: formData.price_to ? Number(formData.price_to) : null,
          })
          .eq('id', serviceId);

        if (updateError) throw updateError;
      } else {
        // Create new service
        const { data: inserted, error: insertError } = await supabase
          .from('services')
          .insert([{
            ...formData,
            price_from: formData.price_from ? Number(formData.price_from) : null,
            price_to: formData.price_to ? Number(formData.price_to) : null,
          }])
          .select('id')
          .single();

        if (insertError) throw insertError;
        savedId = inserted.id;
      }

      // Save EN translation if provided
      const hasEnTranslation = enData.title || enData.description || enData.short_description;
      
      if (savedId && hasEnTranslation) {
        const { error: translationError } = await supabase
          .from('service_translations')
          .upsert({
            service_id: savedId,
            language: 'en',
            title: enData.title || formData.title,
            description: enData.description || formData.description,
            short_description: enData.short_description || formData.short_description,
            features: enData.features,
            advantages: enData.advantages,
            faq: enData.faq,
            meta_title: enData.meta_title,
            meta_description: enData.meta_description,
            meta_keywords: enData.meta_keywords,
            h1_tag: enData.h1_tag,
            canonical_url: enData.canonical_url,
            og_title: enData.og_title,
            og_description: enData.og_description,
            og_image: enData.og_image
          }, {
            onConflict: 'service_id,language'
          });

        if (translationError) throw translationError;
      }

      toast({
        title: 'Успешно',
        description: serviceId ? 'Услуга обновлена' : 'Услуга создана',
      });
      
      onBack();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить услугу',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Service, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title (only for new items)
    if (field === 'title' && !serviceId) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const updateEnField = (field: keyof ServiceTranslation, value: any) => {
    setEnData(prev => ({ ...prev, [field]: value }));
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к услугам
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {serviceId ? 'Редактирование услуги' : 'Создание услуги'}
            </h1>
            <p className="text-muted-foreground">
              {serviceId ? `Редактирование: ${formData.title}` : 'Добавление новой услуги'}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="ru">RU (Русский)</TabsTrigger>
          <TabsTrigger value="en">EN (English)</TabsTrigger>
        </TabsList>

        <TabsContent value="ru" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация (RU)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Название услуги *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Корпоративный сайт"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="corporate"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Краткое описание</Label>
                <Input
                  value={formData.short_description}
                  onChange={(e) => updateField('short_description', e.target.value)}
                  placeholder="Профессиональная разработка корпоративного сайта"
                />
              </div>

              <div className="space-y-2">
                <Label>Полное описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Детальное описание услуги..."
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Цена от ($)</Label>
                  <Input
                    type="number"
                    value={formData.price_from}
                    onChange={(e) => updateField('price_from', e.target.value)}
                    placeholder="2000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена до ($)</Label>
                  <Input
                    type="number"
                    value={formData.price_to}
                    onChange={(e) => updateField('price_to', e.target.value)}
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => updateField('is_active', checked)}
                    />
                    <Label>Активная услуга</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Порядок сортировки</Label>
                  <Input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => updateField('sort_order', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information (EN)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Service Title</Label>
                <Input
                  value={enData.title}
                  onChange={(e) => updateEnField('title', e.target.value)}
                  placeholder="Corporate Website"
                />
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input
                  value={enData.short_description}
                  onChange={(e) => updateEnField('short_description', e.target.value)}
                  placeholder="Professional corporate website development"
                />
              </div>

              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  value={enData.description}
                  onChange={(e) => updateEnField('description', e.target.value)}
                  placeholder="Detailed service description..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceEditorTabs;