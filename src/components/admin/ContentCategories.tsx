import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ServicesManagement from './ServicesManagement';
import ServiceEditor from './ServiceEditor';
import { 
  FileText, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  Briefcase,
  Home,
  Mail,
  Info
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  pages: CategoryPage[];
}

interface CategoryPage {
  slug: string;
  title: string;
  h1?: string;
}

interface ContentCategoriesProps {
  onPageSelect: (pageSlug: string) => void;
}

const ContentCategories = ({ onPageSelect }: ContentCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [showServiceEditor, setShowServiceEditor] = useState(false);

  const categories: Category[] = [
    {
      id: 'main',
      name: 'Основные страницы',
      description: 'Главная, контакты и общая информация',
      icon: Home,
      pages: [
        { slug: 'home', title: 'Главная страница', h1: 'Добро пожаловать в Work4Studio' },
        { slug: 'contact', title: 'Контакты', h1: 'Связаться с нами' },
        { slug: 'about', title: 'О нас', h1: 'О компании' }
      ]
    },
    {
      id: 'services',
      name: 'Услуги',
      description: 'Все виды услуг и их описания',
      icon: Briefcase,
      pages: [
        { slug: 'services', title: 'Общая страница услуг', h1: 'Наши услуги' },
        { slug: 'services/corporate', title: 'Корпоративный сайт', h1: 'Корпоративный сайт - Профессиональная разработка' },
        { slug: 'services/ecommerce', title: 'Интернет-магазин', h1: 'Интернет-магазин - Каталог с корзиной' },
        { slug: 'services/franchise', title: 'Сайт под франшизу', h1: 'Сайт под франшизу' },
        { slug: 'services/lending', title: 'Лендинг', h1: 'Лендинг' },
        { slug: 'services/mvp', title: 'MVP / Startup-сайт', h1: 'MVP / Startup-сайт' }
      ]
    },
    {
      id: 'portfolio',
      name: 'Портфолио',
      description: 'Кейсы и примеры работ',
      icon: FileText,
      pages: [
        { slug: 'cases', title: 'Кейсы', h1: 'Наши работы' }
      ]
    }
  ];

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  // Handle service management
  const handleServiceEdit = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setShowServiceEditor(true);
  };

  const handleServiceCreate = () => {
    setSelectedServiceId(null);
    setShowServiceEditor(true);
  };

  const handleBackFromServiceEditor = () => {
    setShowServiceEditor(false);
    setSelectedServiceId(null);
  };

  // Show service editor
  if (showServiceEditor) {
    return (
      <ServiceEditor 
        serviceId={selectedServiceId || undefined}
        onBack={handleBackFromServiceEditor}
      />
    );
  }

  // Show services management
  if (selectedCategory === 'services') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCategory(null)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к категориям
          </Button>
        </div>

        <ServicesManagement 
          onServiceEdit={handleServiceEdit}
          onServiceCreate={handleServiceCreate}
        />
      </div>
    );
  }

  if (selectedCategory && selectedCategoryData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCategory(null)}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к категориям
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
            <selectedCategoryData.icon className="h-8 w-8" />
            {selectedCategoryData.name}
          </h1>
          <p className="text-muted-foreground">
            {selectedCategoryData.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {selectedCategoryData.pages.map((page) => (
            <Card 
              key={page.slug} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onPageSelect(page.slug)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription>
                  Slug: /{page.slug}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">H1:</span>
                    <p className="text-muted-foreground truncate">
                      {page.h1 || 'Не задано'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Управление контентом</h1>
        <p className="text-muted-foreground">
          Выберите категорию для редактирования контента и SEO
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-6 w-6 text-primary" />
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription>
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {category.pages.length} страниц{category.pages.length === 1 ? 'а' : ''}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Общие действия
          </CardTitle>
          <CardDescription>
            Дополнительные возможности управления контентом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              Создать новую категорию
            </Button>
            <Button variant="outline">
              Экспорт всего контента
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

export default ContentCategories;