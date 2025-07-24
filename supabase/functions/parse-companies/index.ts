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

// Парсинг Яндекс.Справочника через публичные данные
async function parseYandexDirectory(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    console.log(`Поиск компаний в городе ${city}, сфера: ${industry}`);
    
    // Создаем более эффективные поисковые запросы
    const searchTerms = getIndustryTerms(industry);
    
    for (const term of searchTerms) {
      if (companies.length >= limit) break;
      
      const query = `${term} ${city} контакты`;
      console.log(`Поиск по запросу: ${query}`);
      
      // Используем более надежные источники
      const sources = [
        `https://www.google.com/search?q=${encodeURIComponent(query + ' site:zoon.ru')}`,
        `https://www.google.com/search?q=${encodeURIComponent(query + ' site:yell.ru')}`,
        `https://www.google.com/search?q=${encodeURIComponent(query + ' site:flamp.ru')}`,
      ];
      
      for (const searchUrl of sources) {
        if (companies.length >= limit) break;
        
        try {
          await delay(Math.random() * 3000 + 2000); // 2-5 сек задержка
          
          const response = await fetch(searchUrl, {
            headers: {
              'User-Agent': getRandomUserAgent(),
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.1',
              'Referer': 'https://www.google.com/',
              'Connection': 'keep-alive',
            },
          });

          if (response.ok) {
            const html = await response.text();
            
            // Извлекаем ссылки на страницы организаций
            const pageLinks = extractPageLinks(html, searchUrl);
            
            // Парсим каждую найденную страницу
            for (const link of pageLinks.slice(0, 3)) {
              if (companies.length >= limit) break;
              
              try {
                await delay(Math.random() * 2000 + 1000);
                
                const pageData = await parseSinglePage(link, city, industry);
                if (pageData) {
                  companies.push(pageData);
                  console.log(`Найдена компания: ${pageData.company_name}`);
                }
              } catch (error) {
                console.error(`Ошибка парсинга страницы ${link}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Ошибка поиска:`, error);
        }
      }
      
      await delay(Math.random() * 2000 + 1000);
    }
    
  } catch (error) {
    console.error('Общая ошибка парсинга:', error);
  }
  
  return companies;
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

// Извлекаем ссылки на страницы компаний
function extractPageLinks(html: string, sourceUrl: string): string[] {
  const links: string[] = [];
  
  if (sourceUrl.includes('zoon.ru')) {
    const zoonLinks = html.match(/https?:\/\/[^\/]*zoon\.ru[^\s"'>]+/g) || [];
    links.push(...zoonLinks);
  }
  
  if (sourceUrl.includes('yell.ru')) {
    const yellLinks = html.match(/https?:\/\/[^\/]*yell\.ru[^\s"'>]+/g) || [];
    links.push(...yellLinks);
  }
  
  if (sourceUrl.includes('flamp.ru')) {
    const flampLinks = html.match(/https?:\/\/[^\/]*flamp\.ru[^\s"'>]+/g) || [];
    links.push(...flampLinks);
  }
  
  return [...new Set(links)].slice(0, 5);
}

// Парсим отдельную страницу компании
async function parseSinglePage(url: string, city: string, industry: string): Promise<Company | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': getRandomUserAgent() }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    const text = stripHtml(html);
    
    // Извлекаем название компании
    let companyName = '';
    const titleMatch = html.match(/<title[^>]*>([^<]+)</i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)</i);
    
    if (titleMatch) {
      companyName = stripHtml(titleMatch[1]).split('—')[0].split('|')[0].trim();
    } else if (h1Match) {
      companyName = stripHtml(h1Match[1]).trim();
    }
    
    if (!companyName || companyName.length < 3) return null;
    
    // Извлекаем контакты
    const emails = extractEmails(text);
    const phones = extractPhones(text);
    
    // Ищем сайт компании
    const websiteMatch = text.match(/(?:сайт:|website:|www\.|http)[^\s]*([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.(?:ru|com|org|net|бел))/gi);
    const website = websiteMatch ? websiteMatch[0].replace(/^(сайт:|website:)/i, '').trim() : undefined;
    
    return {
      company_name: companyName,
      website: website,
      email: emails[0],
      phone: phones[0],
      city: city,
      industry: industry,
      source_url: url
    };
    
  } catch (error) {
    console.error(`Ошибка парсинга страницы ${url}:`, error);
    return null;
  }
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
    const companies = await parseYandexDirectory(city, industry, limit);
    
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