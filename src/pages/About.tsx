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
  console.log('About component loaded');
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  useScrollAnimation();

  useEffect(() => {
    console.log('About useEffect triggered');
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('About page: fetchData started');
    try {
      // Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      console.log('Team data:', teamData, 'Team error:', teamError);

      // Fetch company info
      const { data: companyData, error: companyError } = await supabase
        .from('company_info')
        .select('*')
        .maybeSingle();

      console.log('Company data:', companyData, 'Company error:', companyError);

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

  console.log('About render - Loading:', loading);
  console.log('About render - Company used:', company);
  console.log('About render - Team members used:', teamMembers);

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
    console.log('About page: still loading...');
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

  console.log('About page: rendering main content');

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

      {/* TEST CONTENT */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">О нашей студии</h1>
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto">
          {company.description}
        </p>
        
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="animate-on-scroll">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Наша миссия</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{company.mission}</p>
            </CardContent>
          </Card>
          <Card className="animate-on-scroll">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-bold">Наше видение</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{company.vision}</p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-lg shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Наши ценности</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="animate-on-scroll hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Наша команда</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden animate-on-scroll hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-muted-foreground mb-2">{member.experience}</p>
                  <p className="text-sm text-muted-foreground mb-4">{member.description}</p>
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

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">Готовы начать проект?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Свяжитесь с нами для обсуждения вашего проекта. Мы поможем воплотить ваши идеи в жизнь.
              </p>
              <Button asChild size="lg" className="hover-scale">
                <Link to="/#contact">
                  Связаться с нами
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default About;