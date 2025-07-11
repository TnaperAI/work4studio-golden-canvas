import { useState } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ContactFormModal from './ContactFormModal';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Главная', href: '/' },
    { name: 'Услуги', href: '/services' },
    { name: 'Кейсы', href: '/cases' },
    { name: 'О нас', href: '/about' },
    { name: 'Контакты', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const downloadLogo = () => {
    // Создаём canvas для генерации логотипа
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Размеры canvas
    canvas.width = 400;
    canvas.height = 120;

    // Фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Настройка текста
    ctx.font = 'bold 36px Inter, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Создаём градиент для текста
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'hsl(262.1 83.3% 57.8%)'); // primary
    gradient.addColorStop(0.5, 'hsl(263 70% 50.4%)'); // accent
    gradient.addColorStop(1, 'hsl(262.1 83.3% 57.8%)'); // primary

    ctx.fillStyle = gradient;
    ctx.fillText('Work4Studio', canvas.width / 2, canvas.height / 2);

    // Скачиваем файл
    const link = document.createElement('a');
    link.download = 'Work4Studio-logo.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-sm">
      <nav className="container-custom relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="group flex items-center hover:scale-105 transition-transform duration-300">
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                
                {/* Logo text */}
                <div className="relative">
                  <span className="font-logo font-bold text-2xl md:text-3xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent group-hover:from-accent group-hover:via-primary group-hover:to-accent transition-all duration-500">
                    Work<span className="text-primary group-hover:text-accent transition-colors duration-500">4</span>Studio
                  </span>
                </div>
              </div>
            </Link>
            
            {/* Download logo button */}
            <button
              onClick={downloadLogo}
              className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-all duration-300 opacity-60 hover:opacity-100"
              title="Скачать логотип"
            >
              <Download size={18} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium transition-all duration-300 relative group ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent transform origin-left transition-transform duration-300 ${
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
            <button 
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => setIsContactModalOpen(true)}
            >
              Обсудить проект
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-secondary/50"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-3 text-lg font-medium transition-all duration-300 rounded-xl ${
                    isActive(item.href)
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-accent/10'
                      : 'text-foreground hover:text-primary hover:bg-secondary/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <button 
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-xl font-semibold text-lg w-full hover:shadow-xl transition-all duration-300 shadow-lg"
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsOpen(false);
                  }}
                >
                  Обсудить проект
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        source="header"
      />
    </header>
  );
};

export default Header;