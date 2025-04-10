
import { createClient } from '@supabase/supabase-js';

// Supabase project configuration
const supabaseUrl = 'https://pdojfgjtcelcrlqtguvd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkb2pmZ2p0Y2VsY3JscXRndXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTQyNzQsImV4cCI6MjA1OTc3MDI3NH0.q3lBNSMWkOPg8LZ77PQ9ZZnTcWn8_ddmvkorXFrKMy4';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to get emotions by name
export const getEmotionByName = async (name: string) => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) {
      console.error('Error fetching emotion:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching emotion:', error);
    return null;
  }
};

// Helper function to safely fetch all approved words
export const fetchApprovedWords = async () => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching approved words:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching approved words:', error);
    return [];
  }
};

