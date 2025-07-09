import React, { useState } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; name: string; flag: string; nativeName: string }[] = [
    { code: 'ru', name: 'Russian', flag: '🇷🇺', nativeName: 'Русский' },
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl
            bg-secondary/50 hover:bg-secondary border border-border/50
            transition-all duration-300 hover:scale-105
            ${isTranslating ? 'opacity-70 cursor-wait' : ''}
          `}
          disabled={isTranslating}
        >
          <Globe className={`h-4 w-4 ${isTranslating ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {currentLanguage?.flag} {currentLanguage?.nativeName}
          </span>
          <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-48 p-1 bg-card border border-border shadow-xl rounded-xl"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
              transition-all duration-200 hover:bg-primary/10
              ${language === lang.code 
                ? 'bg-primary/20 text-primary font-medium' 
                : 'text-foreground hover:text-primary'
              }
            `}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;