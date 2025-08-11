import { useState, useEffect } from 'react';
import NewAdminLayout from './NewAdminLayout';
import Dashboard from './Dashboard';
import ContentDashboard from './ContentDashboard';
import ContactSubmissionsManagement from './ContactSubmissionsManagement';
import ContactContentManagement from './ContactContentManagement';
import LegalDocumentsManagement from './LegalDocumentsManagement';
import PageSEOManagement from './PageSEOManagement';
import CompanyParser from './CompanyParser';
import TeamManagement from './TeamManagement';
import Settings from './Settings';
import UniversalContentEditor from './UniversalContentEditor';

type AdminView = 
  | 'dashboard' 
  | 'pages' 
  | 'submissions' 
  | 'contact-content'
  | 'legal' 
  | 'seo' 
  | 'company-parser'
  | 'team' 
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
      if (hash === 'services-create') {
        setEditorContext({ type: 'service' });
        setCurrentView('editor');
        return;
      }
      
      if (hash === 'cases-create') {
        setEditorContext({ type: 'case' });
        setCurrentView('editor');
        return;
      }
      
      if (hash === 'legal-create') {
        setEditorContext({ type: 'legal' });
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
        case 'contact-content':
          setCurrentView('contact-content');
          break;
        case 'services':
          setCurrentView('pages'); // Services are managed through ContentDashboard
          break;
        case 'cases':
          setCurrentView('pages'); // Cases are managed through ContentDashboard
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
        case 'team':
          setCurrentView('team');
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
            } else if (editorContext.type === 'service' || editorContext.type === 'case') {
              window.location.hash = 'pages'; // Go back to ContentDashboard
            } else {
              window.location.hash = 'legal';
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
      case 'contact-content':
        return <ContactContentManagement />;
      case 'legal':
        return <LegalDocumentsManagement />;
      case 'seo':
        return <PageSEOManagement />;
      case 'company-parser':
        return <CompanyParser />;
      case 'team':
        return <TeamManagement />;
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