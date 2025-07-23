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

// Парсинг справочника организаций
async function parseOrgPage(city: string, industry: string, limit: number): Promise<Company[]> {
  const companies: Company[] = [];
  
  try {
    console.log(`Поиск компаний в городе ${city}, сфера: ${industry}`);
    
    // Формируем поисковый запрос для поиска по открытым справочникам
    const searchQueries = [
      `${industry} ${city} сайт email`,
      `${industry} ${city} контакты`,
      `организации ${industry} ${city}`,
    ];

    for (const query of searchQueries) {
      if (companies.length >= limit) break;
      
      console.log(`Поиск по запросу: ${query}`);
      
      // Используем поиск через DuckDuckGo (не блокирует так активно как Google)
      const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:list-org.com OR site:orgpage.ru OR site:orginfo.ru')}`;
      
      try {
        const response = await fetch(searchUrl, {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
          },
        });

        if (response.ok) {
          const html = await response.text();
          const text = stripHtml(html);
          
          // Извлекаем ссылки на страницы организаций
          const orgLinks = html.match(/https?:\/\/(list-org\.com|orgpage\.ru|orginfo\.ru)[^\s"'>]+/g) || [];
          
          // Парсим каждую найденную страницу организации
          for (const link of orgLinks.slice(0, 5)) {
            if (companies.length >= limit) break;
            
            try {
              await delay(Math.random() * 2000 + 1000); // Задержка 1-3 сек
              
              const orgResponse = await fetch(link, {
                headers: { 'User-Agent': getRandomUserAgent() }
              });
              
              if (orgResponse.ok) {
                const orgHtml = await orgResponse.text();
                const orgText = stripHtml(orgHtml);
                
                // Извлекаем данные компании
                const emails = extractEmails(orgText);
                const phones = extractPhones(orgText);
                
                // Попытка извлечь название компании из title или h1
                const titleMatch = orgHtml.match(/<title[^>]*>([^<]+)</i);
                const h1Match = orgHtml.match(/<h1[^>]*>([^<]+)</i);
                
                let companyName = '';
                if (titleMatch) {
                  companyName = stripHtml(titleMatch[1]).split('-')[0].trim();
                } else if (h1Match) {
                  companyName = stripHtml(h1Match[1]).trim();
                }
                
                if (companyName && companyName.length > 3) {
                  // Поиск сайта компании
                  const websiteMatch = orgText.match(/https?:\/\/[^\s,)]+\.(?:ru|com|org|net)/g);
                  const website = websiteMatch ? websiteMatch[0] : undefined;
                  
                  companies.push({
                    company_name: companyName,
                    website: website,
                    email: emails[0],
                    phone: phones[0],
                    city: city,
                    industry: industry,
                    source_url: link
                  });
                  
                  console.log(`Найдена компания: ${companyName}`);
                }
              }
            } catch (error) {
              console.error(`Ошибка парсинга страницы ${link}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`Ошибка поиска по запросу ${query}:`, error);
      }
      
      // Задержка между разными запросами
      await delay(Math.random() * 3000 + 2000); // 2-5 сек
    }
    
    // Если мало результатов, попробуем альтернативные источники
    if (companies.length < limit / 2) {
      console.log('Пробуем альтернативные источники...');
      
      // Поиск через справочники малого бизнеса
      const mspQuery = `${industry} ${city} site:sbis.ru OR site:kartoteka.ru`;
      const mspUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(mspQuery)}`;
      
      try {
        await delay(2000);
        const response = await fetch(mspUrl, {
          headers: { 'User-Agent': getRandomUserAgent() }
        });
        
        if (response.ok) {
          const html = await response.text();
          // Дополнительная обработка для других источников
          console.log('Найдены дополнительные источники');
        }
      } catch (error) {
        console.error('Ошибка поиска в альтернативных источниках:', error);
      }
    }
    
  } catch (error) {
    console.error('Общая ошибка парсинга:', error);
  }
  
  return companies;
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
    const companies = await parseOrgPage(city, industry, limit);
    
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