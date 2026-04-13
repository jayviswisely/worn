import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://pbrrtzcvapcqkmafeofr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBicnJ0emN2YXBjcWttYWZlb2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNTI0MDcsImV4cCI6MjA5MTYyODQwN30.jGFf6I6Hgzx_9mHeonBW9taLGL9DHVDgzZi8uQBW0eg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});