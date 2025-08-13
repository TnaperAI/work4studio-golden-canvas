// Утилиты для работы с языковыми маршрутами

export type Language = 'ru' | 'en';

export const DEFAULT_LANGUAGE: Language = 'ru';
export const SUPPORTED_LANGUAGES: Language[] = ['ru', 'en'];

/**
 * Извлекает язык из pathname URL
 */
export const getLanguageFromPath = (pathname: string): Language => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] as Language;
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return firstSegment;
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * Удаляет языковой префикс из пути
 */
export const removeLanguageFromPath = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] as Language;
  
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

/**
 * Добавляет языковой префикс к пути
 */
export const addLanguageToPath = (pathname: string, language: Language): string => {
  const cleanPath = removeLanguageFromPath(pathname);
  
  if (language === DEFAULT_LANGUAGE) {
    return cleanPath || '/';
  }
  
  return `/${language}${cleanPath}`;
};

/**
 * Получает локализованный путь для ссылки
 */
export const getLocalizedPath = (path: string, language: Language): string => {
  // Убираем языковой префикс если есть
  const cleanPath = removeLanguageFromPath(path);
  
  // Добавляем нужный языковой префикс
  return addLanguageToPath(cleanPath, language);
};

/**
 * Проверяет, является ли путь корневым (без языкового префикса)
 */
export const isRootPath = (pathname: string): boolean => {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length === 0 || !SUPPORTED_LANGUAGES.includes(segments[0] as Language);
};

/**
 * Получает альтернативные языковые URL для hreflang тегов
 */
export const getAlternativeLanguageUrls = (currentPath: string, baseUrl: string = window.location.origin): Record<Language, string> => {
  const cleanPath = removeLanguageFromPath(currentPath);
  
  return {
    ru: `${baseUrl}${addLanguageToPath(cleanPath, 'ru')}`,
    en: `${baseUrl}${addLanguageToPath(cleanPath, 'en')}`
  };
};