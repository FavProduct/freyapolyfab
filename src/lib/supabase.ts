import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdtdtwluzmbwvxytgpdj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdGR0d2x1em1id3Z4eXRncGRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjU4NTEsImV4cCI6MjEwMzc0MTg1MX0.lmIAoqK2wVjSuouAoRLP5EPNvGQUV5ZYSjjAWx_KjIc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
