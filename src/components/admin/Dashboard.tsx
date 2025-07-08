import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, FileText, Settings, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    submissionsCount: 0,
    submissionsToday: 0,
    pagesCount: 0,
    contentItemsCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch submissions count
      const { count: totalSubmissions } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

      // Fetch today's submissions
      const today = new Date().toISOString().split('T')[0];
      const { count: todaySubmissions } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`);

      // Fetch pages count
      const { count: pagesCount } = await supabase
        .from('page_seo')
        .select('*', { count: 'exact', head: true });

      // Fetch content items count
      const { count: contentCount } = await supabase
        .from('site_content')
        .select('*', { count: 'exact', head: true });

      setStats({
        submissionsCount: totalSubmissions || 0,
        submissionsToday: todaySubmissions || 0,
        pagesCount: pagesCount || 0,
        contentItemsCount: contentCount || 0
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Дашборд</h1>
        <p className="text-muted-foreground">
          Обзор статистики и активности сайта
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissionsCount}</div>
            <p className="text-xs text-muted-foreground">
              Общее количество заявок
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заявки сегодня</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissionsToday}</div>
            <p className="text-xs text-muted-foreground">
              Новые заявки за сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Страницы</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pagesCount}</div>
            <p className="text-xs text-muted-foreground">
              Страниц на сайте
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Контент</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contentItemsCount}</div>
            <p className="text-xs text-muted-foreground">
              Элементов контента
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Статус сайта</CardTitle>
            <CardDescription>Текущее состояние</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Сайт работает нормально</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Время работы</span>
                <span className="text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Скорость загрузки</span>
                <span className="text-green-600">1.2s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Часто используемые функции</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 rounded hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Редактировать главную страницу</span>
              </div>
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Просмотреть заявки</span>
              </div>
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted transition-colors">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Настройки SEO</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;