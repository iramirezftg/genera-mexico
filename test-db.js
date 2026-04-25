require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error, count } = await supabase.from('leads').select('*', { count: 'exact' });
  console.log('Leads data:', data);
  console.log('Leads error:', error);
  console.log('Leads count:', count);
}

test();
