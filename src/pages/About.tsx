import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { TeamCarousel } from '@/components/TeamCarousel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Target, Award, Clock, Star, Heart, Zap, Trophy, CheckCircle, ArrowRight, Calendar } from 'lucide-react';
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
  const {
    getContent
  } = useSiteContent();
  const {
    language
  } = useLanguage();
  useScrollAnimation();
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [language]);

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
      updatePropertyTag('og:url', window.location.href);
    }
  }, [pageSEO]);
  const fetchData = async () => {
    try {
      // Fetch team members
      const {
        data: teamData,
        error: teamError
      } = await supabase.from('team_members').select('*').eq('is_active', true).order('sort_order');

      // Fetch company info
      const {
        data: companyData,
        error: companyError
      } = await supabase.from('company_info').select('*').eq('language', language).maybeSingle();

      // Fetch page SEO
      console.log('🔍 Fetching About SEO for language:', language);
      const {
        data: seoData,
        error: seoError
      } = await supabase.from('page_seo').select('*').eq('page_slug', 'about').eq('language', language).maybeSingle();
      if (teamError) {
        console.error('Team error:', teamError);
      }
      if (companyError) {
        console.error('Company error:', companyError);
      }
      if (seoError) {
        console.error('❌ About SEO error:', seoError);
      }
      setTeam(teamData || []);
      setCompanyInfo(companyData);
      console.log('✅ About SEO data loaded:', seoData);
      setPageSEO(seoData);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Показываем загрузочное состояние при загрузке 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  // Используем данные из базы или динамические fallback
  const company = companyInfo || {
    mission: getContent('about', 'mission_text') || (language === 'en' ? 'We create unique web solutions that help businesses grow and develop in the digital world' : 'Создаем уникальные веб-решения, которые помогают бизнесу расти и развиваться в цифровом мире'),
    vision: getContent('about', 'vision_text') || (language === 'en' ? 'To become a leading web development studio known for innovative solutions and impeccable quality' : 'Стать ведущей студией веб-разработки, известной инновационными решениями и безупречным качеством'),
    founding_year: '2019',
    team_size: '8+',
    projects_completed: '150+',
    clients_served: '80+',
    description: getContent('about', 'company_description') || (language === 'en' ? 'Work4Studio is a team of professionals specializing in creating modern websites and applications. We combine design creativity with cutting-edge development technologies.' : 'Work4Studio — это команда профессионалов, специализирующихся на создании современных веб-сайтов и приложений.')
  };
  
  const teamMembers = team.length > 0 ? team : [];
  const stats = [{
    icon: Calendar,
    label: getContent('about', 'stats_founding_year_label') || (language === 'en' ? 'Founded' : 'Год основания'),
    value: company.founding_year
  }, {
    icon: Users,
    label: getContent('about', 'stats_team_label') || (language === 'en' ? 'Team' : 'Команда'),
    value: company.team_size
  }, {
    icon: Trophy,
    label: getContent('about', 'stats_projects_label') || (language === 'en' ? 'Projects Completed' : 'Проектов завершено'),
    value: company.projects_completed
  }, {
    icon: Star,
    label: getContent('about', 'stats_clients_label') || (language === 'en' ? 'Happy Clients' : 'Довольных клиентов'),
    value: company.clients_served
  }];

  // Получаем данные ценностей из базы данных или используем дефолтные
  const values = [{
    icon: Target,
    title: getContent('about', 'value_1_title') || (language === 'en' ? 'Quality' : 'Качество'),
    description: getContent('about', 'value_1_description') || (language === 'en' ? 'We never compromise on quality. Every project undergoes strict quality control.' : 'Мы не идем на компромиссы в вопросах качества. Каждый проект проходит строгий контроль.')
  }, {
    icon: Zap,
    title: getContent('about', 'value_2_title') || (language === 'en' ? 'Innovation' : 'Инновации'),
    description: getContent('about', 'value_2_description') || (language === 'en' ? 'We use the most modern technologies and approaches in development.' : 'Используем самые современные технологии и подходы в разработке.')
  }, {
    icon: Heart,
    title: getContent('about', 'value_3_title') || (language === 'en' ? 'Service' : 'Сервис'),
    description: getContent('about', 'value_3_description') || (language === 'en' ? 'Your success is our priority. We build long-term relationships.' : 'Ваш успех — наш приоритет. Строим долгосрочные отношения.')
  }, {
    icon: CheckCircle,
    title: getContent('about', 'value_4_title') || (language === 'en' ? 'Reliability' : 'Надежность'),
    description: getContent('about', 'value_4_description') || (language === 'en' ? 'We meet deadlines, keep our word and are always available for support.' : 'Соблюдаем сроки, держим слово и всегда доступны для поддержки.')
  }];
  return <div className="min-h-screen">{/* Убираем bg-background чтобы видеть фоновую анимацию */}
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-4 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{getContent('about', 'breadcrumb_home') || (language === 'en' ? 'Home' : 'Главная')}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{getContent('about', 'breadcrumb_about') || (language === 'en' ? 'About' : 'О нас')}</BreadcrumbPage>
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
              {getContent('about', 'hero_title_1') && getContent('about', 'hero_title_2') ? <>
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'hero_title_1')}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                    {getContent('about', 'hero_title_2')}
                  </span>
                </> : pageSEO && pageSEO.h1_tag ? <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                  {pageSEO.h1_tag}
                </span> : <>
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'hero_title_1') || 'Наша'}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                    {getContent('about', 'hero_title_2') || 'компания'}
                  </span>
                </>}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
              {getContent('about', 'company_description') || company.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom section-padding">
        {/* Stats Section */}
        <section className="mb-20 animate-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => <div key={index} className="bg-card border border-border rounded-3xl p-8 text-center hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </div>
                <div className="text-muted-foreground font-medium text-lg">{stat.label}</div>
              </div>)}
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
                    {getContent('about', 'mission_title') || (language === 'en' ? 'Our Mission' : 'Наша миссия')}
                  </span>
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{getContent('about', 'mission_text') || company.mission}</p>
            </div>
            <div className="bg-card border border-border rounded-3xl p-8 md:p-12 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {getContent('about', 'vision_title') || (language === 'en' ? 'Our Vision' : 'Наше видение')}
                  </span>
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{getContent('about', 'vision_text') || company.vision}</p>
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
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                {getContent('about', 'values_title_second') || 'ценности'}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getContent('about', 'values_subtitle') || 'Принципы, которые направляют нашу работу и отношения с клиентами'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => <div key={index} className="bg-card border border-border rounded-3xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 group text-center animate-on-scroll">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>)}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 whitespace-nowrap">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {getContent('about', 'team_title_first') || 'Наша'}
              </span>{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getContent('about', 'team_title_second') || 'команда'}
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getContent('about', 'team_subtitle') || 'Профессионалы, которые воплощают ваши идеи в жизнь'}
            </p>
           </div>
           {teamMembers.length > 0 ? (
             <div className="animate-on-scroll">
               <TeamCarousel members={teamMembers} />
             </div>
           ) : (
             <div className="text-center py-16 animate-on-scroll">
               <p className="text-muted-foreground text-lg">
                 {language === 'en' ? 'Team information will be available soon.' : 'Информация о команде скоро будет доступна.'}
               </p>
             </div>
           )}
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
    </div>;
};
export default About;