import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface NavItemProps {
  name: string;
  href: string;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, isMobile = false, onClick }) => {
  const location = useLocation();
  const { translatedText } = useTranslatedContent(name);
  
  const isActive = (path: string) => location.pathname === path;

  if (isMobile) {
    return (
      <Link
        to={href}
        className={`block px-4 py-3 text-lg font-medium transition-all duration-300 rounded-xl ${
          isActive(href)
            ? 'text-primary bg-gradient-to-r from-primary/10 to-accent/10'
            : 'text-foreground hover:text-primary hover:bg-secondary/50'
        }`}
        onClick={onClick}
      >
        {translatedText}
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={`text-base font-medium transition-all duration-300 relative group ${
        isActive(href)
          ? 'text-primary'
          : 'text-foreground hover:text-primary'
      }`}
    >
      {translatedText}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent transform origin-left transition-transform duration-300 ${
        isActive(href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  );
};

export default NavItem;