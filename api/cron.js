import { createClient } from '@supabase/supabase-js';
import TelegramBot from 'node-telegram-bot-api';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const token = process.env.TELEGRAM_BOT_TOKEN;

// --- MOCK API DATA ---
const getMockEvents = () => {
    const now = new Date();
    const addTime = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000);

    return [
        { id: 1, sport_id: 'tennis', tournament_id: 'atp_250', title: 'Финал: Медведев - Зверев', start_time: addTime(0.5) },
        { id: 2, sport_id: 'football', tournament_id: 'world_cup_fb', title: 'Бразилия - Аргентина', start_time: addTime(1.5) },
        { id: 3, sport_id: 'volleyball', tournament_id: 'nations_league', title: 'Россия - Польша', start_time: addTime(25) },
        { id: 4, sport_id: 'f1', tournament_id: 'f1_gran_prix', title: 'Гран-при Монако: Гонка', start_time: addTime(24 * 7 + 2) }
    ];
};

const formatDate = (date) => {
    return date.toLocaleString('ru-RU', {
        day: '2-digit', month: 'long',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Europe/Moscow'
    }) + ' (МСК)';
};

// Vercel Serverless Cron Handler
export default async function handler(req, res) {
    console.log(`[${new Date().toISOString()}] Running Vercel notification cron...`);

    // Verify Vercel Cron Secret in production to prevent unauthorized runs
    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const bot = new TelegramBot(token);
        const events = getMockEvents();
        const now = new Date();

        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select(`
                *,
                user:users(telegram_chat_id)
            `);

        if (subError) throw subError;
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).json({ message: 'No subscriptions found' });
        }

        let sentCount = 0;

        for (const event of events) {
            const timeDiffMs = event.start_time.getTime() - now.getTime();
            const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

            // Allow slightly larger margins since Vercel free tier crons run less precisely
            const margin = 0.5; // Half an hour margin for Vercel Crons
            const isMatchStart = Math.abs(timeDiffHours) < margin;
            const isMatch1h = Math.abs(timeDiffHours - 1) < margin;
            const isMatch1d = Math.abs(timeDiffHours - 24) < margin;
            const isMatch1w = Math.abs(timeDiffHours - (24 * 7)) < margin;

            let currentTriggeredPref = null;
            let triggerText = "";

            if (isMatchStart) { currentTriggeredPref = 'start'; triggerText = 'Матч начался!'; }
            else if (isMatch1h) { currentTriggeredPref = '1h'; triggerText = 'Матч начнется в ближайший час'; }
            else if (isMatch1d) { currentTriggeredPref = '1d'; triggerText = 'Матч начнется завтра'; }
            else if (isMatch1w) { currentTriggeredPref = '1w'; triggerText = 'Матч начнется через неделю'; }

            if (!currentTriggeredPref) continue;

            const targetSubs = subscriptions.filter(sub => {
                const wantsThisTournament = sub.tournaments.includes(event.tournament_id);
                const wantsThisTime = Array.isArray(sub.preferences)
                    ? sub.preferences.includes(currentTriggeredPref)
                    : sub.preferences === currentTriggeredPref;
                const hasTelegram = sub.user && sub.user.telegram_chat_id;

                return wantsThisTournament && wantsThisTime && hasTelegram;
            });

            for (const sub of targetSubs) {
                const chatId = sub.user.telegram_chat_id;
                const message = `🚨 <b>Sports Notifier</b>\n\n` +
                    `🏆 ${triggerText}\n\n` +
                    `<b>Событие:</b> ${event.title}\n` +
                    `<b>Начало:</b> ${formatDate(event.start_time)}\n\n` +
                    `<i>Вы получили это уведомление по вашей подписке.</i>`;

                try {
                    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
                    sentCount++;
                } catch (sendErr) {
                    console.error(`Failed to send to ${chatId}:`, sendErr.message);
                }
            }
        }

        return res.status(200).json({ ok: true, sentNotifications: sentCount });

    } catch (err) {
        console.error("Cron Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
