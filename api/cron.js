import { createClient } from '@supabase/supabase-js';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const token = process.env.TELEGRAM_BOT_TOKEN;
const apiKey = process.env.API_SPORTS_KEY;

const f1ApiHeaders = {
    'x-apisports-key': apiKey,
    'x-rapidapi-host': 'v1.formula-1.api-sports.io'
};

const apiHeaders = {
    'x-apisports-key': apiKey,
    'x-rapidapi-host': 'v3.football.api-sports.io'
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

    if (process.env.CRON_SECRET && req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const bot = new TelegramBot(token);
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Convert dates to YYYY-MM-DD
        const toDateString = (d) => d.toISOString().split('T')[0];

        // 1. Fetch Subscriptions
        const { data: subscriptions, error: subError } = await supabase
            .from('subscriptions')
            .select(`*, user:users(telegram_chat_id)`);

        if (subError) throw subError;
        if (!subscriptions || subscriptions.length === 0) {
            return res.status(200).json({ message: 'No subscriptions found' });
        }

        // 2. Map Tournaments users are subscribed to
        const activeFootballLeagueIds = new Set();
        const prefersF1 = subscriptions.some(s => s.tournaments.includes('1') && s.sports.includes('f1'));

        subscriptions.forEach(sub => {
            if (sub.sports.includes('football')) {
                sub.tournaments.forEach(id => activeFootballLeagueIds.add(id));
            }
        });

        const liveEvents = [];

        // 3. Fetch FOOTBALL Data from API-Sports
        // Only fetch events for the next 7 days to cover the "1w" preference
        if (activeFootballLeagueIds.size > 0) {
            try {
                // Free tier limits to fetching by date.
                // Because of constraints, in a real app we'd fetch specific leagues,
                // but the easiest approach is to get fixtures for specific dates and filter.
                // We'll fetch today, tomorrow, and a week from now.

                const datesToFetch = [toDateString(now), toDateString(tomorrow), toDateString(nextWeek)];

                for (const date of datesToFetch) {
                    const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
                        headers: apiHeaders,
                        params: { date: date, timezone: 'Europe/Moscow' }
                    });

                    if (response.data && response.data.response) {
                        const fixtures = response.data.response;
                        fixtures.forEach(fixture => {
                            // Check if it's one of our leagues
                            if (activeFootballLeagueIds.has(fixture.league.id.toString())) {
                                liveEvents.push({
                                    id: `fb_${fixture.fixture.id}`,
                                    sport_id: 'football',
                                    tournament_id: fixture.league.id.toString(),
                                    title: `${fixture.teams.home.name} vs ${fixture.teams.away.name}`,
                                    start_time: new Date(fixture.fixture.date)
                                });
                            }
                        });
                    }
                }
            } catch (fbErr) {
                console.error("Football API Error:", fbErr?.response?.data || fbErr.message);
            }
        }

        // 4. Fetch FORMULA 1 Data from API-Sports
        if (prefersF1) {
            try {
                // Since we are testing and the API might not have 2026 data yet, we use 2024
                const f1Response = await axios.get('https://v1.formula-1.api-sports.io/races', {
                    headers: f1ApiHeaders,
                    params: { season: 2024, type: 'race', timezone: 'Europe/Moscow' }
                });

                if (f1Response.data && f1Response.data.response) {
                    const races = f1Response.data.response;
                    if (races.length > 0) {
                        // For demonstration purposes so the user actually receives a notification RIGHT NOW,
                        // we take the first race and pretend it starts in 5 minutes.
                        const demoRace = races[0];
                        const fakeStartTime = new Date(now.getTime() + 5 * 60 * 1000); // starts in 5 mins

                        liveEvents.push({
                            id: `f1_demo_${demoRace.id}`,
                            sport_id: 'f1',
                            tournament_id: '1',
                            title: `🏎 ${demoRace.competition.name} (Тестовый матч)`,
                            start_time: fakeStartTime
                        });
                    }
                }
            } catch (f1Err) {
                console.error("F1 API Error:", f1Err?.response?.data || f1Err.message);
            }
        }

        // 5. Matches formatting & notifications (Common Logic)
        let sentCount = 0;

        for (const event of liveEvents) {
            const timeDiffMs = event.start_time.getTime() - now.getTime();
            const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

            const margin = 0.5; // Half an hour margin
            const isMatchStart = Math.abs(timeDiffHours) < margin;
            const isMatch1h = Math.abs(timeDiffHours - 1) < margin;
            const isMatch1d = Math.abs(timeDiffHours - 24) < margin;
            const isMatch1w = Math.abs(timeDiffHours - (24 * 7)) < margin;

            let currentTriggeredPref = null;
            let triggerText = "";

            if (isMatchStart) { currentTriggeredPref = 'start'; triggerText = 'Матч скоро начнется!'; }
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

        return res.status(200).json({
            ok: true,
            eventsFound: liveEvents.length,
            sentNotifications: sentCount
        });

    } catch (err) {
        console.error("Cron Error:", err);
        return res.status(500).json({ error: err.message });
    }
}
