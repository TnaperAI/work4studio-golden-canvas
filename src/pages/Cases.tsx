import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import ContactFormModal from '@/components/ContactFormModal';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
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
  sort_order: number;
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
}

interface PageSEO {
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

const categoryNamesMap: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    website: 'Веб-сайт',
    ecommerce: 'Интернет-магазин',
    mobile: 'Мобильное приложение',
    landing: 'Лендинг',
    corporate: 'Корпоративный сайт',
    startup: 'Стартап',
    redesign: 'Редизайн',
    crm: 'CRM'
  },
  en: {
    website: 'Website',
    ecommerce: 'E-commerce',
    mobile: 'Mobile app',
    landing: 'Landing page',
    corporate: 'Corporate website',
    startup: 'Startup',
    redesign: 'Redesign',
    crm: 'CRM'
  }
};

const getCategoryName = (category: string, lang: 'ru' | 'en') =>
  categoryNamesMap[lang]?.[category] || category;

const categoryColors: Record<string, string> = {
  website: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  ecommerce: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  mobile: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  landing: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  corporate: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  startup: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  redesign: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  crm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300'
};

const i18n: Record<'ru' | 'en', Record<string, string>> = {
  ru: {
    home: 'Главная',
    cases: 'Кейсы',
    backToCases: 'Вернуться к кейсам',
    viewProject: 'Посмотреть проект',
    about: 'О проекте',
    gallery: 'Галерея',
    category: 'Категория',
    technologies: 'Технологии',
    budget: 'Бюджет',
    results: 'Результаты',
    allProjects: 'Все проекты',
    view: 'Смотреть',
    notFoundInCategory: 'Проекты в этой категории не найдены',
    featured: 'Избранное',
    heroLine1: 'Наши',
    heroLine2: 'работы',
    heroSubtitle: 'Примеры успешных проектов, которые приносят реальные результаты нашим клиентам',
    image: 'изображение'
  },
  en: {
    home: 'Home',
    cases: 'Cases',
    backToCases: 'Back to cases',
    viewProject: 'View project',
    about: 'About the project',
    gallery: 'Gallery',
    category: 'Category',
    technologies: 'Technologies',
    budget: 'Budget',
    results: 'Results',
    allProjects: 'All projects',
    view: 'View',
    notFoundInCategory: 'No projects found in this category',
    featured: 'Featured',
    heroLine1: 'Our',
    heroLine2: 'work',
    heroSubtitle: 'Examples of successful projects that deliver real results for our clients',
    image: 'image'
  }
};

const Cases = () => {
  const { language } = useLanguage();
  const { slug } = useParams();
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showContactForm, setShowContactForm] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [galleryTitle, setGalleryTitle] = useState('');
  
  useScrollAnimation();

  useEffect(() => {
    // Очищаем состояние при изменении slug или языка
    console.log('🔄 Cases useEffect triggered - slug:', slug, 'language:', language);
    if (!slug) {
      setSelectedCase(null);
      setLoading(true);
      setCases([]);
    }
    fetchCasesAndSEO();
  }, [slug, language]);

  const fetchCasesAndSEO = async () => {
    console.log('🚀 fetchCasesAndSEO started for language:', language);
    try {
      // Fetch cases
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching cases:', error);
      } else {
        let items = data || [];
        if (language === 'en' && items.length) {
          const ids = items.map(c => c.id);
          const { data: tr } = await (supabase as any)
            .from('case_translations')
            .select('case_id,title,short_description,description,results,h1_tag,meta_title,meta_description,og_title,og_description,og_image,canonical_url')
            .eq('language', 'en')
            .in('case_id', ids);
          const map = new Map((tr || []).map((t: any) => [t.case_id, t]));
          items = items.map((c: any) => {
            const t: any = map.get(c.id);
            if (!t) return c;
            return {
              ...c,
              title: t.title || c.title,
              short_description: t.short_description || c.short_description,
              description: t.description || c.description,
              results: t.results || c.results,
              h1_tag: t.h1_tag || c.h1_tag,
              meta_title: t.meta_title || c.meta_title,
              meta_description: t.meta_description || c.meta_description,
              og_title: t.og_title || c.og_title,
              og_description: t.og_description || c.og_description,
              og_image: t.og_image || c.og_image,
              canonical_url: t.canonical_url || c.canonical_url,
            };
          });
        }
        setCases(items);
      }

      // Fetch SEO data
      console.log('🔍 Fetching Cases SEO for language:', language);
      const { data: seoData, error: seoError } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_slug', 'cases')
        .eq('language', language)
        .maybeSingle();

      if (seoError) {
        console.error('❌ Cases SEO error:', seoError);
      } else {
        console.log('✅ Cases SEO data loaded:', seoData);
        setPageSEO(seoData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обновляем SEO теги когда загружаются данные или меняется выбранный кейс
  useEffect(() => {
    console.log('🎯 Cases SEO - selectedCase:', selectedCase?.title, 'pageSEO:', pageSEO?.og_title);
    // Определяем какие SEO данные использовать
    const seoData = selectedCase ? {
      page_title: selectedCase.meta_title || selectedCase.title,
      meta_description: selectedCase.meta_description || selectedCase.short_description,
      meta_keywords: '', // Кейсы обычно не используют keywords
      og_title: selectedCase.og_title || selectedCase.title,
      og_description: selectedCase.og_description || selectedCase.short_description,
      og_image: selectedCase.og_image || selectedCase.main_image,
      canonical_url: selectedCase.canonical_url || `${window.location.origin}/cases/${selectedCase.slug}`
    } : pageSEO;

    if (seoData) {
      // Обновляем title
      if (seoData.page_title) {
        document.title = seoData.page_title;
      }

      // Обновляем meta теги
      const updateMetaTag = (name: string, content: string) => {
        if (!content) return;
        // Удаляем существующий тег
        const existing = document.querySelector(`meta[name="${name}"]`);
        if (existing) existing.remove();
        
        // Создаем новый тег
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
        console.log(`🏷️ Updated meta[name="${name}"]="${content}"`);
      };

      const updatePropertyTag = (property: string, content: string) => {
        if (!content) return;
        // Удаляем существующий тег
        const existing = document.querySelector(`meta[property="${property}"]`);
        if (existing) existing.remove();
        
        // Создаем новый тег
        const meta = document.createElement('meta');
        meta.setAttribute('property', property);
        meta.content = content;
        document.head.appendChild(meta);
        console.log(`🏷️ Updated meta[property="${property}"]="${content}"`);
      };

      // Обновляем canonical URL
      if (seoData.canonical_url) {
        const existing = document.querySelector('link[rel="canonical"]');
        if (existing) existing.remove();
        
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = seoData.canonical_url;
        document.head.appendChild(canonical);
        console.log(`🔗 Updated canonical="${seoData.canonical_url}"`);
      }

      console.log('🔧 Applying SEO data:', seoData);
      // Устанавливаем мета теги
      updateMetaTag('description', seoData.meta_description);
      if (seoData.meta_keywords) {
        updateMetaTag('keywords', seoData.meta_keywords);
      }
      updatePropertyTag('og:title', seoData.og_title);
      updatePropertyTag('og:description', seoData.og_description);
      updatePropertyTag('og:image', seoData.og_image);
      updatePropertyTag('og:type', selectedCase ? 'article' : 'website');
      
      // Добавляем URL для Open Graph
      updatePropertyTag('og:url', window.location.href);
    }
  }, [pageSEO, selectedCase]);

  // Перезапускаем анимацию скролла после загрузки данных
  useEffect(() => {
    if (!loading) {
      // Даем время DOM обновиться, затем повторно запускаем анимацию
      setTimeout(() => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
          el.classList.add('in-view');
        });
      }, 100);
    }
  }, [loading]);

  useEffect(() => {
    if (slug && cases.length > 0) {
      const caseItem = cases.find(c => c.slug === slug);
      setSelectedCase(caseItem || null);
    } else if (!slug) {
      setSelectedCase(null);
    }
  }, [slug, cases]);

  const categories = Array.from(new Set(cases.map(c => c.category)));

  const filteredCases = cases.filter(caseItem => {
    const matchesCategory = selectedCategory === 'all' || caseItem.category === selectedCategory;
    return matchesCategory;
  }).sort((a, b) => {
    // Сначала избранные проекты
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    // Затем по sort_order
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const featuredCases = filteredCases.filter(c => c.is_featured);
  const regularCases = filteredCases.filter(c => !c.is_featured);

  const openGallery = (images: string[], startIndex: number, title: string) => {
    setGalleryImages(images);
    setGalleryStartIndex(startIndex);
    setGalleryTitle(title);
    setGalleryOpen(true);
  };

  if (selectedCase) {
    return (
      <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
        <Header />
        
        {/* Breadcrumb */}
        <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
          <div className="container-custom">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">{i18n[language].home}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/cases">{i18n[language].cases}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selectedCase.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg animate-pulse-slow"></div>
          </div>
          <div className="container-custom relative z-10">
            <div className="max-w-none">
              <Link 
                to="/cases" 
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 text-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-3" />
                {i18n[language].backToCases}
              </Link>
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {selectedCase.h1_tag || selectedCase.title}
                  </span>
                </h1>
                <div className="flex flex-wrap items-center gap-8 text-muted-foreground mb-12">
                  <div className="flex items-center gap-3 text-lg bg-card border border-border px-6 py-3 rounded-2xl">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedCase.client_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg bg-card border border-border px-6 py-3 rounded-2xl">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">{new Date(selectedCase.project_date).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-lg bg-card border border-border px-6 py-3 rounded-2xl">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedCase.project_duration}</span>
                  </div>
                  {selectedCase.project_url && (
                    <a 
                      href={selectedCase.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-lg bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span className="font-medium">{i18n[language].viewProject}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="container-custom py-8">

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-12">
              {/* Main Image */}
              <div className="aspect-video rounded-3xl overflow-hidden group cursor-pointer" onClick={() => openGallery([selectedCase.main_image, ...selectedCase.gallery_images], 0, selectedCase.title)}>
                <img 
                  src={selectedCase.main_image} 
                  alt={selectedCase.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-3xl p-8">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {i18n[language].about}
                  </span>
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {selectedCase.description}
                </p>
              </div>

              {/* Gallery */}
              {selectedCase.gallery_images.length > 0 && (
                <div className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold">
                    <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {i18n[language].gallery}
                    </span>
                  </h2>
                   <div className="grid gap-6 md:grid-cols-2">
                     {selectedCase.gallery_images.map((image, index) => (
                       <div 
                         key={index} 
                         className="aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                         onClick={() => openGallery([selectedCase.main_image, ...selectedCase.gallery_images], index + 1, selectedCase.title)}
                       >
                         <img 
                           src={image} 
                           alt={`${selectedCase.title} - ${i18n[language].image} ${index + 1}`}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         />
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Project Info Card */}
              <div className="bg-card border border-border rounded-3xl p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-4">{i18n[language].category}</h3>
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm px-4 py-2">
                      {getCategoryName(selectedCase.category, language)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-bold mb-4">{i18n[language].technologies}</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedCase.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                    <div>
                      <h3 className="text-xl font-heading font-bold mb-4">{i18n[language].budget}</h3>
                      <p className="text-muted-foreground text-lg font-medium">{selectedCase.budget_range}</p>
                    </div>
                </div>
              </div>

              {/* Results Card */}
              {selectedCase.results.length > 0 && (
                <div className="bg-card border border-border rounded-3xl p-8">
                  <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {i18n[language].results}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {selectedCase.results.map((result, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        
        
        <Footer />
        
        <ContactFormModal 
          isOpen={showContactForm} 
          onClose={() => setShowContactForm(false)} 
          source="case_detail_page"
        />
        
        <ImageGalleryModal
          images={galleryImages}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={galleryStartIndex}
          title={galleryTitle}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container-custom">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{i18n[language].home}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{i18n[language].cases}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {i18n[language].heroLine1}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                {i18n[language].heroLine2}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              {i18n[language].heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      <main className="container-custom py-8">

        {/* Category Tabs */}
        {!loading && cases.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transform scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:scale-105'
                }`}
              >
                {i18n[language].allProjects}
              </button>
              {categories.filter(category => category).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transform scale-105'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:scale-105'
                  }`}
                >
                  {getCategoryName(category, language)}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Show all filtered cases in one grid */}
            {filteredCases.length > 0 ? (
              <section>
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-12">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {selectedCategory === 'all' ? i18n[language].allProjects : getCategoryName(selectedCategory, language)}
                  </span>
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCases.map((caseItem, index) => (
                    <Link key={caseItem.id} to={`/cases/${caseItem.slug}`} className="group cursor-pointer block opacity-100 transform-none" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105">
                        <div className="aspect-video overflow-hidden relative">
                          <img 
                            src={caseItem.main_image} 
                            alt={caseItem.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold shadow-lg text-xs">
                              {getCategoryName(caseItem.category, language)}
                            </Badge>
                            {caseItem.is_featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-background/80 backdrop-blur-sm text-xs">
                                {i18n[language].featured}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                            {caseItem.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2">
                            {caseItem.short_description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">{caseItem.client_name}</span>
                            <div className="flex items-center text-primary">
                              <Eye className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">{i18n[language].view}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">{i18n[language].notFoundInCategory}</p>
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