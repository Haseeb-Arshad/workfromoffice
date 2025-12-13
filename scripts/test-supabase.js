const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
    const envConfig = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.includes('=')) {
            const [key, val] = line.split('=');
            process.env[key.trim()] = val.trim();
        }
    });
} catch (e) {
    console.error("Could not read .env.local");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Checking Supabase Connection...");
console.log("URL Present:", !!supabaseUrl);
console.log("Key Present:", !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error("Connection Failed:", error.message);
        } else {
            console.log("Connection Successful! Profiles count query executed.");
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
