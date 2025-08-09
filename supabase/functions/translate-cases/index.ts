// Supabase Edge Function: translate-cases
// Translates case content to English and upserts into case_translations
// Uses OpenRouter API via OPENROUTER_API_KEY secret

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (!OPENROUTER_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing required secrets" }), { status: 500 });
  }

  try {
    // Fetch active cases
    const casesRes = await fetch(`${SUPABASE_URL}/rest/v1/cases?select=id,title,short_description,description,results,h1_tag,meta_title,meta_description,meta_keywords,og_title,og_description,og_image&is_active=eq.true`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!casesRes.ok) throw new Error(`Fetch cases failed: ${await casesRes.text()}`);
    const cases = await casesRes.json();

    if (!Array.isArray(cases) || cases.length === 0) {
      return new Response(JSON.stringify({ message: "No cases to translate" }), { status: 200 });
    }

    // Fetch existing EN translations
    const ids = cases.map((c: any) => c.id).join(",");
    const trRes = await fetch(`${SUPABASE_URL}/rest/v1/case_translations?select=case_id&language=eq.en&case_id=in.(${ids})`, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });
    if (!trRes.ok) throw new Error(`Fetch translations failed: ${await trRes.text()}`);
    const existing = await trRes.json();
    const existingIds = new Set(existing.map((t: any) => t.case_id));

    const toTranslate = cases.filter((c: any) => !existingIds.has(c.id));
    if (toTranslate.length === 0) {
      return new Response(JSON.stringify({ message: "All EN translations exist" }), { status: 200 });
    }

    const upserts: any[] = [];

    for (const item of toTranslate) {
      const prompt = `Translate the following Russian case content to natural, concise English. Return strict JSON with keys: title, short_description, description, results (array of strings), h1_tag, meta_title, meta_description, meta_keywords, og_title, og_description. If a field is empty, return empty string.\n\nTITLE: ${item.title || ''}\nSHORT_DESCRIPTION: ${item.short_description || ''}\nDESCRIPTION: ${item.description || ''}\nRESULTS: ${(item.results || []).join("; ")}\nH1: ${item.h1_tag || ''}\nMETA_TITLE: ${item.meta_title || ''}\nMETA_DESCRIPTION: ${item.meta_description || ''}\nMETA_KEYWORDS: ${item.meta_keywords || ''}\nOG_TITLE: ${item.og_title || ''}\nOG_DESCRIPTION: ${item.og_description || ''}`;

      const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a professional translator. Respond with only valid JSON." },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
        }),
      });

      if (!resp.ok) throw new Error(`OpenRouter error: ${await resp.text()}`);
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "{}";
      let parsed;
      try { parsed = JSON.parse(content); } catch { parsed = {}; }

      upserts.push({
        case_id: item.id,
        language: 'en',
        title: parsed.title || item.title || '',
        short_description: parsed.short_description || item.short_description || null,
        description: parsed.description || item.description || null,
        results: Array.isArray(parsed.results) ? parsed.results : (item.results || []),
        h1_tag: parsed.h1_tag || item.h1_tag || null,
        meta_title: parsed.meta_title || item.meta_title || null,
        meta_description: parsed.meta_description || item.meta_description || null,
        meta_keywords: parsed.meta_keywords || item.meta_keywords || null,
        og_title: parsed.og_title || item.og_title || null,
        og_description: parsed.og_description || item.og_description || null,
        og_image: item.og_image || null,
      });
    }

    if (upserts.length > 0) {
      const upRes = await fetch(`${SUPABASE_URL}/rest/v1/case_translations`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(upserts),
      });
      if (!upRes.ok) throw new Error(`Upsert failed: ${await upRes.text()}`);
    }

    return new Response(JSON.stringify({ translated: upserts.length }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});