import { createClient } from '@supabase/supabase-js';
import { INITIAL_TYRES, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_SETTINGS } from './src/data/seedData.ts';

const supabaseUrl = 'https://qvogydeqpptymdzizwbz.supabase.co';
const supabaseAnonKey = 'sb_publishable_R6cBT_vd18C8Pz3mKekzZw_mDH_QHuS';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase REST API Connection to:', supabaseUrl);

  try {
    const { data, error } = await supabase.from('categories').select('*').limit(5);
    if (error) {
      console.log('Categories query response:', error.message);
    } else {
      console.log('Successfully connected to Supabase REST API! Categories:', data);
    }
  } catch (err) {
    console.error('Connection test error:', err);
  }
}

testSupabaseConnection();
