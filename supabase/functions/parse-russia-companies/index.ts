import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface ParsedCompany {
  company_name: string;
  company_type: 'ip' | 'ooo' | 'zao' | 'pao' | 'other';
  registration_number?: string;
  country: 'ru';
  region?: string;
  city?: string;
  address?: string;
  registration_date?: string;
  email?: string;
  website?: string;
  industry?: string;
  source_url: string;
}

function getRandomSearchQuery(): string {
  const queries = [
    "ООО",
    "ЗАО", 
    "ПАО",
    "ИП",
    "строительство",
    "торговля", 
    "услуги",
    "производство",
    "IT",
    "консалтинг",
    "логистика",
    "медицина",
    "образование",
    "ресторан"
  ];
  
  return queries[Math.floor(Math.random() * queries.length)];
}

function mapCompanyType(opfCode: string): 'ip' | 'ooo' | 'zao' | 'pao' | 'other' {
  if (!opfCode) return 'other';
  
  switch (opfCode) {
    case '50102': return 'ip';
    case '12300':
    case '12200': return 'ooo';
    case '12267': return 'zao';
    case '12247': return 'pao';
    default: return 'other';
  }
}

serve(async (req) => {
  console.log('🚀 НОВАЯ ФУНКЦИЯ ЗАПУЩЕНА!');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('✅ Проверка API ключей:');
    console.log('PERPLEXITY_API_KEY:', perplexityApiKey ? 'ЕСТЬ' : 'НЕТ');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Получаем дату для поиска
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const searchDate = yesterday.toISOString().split('T')[0];
    
    console.log('📅 Дата поиска:', searchDate);
    
    let companies: ParsedCompany[] = [];
    
    // Пробуем получить данные через Perplexity AI
    if (perplexityApiKey) {
      console.log('🤖 Запрос к Perplexity AI...');
      
      try {
        const industries = ['строительство', 'IT', 'торговля', 'производство', 'услуги'];
        const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
        
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${perplexityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Ты помощник для поиска российских компаний. Отвечай только в формате JSON массива с полями: name, type, city, region, industry, website. Максимум 5 компаний.'
              },
              {
                role: 'user',
                content: `Найди 5 реальных российских компаний в сфере "${randomIndustry}" с их контактными данными и сайтами`
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 1000,
            return_images: false,
            return_related_questions: false,
            search_recency_filter: 'month'
          }),
        });

        console.log('📊 Статус ответа Perplexity:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              const jsonMatch = content.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                const companiesData = JSON.parse(jsonMatch[0]);
                
                companies = companiesData.map((company: any, index: number) => ({
                  company_name: company.name || `Компания ${index + 1}`,
                  company_type: 'ooo' as const,
                  registration_number: `700${Math.floor(Math.random() * 10000000000)}${index}`,
                  country: 'ru' as const,
                  region: company.region || 'Москва',
                  city: company.city || 'Москва',
                  address: `${company.city || 'Москва'}, ул. ${Math.floor(Math.random() * 100)}`,
                  registration_date: searchDate,
                  industry: company.industry || randomIndustry,
                  source_url: 'perplexity.ai',
                  email: `info@company${index + 1}.ru`,
                  website: company.website || `https://company${index + 1}.ru`
                }));
                
                console.log('🎉 Обработано компаний через Perplexity:', companies.length);
              }
            } catch (parseError) {
              console.error('❌ Ошибка парсинга JSON от Perplexity:', parseError);
            }
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Ошибка Perplexity:', response.status, errorText);
        }
        
      } catch (error) {
        console.error('❌ Ошибка при запросе к Perplexity:', error);
      }
    }
    
    // Если нет данных от DaData, используем демо
    if (companies.length === 0) {
      console.log('⚠️ Используем демо данные');
      companies = [
        {
          company_name: 'ООО "Демо Компания" (ТЕСТ)',
          company_type: 'ooo',
          registration_number: '1234567890123',
          country: 'ru',
          region: 'Москва',
          city: 'Москва',
          address: 'г. Москва, ул. Тестовая, д. 1',
          registration_date: searchDate,
          industry: 'Тестирование API',
          source_url: 'demo-data',
          email: 'test@example.com',
          website: 'https://example.com'
        }
      ];
    }
    
    // Сохраняем в базу
    console.log('💾 Сохранение в базу данных...');
    const { data, error } = await supabase
      .from('parsed_companies')
      .insert(companies)
      .select();
      
    if (error) {
      console.error('❌ Ошибка сохранения:', error);
      throw error;
    }
    
    console.log('✅ Успешно сохранено:', data?.length || 0, 'компаний');
    
    return new Response(JSON.stringify({
      success: true,
      companies_found: companies.length,
      companies_saved: data?.length || 0,
      date: searchDate,
      source: companies[0]?.source_url,
      message: companies[0]?.source_url === 'dadata.ru' ? 'Получены реальные данные!' : 'Использованы демо данные'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});