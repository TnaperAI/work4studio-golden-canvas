import { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Case {
  id: string;
  title: string;
  description: string | null;
  category: string;
  main_image: string | null;
  results: string[] | null;
  is_featured: boolean;
}

const CasesSection = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCases();
  }, []);

  const fetchFeaturedCases = async () => {
    try {
      console.log('🔄 Starting to fetch cases...');
      const { data, error } = await supabase
        .from('cases')
        .select('id, title, description, category, main_image, results, is_featured')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order')
        .limit(6);

      console.log('📊 Cases query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching featured cases:', error);
      } else {
        console.log('✅ Successfully loaded cases:', data);
        setCases(data || []);
      }
    } catch (error) {
      console.error('💥 Exception fetching featured cases:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding relative overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!loading && cases.length === 0) {
    return (
      <section className="section-padding relative overflow-hidden">
        <div className="container-custom">
          <div className="text-center py-16">
            <h2 className="text-2xl font-heading font-bold mb-4">Кейсы скоро появятся</h2>
            <p className="text-muted-foreground">Мы работаем над добавлением наших лучших проектов</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding relative overflow-hidden" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Наши</span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">кейсы</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Примеры успешных проектов, которые приносят реальные результаты бизнесу
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Простая сетка */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseItem, index) => (
              <Link 
                key={caseItem.id} 
                to={`/cases/${caseItem.id}`}
                className="block bg-white border border-gray-200 rounded-2xl group cursor-pointer animate-on-scroll h-full hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  {caseItem.main_image ? (
                    <img
                      src={caseItem.main_image}
                      alt={caseItem.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Изображение не загружено</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full shadow-lg">
                      {caseItem.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <ExternalLink className="w-8 h-8 mx-auto mb-2" />
                      <span className="text-sm font-medium">Посмотреть проект</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-white">
                  <h3 className="text-xl md:text-2xl font-heading font-bold mb-4 text-gray-900">
                    {caseItem.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {caseItem.description || 'Описание проекта'}
                  </p>
                  
                  {caseItem.results && caseItem.results.length > 0 && (
                    <div className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {caseItem.results[0]}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-on-scroll">
            <Link to="/cases" className="bg-card text-card-foreground px-8 py-4 rounded-xl font-medium border border-border text-lg hover:bg-secondary hover:border-primary/30 transition-all duration-300 inline-flex items-center space-x-3 hover:scale-105 shadow-lg">
              <span>Посмотреть все кейсы</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection;