import ContentCategories from './ContentCategories';

interface ContentManagementProps {
  onPageSelect: (pageSlug: string) => void;
}

const ContentManagement = ({ onPageSelect }: ContentManagementProps) => {
  return <ContentCategories onPageSelect={onPageSelect} />;
};

export default ContentManagement;