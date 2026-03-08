import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase and Bot Client inside the handler so it initializes on each serverless invocation
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const token = process.env.TELEGRAM_BOT_TOKEN;

// Initialize telegram bot without polling since we use webhooks on Vercel
const bot = new TelegramBot(token);

export default async function handler(req, res) {
    try {
        // Return early if not a POST request
        if (req.method !== 'POST') {
            return res.status(200).send('Sports Notifier Bot Webhook is active.');
        }

        const { body } = req;

        // Make sure we have a message to process
        if (body && body.message) {
            const msg = body.message;
            const chatId = msg.chat.id;
            const text = msg.text || '';

            // 1. Process /start command
            if (text.startsWith('/start')) {
                const parts = text.split(' ');

                // Scenario A: Deep linking connection (/start <UUID>)
                if (parts.length > 1) {
                    const userUuid = parts[1];
                    const supabase = createClient(supabaseUrl, supabaseAnonKey);

                    console.log(`Connection request: Chat ${chatId} -> User ${userUuid}`);

                    const { data: user, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', userUuid)
                        .single();

                    if (fetchError || !user) {
                        await bot.sendMessage(chatId, "⚠️ Ошибка связи с веб-приложением. Вернитесь на сайт и попробуйте снова.");
                    } else {
                        const { error: updateError } = await supabase
                            .from('users')
                            .update({ telegram_chat_id: chatId })
                            .eq('id', userUuid);

                        if (updateError) {
                            await bot.sendMessage(chatId, "⚠️ Произошла ошибка при привязке аккаунта.");
                        } else {
                            await bot.sendMessage(chatId, `✅ Отлично! Ваш Telegram успешно привязан.\n\nТеперь вы будете получать уведомления о любимых турнирах здесь.`);
                        }
                    }
                }
                // Scenario B: Just plain /start
                else {
                    await bot.sendMessage(chatId, "Привет! 🏟 Я Sports Notifier Bot.\n\nЗайдите на наш сайт, выберите любимые турниры и нажмите кнопку привязки Telegram.");
                }
            }
            // 2. Process /ping mapping
            else if (text === '/ping') {
                await bot.sendMessage(chatId, "🏓 Pong! Я на связи.");
            }
        }

        // Always return 200 OK so Telegram doesn't retry
        return res.status(200).json({ ok: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
}
