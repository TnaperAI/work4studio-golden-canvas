import React from 'react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureList from './FeatureList';

interface ServiceItemProps {
  service: {
    id: string;
    title: string;
    slug: string;
    short_description: string;
    features: string[];
    is_active: boolean;
    sort_order: number;
  };
  index: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service, index }) => {
  const { translatedText: title } = useTranslatedContent(service.title);
  const { translatedText: description } = useTranslatedContent(service.short_description);
  const { translatedText: detailsLink } = useTranslatedContent('Подробнее');

  return (
    <div
      key={service.id}
      className="card-premium p-8 group cursor-pointer animate-on-scroll"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex items-start space-x-6">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
          <Globe className="w-8 h-8 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-heading font-semibold mb-4">
            {title}
          </h3>
          
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
          
          {service.features && service.features.length > 0 && (
            <FeatureList features={service.features.slice(0, 4)} />
          )}
          
          <Link
            to={`/services/${service.slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {detailsLink}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;