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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon, Save } from 'lucide-react';

interface CaseData {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  client_name: string;
  project_url: string;
  main_image: string;
  gallery_images: string[];
  technologies: string[];
  category: 'website' | 'ecommerce' | 'mobile' | 'landing' | 'corporate' | 'startup' | 'redesign' | 'crm';
  project_date: string;
  project_duration: string;
  budget_range: string;
  results: string[];
  is_featured: boolean;
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

interface CaseTranslation {
  title: string;
  short_description: string;
  description: string;
  results: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  h1_tag: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
}

interface CaseEditorTabsProps {
  caseId?: string;
  onBack: () => void;
}

const categoryOptions = [
  { value: 'website', label: 'Веб-сайт' },
  { value: 'ecommerce', label: 'Интернет-магазин' },
  { value: 'mobile', label: 'Мобильное приложение' },
  { value: 'landing', label: 'Лендинг' },
  { value: 'corporate', label: 'Корпоративный сайт' },
  { value: 'startup', label: 'Стартап' },
  { value: 'redesign', label: 'Редизайн' },
  { value: 'crm', label: 'CRM' }
];

const CaseEditorTabs = ({ caseId, onBack }: CaseEditorTabsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!caseId);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('ru');

  const [formData, setFormData] = useState<CaseData>({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    client_name: '',
    project_url: '',
    main_image: '',
    gallery_images: [],
    technologies: [],
    category: 'website',
    project_date: new Date().toISOString().split('T')[0],
    project_duration: '',
    budget_range: '',
    results: [],
    is_featured: false,
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

  const [enData, setEnData] = useState<CaseTranslation>({
    title: '',
    short_description: '',
    description: '',
    results: [],
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
    if (caseId) {
      fetchCase();
    } else {
      setLoading(false);
    }
  }, [caseId]);

  const fetchCase = async () => {
    if (!caseId) return;

    try {
      // Fetch base case
      const { data: caseData, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .maybeSingle();

      if (error) throw error;

      if (caseData) {
        setFormData({
          ...caseData,
          project_date: caseData.project_date || new Date().toISOString().split('T')[0]
        });

        // Fetch EN translation
        const { data: translation } = await supabase
          .from('case_translations')
          .select('*')
          .eq('case_id', caseId)
          .eq('language', 'en')
          .maybeSingle();

        if (translation) {
          setEnData({
            title: translation.title || '',
            short_description: translation.short_description || '',
            description: translation.description || '',
            results: translation.results || [],
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
      console.error('Error fetching case:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить кейс',
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
      let savedId = caseId;

      if (caseId) {
        // Update existing case
        const { error: updateError } = await supabase
          .from('cases')
          .update(formData)
          .eq('id', caseId);

        if (updateError) throw updateError;
      } else {
        // Create new case
        const { data: inserted, error: insertError } = await supabase
          .from('cases')
          .insert([formData])
          .select('id')
          .single();

        if (insertError) throw insertError;
        savedId = inserted.id;
      }

      // Save EN translation if provided
      const hasEnTranslation = enData.title || enData.description || enData.short_description;
      
      if (savedId && hasEnTranslation) {
        const { error: translationError } = await supabase
          .from('case_translations')
          .upsert({
            case_id: savedId,
            language: 'en',
            title: enData.title || formData.title,
            short_description: enData.short_description,
            description: enData.description,
            results: enData.results,
            meta_title: enData.meta_title,
            meta_description: enData.meta_description,
            meta_keywords: enData.meta_keywords,
            h1_tag: enData.h1_tag,
            canonical_url: enData.canonical_url,
            og_title: enData.og_title,
            og_description: enData.og_description,
            og_image: enData.og_image
          }, {
            onConflict: 'case_id,language'
          });

        if (translationError) throw translationError;
      }

      toast({
        title: 'Успешно',
        description: caseId ? 'Кейс обновлен' : 'Кейс создан',
      });
      
      onBack();
    } catch (error: any) {
      console.error('Error saving case:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить кейс',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CaseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title (only for new items)
    if (field === 'title' && !caseId) {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const updateEnField = (field: keyof CaseTranslation, value: any) => {
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
            Назад к кейсам
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold">
              {caseId ? 'Редактирование кейса' : 'Создание кейса'}
            </h1>
            <p className="text-muted-foreground">
              {caseId ? `Редактирование: ${formData.title}` : 'Добавление нового кейса в портфолио'}
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
                  <Label>Название кейса *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="Корпоративный сайт для IT-компании"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    placeholder="corporate-it-website"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Клиент</Label>
                  <Input
                    value={formData.client_name}
                    onChange={(e) => updateField('client_name', e.target.value)}
                    placeholder="TechSolutions Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Краткое описание</Label>
                <Input
                  value={formData.short_description}
                  onChange={(e) => updateField('short_description', e.target.value)}
                  placeholder="Современный корпоративный сайт с интерактивными элементами"
                />
              </div>

              <div className="space-y-2">
                <Label>Полное описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Детальное описание проекта, задач и решений..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Ссылка на проект</Label>
                <Input
                  value={formData.project_url}
                  onChange={(e) => updateField('project_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label>H1 заголовок</Label>
                <Input
                  value={formData.h1_tag}
                  onChange={(e) => updateField('h1_tag', e.target.value)}
                  placeholder="H1 заголовок страницы"
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

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  placeholder="Описание для поисковиков"
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Настройки проекта (общие для всех языков)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Дата проекта</Label>
                  <Input
                    type="date"
                    value={formData.project_date}
                    onChange={(e) => updateField('project_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Длительность</Label>
                  <Input
                    value={formData.project_duration}
                    onChange={(e) => updateField('project_duration', e.target.value)}
                    placeholder="2 месяца"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Бюджет</Label>
                  <Input
                    value={formData.budget_range}
                    onChange={(e) => updateField('budget_range', e.target.value)}
                    placeholder="300 000 - 500 000 ₽"
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
                    <Label>Показывать кейс</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => updateField('is_featured', checked)}
                    />
                    <Label>Избранный кейс</Label>
                  </div>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Case Title *</Label>
                  <Input
                    value={enData.title}
                    onChange={(e) => updateEnField('title', e.target.value)}
                    placeholder="Corporate website for IT company"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug (shared)</Label>
                  <Input
                    value={formData.slug}
                    disabled
                    placeholder="Управляется в RU версии"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short Description</Label>
                <Input
                  value={enData.short_description}
                  onChange={(e) => updateEnField('short_description', e.target.value)}
                  placeholder="Modern corporate website with interactive elements"
                />
              </div>

              <div className="space-y-2">
                <Label>Full Description</Label>
                <Textarea
                  value={enData.description}
                  onChange={(e) => updateEnField('description', e.target.value)}
                  placeholder="Detailed project description, tasks and solutions..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>H1 Tag</Label>
                <Input
                  value={enData.h1_tag}
                  onChange={(e) => updateEnField('h1_tag', e.target.value)}
                  placeholder="Page H1 heading"
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={enData.meta_title}
                  onChange={(e) => updateEnField('meta_title', e.target.value)}
                  placeholder="SEO title"
                />
              </div>

              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={enData.meta_description}
                  onChange={(e) => updateEnField('meta_description', e.target.value)}
                  placeholder="SEO description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input
                  value={enData.meta_keywords}
                  onChange={(e) => updateEnField('meta_keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseEditorTabs;