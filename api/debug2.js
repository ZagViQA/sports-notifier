export default function handler(req, res) {
    const keys = Object.keys(process.env).filter(k => k.toLowerCase().includes('supabase') || k.toLowerCase().includes('service'));
    res.status(200).json({
        foundKeys: keys,
        botTokenStarts: process.env.TELEGRAM_BOT_TOKEN ? process.env.TELEGRAM_BOT_TOKEN.substring(0, 5) : null
    });
}
