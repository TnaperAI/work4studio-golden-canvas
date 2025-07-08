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
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
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

const About = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  useScrollAnimation();

  useEffect(() => {
    fetchData();
  }, []);

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
        .maybeSingle();

      if (teamError) {
        console.error('Team error:', teamError);
      }
      if (companyError) {
        console.error('Company error:', companyError);
      }

      setTeam(teamData || []);
      setCompanyInfo(companyData);
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
    { icon: Calendar, label: 'Год основания', value: company.founding_year },
    { icon: Users, label: 'Команда', value: company.team_size },
    { icon: Trophy, label: 'Проектов завершено', value: company.projects_completed },
    { icon: Star, label: 'Довольных клиентов', value: company.clients_served }
  ];

  const values = [
    {
      icon: Target,
      title: 'Качество',
      description: 'Мы не идем на компромиссы в вопросах качества. Каждый проект проходит строгий контроль.'
    },
    {
      icon: Zap,
      title: 'Инновации',
      description: 'Используем самые современные технологии и подходы в разработке.'
    },
    {
      icon: Heart,
      title: 'Клиентоориентированность',
      description: 'Успех наших клиентов — это наш успех. Мы строим долгосрочные партнерские отношения.'
    },
    {
      icon: CheckCircle,
      title: 'Надежность',
      description: 'Соблюдаем сроки, держим слово и всегда доступны для поддержки.'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Загрузка страницы "О нас"...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-20 pb-3 bg-gradient-to-r from-background/95 via-background/98 to-background/95 border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Главная</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>О нас</BreadcrumbPage>
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
            <div className="flex items-center justify-center mb-8">
              <Users className="h-10 w-10 text-primary mr-4" />
              <span className="text-primary font-bold text-xl">О компании</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-10 leading-tight">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Наша
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-glow">
                студия
              </span>
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
              <div key={index} className="bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50 text-center hover:shadow-2xl hover:scale-105 transition-all duration-500 group">
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
            <div className="bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Наша миссия
                  </span>
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">{company.mission}</p>
            </div>
            <div className="bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 animate-on-scroll">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/30 rounded-2xl flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold">
                  <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Наше видение
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
                Наши
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ценности
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Принципы, которые направляют нашу работу и отношения с клиентами
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 group text-center animate-on-scroll">
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
                Наша
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                команда
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Профессионалы, которые воплощают ваши идеи в жизнь
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={member.id} className="bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-border/50 hover:shadow-2xl hover:scale-105 transition-all duration-500 group animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-heading font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-2 text-lg">{member.position}</p>
                  <p className="text-sm text-muted-foreground mb-3 font-medium bg-gradient-to-r from-card/50 to-secondary/30 px-3 py-1 rounded-full inline-block">{member.experience}</p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{member.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} className="bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border border-border/30 hover:from-primary/20 hover:to-accent/20 transition-colors">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-on-scroll">
          <div className="relative bg-gradient-to-br from-card/50 to-secondary/30 backdrop-blur-sm rounded-3xl p-12 md:p-16 border border-border/50 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-lg"></div>
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-heading font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Готовы начать
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  проект?
                </span>
              </h3>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                Свяжитесь с нами для обсуждения вашего проекта. Мы поможем воплотить ваши идеи в жизнь и создать что-то удивительное вместе.
              </p>
              <Button asChild className="btn-gold text-xl px-8 py-4 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link to="/contact">
                  Связаться с нами
                  <ArrowRight className="ml-3 h-6 w-6" />
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