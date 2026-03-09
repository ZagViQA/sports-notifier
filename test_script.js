import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

    console.log('Fetching dummy user from DB to simulate login...');
    // We just get the user id 
    const { data: users } = await supabase.from('users').select('*').limit(1);
    if (!users || users.length === 0) {
        console.log('No user found to inject.');
        return;
    }
    const user = users[0];

    await page.goto('http://localhost:5173/');

    await page.evaluate((uid) => {
        const fakeSession = {
            user: { id: uid, email: "test@example.com" },
            session: { access_token: "fake", user: { id: uid, email: "test@example.com" } }
        };
        // The key is usually sb-YOUR_PROJECT_ID-auth-token
        // We will just patch supabase.auth.getSession by overriding it for the test
        window.localStorage.setItem('sb-test-auth', JSON.stringify(fakeSession));
    }, user.id);

    // But we can't easily fake the session for supabase-js unless we mock it or have a real token.
    // Instead of faking, I'll just check if Dashboard throws an error by importing the component code.

    await browser.close();
})();
