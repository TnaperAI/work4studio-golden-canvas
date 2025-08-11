import { useState, useEffect } from 'react';
import NewAdminLayout from './NewAdminLayout';
import Dashboard from './Dashboard';
import ContentDashboard from './ContentDashboard';
import ContactSubmissionsManagement from './ContactSubmissionsManagement';
import LegalDocumentsManagement from './LegalDocumentsManagement';
import PageSEOManagement from './PageSEOManagement';
import CompanyParser from './CompanyParser';
import Settings from './Settings';
import UniversalContentEditor from './UniversalContentEditor';

type AdminView = 
  | 'dashboard' 
  | 'pages' 
  | 'submissions' 
  | 'legal' 
  | 'seo' 
  | 'company-parser' 
  | 'settings'
  | 'editor';

const NewAdminDashboard = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editorContext, setEditorContext] = useState<{
    type: 'page' | 'service' | 'case' | 'legal';
    id?: string;
    slug?: string;
  } | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      // Handle editor routes
      if (hash.startsWith('page-editor-')) {
        const slug = hash.replace('page-editor-', '');
        setEditorContext({ type: 'page', slug });
        setCurrentView('editor');
        return;
      }
      
      if (hash.startsWith('service-editor-')) {
        const id = hash.replace('service-editor-', '');
        setEditorContext({ type: 'service', id });
        setCurrentView('editor');
        return;
      }
      
      if (hash.startsWith('case-editor-')) {
        const id = hash.replace('case-editor-', '');
        setEditorContext({ type: 'case', id });
        setCurrentView('editor');
        return;
      }
      
      if (hash.startsWith('legal-editor-')) {
        const id = hash.replace('legal-editor-', '');
        setEditorContext({ type: 'legal', id });
        setCurrentView('editor');
        return;
      }

      // Handle create routes
      if (hash.includes('-create')) {
        const type = hash.replace('-create', '') as 'service' | 'case' | 'legal';
        setEditorContext({ type });
        setCurrentView('editor');
        return;
      }

      // Handle main views
      switch (hash) {
        case 'pages':
          setCurrentView('pages');
          break;
        case 'submissions':
          setCurrentView('submissions');
          break;
        case 'legal':
          setCurrentView('legal');
          break;
        case 'seo':
          setCurrentView('seo');
          break;
        case 'company-parser':
          setCurrentView('company-parser');
          break;
        case 'settings':
          setCurrentView('settings');
          break;
        case 'dashboard':
        case '':
        default:
          setCurrentView('dashboard');
          setEditorContext(null);
          break;
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

  const renderCurrentView = () => {
    if (currentView === 'editor' && editorContext) {
      return (
        <UniversalContentEditor
          type={editorContext.type}
          id={editorContext.id}
          slug={editorContext.slug}
          onBack={() => {
            if (editorContext.type === 'page') {
              window.location.hash = 'pages';
            } else {
              window.location.hash = editorContext.type + 's';
            }
          }}
        />
      );
    }

    switch (currentView) {
      case 'pages':
        return <ContentDashboard />;
      case 'submissions':
        return <ContactSubmissionsManagement />;
      case 'legal':
        return <LegalDocumentsManagement />;
      case 'seo':
        return <PageSEOManagement />;
      case 'company-parser':
        return <CompanyParser />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <NewAdminLayout>
      {renderCurrentView()}
    </NewAdminLayout>
  );
};

export default NewAdminDashboard;