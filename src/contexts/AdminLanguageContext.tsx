import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AdminLanguage = 'ru' | 'en';

interface AdminLanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  toggleLanguage: () => void;
}

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

interface AdminLanguageProviderProps {
  children: ReactNode;
}

export const AdminLanguageProvider: React.FC<AdminLanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<AdminLanguage>('ru');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ru' ? 'en' : 'ru');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
  };

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLanguage = (): AdminLanguageContextType => {
  const context = useContext(AdminLanguageContext);
  if (context === undefined) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return context;
};