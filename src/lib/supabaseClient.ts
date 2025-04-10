
import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
const supabaseUrl = 'https://pdojfgjtcelcrlqtguvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkb2pmZ2p0Y2VsY3JscXRndXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQyNzQsImV4cCI6MjA1OTc3MDI3NH0.q3lBNSMWkOPg8LZ77PQ9ZZnTcWn8_ddmvkorXFrKMy4';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
