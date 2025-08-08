import React, { useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import ContentCategories from './ContentCategories';

interface LanguageContentMenuProps {
  onPageSelect: (pageSlug: string) => void;
}

const LanguageContentMenu = ({ onPageSelect }: LanguageContentMenuProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'ru' | 'en' | null>(null);

  const languages = [
    { code: 'ru' as const, name: 'Русский контент', flag: '🇷🇺' },
    { code: 'en' as const, name: 'English Content', flag: '🇺🇸' },
  ];

  if (selectedLanguage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold">
              {languages.find(l => l.code === selectedLanguage)?.name}
            </h2>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setSelectedLanguage(null)}
          >
            Назад к выбору языка
          </Button>
        </div>
        
        <ContentCategories 
          onPageSelect={onPageSelect} 
          language={selectedLanguage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
          <Languages className="h-8 w-8" />
          Контент сайта
        </h1>
        <p className="text-muted-foreground">
          Выберите язык для управления контентом
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className="group p-6 border rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
            onClick={() => setSelectedLanguage(lang.code)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {lang.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang.code === 'ru' ? 'Управление русскоязычным контентом' : 'Manage English content'}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors rotate-[-90deg]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageContentMenu;