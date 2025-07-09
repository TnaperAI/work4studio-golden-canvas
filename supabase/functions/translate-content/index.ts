import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLang, sourceLang = 'ru' }: TranslationRequest = await req.json();

    if (!text || !targetLang) {
      return new Response(
        JSON.stringify({ error: 'Text and target language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Skip translation if already in target language
    if (sourceLang === targetLang) {
      return new Response(
        JSON.stringify({ translatedText: text, success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Translating: "${text}" from ${sourceLang} to ${targetLang}`);

    // MyMemory API call
    const encodedText = encodeURIComponent(text);
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(myMemoryUrl);
    
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus !== 200) {
      throw new Error(`Translation failed: ${data.responseDetails || 'Unknown error'}`);
    }

    const translatedText = data.responseData.translatedText;
    
    console.log(`Translation result: "${translatedText}"`);

    return new Response(
      JSON.stringify({ 
        translatedText, 
        success: true,
        confidence: data.responseData.match || 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});