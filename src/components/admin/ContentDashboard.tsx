import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminLanguage } from '@/contexts/AdminLanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  ChevronRight, 
  Home,
  Briefcase,
  Image,
  Mail,
  Info,
  Plus,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  hasRussian: boolean;
  hasEnglish: boolean;
  type: 'page' | 'service' | 'case' | 'legal';
  slug?: string;
  onClick: () => void;
}

const ContentDashboard = () => {
  const { language } = useAdminLanguage();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    translatedItems: 0,
    missingTranslations: 0
  });

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      // Fetch site content
      const { data: siteContent } = await supabase
        .from('site_content')
        .select('*');

      // Fetch services
      const { data: services } = await supabase
        .from('services')
        .select('*, service_translations(*)');

      // Fetch cases
      const { data: cases } = await supabase
        .from('cases')
        .select('*, case_translations(*)');

      // Fetch legal documents
      const { data: legalDocs } = await supabase
        .from('legal_documents')
        .select('*');
      
      // Fetch legal document translations (simplified for now)
      const legalTranslations: any[] = [];

      const items: ContentItem[] = [];

      // Add main pages
      const mainPages = [
        { slug: 'home', title: 'Главная страница', icon: Home },
        { slug: 'about', title: 'О нас', icon: Info },
        { slug: 'contact', title: 'Контакты', icon: Mail },
        { slug: 'services', title: 'Страница услуг', icon: Briefcase }
      ];

      mainPages.forEach(page => {
        const ruContent = siteContent?.some(c => c.section === page.slug && c.language === 'ru');
        const enContent = siteContent?.some(c => c.section === page.slug && c.language === 'en');
        
        items.push({
          id: `page-${page.slug}`,
          title: page.title,
          description: `Основная страница сайта`,
          icon: page.icon,
          hasRussian: ruContent || false,
          hasEnglish: enContent || false,
          type: 'page',
          slug: page.slug,
          onClick: () => window.location.hash = `page-editor-${page.slug}`
        });
      });

      // Add services
      services?.forEach(service => {
        const hasTranslation = service.service_translations?.some((t: any) => t.language === 'en');
        items.push({
          id: `service-${service.id}`,
          title: service.title,
          description: service.short_description || 'Без описания',
          icon: Briefcase,
          hasRussian: true,
          hasEnglish: hasTranslation || false,
          type: 'service',
          onClick: () => window.location.hash = `service-editor-${service.id}`
        });
      });

      // Add cases
      cases?.forEach(caseItem => {
        const hasTranslation = caseItem.case_translations?.some((t: any) => t.language === 'en');
        items.push({
          id: `case-${caseItem.id}`,
          title: caseItem.title,
          description: caseItem.short_description || 'Без описания',
          icon: Image,
          hasRussian: true,
          hasEnglish: hasTranslation || false,
          type: 'case',
          onClick: () => window.location.hash = `case-editor-${caseItem.id}`
        });
      });

      // Add legal documents
      legalDocs?.forEach(doc => {
        const hasTranslation = legalTranslations?.some((t: any) => t.document_id === doc.id && t.language === 'en');
        items.push({
          id: `legal-${doc.id}`,
          title: doc.title,
          description: doc.type,
          icon: FileText,
          hasRussian: true,
          hasEnglish: hasTranslation || false,
          type: 'legal',
          onClick: () => window.location.hash = `legal-editor-${doc.id}`
        });
      });

      setContentItems(items);

      // Calculate stats
      const total = items.length;
      const translated = items.filter(item => item.hasRussian && item.hasEnglish).length;
      const missing = total - translated;

      setStats({
        totalItems: total,
        translatedItems: translated,
        missingTranslations: missing
      });

    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const getTranslationStatus = (item: ContentItem) => {
    if (item.hasRussian && item.hasEnglish) {
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Полный</Badge>;
    }
    if (item.hasRussian && !item.hasEnglish) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Нет EN</Badge>;
    }
    if (!item.hasRussian && item.hasEnglish) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Нет RU</Badge>;
    }
    return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Пустой</Badge>;
  };

  const filteredItems = contentItems.filter(item => {
    if (language === 'ru') return true;
    return item.hasEnglish || !item.hasRussian; // Show items that have EN or are completely empty
  });

  const groupedItems = {
    pages: filteredItems.filter(item => item.type === 'page'),
    services: filteredItems.filter(item => item.type === 'service'),
    cases: filteredItems.filter(item => item.type === 'case'),
    legal: filteredItems.filter(item => item.type === 'legal'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">
            Управление контентом
          </h1>
          <p className="text-muted-foreground">
            Редактирование контента на {language === 'ru' ? 'русском' : 'английском'} языке
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Активный язык: {language === 'ru' ? 'Русский' : 'English'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Всего элементов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Переведено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.translatedItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Без перевода</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.missingTranslations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Sections */}
      {Object.entries(groupedItems).map(([key, items]) => {
        if (items.length === 0) return null;
        
        const sectionTitles = {
          pages: 'Основные страницы',
          services: 'Услуги',
          cases: 'Кейсы', 
          legal: 'Правовые документы'
        };

        return (
          <div key={key} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{sectionTitles[key as keyof typeof sectionTitles]}</h2>
              {key !== 'pages' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.location.hash = `${key}-create`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={item.onClick}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="flex items-center gap-2">
                          {getTranslationStatus(item)}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                      <CardDescription className="truncate">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Нажмите для редактирования
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContentDashboard;