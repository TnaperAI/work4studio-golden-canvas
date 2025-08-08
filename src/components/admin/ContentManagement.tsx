import ContentCategories from './ContentCategories';

interface ContentManagementProps {
  onPageSelect: (pageSlug: string) => void;
  language: 'ru' | 'en';
}

const ContentManagement = ({ onPageSelect, language }: ContentManagementProps) => {
  return <ContentCategories onPageSelect={onPageSelect} language={language} />;
};

export default ContentManagement;