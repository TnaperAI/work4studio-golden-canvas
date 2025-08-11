import { useState } from 'react';
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
  Search
} from 'lucide-react';

interface NewAdminLayoutProps {
  children: React.ReactNode;
}

const NewAdminLayout = ({ children }: NewAdminLayoutProps) => {
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Дашборд', href: '#dashboard', icon: Home },
    { name: 'Основные страницы', href: '#pages', icon: FileText },
    { name: 'Заявки', href: '#submissions', icon: Users },
    { name: 'Команда', href: '#team', icon: Users },
    { name: 'SEO настройки', href: '#seo', icon: Globe },
    { name: 'Правовые документы', href: '#legal', icon: Scale },
    { name: 'Поиск компаний', href: '#company-parser', icon: Search },
    { name: 'Настройки', href: '#settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    const hash = window.location.hash.replace('#', '');
    if (path === '#dashboard') return hash === 'dashboard' || hash === '';
    return hash === path.replace('#', '');
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
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
          <h1 className="text-xl font-heading font-bold">CMS Админка</h1>
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center px-6">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold">Work4Studio CMS</h2>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NewAdminLayout;