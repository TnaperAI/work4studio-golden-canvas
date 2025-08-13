import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Language, 
  DEFAULT_LANGUAGE, 
  getLanguageFromPath, 
  addLanguageToPath, 
  removeLanguageFromPath,
  isRootPath 
} from '@/utils/languageRouting';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  // Инициализируем язык из URL
  const [language, setLanguageState] = useState<Language>(() => {
    return getLanguageFromPath(location.pathname);
  });

  // Обновляем язык при изменении URL
  useEffect(() => {
    const newLanguage = getLanguageFromPath(location.pathname);
    if (newLanguage !== language) {
      setLanguageState(newLanguage);
    }
  }, [location.pathname, language]);

  // Редирект с корневого URL на язык по умолчанию
  useEffect(() => {
    if (isRootPath(location.pathname)) {
      const targetPath = addLanguageToPath(location.pathname, DEFAULT_LANGUAGE);
      navigate(targetPath, { replace: true });
      return;
    }
    setIsLoading(false);
  }, [location.pathname, navigate]);

  const setLanguage = (newLanguage: Language) => {
    const currentPath = removeLanguageFromPath(location.pathname);
    const newPath = addLanguageToPath(currentPath, newLanguage);
    navigate(newPath);
  };

  const value = {
    language,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Экспортируем тип для обратной совместимости
export type { Language };