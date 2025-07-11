import { Link } from 'react-router-dom';
import { Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/services' },
    { name: 'Кейсы', href: '/cases' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contact' },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-2">
          <div className="mb-6">
            <svg
              width="250"
              height="60"
              viewBox="0 0 250 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="hover:scale-105 transition-transform duration-300"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="50%" stopColor="hsl(262 83% 58%)" />
                  <stop offset="100%" stopColor="hsl(217 91% 60%)" />
                </linearGradient>
                <linearGradient id="numberGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" />
                  <stop offset="100%" stopColor="hsl(262 83% 58%)" />
                </linearGradient>
              </defs>
              
              <text
                x="5"
                y="35"
                fontFamily="Orbitron, monospace"
                fontSize="28"
                fontWeight="bold"
                fill="url(#logoGradient)"
              >
                Work
              </text>
              
              <text
                x="95"
                y="35"
                fontFamily="Orbitron, monospace"
                fontSize="28"
                fontWeight="bold"
                fill="url(#numberGradient)"
              >
                4
              </text>
              
              <text
                x="115"
                y="35"
                fontFamily="Orbitron, monospace"
                fontSize="28"
                fontWeight="bold"
                fill="url(#logoGradient)"
              >
                Studio
              </text>
            </svg>
          </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Создаём сайты, которые работают за вас. Разработка и поддержка на новой скорости с использованием современных технологий.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hello@work4studio.com"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium text-card-foreground">Написать нам</span>
              </a>
              <a
                href="https://t.me/work4studio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium text-card-foreground">Telegram</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 text-foreground">
              Навигация
            </h4>
            <ul className="space-y-4">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Quick Links */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Услуги
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                >
                  Разработка сайтов
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                >
                  Лендинги
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                >
                  E-commerce
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 text-lg relative group"
                >
                  Поддержка
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with enhanced styling */}
        <div className="border-t border-gradient-to-r from-transparent via-border to-transparent pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-lg">
              © 2024 Work4Studio. Все права защищены.
            </p>
            <div className="flex items-center space-x-6">
              <Link 
                to="/legal/privacy_policy" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
              >
                Политика конфиденциальности
              </Link>
              <Link 
                to="/legal/terms_of_service" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors underline"
              >
                Пользовательское соглашение
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-muted-foreground">Сделано с</span>
              <span className="text-red-500 text-xl">♥</span>
              <span className="text-sm text-muted-foreground">в России</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;