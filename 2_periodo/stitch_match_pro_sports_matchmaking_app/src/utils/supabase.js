import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qrzmntjcjujbkiotuaku.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_0wf2f6IOiqp3E3ObtBJXAQ_qiIVQS2s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
