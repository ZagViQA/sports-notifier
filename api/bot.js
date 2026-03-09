import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase and Bot Client inside the handler so it initializes on each serverless invocation
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
                    const supabase = createClient(supabaseUrl, supabaseServiceKey);

                    console.log(`Connection request: Chat ${chatId} -> User ${userUuid}`);

                    const { data: user, error: fetchError } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', userUuid)
                        .single();

                    if (fetchError || !user) {
                        await bot.sendMessage(chatId, "⚠️ Ошибка связи с веб-приложением. Вернитесь на Кабинет и попробуйте нажать кнопку привязки снова.");
                    } else {
                        // Check if this chat ID is already linked to another (old/anonymous) account
                        const { data: oldUser } = await supabase
                            .from('users')
                            .select('id')
                            .eq('telegram_chat_id', chatId)
                            .single();

                        if (oldUser && oldUser.id !== userUuid) {
                            console.log(`Transferring subscriptions from ${oldUser.id} to ${userUuid}`);

                            // Transfer all old subscriptions to this new user ID
                            await supabase
                                .from('subscriptions')
                                .update({ user_id: userUuid })
                                .eq('user_id', oldUser.id);

                            // Delete the old anonymous user
                            await supabase
                                .from('users')
                                .delete()
                                .eq('id', oldUser.id);
                        }

                        // Finally, link Telegram to the current active user
                        const { error: updateError } = await supabase
                            .from('users')
                            .update({ telegram_chat_id: chatId })
                            .eq('id', userUuid);

                        if (updateError) {
                            await bot.sendMessage(chatId, "⚠️ Произошла ошибка при сохранении Telegram в базу данных.");
                        } else {
                            await bot.sendMessage(chatId, `✅ Отлично! Ваш Telegram успешно привязан.\n\nЗайдите в Личный Кабинет на сайте, чтобы увидеть все перенесенные подписки.`);
                        }
                    }
                }
                // Scenario B: Just plain /start
                else {
                    await bot.sendMessage(chatId, "Привет! 🏟 Я Sports Notifier Bot.\n\nЗайдите на наш сайт, выберите любимые турниры или откройте Кабинет, а затем нажмите кнопку привязки Telegram.");
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
