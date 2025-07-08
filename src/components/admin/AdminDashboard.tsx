import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import ContentManagement from './ContentManagement';
import PageEditor from './PageEditor';

type AdminView = 'dashboard' | 'content' | 'page-editor';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'content') {
        setCurrentView('content');
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

  return <Dashboard />;
};

export default AdminDashboard;