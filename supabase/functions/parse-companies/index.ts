import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Инициализируем Supabase клиент
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SearchRequest {
  city: string;
  industry: string;
  limit: number;
}

interface Company {
  company_name: string;
  website?: string;
  email?: string;
  phone?: string;
  city: string;
  industry: string;
  address?: string;
  source_url: string;
}

// Функция для извлечения email из текста
function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return text.match(emailRegex) || [];
}

// Функция для извлечения телефонов из текста
function extractPhones(text: string): string[] {
  const phoneRegex = /(?:\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}/g;
  return text.match(phoneRegex) || [];
}

// Функция для очистки текста от HTML тегов
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Добавляем задержку между запросами
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Получаем случайный User-Agent
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Парсинг открытых справочников напрямую
async function parseDirectorySites(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    console.log(`Поиск компаний в городе ${city}, сфера: ${industry}`);
    
    // Парсим 2ГИС напрямую через их открытый поиск
    const dgisResults = await parse2GIS(city, industry, Math.min(limit, 10));
    companies.push(...dgisResults);
    
    if (companies.length < limit) {
      // Парсим ZOON.RU 
      const zoonResults = await parseZoon(city, industry, Math.min(limit - companies.length, 10));
      companies.push(...zoonResults);
    }
    
    if (companies.length < limit) {
      // Парсим Yell.ru
      const yellResults = await parseYell(city, industry, Math.min(limit - companies.length, 10));
      companies.push(...yellResults);
    }
    
  } catch (error) {
    console.error('Общая ошибка парсинга:', error);
  }
  
  return companies.slice(0, limit);
}

// Парсинг 2ГИС
async function parse2GIS(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    const searchTerm = getIndustryTerms(industry)[0];
    const url = `https://2gis.ru/search/${encodeURIComponent(searchTerm)}?m=${getCityCoords(city)}`;
    
    console.log(`Парсинг 2GIS для ${city}`);
    
    await delay(2000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (response.ok) {
      const html = await response.text();
      
      // Ищем данные компаний в 2ГИС
      const nameMatches = html.match(/data-testid="POI_name"[^>]*>([^<]+)</g) || [];
      const phoneMatches = html.match(/tel:([+\d\s()-]+)/g) || [];
      
      for (let i = 0; i < Math.min(nameMatches.length, limit); i++) {
        const nameMatch = nameMatches[i].match(/>([^<]+)</);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          const phone = phoneMatches[i] ? phoneMatches[i].replace('tel:', '') : undefined;
          
          companies.push({
            company_name: name,
            phone: phone,
            city: city,
            industry: industry,
            source_url: url
          });
          
          console.log(`2ГИС: найдена ${name}`);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка парсинга 2ГИС:', error);
  }
  
  return companies;
}

// Парсинг ZOON.RU
async function parseZoon(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    const searchTerm = getIndustryTerms(industry)[0];
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    const url = `https://zoon.ru/${citySlug}/search/?text=${encodeURIComponent(searchTerm)}`;
    
    console.log(`Парсинг ZOON для ${city}`);
    
    await delay(2000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (response.ok) {
      const html = await response.text();
      
      // Ищем компании в ZOON
      const companyBlocks = html.match(/<div[^>]*class="[^"]*minicard-item[^"]*"[^>]*>[\s\S]*?<\/div>/g) || [];
      
      for (let i = 0; i < Math.min(companyBlocks.length, limit); i++) {
        const block = companyBlocks[i];
        
        const nameMatch = block.match(/class="[^"]*minicard-item__title[^"]*"[^>]*>([^<]+)/);
        const phoneMatch = block.match(/href="tel:([^"]+)"/);
        
        if (nameMatch) {
          const name = stripHtml(nameMatch[1]).trim();
          const phone = phoneMatch ? phoneMatch[1] : undefined;
          
          companies.push({
            company_name: name,
            phone: phone,
            city: city,
            industry: industry,
            source_url: url
          });
          
          console.log(`ZOON: найдена ${name}`);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка парсинга ZOON:', error);
  }
  
  return companies;
}

// Парсинг Yell.ru  
async function parseYell(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    const searchTerm = getIndustryTerms(industry)[0];
    const url = `https://www.yell.ru/search?text=${encodeURIComponent(searchTerm)}&where=${encodeURIComponent(city)}`;
    
    console.log(`Парсинг Yell для ${city}`);
    
    await delay(2000);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (response.ok) {
      const html = await response.text();
      
      // Ищем компании в Yell
      const nameMatches = html.match(/<h2[^>]*class="[^"]*company-name[^"]*"[^>]*>[\s\S]*?<\/h2>/g) || [];
      const phoneMatches = html.match(/class="[^"]*phone[^"]*"[^>]*>([^<]+)/g) || [];
      
      for (let i = 0; i < Math.min(nameMatches.length, limit); i++) {
        const nameMatch = nameMatches[i].match(/>([^<]+)</);
        const phoneMatch = phoneMatches[i] ? phoneMatches[i].match(/>([^<]+)</) : null;
        
        if (nameMatch) {
          const name = stripHtml(nameMatch[1]).trim();
          const phone = phoneMatch ? phoneMatch[1].trim() : undefined;
          
          companies.push({
            company_name: name,
            phone: phone,
            city: city,
            industry: industry,
            source_url: url
          });
          
          console.log(`Yell: найдена ${name}`);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка парсинга Yell:', error);
  }
  
  return companies;
}

// Получаем координаты города для 2ГИС
function getCityCoords(city: string): string {
  const coords: { [key: string]: string } = {
    'москва': '55.755826,37.617300',
    'санкт-петербург': '59.939095,30.315868',
    'новосибирск': '55.030204,82.920430',
    'екатеринбург': '56.838011,60.597465',
    'казань': '55.796127,49.106414',
    'нижний новгород': '56.326797,44.006516'
  };
  
  return coords[city.toLowerCase()] || '55.755826,37.617300';
}

// Получаем синонимы для отрасли
function getIndustryTerms(industry: string): string[] {
  const terms: { [key: string]: string[] } = {
    'медицина': ['медицинский центр', 'клиника', 'поликлиника', 'больница'],
    'стоматология': ['стоматология', 'стоматологическая клиника', 'зубная клиника'],
    'автосервис': ['автосервис', 'автомастерская', 'ремонт автомобилей', 'СТО'],
    'ресторан': ['ресторан', 'кафе', 'столовая', 'пиццерия'],
    'красота': ['салон красоты', 'парикмахерская', 'косметология', 'маникюр'],
    'образование': ['школа', 'образовательный центр', 'курсы', 'обучение'],
    'недвижимость': ['агентство недвижимости', 'риэлтор', 'недвижимость'],
    'спорт': ['фитнес-клуб', 'спортзал', 'тренажерный зал'],
    'юридические': ['юридические услуги', 'адвокат', 'юрист', 'правовые услуги'],
    'строительство': ['строительная компания', 'ремонт', 'строительство']
  };
  
  return terms[industry] || [industry];
}

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, industry, limit }: SearchRequest = await req.json();
    
    console.log(`Начинаем поиск компаний: город=${city}, сфера=${industry}, лимит=${limit}`);
    
    // Парсим компании
    const companies = await parseDirectorySites(city, industry, limit);
    
    console.log(`Найдено ${companies.length} компаний`);
    
    // Сохраняем в базу данных
    const savedCompanies = [];
    for (const company of companies) {
      try {
        const { data, error } = await supabase
          .from('parsed_companies')
          .insert({
            company_name: company.company_name,
            website: company.website,
            email: company.email,
            phone: company.phone,
            city: company.city,
            industry: company.industry,
            address: company.address,
            source_url: company.source_url,
            country: 'russia',
            company_type: 'ooo',
            status: 'new'
          })
          .select()
          .single();
          
        if (!error && data) {
          savedCompanies.push(data);
        } else if (error) {
          console.error('Ошибка сохранения компании:', error);
        }
      } catch (error) {
        console.error('Ошибка при сохранении компании:', error);
      }
    }
    
    console.log(`Сохранено ${savedCompanies.length} компаний в базу данных`);
    
    return new Response(JSON.stringify({
      success: true,
      total: savedCompanies.length,
      companies: savedCompanies
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Ошибка в функции parse-companies:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});