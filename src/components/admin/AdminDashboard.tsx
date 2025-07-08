import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import ContentManagement from './ContentManagement';
import ContactSubmissionsManagement from './ContactSubmissionsManagement';
import PageEditor from './PageEditor';

type AdminView = 'dashboard' | 'content' | 'page-editor' | 'submissions' | 'settings';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'content') {
        setCurrentView('content');
      } else if (hash === 'submissions') {
        setCurrentView('submissions');
      } else if (hash === 'settings') {
        setCurrentView('settings');
      } else if (hash === 'dashboard' || hash === '') {
        setCurrentView('dashboard');
      }
    };

    // Set initial view based on current hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handlePageSelect = (pageSlug: string) => {
    setSelectedPageSlug(pageSlug);
    setCurrentView('page-editor');
  };

  const handleBackToContent = () => {
    setCurrentView('content');
    setSelectedPageSlug('');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'page-editor' && selectedPageSlug) {
    return (
      <PageEditor 
        pageSlug={selectedPageSlug} 
        onBack={handleBackToContent}
      />
    );
  }

  if (currentView === 'content') {
    return (
      <ContentManagement onPageSelect={handlePageSelect} />
    );
  }

  if (currentView === 'submissions') {
    return <ContactSubmissionsManagement />;
  }

  if (currentView === 'settings') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold">Настройки</h1>
          <p className="text-muted-foreground">
            Общие настройки административной панели
          </p>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p>Раздел настроек находится в разработке</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default AdminDashboard;