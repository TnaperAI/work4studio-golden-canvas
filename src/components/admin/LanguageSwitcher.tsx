import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Globe, Check, AlertCircle } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = "" 
}) => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { content, translateContent } = useSiteContent();
  const { toast } = useToast();
  const [translating, setTranslating] = useState(false);
  const [realStats, setRealStats] = useState<{[key: string]: {total: number, ruTotal: number, percentage: number}}>({});

  // Load real statistics from database
  useEffect(() => {
    const loadRealStats = async () => {
      try {
        // Get site_content statistics
        const { data: siteContentStats } = await supabase
          .from('site_content')
          .select('language')
          .order('language');

        // Get page_seo statistics  
        const { data: seoStats } = await supabase
          .from('page_seo')
          .select('language')
          .order('language');

        // Calculate totals
        const ruSiteContent = siteContentStats?.filter(item => item.language === 'ru').length || 0;
        const enSiteContent = siteContentStats?.filter(item => item.language === 'en').length || 0;
        const ruSeo = seoStats?.filter(item => item.language === 'ru').length || 0;
        const enSeo = seoStats?.filter(item => item.language === 'en').length || 0;

        const ruTotal = ruSiteContent + ruSeo;
        const enTotal = enSiteContent + enSeo;

        setRealStats({
          ru: {
            total: ruTotal,
            ruTotal: ruTotal,
            percentage: 100
          },
          en: {
            total: enTotal,
            ruTotal: ruTotal,
            percentage: ruTotal > 0 ? Math.round((enTotal / ruTotal) * 100) : 0
          }
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    loadRealStats();
  }, []);

  // Calculate content statistics for each language using real data
  const getLanguageStats = (language: Language) => {
    return realStats[language] || { total: 0, ruTotal: 0, percentage: 0 };
  };

  // Handle language switch
  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    toast({
      title: "Язык изменён",
      description: `Выбран язык: ${availableLanguages.find(l => l.code === language)?.name}`,
    });
  };

  // Handle automatic translation with extended coverage
  const handleTranslate = async (fromLang: Language, toLang: Language) => {
    if (translating) return;
    
    setTranslating(true);
    try {
      // 1. Translate site_content (existing functionality)
      await translateContent(fromLang, toLang);
      
      // 2. Translate company_info
      const { data: companyData } = await supabase
        .from('company_info')
        .select('*')
        .single();
        
      if (companyData) {
        const companyFields = ['description', 'mission', 'vision'];
        const translatedCompanyData: any = { ...companyData };
        
        for (const field of companyFields) {
          if (companyData[field]) {
            try {
              const response = await supabase.functions.invoke('translate-content', {
                body: { 
                  text: companyData[field], 
                  from: fromLang, 
                  to: toLang 
                }
              });
              
              if (response.data?.success && response.data?.translatedText) {
                translatedCompanyData[field] = response.data.translatedText;
              }
            } catch (error) {
              console.error(`Error translating company ${field}:`, error);
            }
          }
        }
        
        // Save translated company info (we'll create separate records for different languages if needed)
        await supabase
          .from('company_info')
          .upsert(translatedCompanyData);
      }
      
      // 3. Translate team_members
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);
        
      if (teamData && teamData.length > 0) {
        const teamUpdates = [];
        
        for (const member of teamData) {
          const translatedMember: any = { ...member };
          
          // Translate description and position
          const fieldsToTranslate = ['description', 'position'];
          
          for (const field of fieldsToTranslate) {
            if (member[field]) {
              try {
                const response = await supabase.functions.invoke('translate-content', {
                  body: { 
                    text: member[field], 
                    from: fromLang, 
                    to: toLang 
                  }
                });
                
                if (response.data?.success && response.data?.translatedText) {
                  translatedMember[field] = response.data.translatedText;
                }
              } catch (error) {
                console.error(`Error translating team member ${member.name} ${field}:`, error);
              }
            }
          }
          
          teamUpdates.push(translatedMember);
        }
        
        // Save translated team members
        if (teamUpdates.length > 0) {
          await supabase
            .from('team_members')
            .upsert(teamUpdates);
        }
      }
      
      // Reload statistics after translation
      const loadRealStats = async () => {
        try {
          const { data: siteContentStats } = await supabase
            .from('site_content')
            .select('language');

          const { data: seoStats } = await supabase
            .from('page_seo')
            .select('language');

          const ruSiteContent = siteContentStats?.filter(item => item.language === 'ru').length || 0;
          const enSiteContent = siteContentStats?.filter(item => item.language === 'en').length || 0;
          const ruSeo = seoStats?.filter(item => item.language === 'ru').length || 0;
          const enSeo = seoStats?.filter(item => item.language === 'en').length || 0;

          const ruTotal = ruSiteContent + ruSeo;
          const enTotal = enSiteContent + enSeo;

          setRealStats({
            ru: { total: ruTotal, ruTotal: ruTotal, percentage: 100 },
            en: { total: enTotal, ruTotal: ruTotal, percentage: ruTotal > 0 ? Math.round((enTotal / ruTotal) * 100) : 0 }
          });
        } catch (error) {
          console.error('Error reloading stats:', error);
        }
      };

      await loadRealStats();
      
      toast({
        title: "Полный перевод завершён",
        description: `Переведён весь контент: тексты, информация о компании и команде с ${fromLang === 'ru' ? 'русского' : 'английского'} на ${toLang === 'ru' ? 'русский' : 'английский'}`,
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Ошибка перевода",
        description: error instanceof Error ? error.message : "Не удалось выполнить перевод",
        variant: "destructive",
      });
    } finally {
      setTranslating(false);
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <Check className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Управление языками
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Switcher */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Текущий язык редактирования:</p>
          <div className="flex gap-2">
            {availableLanguages.map((language) => {
              const stats = getLanguageStats(language.code);
              const isActive = currentLanguage === language.code;
              
              return (
                <Button
                  key={language.code}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => handleLanguageChange(language.code)}
                  className="flex items-center gap-2"
                >
                  {language.name}
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getStatusColor(stats.percentage)}`}
                  >
                    {stats.percentage}%
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Language Statistics */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Статус переводов:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableLanguages.map((language) => {
              const stats = getLanguageStats(language.code);
              
              return (
                <div
                  key={language.code}
                  className="flex items-center justify-between p-2 rounded-md border bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stats.percentage)}
                    <span className="text-sm">{language.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stats.total} / {stats.ruTotal}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Automatic Translation */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Автоматический перевод:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTranslate('ru', 'en')}
              disabled={translating}
              className="flex items-center gap-2"
            >
              {translating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Перевести RU → EN
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTranslate('en', 'ru')}
              disabled={translating}
              className="flex items-center gap-2"
            >
              {translating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Перевести EN → RU
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Использует AI для автоматического перевода всего контента
          </p>
        </div>
      </CardContent>
    </Card>
  );
};