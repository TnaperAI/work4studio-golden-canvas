import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactSubmissionData {
  name: string
  email: string
  phone?: string | null
  message: string
  source: string
  // optional debug overrides
  telegram_bot_token?: string
  telegram_chat_id?: string | number
  token?: string
  chat_id?: string | number
  _debugToken?: string
  _debugChatId?: string | number
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const submissionData: ContactSubmissionData = await req.json()

    const envToken = Deno.env.get('TELEGRAM_BOT_TOKEN')?.trim()
    const envChatId = Deno.env.get('TELEGRAM_CHAT_ID')?.trim()

    // allow debug overrides from body ONLY if envs are missing (useful to diagnose secret issues)
    const telegramBotToken = envToken || submissionData.telegram_bot_token || submissionData.token || submissionData._debugToken
    const telegramChatIdRaw = envChatId || submissionData.telegram_chat_id || submissionData.chat_id || submissionData._debugChatId

    if (!telegramBotToken || !telegramChatIdRaw) {
      console.error('Missing Telegram configuration (v2)', {
        hasToken: Boolean(telegramBotToken),
        hasChatId: Boolean(telegramChatIdRaw),
      })
      return new Response(
        JSON.stringify({ error: 'Telegram not configured', hasToken: Boolean(telegramBotToken), hasChatId: Boolean(telegramChatIdRaw) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate bot token
    const meResp = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`)
    if (!meResp.ok) {
      const details = await meResp.text()
      console.error('Telegram getMe failed (v2):', details)
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram bot token', details }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const chatId: number | string = typeof telegramChatIdRaw === 'string' && /^-?\d+$/.test(telegramChatIdRaw)
      ? Number(telegramChatIdRaw)
      : telegramChatIdRaw

    const telegramMessage = `\n🔔 Новая заявка с сайта Work4Studio (v2)\n\n👤 Имя: ${submissionData.name}\n📧 Email: ${submissionData.email}\n📱 Телефон: ${submissionData.phone || 'Не указан'}\n📝 Сообщение: \n${submissionData.message}\n\n🌐 Источник: ${submissionData.source}\n⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n`

    const telegramResponse = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
    })

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text()
      console.error('Telegram API error (v2):', telegramError)
      return new Response(
        JSON.stringify({ error: 'Telegram API error', details: telegramError }),
        { status: telegramResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Telegram notification sent successfully (v2)')

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram (v2)' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Error in notify-telegram2 function:', error)
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})