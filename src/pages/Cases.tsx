import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Search, 
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  User,
  Star,
  ArrowLeft,
  Eye,
  Target,
  TrendingUp,
  Home
} from 'lucide-react';

interface Case {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  client_name: string;
  project_url: string;
  main_image: string;
  gallery_images: string[];
  technologies: string[];
  category: string;
  project_date: string;
  project_duration: string;
  budget_range: string;
  results: string[];
  is_featured: boolean;
  h1_tag: string;
}

const categoryNames: Record<string, string> = {
  website: 'Веб-сайт',
  ecommerce: 'Интернет-магазин',
  mobile: 'Мобильное приложение',
  landing: 'Лендинг',
  corporate: 'Корпоративный сайт',
  startup: 'Стартап',
  redesign: 'Редизайн'
};

const categoryColors: Record<string, string> = {
  website: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ecommerce: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  mobile: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  landing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  corporate: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  startup: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  redesign: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
};

const Cases = () => {
  const { slug } = useParams();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    console.log('URL slug changed:', slug);
    console.log('Cases loaded:', cases.length);
    
    if (slug && cases.length > 0) {
      const caseItem = cases.find(c => c.slug === slug);
      console.log('Found case:', caseItem?.title);
      setSelectedCase(caseItem || null);
    } else if (!slug) {
      // Если нет slug в URL, показываем список кейсов
      console.log('No slug, showing case list');
      setSelectedCase(null);
    }
  }, [slug, cases]);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching cases:', error);
    } else {
      setCases(data || []);
    }
    setLoading(false);
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || caseItem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredCases = filteredCases.filter(c => c.is_featured);
  const regularCases = filteredCases.filter(c => !c.is_featured);

  const categories = Array.from(new Set(cases.map(c => c.category)));

  if (selectedCase) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      Главная
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/cases">Кейсы</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedCase.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="mb-8">
            <Link 
              to="/cases" 
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к кейсам
            </Link>
            <h1 className="text-4xl font-heading font-bold mb-4">
              {selectedCase.h1_tag || selectedCase.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedCase.client_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(selectedCase.project_date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{selectedCase.project_duration}</span>
              </div>
              {selectedCase.project_url && (
                <a 
                  href={selectedCase.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Посмотреть проект
                </a>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Main Image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedCase.main_image} 
                  alt={selectedCase.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-2xl font-heading font-semibold mb-4">О проекте</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>

              {/* Gallery */}
              {selectedCase.gallery_images.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-semibold">Галерея</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedCase.gallery_images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${selectedCase.title} - изображение ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Project Info Card */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Категория</h3>
                    <Badge className={categoryColors[selectedCase.category] || 'bg-gray-100 text-gray-800'}>
                      {categoryNames[selectedCase.category] || selectedCase.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Технологии</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Бюджет</h3>
                    <p className="text-muted-foreground">{selectedCase.budget_range}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              {selectedCase.results.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Результаты
                    </h3>
                    <div className="space-y-3">
                      {selectedCase.results.map((result, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{result}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Главная
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Кейсы</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Наши работы
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Примеры успешных проектов, которые мы реализовали для наших клиентов
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или клиенту..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
              >
                <option value="all">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryNames[category] || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Cases */}
            {featuredCases.length > 0 && (
              <section>
                <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Избранные проекты
                </h2>
                <div className="grid gap-8 md:grid-cols-2">
                  {featuredCases.map((caseItem) => (
                    <Card key={caseItem.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={caseItem.main_image} 
                          alt={caseItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={categoryColors[caseItem.category] || 'bg-gray-100 text-gray-800'}>
                            {categoryNames[caseItem.category] || caseItem.category}
                          </Badge>
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                            Избранное
                          </Badge>
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-2">{caseItem.title}</h3>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{caseItem.short_description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{caseItem.client_name}</span>
                          <Link to={`/cases/${caseItem.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Смотреть
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Cases */}
            {regularCases.length > 0 && (
              <section>
                <h2 className="text-2xl font-heading font-semibold mb-6">
                  {featuredCases.length > 0 ? 'Другие проекты' : 'Все проекты'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularCases.map((caseItem) => (
                    <Card key={caseItem.id} className="group overflow-hidden hover:shadow-md transition-all duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={caseItem.main_image} 
                          alt={caseItem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={categoryColors[caseItem.category] || 'bg-gray-100 text-gray-800'}>
                            {categoryNames[caseItem.category] || caseItem.category}
                          </Badge>
                        </div>
                        <h3 className="font-heading font-semibold mb-2">{caseItem.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{caseItem.short_description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{caseItem.client_name}</span>
                          <Link to={`/cases/${caseItem.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Кейсы не найдены</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cases;