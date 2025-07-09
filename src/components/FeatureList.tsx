import React from 'react';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

interface FeatureListProps {
  features: string[];
}

const FeatureList: React.FC<FeatureListProps> = ({ features }) => {
  return (
    <ul className="space-y-2 mb-8">
      {features.map((feature, idx) => {
        const { translatedText: featureText } = useTranslatedContent(feature);
        return (
          <li key={idx} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
            {featureText}
          </li>
        );
      })}
    </ul>
  );
};

export default FeatureList;