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
    <footer className="relative overflow-hidden border-t-2 border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-secondary/30 to-secondary/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-accent/5 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom section-padding relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Work4Studio
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Создаём сайты, которые работают за вас. Разработка и поддержка на новой скорости с использованием современных технологий.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hello@work4studio.com"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-card/50 to-secondary/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-border/50"
              >
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Написать нам</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-card/50 to-secondary/30 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-border/50"
              >
                <MessageCircle className="w-5 h-5 mr-3 text-primary" />
                <span className="font-medium">Telegram</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xl font-heading font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
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