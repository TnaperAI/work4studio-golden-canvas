import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { CheckCircle, AlertCircle, XCircle, Globe } from 'lucide-react';

export const TranslationStatus: React.FC = () => {
  const { content } = useSiteContent();
  const { availableLanguages } = useLanguage();

  // Получить статистику для каждого языка
  const getLanguageStats = (language: Language) => {
    const langContent = content.filter(item => item.language === language);
    const ruContent = content.filter(item => item.language === 'ru');
    
    // Получить уникальные секции и ключи для русского языка (эталон)
    const ruContentMap = new Set(ruContent.map(item => `${item.section}:${item.key}`));
    const langContentMap = new Set(langContent.map(item => `${item.section}:${item.key}`));
    
    const total = ruContentMap.size;
    const translated = Array.from(ruContentMap).filter(key => langContentMap.has(key)).length;
    const percentage = total > 0 ? Math.round((translated / total) * 100) : 0;
    
    return {
      total,
      translated,
      missing: total - translated,
      percentage
    };
  };

  // Получить детальную статистику по секциям
  const getSectionStats = () => {
    const sections = [...new Set(content.filter(item => item.language === 'ru').map(item => item.section))];
    
    return sections.map(section => {
      const ruItems = content.filter(item => item.language === 'ru' && item.section === section);
      const stats: Record<Language, { translated: number; total: number; percentage: number }> = {} as any;
      
      availableLanguages.forEach(lang => {
        const langItems = content.filter(item => item.language === lang.code && item.section === section);
        const ruKeys = new Set(ruItems.map(item => item.key));
        const langKeys = new Set(langItems.map(item => item.key));
        
        const translated = Array.from(ruKeys).filter(key => langKeys.has(key)).length;
        const total = ruKeys.size;
        
        stats[lang.code] = {
          translated,
          total,
          percentage: total > 0 ? Math.round((translated / total) * 100) : 0
        };
      });
      
      return {
        section,
        stats
      };
    });
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (percentage >= 50) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const languageStats = availableLanguages.map(lang => ({
    ...lang,
    ...getLanguageStats(lang.code)
  }));

  const sectionStats = getSectionStats();

  return (
    <div className="space-y-6">
      {/* Общая статистика */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Общий статус переводов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languageStats.map((lang) => (
              <div key={lang.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(lang.percentage)}
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <Badge className={`text-white ${getStatusColor(lang.percentage)}`}>
                    {lang.percentage}%
                  </Badge>
                </div>
                <Progress value={lang.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {lang.translated} из {lang.total} переведено
                  {lang.missing > 0 && ` (${lang.missing} отсутствует)`}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Детальная статистика по секциям */}
      <Card>
        <CardHeader>
          <CardTitle>Статус по секциям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionStats.map((section) => (
              <div key={section.section} className="space-y-2">
                <h4 className="font-medium capitalize">
                  {section.section.replace('_', ' ')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableLanguages.map((lang) => {
                    const stats = section.stats[lang.code];
                    return (
                      <div key={lang.code} className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(stats.percentage)}
                          <span className="text-sm">{lang.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stats.translated}/{stats.total}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};