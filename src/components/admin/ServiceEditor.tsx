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
import { ArrowLeft, Plus, X } from 'lucide-react';

interface Service {
  id?: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_from: number | '';
  price_to: number | '';
  features: string[];
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

interface ServiceEditorProps {
  serviceId?: string;
  onBack: () => void;
}

const ServiceEditor = ({ serviceId, onBack }: ServiceEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!serviceId);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  
  const [formData, setFormData] = useState<Service>({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    price_from: '',
    price_to: '',
    features: [],
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

  useEffect(() => {
    if (serviceId) {
      fetchService();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

  const fetchService = async () => {
    if (!serviceId) return;

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить услугу',
        variant: 'destructive',
      });
    } else if (data) {
      setFormData({
        ...data,
        price_from: data.price_from || '',
        price_to: data.price_to || '',
        faq: Array.isArray(data.faq) ? data.faq.map((item: any) => ({
          question: item.question || '',
          answer: item.answer || ''
        })) : []
      });
    }
    setLoading(false);
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

    const dataToSave = {
      ...formData,
      price_from: formData.price_from ? Number(formData.price_from) : null,
      price_to: formData.price_to ? Number(formData.price_to) : null,
    };

    let error;
    if (serviceId) {
      const { error: updateError } = await supabase
        .from('services')
        .update(dataToSave)
        .eq('id', serviceId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('services')
        .insert([dataToSave]);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить услугу',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: serviceId ? 'Услуга обновлена' : 'Услуга создана',
      });
      onBack();
    }

    setSaving(false);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    if (newFaqQuestion.trim() && newFaqAnswer.trim()) {
      setFormData(prev => ({
        ...prev,
        faq: [...prev.faq, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]
      }));
      setNewFaqQuestion('');
      setNewFaqAnswer('');
    }
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: keyof Service, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !serviceId) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
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

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
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

              <div className="space-y-2">
                <Label>Особенности услуги</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Добавить особенность..."
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button onClick={() => removeFeature(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>FAQ для детальной страницы</Label>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Input
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      placeholder="Вопрос..."
                    />
                    <Textarea
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      placeholder="Ответ..."
                      rows={2}
                    />
                    <Button type="button" onClick={addFaq} className="self-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить FAQ
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.faq.map((faqItem, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-2">{faqItem.question}</h4>
                            <p className="text-muted-foreground text-sm">{faqItem.answer}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFaq(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
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
                    value={formData.h1_tag}
                    onChange={(e) => updateField('h1_tag', e.target.value)}
                    placeholder="Основной H1 заголовок страницы"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={formData.meta_title}
                    onChange={(e) => updateField('meta_title', e.target.value)}
                    placeholder="Title для поисковиков"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={formData.meta_description}
                    onChange={(e) => updateField('meta_description', e.target.value)}
                    placeholder="Описание страницы для поисковиков"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ключевые слова</Label>
                  <Input
                    value={formData.meta_keywords}
                    onChange={(e) => updateField('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Canonical URL</Label>
                  <Input
                    value={formData.canonical_url}
                    onChange={(e) => updateField('canonical_url', e.target.value)}
                    placeholder="https://site.com/services/corporate"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input
                    value={formData.og_title}
                    onChange={(e) => updateField('og_title', e.target.value)}
                    placeholder="Заголовок для соцсетей"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <Input
                    value={formData.og_image}
                    onChange={(e) => updateField('og_image', e.target.value)}
                    placeholder="URL изображения для соцсетей"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>OG Description</Label>
                  <Textarea
                    value={formData.og_description}
                    onChange={(e) => updateField('og_description', e.target.value)}
                    placeholder="Описание для соцсетей"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки отображения</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => updateField('is_active', checked)}
                />
                <Label>Показывать услугу на сайте</Label>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onBack}>
          Отмена
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </div>
  );
};

export default ServiceEditor;