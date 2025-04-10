
import React, { useState, useEffect } from 'react';
import { supabase, fetchEmotions, createEmotionIfNotExists, ensureBasicEmotions } from '../../lib/supabaseClient';
import { Emotion } from '../../types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface WordAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const WordAddModal: React.FC<WordAddModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [wordText, setWordText] = useState('');
  const [meaning, setMeaning] = useState('');
  const [emotionId, setEmotionId] = useState<string | null>(null);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEmotions, setLoadingEmotions] = useState(true);

  useEffect(() => {
    // ตรวจสอบและสร้างอารมณ์พื้นฐานก่อนโหลดข้อมูลอื่น
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      setLoadingEmotions(true);
      
      // ตรวจสอบและสร้างอารมณ์พื้นฐาน
      await ensureBasicEmotions();
      
      // ดึงข้อมูลอารมณ์ทั้งหมด
      const emotionsData = await fetchEmotions();
      console.log('Loaded emotions for AddModal:', emotionsData);
      setEmotions(emotionsData || []);
      
      // ตั้งค่าอารมณ์เริ่มต้นเป็น "positive" ถ้ามี
      const positiveEmotion = emotionsData.find(e => e.name === 'positive');
      if (positiveEmotion) {
        setEmotionId(positiveEmotion.id);
      }
    } catch (error) {
      console.error('Error loading emotions:', error);
      toast.error('ไม่สามารถโหลดข้อมูลอารมณ์ได้');
    } finally {
      setLoadingEmotions(false);
    }
  };

  const addWord = async () => {
    if (!wordText.trim()) {
      toast.error('กรุณากรอกคำ');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // หาอารมณ์เริ่มต้นถ้าไม่มีการเลือก
      let finalEmotionId = emotionId;
      if (!finalEmotionId) {
        // สร้างหรือดึงอารมณ์ 'neutral' เป็นค่าเริ่มต้น
        const neutralEmotion = await createEmotionIfNotExists('neutral', 'อารมณ์เป็นกลาง');
        if (neutralEmotion) {
          finalEmotionId = neutralEmotion.id;
        }
      }

      // ตรวจสอบว่ามีคำนี้อยู่แล้วหรือไม่
      const { data: existingWord } = await supabase
        .from('words')
        .select('id')
        .eq('word', wordText.trim())
        .maybeSingle();
      
      if (existingWord) {
        console.log('Word already exists with ID:', existingWord.id);
        toast.error('คำนี้มีอยู่ในระบบแล้ว');
        setIsSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from('words')
        .insert([
          {
            word: wordText.trim(),
            meaning: meaning.trim() || null,
            emotion_id: finalEmotionId,
            approved: false,
          },
        ])
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      toast.success('เพิ่มคำสำเร็จ');
      onSuccess();
      
      // รีเซ็ตฟอร์ม
      setWordText('');
      setMeaning('');
      setEmotionId(null);
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error('ไม่สามารถเพิ่มคำได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>เพิ่มคำใหม่</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="word">คำ</Label>
            <Input
              id="word"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="กรอกคำ"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="meaning">ความหมาย (ถ้ามี)</Label>
            <Textarea
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="กรอกความหมาย"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emotion">อารมณ์</Label>
            <Select
              disabled={loadingEmotions || isSubmitting}
              value={emotionId || ''}
              onValueChange={(value) => setEmotionId(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกอารมณ์" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ไม่ระบุ</SelectItem>
                {emotions.map((emotion) => (
                  <SelectItem key={emotion.id} value={emotion.id}>
                    {emotion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button onClick={addWord} disabled={isSubmitting || !wordText.trim()}>
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordAddModal;
