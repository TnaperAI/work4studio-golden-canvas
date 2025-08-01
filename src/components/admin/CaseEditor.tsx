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
import { ArrowLeft, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';

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

interface CaseEditorProps {
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

const CaseEditor = ({ caseId, onBack }: CaseEditorProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(!!caseId);
  const [saving, setSaving] = useState(false);
  const [newTechnology, setNewTechnology] = useState('');
  const [newResult, setNewResult] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  
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

  useEffect(() => {
    if (caseId) {
      fetchCase();
    } else {
      setLoading(false);
    }
  }, [caseId]);

  const fetchCase = async () => {
    if (!caseId) return;

    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить кейс',
        variant: 'destructive',
      });
    } else if (data) {
      setFormData({
        ...data,
        project_date: data.project_date || new Date().toISOString().split('T')[0]
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

    let error;
    if (caseId) {
      const { error: updateError } = await supabase
        .from('cases')
        .update(formData)
        .eq('id', caseId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('cases')
        .insert(formData);
      error = insertError;
    }

    if (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить кейс',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Успешно',
        description: caseId ? 'Кейс обновлен' : 'Кейс создан',
      });
      onBack();
    }

    setSaving(false);
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addResult = () => {
    if (newResult.trim()) {
      setFormData(prev => ({
        ...prev,
        results: [...prev.results, newResult.trim()]
      }));
      setNewResult('');
    }
  };

  const removeResult = (index: number) => {
    setFormData(prev => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== index)
    }));
  };

  const addGalleryImage = () => {
    if (newGalleryImage.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, newGalleryImage.trim()]
      }));
      setNewGalleryImage('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('case-images')
      .upload(fileName, file);
      
    if (error) {
      toast({
        title: 'Ошибка загрузки',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('case-images')
      .getPublicUrl(fileName);
      
    return publicUrl;
  };

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Неподдерживаемый формат',
        description: 'Поддерживаются только JPEG, PNG и WebP',
        variant: 'destructive',
      });
      return;
    }
    
    setUploadingMainImage(true);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      updateField('main_image', imageUrl);
    }
    setUploadingMainImage(false);
    event.target.value = ''; // Reset input
  };

  const handleGalleryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Неподдерживаемый формат',
        description: 'Поддерживаются только JPEG, PNG и WebP',
        variant: 'destructive',
      });
      return;
    }
    
    setUploadingGalleryImage(true);
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, imageUrl]
      }));
    }
    setUploadingGalleryImage(false);
    event.target.value = ''; // Reset input
  };

  const updateField = (field: keyof CaseData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !caseId) {
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

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="media">Медиа</TabsTrigger>
          <TabsTrigger value="details">Детали</TabsTrigger>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Изображения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Главное изображение</Label>
                
                {/* Upload button */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="main-image-upload"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('main-image-upload')?.click()}
                    disabled={uploadingMainImage}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingMainImage ? 'Загрузка...' : 'Загрузить файл'}
                  </Button>
                  <span className="text-sm text-muted-foreground self-center">
                    JPEG, PNG, WebP
                  </span>
                </div>

                {/* Manual URL input */}
                <div className="space-y-2">
                  <Label className="text-sm">или введите URL</Label>
                  <Input
                    value={formData.main_image}
                    onChange={(e) => updateField('main_image', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Preview */}
                {formData.main_image && (
                  <div className="mt-2">
                    <img 
                      src={formData.main_image} 
                      alt="Предпросмотр главного изображения"
                      className="w-48 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label>Галерея изображений</Label>
                
                {/* Upload button for gallery */}
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="gallery-image-upload"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleGalleryImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('gallery-image-upload')?.click()}
                    disabled={uploadingGalleryImage}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingGalleryImage ? 'Загрузка...' : 'Добавить файл'}
                  </Button>
                  <span className="text-sm text-muted-foreground self-center">
                    JPEG, PNG, WebP
                  </span>
                </div>

                {/* Manual URL input for gallery */}
                <div className="flex gap-2">
                  <Input
                    value={newGalleryImage}
                    onChange={(e) => setNewGalleryImage(e.target.value)}
                    placeholder="или введите URL изображения..."
                    onKeyPress={(e) => e.key === 'Enter' && addGalleryImage()}
                  />
                  <Button type="button" onClick={addGalleryImage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Gallery grid */}
                {formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {formData.gallery_images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Галерея ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border hover:opacity-75 transition-opacity"
                        />
                        <button 
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Детали проекта</CardTitle>
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

              <div className="space-y-2">
                <Label>Технологии</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Добавить технологию..."
                    onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                  />
                  <Button type="button" onClick={addTechnology}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button onClick={() => removeTechnology(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Результаты проекта</Label>
                <div className="flex gap-2">
                  <Input
                    value={newResult}
                    onChange={(e) => setNewResult(e.target.value)}
                    placeholder="Добавить результат..."
                    onKeyPress={(e) => e.key === 'Enter' && addResult()}
                  />
                  <Button type="button" onClick={addResult}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-2">
                  {formData.results.map((result, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <span className="text-sm flex-1">{result}</span>
                      <button onClick={() => removeResult(index)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
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
                    placeholder="https://site.com/cases/case-slug"
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
                <Label>Показывать кейс на сайте</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => updateField('is_featured', checked)}
                />
                <Label>Избранный кейс</Label>
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

export default CaseEditor;