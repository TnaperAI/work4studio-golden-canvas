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
  Calendar,
  MapPin,
  Mail,
  Phone
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

  const fetchData = async () => {
    try {
      // Fetch team members
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      // Fetch company info
      const { data: companyData } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

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

  const company = companyInfo || defaultCompany;
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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-20 pb-3 bg-muted/50 border-b">
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
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/30 rounded-full blur-lg"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-on-scroll">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              О нашей студии
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {company.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-on-scroll">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="animate-on-scroll">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-4">Наша миссия</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {company.mission}
                </p>
              </div>
              <div className="animate-on-scroll">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-6">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-3xl font-heading font-bold mb-4">Наше видение</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {company.vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-heading font-bold mb-4">Наши ценности</h2>
              <p className="text-xl text-muted-foreground">
                Принципы, которыми мы руководствуемся в работе
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow animate-on-scroll">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-4xl font-heading font-bold mb-4">Наша команда</h2>
              <p className="text-xl text-muted-foreground">
                Профессионалы, которые создают ваш успех
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-on-scroll">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.position}</p>
                    <p className="text-muted-foreground text-sm mb-4">{member.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="h-4 w-4" />
                      <span>Опыт: {member.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white animate-on-scroll">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Готовы начать проект?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Свяжитесь с нами, и мы обсудим, как помочь вашему бизнесу расти
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contact" className="flex items-center gap-2">
                  Связаться с нами
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/cases">Посмотреть работы</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;