import ServiceEditorTabs from './ServiceEditorTabs';

interface ServiceEditorProps {
  serviceId?: string;
  onBack: () => void;
}

const ServiceEditor = ({ serviceId, onBack }: ServiceEditorProps) => {
  return (
    <ServiceEditorTabs
      serviceId={serviceId}
      onBack={onBack}
    />
  );
};

export default ServiceEditor;