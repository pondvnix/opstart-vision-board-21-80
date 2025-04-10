
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
    // ใช้ "eq" แทนการใช้ ".eq()" เพื่อแก้ไขปัญหาในการค้นหาอารมณ์
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

// Helper function to create a new emotion if it doesn't exist
export const createEmotionIfNotExists = async (name: string, description?: string) => {
  try {
    // ตรวจสอบว่าอารมณ์มีอยู่แล้วหรือไม่
    const { data: existingEmotion, error: fetchError } = await supabase
      .from('emotions')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if emotion exists:', fetchError);
      return null;
    }
    
    // ถ้ามีอารมณ์อยู่แล้วให้ส่งค่ากลับ
    if (existingEmotion) {
      return existingEmotion;
    }
    
    // ถ้าไม่มีอารมณ์ให้สร้างใหม่
    const { data: newEmotion, error: insertError } = await supabase
      .from('emotions')
      .insert([{ name, description: description || `อารมณ์ ${name}` }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating emotion:', insertError);
      return null;
    }
    
    return newEmotion;
  } catch (error) {
    console.error('Exception creating emotion:', error);
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

// Helper function to safely fetch emotions
export const fetchEmotions = async () => {
  try {
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching emotions:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching emotions:', error);
    return [];
  }
};

// Function to get templates for a specific word
export const getTemplatesForWord = async (wordId: string) => {
  try {
    // แก้ไขการใช้ word_id เป็นการจัดการแบบอื่น เนื่องจากไม่มีคอลัมน์ word_id ในตาราง sentences
    // แทนที่จะค้นหาด้วย word_id ให้ส่งคืนเทมเพลตทั้งหมดที่เกี่ยวข้องกับอารมณ์ของคำนั้น
    const { data: word, error: wordError } = await supabase
      .from('words')
      .select('*')
      .eq('id', wordId)
      .single();
    
    if (wordError) {
      console.error('Error fetching word:', wordError);
      return [];
    }
    
    // ถ้าคำไม่มีอารมณ์ให้ส่งเทมเพลตทั้งหมดกลับไป
    if (!word.emotion_id) {
      const { data: allTemplates, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .limit(10);
      
      if (templatesError) {
        console.error('Error fetching all templates:', templatesError);
        return [];
      }
      
      return allTemplates || [];
    }
    
    // ค้นหาเทมเพลตที่มีอารมณ์เดียวกับคำ
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .eq('emotion_id', word.emotion_id);
    
    if (templatesError) {
      console.error('Error fetching templates by emotion:', templatesError);
      return [];
    }
    
    return templates || [];
  } catch (error) {
    console.error('Exception fetching templates for word:', error);
    return [];
  }
};

// Function to delete a word and related records
export const deleteWordAndRelatedRecords = async (wordId: string) => {
  try {
    // ไม่จำเป็นต้องลบข้อมูลที่เกี่ยวข้องใน sentences เนื่องจากไม่มีความสัมพันธ์โดยตรง
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', wordId);
    
    if (error) {
      console.error('Error deleting word:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting word:', error);
    return false;
  }
};
