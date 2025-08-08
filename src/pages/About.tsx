import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import BackToTop from '@/components/BackToTop';
import { TeamCarousel } from '@/components/TeamCarousel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users, 
  Target, 
  Award, 
  Clock,
  Star,
  Heart,
  Zap,
  Trophy,
  CheckCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  skills: string[];
  experience: string;
  is_active: boolean;
  sort_order: number;
}

interface CompanyInfo {
  mission: string;
  vision: string;
  founding_year: string;
  team_size: string;
  projects_completed: string;
  clients_served: string;
  description: string;
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

const About = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [pageSEO, setPageSEO] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);
  const { getContent } = useSiteContent();
  const { currentLanguage } = useLanguage();
  useScrollAnimation();

  useEffect(() => {
    fetchData();
  }, [currentLanguage]);

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

  // Обновляем SEO теги когда загружаются данные
  useEffect(() => {
    if (pageSEO) {
      // Обновляем title
      if (pageSEO.page_title) {
        document.title = pageSEO.page_title;
      }

      // Обновляем meta теги
      const updateMetaTag = (name: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = name;
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      const updatePropertyTag = (property: string, content: string) => {
        if (!content) return;
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Обновляем canonical URL
      if (pageSEO.canonical_url) {
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = pageSEO.canonical_url;
      }

      // Устанавливаем мета теги
      updateMetaTag('description', pageSEO.meta_description);
      updateMetaTag('keywords', pageSEO.meta_keywords);
      updatePropertyTag('og:title', pageSEO.og_title);
      updatePropertyTag('og:description', pageSEO.og_description);
      updatePropertyTag('og:image', pageSEO.og_image);
      updatePropertyTag('og:type', 'website');
    }
  }, [pageSEO]);

  const fetchData = async () => {
    try {
      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      // Fetch company info
      const { data: companyData, error: companyError } = await supabase
        .from('company_info')
        .select('*')
        .eq('language', currentLanguage)
        .maybeSingle();

      // Fetch page SEO
      const { data: seoData, error: seoError } = await supabase
        .from('page_seo')
        .select('*')
        .eq('page_slug', 'about')
        .eq('language', currentLanguage)
        .maybeSingle();

      if (teamError) {
        console.error('Team error:', teamError);
      }
      if (companyError) {
        console.error('Company error:', companyError);
      }
      if (seoError) {
        console.error('SEO error:', seoError);
      }

      setTeam(teamData || []);
      setCompanyInfo(companyData);
      setPageSEO(seoData);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default data если нет в базе
  const defaultCompany = {
    mission: 'Создаем уникальные веб-решения, которые помогают бизнесу расти и развиваться в цифровом мире',
    vision: 'Стать ведущей студией веб-разработки, известной инновационными решениями и безупречным качеством',
    founding_year: '2019',
    team_size: '8+',
    projects_completed: '150+',
    clients_served: '80+',
    description: 'Work4Studio — это команда профессионалов, специализирующихся на создании современных веб-сайтов и приложений. Мы объединяем креативность дизайна с передовыми технологиями разработки.'
  };

  const company = companyInfo || defaultCompany;

  const defaultTeam = [
    {
      id: '1',
      name: 'Алексей Петров',
      position: 'Основатель & Lead Developer',
      description: 'Эксперт в области веб-разработки с более чем 7-летним опытом. Специализируется на React, Node.js и архитектуре приложений.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      experience: '7+ лет',
      is_active: true,
      sort_order: 1
    },
    {
      id: '2', 
      name: 'Мария Сидорова',
      position: 'UI/UX Designer',
      description: 'Создает интуитивные и красивые интерфейсы. Имеет степень в области дизайна и опыт работы с крупными брендами.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      experience: '5+ лет',
      is_active: true,
      sort_order: 2
    },
    {
      id: '3',
      name: 'Дмитрий Козлов', 
      position: 'Frontend Developer',
      description: 'Специалист по frontend-разработке с фокусом на производительность и пользовательский опыт.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      skills: ['React', 'Vue.js', 'CSS/SCSS', 'WebPack'],
      experience: '4+ года',
      is_active: true,
      sort_order: 3
    }
  ];

  const teamMembers = team.length > 0 ? team : defaultTeam;

  const stats = [
    { icon: Calendar, label: getContent('about', 'stats_founding_year_label') || 'Год основания', value: company.founding_year },
    { icon: Users, label: getContent('about', 'stats_team_label') || 'Команда', value: company.team_size },
    { icon: Trophy, label: getContent('about', 'stats_projects_label') || 'Проектов завершено', value: company.projects_completed },
    { icon: Star, label: getContent('about', 'stats_clients_label') || 'Довольных клиентов', value: company.clients_served }
  ];

  // Получаем данные ценностей из базы данных или используем дефолтные
  const values = [
    {
      icon: Target,
      title: getContent('about', 'value_1_title') || 'Качество',
      description: getContent('about', 'value_1_description') || 'Мы не идем на компромиссы в вопросах качества. Каждый проект проходит строгий контроль.'
    },
    {
      icon: Zap,
      title: getContent('about', 'value_2_title') || 'Инновации',
      description: getContent('about', 'value_2_description') || 'Используем самые современные технологии и подходы в разработке.'
    },
    {
      icon: Heart,
      title: getContent('about', 'value_3_title') || 'Сервис',
      description: getContent('about', 'value_3_description') || 'Ваш успех — наш приоритет. Строим долгосрочные отношения.'
    },
    {
      icon: CheckCircle,
      title: getContent('about', 'value_4_title') || 'Надежность',
      description: getContent('about', 'value_4_description') || 'Соблюдаем сроки, держим слово и всегда доступны для поддержки.'
    }
  ];


  return (
    <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{getContent('about', 'breadcrumb_home') || 'Главная'}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getContent('about', 'breadcrumb_about') || 'О нас'}</BreadcrumbPage>
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
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center animate-on-scroll">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              {getContent('about', 'hero_title_1') && getContent('about', 'hero_title_2') ? (
                <>
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'hero_title_1')}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                    {getContent('about', 'hero_title_2')}
                  </span>
                </>
              ) : pageSEO && pageSEO.h1_tag ? (
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                  {pageSEO.h1_tag}
                </span>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'hero_title_1') || 'Наша'}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                    {getContent('about', 'hero_title_2') || 'компания'}
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              {company.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom section-padding">
        {/* Stats Section */}
        <section className="mb-20 animate-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border border-border rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <div className="text-muted-foreground font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'mission_title') || 'Наша миссия'}
                  </span>
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{company.mission}</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'vision_title') || 'Наше видение'}
                  </span>
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{company.vision}</p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('about', 'values_title') || 'Наши'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getContent('about', 'values_title_second') || 'ценности'}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getContent('about', 'values_subtitle') || 'Принципы, которые направляют нашу работу и отношения с клиентами'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 group text-center animate-on-scroll">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('about', 'team_title_first') || 'Наша'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getContent('about', 'team_title_second') || 'команда'}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getContent('about', 'team_subtitle') || 'Профессионалы, которые воплощают ваши идеи в жизнь'}
            </p>
          </div>
          <div className="animate-on-scroll">
            <TeamCarousel members={teamMembers} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-on-scroll">
          <div className="relative bg-card border border-border rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {getContent('about', 'cta_title_first') || 'Готовы начать'}
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {getContent('about', 'cta_title_second') || 'проект?'}
                </span>
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                {getContent('about', 'cta_subtitle') || 'Свяжитесь с нами для обсуждения вашего проекта. Мы поможем воплотить ваши идеи в жизнь и создать что-то удивительное вместе.'}
              </p>
              <Button asChild className="btn-gold text-base md:text-xl px-6 py-3 md:px-8 md:py-4 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link to="/contact">
                  {getContent('about', 'cta_button_text') || 'Связаться с нами'}
                  <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;