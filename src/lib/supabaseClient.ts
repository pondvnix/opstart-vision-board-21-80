
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

// Helper function to get emotions by name ด้วยการแก้ไขวิธีการค้นหา
export const getEmotionByName = async (name: string) => {
  try {
    console.log(`Attempting to fetch emotion with name: ${name}`);
    // แก้ไขการค้นหาอารมณ์โดยใช้ filter() ซึ่งทำงานได้ดีกว่าการใช้ eq()
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .filter('name', 'eq', name)
      .maybeSingle();
    
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
    console.log(`Checking if emotion '${name}' exists or creating it...`);
    
    // พยายามค้นหาอารมณ์ในฐานข้อมูลก่อน
    const { data: existingEmotion, error: fetchError } = await supabase
      .from('emotions')
      .select('*')
      .filter('name', 'eq', name)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking if emotion exists:', fetchError);
      return null;
    }
    
    // ถ้ามีอารมณ์อยู่แล้วให้ส่งค่ากลับ
    if (existingEmotion) {
      console.log(`Emotion '${name}' already exists with ID: ${existingEmotion.id}`);
      return existingEmotion;
    }
    
    // ถ้าไม่มีอารมณ์ให้สร้างใหม่
    console.log(`Creating new emotion '${name}'`);
    const { data: newEmotion, error: insertError } = await supabase
      .from('emotions')
      .insert([{ 
        name, 
        description: description || `อารมณ์ ${name}` 
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating emotion:', insertError);
      return null;
    }
    
    console.log(`Created emotion '${name}' with ID: ${newEmotion.id}`);
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
    console.log('Fetching all emotions...');
    const { data, error } = await supabase
      .from('emotions')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching emotions:', error);
      return [];
    }
    
    console.log(`Fetched ${data?.length || 0} emotions`);
    return data || [];
  } catch (error) {
    console.error('Exception fetching emotions:', error);
    return [];
  }
};

// Function to get templates for a specific word - แก้ไขเพื่อค้นหาด้วย template_text
export const getTemplatesForWord = async (wordId: string) => {
  try {
    console.log(`Fetching templates for word with ID: ${wordId}`);
    
    // ค้นหาคำและอารมณ์ที่เกี่ยวข้อง
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
      console.log('Word has no emotion, fetching all templates');
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
    
    // ค้นหาเทมเพลตที่มีอารมณ์เดียวกับคำ - แก้ไขการใช้คอลัมน์จาก template เป็น template_text
    console.log(`Fetching templates with emotion_id: ${word.emotion_id}`);
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('*')
      .eq('emotion_id', word.emotion_id);
    
    if (templatesError) {
      console.error('Error fetching templates by emotion:', templatesError);
      return [];
    }
    
    console.log(`Found ${templates?.length || 0} templates for emotion_id: ${word.emotion_id}`);
    return templates || [];
  } catch (error) {
    console.error('Exception fetching templates for word:', error);
    return [];
  }
};

// Function to delete a word and related records - แก้ไขเพื่อลบเฉพาะคำโดยไม่เกี่ยวข้องกับ word_id ใน sentences
export const deleteWordAndRelatedRecords = async (wordId: string) => {
  try {
    console.log(`Deleting word with ID: ${wordId}`);
    
    // ตรวจสอบว่ามีคำที่ต้องการลบอยู่จริงหรือไม่
    const { data: word, error: checkError } = await supabase
      .from('words')
      .select('*')
      .eq('id', wordId)
      .single();
    
    if (checkError) {
      console.error('Error finding word for deletion:', checkError);
      console.log(`Word not found for deletion: ${wordId}`);
      return false;
    }
    
    // ลบคำจากฐานข้อมูล - ไม่มีการลบข้อมูลที่เกี่ยวข้องอื่นๆ เนื่องจากไม่มีความสัมพันธ์โดยตรง
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', wordId);
    
    if (error) {
      console.error('Error deleting word:', error);
      return false;
    }
    
    console.log(`Successfully deleted word with ID: ${wordId}`);
    return true;
  } catch (error) {
    console.error('Exception deleting word:', error);
    return false;
  }
};

// ฟังก์ชันสำหรับเตรียมข้อมูลอารมณ์พื้นฐาน - เพิ่มใหม่
export const ensureBasicEmotions = async () => {
  try {
    console.log('Ensuring basic emotions exist...');
    
    // สร้างอารมณ์พื้นฐาน 3 อารมณ์
    const positiveEmotion = await createEmotionIfNotExists('positive', 'อารมณ์เชิงบวก เช่น ความสุข ความหวัง กำลังใจ');
    const neutralEmotion = await createEmotionIfNotExists('neutral', 'อารมณ์เป็นกลาง');
    const negativeEmotion = await createEmotionIfNotExists('negative', 'อารมณ์เชิงลบ เช่น ความเศร้า ความกังวล');
    
    console.log('Basic emotions created/checked:');
    console.log('- Positive:', positiveEmotion?.id);
    console.log('- Neutral:', neutralEmotion?.id);
    console.log('- Negative:', negativeEmotion?.id);
    
    return {
      positive: positiveEmotion,
      neutral: neutralEmotion,
      negative: negativeEmotion
    };
  } catch (error) {
    console.error('Error ensuring basic emotions:', error);
    return null;
  }
};
