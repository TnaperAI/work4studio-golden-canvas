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
      const { data, error } = await supabase
        .from('cases')
        .select('id, title, description, category, main_image, results, is_featured')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order')
        .limit(6);

      if (error) {
        console.error('Error fetching featured cases:', error);
      } else {
        setCases(data || []);
      }
    } catch (error) {
      console.error('Error fetching featured cases:', error);
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

  if (cases.length === 0) {
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
    <section className="section-padding relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-secondary/10"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-20 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Наши</span>{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">кейсы</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Примеры успешных проектов, которые приносят реальные результаты бизнесу
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Debug info - показать количество кейсов */}
          <div className="text-center mb-8 p-4 bg-yellow-500 text-black rounded">
            <div>Показано {cases.length} кейсов на главной</div>
            <div>Loading: {loading ? 'true' : 'false'}</div>
            <div>Cases data: {JSON.stringify(cases.map(c => ({ id: c.id, title: c.title })))}</div>
          </div>
          
          {/* Простая сетка вместо карусели для отладки */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 bg-red-500 p-4">
            <div className="bg-green-500 p-4 text-black">TEST CARD - Видна ли эта карточка?</div>
            {cases.map((caseItem, index) => (
              <div key={caseItem.id} className="bg-white text-black border-4 border-red-500 rounded-2xl p-4 min-h-[400px]">
                <div className="bg-blue-500 text-white p-2 mb-4">
                  CASE #{index + 1}: {caseItem.title}
                </div>
                
                <div className="bg-gray-200 p-2 mb-2">
                  ID: {caseItem.id}
                </div>
                
                <div className="bg-gray-200 p-2 mb-2">
                  Category: {caseItem.category}
                </div>
                
                <div className="bg-gray-200 p-2 mb-2">
                  Description: {caseItem.description}
                </div>
                
                <div className="bg-gray-200 p-2 mb-2">
                  Image: {caseItem.main_image ? 'YES' : 'NO'}
                </div>
                
                <div className="bg-gray-200 p-2">
                  Results: {caseItem.results ? caseItem.results.length : 0} items
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-on-scroll">
            <Link to="/cases" className="bg-card text-foreground px-8 py-4 rounded-xl font-medium border border-border text-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:border-primary/50 transition-all duration-300 inline-flex items-center space-x-3 hover:scale-105">
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