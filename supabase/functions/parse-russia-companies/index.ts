import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const dadataApiKey = Deno.env.get('DADATA_API_KEY');
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
    console.log('DADATA_API_KEY:', dadataApiKey ? 'ЕСТЬ' : 'НЕТ');
    console.log('Длина ключа:', dadataApiKey?.length || 0);
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Получаем дату для поиска
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const searchDate = yesterday.toISOString().split('T')[0];
    
    console.log('📅 Дата поиска:', searchDate);
    
    let companies: ParsedCompany[] = [];
    
    // Пробуем получить данные от DaData
    if (dadataApiKey) {
      console.log('🔍 Запрос к DaData API...');
      
      try {
        const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Token ${dadataApiKey}`
          },
          body: JSON.stringify({
            query: getRandomSearchQuery(),
            count: 5
          })
        });

        console.log('📊 Статус ответа DaData:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Получено предложений:', data.suggestions?.length || 0);
          
          if (data.suggestions && data.suggestions.length > 0) {
            companies = data.suggestions.map((suggestion: any) => {
              const company = suggestion.data;
              
              return {
                company_name: company.name?.full_with_opf || company.name?.short_with_opf || 'Неизвестно',
                company_type: mapCompanyType(company.opf?.code),
                registration_number: company.ogrn,
                country: 'ru' as const,
                region: company.address?.data?.region_with_type,
                city: company.address?.data?.city_with_type,
                address: company.address?.value,
                registration_date: company.state?.registration_date ? 
                  new Date(company.state.registration_date).toISOString().split('T')[0] : 
                  searchDate,
                industry: company.okved,
                source_url: 'dadata.ru',
                email: undefined,
                website: undefined
              };
            });
            
            console.log('🎉 Обработано компаний:', companies.length);
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Ошибка DaData:', response.status, errorText);
        }
        
      } catch (error) {
        console.error('❌ Ошибка при запросе к DaData:', error);
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