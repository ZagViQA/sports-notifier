import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    const { data: users, error: uErr } = await supabase.from('users').select('*');
    const { data: subs, error: sErr } = await supabase.from('subscriptions').select('*');
    console.log('--- USERS ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('--- SUBSCRIPTIONS ---');
    console.log(JSON.stringify(subs, null, 2));
}
checkData();
