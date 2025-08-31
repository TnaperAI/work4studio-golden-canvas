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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const submissionData: ContactSubmissionData = await req.json()
    
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || Deno.env.get('TELEGRAM_TOKEN')
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID') || Deno.env.get('TELEGRAM_CHATID')

    if (!telegramBotToken || !telegramChatId) {
      console.error('Missing Telegram configuration', {
        hasToken: Boolean(telegramBotToken),
        hasChatId: Boolean(telegramChatId),
      })
      return new Response(
        JSON.stringify({ error: 'Telegram not configured', hasToken: Boolean(telegramBotToken), hasChatId: Boolean(telegramChatId) }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Проверяем валидность токена бота
    const meResp = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`)
    if (!meResp.ok) {
      const details = await meResp.text()
      console.error('Telegram getMe failed:', details)
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram bot token', details }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Форматируем сообщение для Telegram
    const telegramMessage = `\n🔔 Новая заявка с сайта Work4Studio\n\n👤 Имя: ${submissionData.name}\n📧 Email: ${submissionData.email}\n📱 Телефон: ${submissionData.phone || 'Не указан'}\n📝 Сообщение: \n${submissionData.message}\n\n🌐 Источник: ${submissionData.source}\n⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}\n`

    // Приводим chat_id к числу, если это только цифры
    const chatId: number | string = /^\d+$/.test(telegramChatId) ? Number(telegramChatId) : telegramChatId

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
        }),
      }
    )

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text()
      console.error('Telegram API error:', telegramError)
      return new Response(
        JSON.stringify({ error: 'Telegram API error', details: telegramError }),
        { status: telegramResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Telegram notification sent successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent to Telegram' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in notify-telegram function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
}

serve(handler)