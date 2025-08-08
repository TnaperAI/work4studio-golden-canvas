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
    console.log('Starting translation request');
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    console.log('API Key exists:', !!OPENROUTER_API_KEY);
    
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

    console.log('Request body:', { text: text.substring(0, 50), fromLanguage, toLanguage });

    if (!text || !fromLanguage || !toLanguage) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: text, fromLanguage, toLanguage' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create simple translation prompt
    const languageNames = {
      'ru': 'Russian',
      'en': 'English'
    };

    const fromLangName = languageNames[fromLanguage as keyof typeof languageNames] || fromLanguage;
    const toLangName = languageNames[toLanguage as keyof typeof languageNames] || toLanguage;

    const prompt = `Translate the following text from ${fromLangName} to ${toLangName}. Only return the translated text, no explanations:

${text}`;

    console.log('Making request to OpenRouter...');

    // Call OpenRouter API with simple model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://lovable.dev",
        "X-Title": "Work4Studio Translation Service",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response data:', JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenRouter API');
    }

    const translatedText = data.choices[0].message.content.trim();
    console.log('Translation result:', translatedText);

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