import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  LogOut, 
  Menu,
  X,
  Scale,
  Globe,
  Search,
  ChevronDown,
  Languages
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Дашборд', href: '#dashboard', icon: Home },
    { 
      name: 'Контент сайта', 
      href: '#content', 
      icon: Languages,
      hasDropdown: true,
      subItems: [
        { name: 'Русский контент', href: '#content-ru' },
        { name: 'English Content', href: '#content-en' }
      ]
    },
    { name: 'Заявки', href: '#submissions', icon: Users },
    { name: 'Поиск компаний', href: '#company-parser', icon: Search },
    { name: 'SEO настройки', href: '#seo', icon: Globe },
    { name: 'Правовые документы', href: '#legal', icon: Scale },
    { name: 'Настройки', href: '#settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    const hash = window.location.hash.replace('#', '');
    if (path === '#dashboard') return hash === 'dashboard' || hash === '';
    if (path === '#content') return hash === 'content' || hash === 'content-ru' || hash === 'content-en';
    if (path === '#content-ru') return hash === 'content-ru';
    if (path === '#content-en') return hash === 'content-en';
    if (path === '#submissions') return hash === 'submissions';
    if (path === '#company-parser') return hash === 'company-parser';
    if (path === '#seo') return hash === 'seo';
    if (path === '#legal') return hash === 'legal';
    if (path === '#settings') return hash === 'settings';
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-heading font-bold">Админка</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            
            if (item.hasDropdown) {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`
                        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-48">
                    {item.subItems?.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <a
                          href={subItem.href}
                          className={`w-full cursor-pointer ${
                            isActive(subItem.href)
                              ? 'bg-muted text-primary font-medium'
                              : ''
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          {subItem.name}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            
            return (
              <a
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">
            Роль: <span className="font-medium">{role}</span>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold">Work4Studio - Административная панель</h2>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;