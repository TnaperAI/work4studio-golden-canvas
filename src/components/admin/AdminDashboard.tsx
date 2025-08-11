import { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import ContentManagement from './ContentManagement';
import LanguageContentMenu from './LanguageContentMenu';
import ContactSubmissionsManagement from './ContactSubmissionsManagement';
import PageEditor from './PageEditor';
import Settings from './Settings';
import LegalDocumentsManagement from './LegalDocumentsManagement';
import PageSEOManagement from './PageSEOManagement';

type AdminView = 'dashboard' | 'content' | 'content-ru' | 'content-en' | 'page-editor' | 'submissions' | 'legal' | 'seo' | 'settings';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'ru' | 'en'>('ru');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'content') {
        setCurrentView('content');
      } else if (hash === 'content-ru') {
        setCurrentView('content-ru');
      } else if (hash === 'content-en') {
        setCurrentView('content-en');
      } else if (hash === 'submissions') {
        setCurrentView('submissions');
      } else if (hash === 'legal') {
        setCurrentView('legal');
      } else if (hash === 'seo') {
        setCurrentView('seo');
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
    const hash = window.location.hash.replace('#', '');
    setSelectedLanguage(hash === 'content-en' ? 'en' : 'ru');
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
        language={selectedLanguage}
      />
    );
  }

  if (currentView === 'content') {
    return (
      <LanguageContentMenu onPageSelect={handlePageSelect} />
    );
  }

  if (currentView === 'content-ru') {
    return (
      <ContentManagement onPageSelect={handlePageSelect} language="ru" />
    );
  }

  if (currentView === 'content-en') {
    return (
      <ContentManagement onPageSelect={handlePageSelect} language="en" />
    );
  }

  if (currentView === 'submissions') {
    return <ContactSubmissionsManagement />;
  }

  if (currentView === 'legal') {
    return <LegalDocumentsManagement />;
  }

  if (currentView === 'seo') {
    return <PageSEOManagement />;
  }

  if (currentView === 'settings') {
    return <Settings />;
  }

  return <Dashboard />;
};

export default AdminDashboard;