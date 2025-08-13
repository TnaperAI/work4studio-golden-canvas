import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath } from '@/utils/languageRouting';

interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  preserveLanguage?: boolean; // По умолчанию true
}

/**
 * Компонент ссылки с автоматической локализацией URL
 * Автоматически добавляет языковой префикс к пути
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({ 
  to, 
  preserveLanguage = true, 
  ...props 
}) => {
  const { language } = useLanguage();
  
  // Если preserveLanguage = false, используем оригинальный путь
  const localizedTo = preserveLanguage ? getLocalizedPath(to, language) : to;
  
  return <Link to={localizedTo} {...props} />;
};

export default LocalizedLink;