import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslateRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
}

interface TranslateResponse {
  translatedText: string;
  success: boolean;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body: TranslateRequest = await req.json();
    const { text, fromLanguage, toLanguage } = body;

    if (!text || !fromLanguage || !toLanguage) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: text, fromLanguage, toLanguage' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create translation prompt
    const languageNames = {
      'ru': 'Russian',
      'en': 'English'
    };

    const fromLangName = languageNames[fromLanguage as keyof typeof languageNames] || fromLanguage;
    const toLangName = languageNames[toLanguage as keyof typeof languageNames] || toLanguage;

    const prompt = `You are a professional translator. Translate the following text from ${fromLangName} to ${toLangName}. 

IMPORTANT RULES:
- Only return the translated text, no explanations or additional comments
- Preserve the original meaning and tone
- Keep formatting if any (HTML tags, markdown, etc.)
- For web/marketing content, use natural and engaging language
- For technical terms, use appropriate professional terminology

Text to translate:
${text}`;

    console.log('Translating text:', { text: text.substring(0, 100), fromLanguage, toLanguage });

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://lovable.dev", // Optional, for traffic analytics
        "X-Title": "Work4Studio Translation Service", // Optional, shows in rankings
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-8b-instruct:free", // Using free model for cost efficiency
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "max_tokens": 1000,
        "temperature": 0.3, // Lower temperature for more consistent translations
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    const translatedText = data.choices[0].message.content.trim();

    const result: TranslateResponse = {
      translatedText,
      success: true
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Translation error:", error);
    
    const result: TranslateResponse = {
      translatedText: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };

    return new Response(JSON.stringify(result), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});