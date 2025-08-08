import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { useToast } from '@/hooks/use-toast';
import { Globe, Copy, Check, AlertCircle } from 'lucide-react';

interface LanguageSwitcherProps {
  showCopyActions?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  showCopyActions = false 
}) => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const { content, copyContentToLanguage } = useSiteContent();
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  // Calculate content statistics for each language
  const getLanguageStats = (language: Language) => {
    const langContent = content.filter(item => item.language === language);
    const totalRuContent = content.filter(item => item.language === 'ru').length;
    
    return {
      total: langContent.length,
      ruTotal: totalRuContent,
      percentage: totalRuContent > 0 ? Math.round((langContent.length / totalRuContent) * 100) : 0
    };
  };

  // Handle language switch
  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    toast({
      title: "Язык изменён",
      description: `Выбран язык: ${availableLanguages.find(l => l.code === language)?.name}`,
    });
  };

  // Handle content copying
  const handleCopyContent = async (fromLang: Language, toLang: Language) => {
    if (copying) return;
    
    setCopying(true);
    try {
      await copyContentToLanguage(fromLang, toLang);
      toast({
        title: "Контент скопирован",
        description: `Контент из ${fromLang === 'ru' ? 'русского' : 'английского'} языка скопирован в ${toLang === 'ru' ? 'русский' : 'английский'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка копирования",
        description: "Не удалось скопировать контент",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
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
    <Card className="w-full">
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

        {/* Copy Actions */}
        {showCopyActions && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Массовые операции:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyContent('ru', 'en')}
                disabled={copying}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Скопировать RU → EN
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyContent('en', 'ru')}
                disabled={copying}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Скопировать EN → RU
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Внимание: копирование перезапишет существующие переводы
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};