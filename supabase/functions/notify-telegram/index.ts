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
    
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID')

    if (!telegramBotToken || !telegramChatId) {
      console.error('Missing Telegram configuration')
      return new Response(
        JSON.stringify({ error: 'Telegram not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Форматируем сообщение для Telegram
    const telegramMessage = `
🔔 *Новая заявка с сайта Work4Studio*

👤 *Имя:* ${submissionData.name}
📧 *Email:* ${submissionData.email}
📱 *Телефон:* ${submissionData.phone || 'Не указан'}
📝 *Сообщение:* 
${submissionData.message}

🌐 *Источник:* ${submissionData.source}
⏰ *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
`

    // Отправляем сообщение в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    )

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text()
      console.error('Telegram API error:', telegramError)
      throw new Error(`Telegram API error: ${telegramResponse.status}`)
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