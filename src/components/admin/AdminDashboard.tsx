import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSiteContent } from '@/hooks/useSiteContent';

const AdminDashboard = () => {
  const { content, getContent, updateContent } = useSiteContent();
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const { toast } = useToast();

  // Form states
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [ctaButton, setCtaButton] = useState('');
  const [statsDays, setStatsDays] = useState('');
  const [statsDaysText, setStatsDaysText] = useState('');
  const [statsSupport, setStatsSupport] = useState('');
  const [statsSupportText, setStatsSupportText] = useState('');
  const [statsCode, setStatsCode] = useState('');
  const [statsCodeText, setStatsCodeText] = useState('');

  useEffect(() => {
    // Fetch submissions count
    const fetchSubmissionsCount = async () => {
      const { count } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });
      setSubmissionsCount(count || 0);
    };

    fetchSubmissionsCount();

    // Update form fields when content loads
    if (content.length > 0) {
      setHeroTitle(getContent('hero', 'title'));
      setHeroSubtitle(getContent('hero', 'subtitle'));
      setCtaButton(getContent('hero', 'cta_button'));
      setStatsDays(getContent('stats', 'days'));
      setStatsDaysText(getContent('stats', 'days_text'));
      setStatsSupport(getContent('stats', 'support'));
      setStatsSupportText(getContent('stats', 'support_text'));
      setStatsCode(getContent('stats', 'code'));
      setStatsCodeText(getContent('stats', 'code_text'));
    }
  }, [content, getContent]);

  const handleSaveHero = async () => {
    try {
      await Promise.all([
        updateContent('hero', 'title', heroTitle),
        updateContent('hero', 'subtitle', heroSubtitle),
        updateContent('hero', 'cta_button', ctaButton),
      ]);

      toast({
        title: 'Успешно',
        description: 'Контент героя секции обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить контент',
        variant: 'destructive',
      });
    }
  };

  const handleSaveStats = async () => {
    try {
      await Promise.all([
        updateContent('stats', 'days', statsDays),
        updateContent('stats', 'days_text', statsDaysText),
        updateContent('stats', 'support', statsSupport),
        updateContent('stats', 'support_text', statsSupportText),
        updateContent('stats', 'code', statsCode),
        updateContent('stats', 'code_text', statsCodeText),
      ]);

      toast({
        title: 'Успешно',
        description: 'Статистика обновлена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статистику',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Управление главной страницей</h1>
        <p className="text-muted-foreground">
          Изменения будут видны на сайте в реальном времени
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Заявки</CardTitle>
            <CardDescription>Общее количество полученных заявок</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissionsCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Статус сайта</CardTitle>
            <CardDescription>Состояние работы сайта</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Активен</div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section Content */}
      <Card>
        <CardHeader>
          <CardTitle>Главная секция (Hero)</CardTitle>
          <CardDescription>
            Редактирование основного текста и заголовков
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hero-title">Заголовок</Label>
            <Input
              id="hero-title"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Основной заголовок"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hero-subtitle">Подзаголовок</Label>
            <Textarea
              id="hero-subtitle"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              placeholder="Описание под заголовком"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta-button">Текст кнопки</Label>
            <Input
              id="cta-button"
              value={ctaButton}
              onChange={(e) => setCtaButton(e.target.value)}
              placeholder="Обсудить проект"
            />
          </div>
          <Button onClick={handleSaveHero}>
            Сохранить изменения героя
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Статистика</CardTitle>
          <CardDescription>
            Редактирование цифр и текста в блоке статистики
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stats-days">Количество дней</Label>
              <Input
                id="stats-days"
                value={statsDays}
                onChange={(e) => setStatsDays(e.target.value)}
                placeholder="3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-days-text">Текст к дням</Label>
              <Input
                id="stats-days-text"
                value={statsDaysText}
                onChange={(e) => setStatsDaysText(e.target.value)}
                placeholder="дня до запуска"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-support">Поддержка</Label>
              <Input
                id="stats-support"
                value={statsSupport}
                onChange={(e) => setStatsSupport(e.target.value)}
                placeholder="24/7"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-support-text">Текст к поддержке</Label>
              <Input
                id="stats-support-text"
                value={statsSupportText}
                onChange={(e) => setStatsSupportText(e.target.value)}
                placeholder="поддержка"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-code">Процент кода</Label>
              <Input
                id="stats-code"
                value={statsCode}
                onChange={(e) => setStatsCode(e.target.value)}
                placeholder="100%"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stats-code-text">Текст к коду</Label>
              <Input
                id="stats-code-text"
                value={statsCodeText}
                onChange={(e) => setStatsCodeText(e.target.value)}
                placeholder="открытый код"
              />
            </div>
          </div>
          <Button onClick={handleSaveStats}>
            Сохранить статистику
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;