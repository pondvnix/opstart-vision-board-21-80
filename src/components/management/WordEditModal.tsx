
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Word, Emotion } from '../../types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface WordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  word: Word;
}

const WordEditModal: React.FC<WordEditModalProps> = ({ isOpen, onClose, onSuccess, word }) => {
  const [wordText, setWordText] = useState(word.word);
  const [meaning, setMeaning] = useState(word.meaning || '');
  const [emotionId, setEmotionId] = useState<string | null>(word.emotion_id);
  const [approved, setApproved] = useState(word.approved);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEmotions, setLoadingEmotions] = useState(true);

  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      setLoadingEmotions(true);
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      console.log('Loaded emotions:', data);
      setEmotions(data || []);
    } catch (error) {
      console.error('Error fetching emotions:', error);
      toast.error('ไม่สามารถโหลดข้อมูลอารมณ์ได้');
    } finally {
      setLoadingEmotions(false);
    }
  };

  const updateWord = async () => {
    if (!wordText.trim()) {
      toast.error('กรุณากรอกคำ');
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } = await supabase
        .from('words')
        .update({
          word: wordText.trim(),
          meaning: meaning.trim() || null,
          emotion_id: emotionId,
          approved: approved,
        })
        .eq('id', word.id)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      toast.success('อัปเดตคำสำเร็จ');
      onSuccess();
    } catch (error) {
      console.error('Error updating word:', error);
      toast.error('ไม่สามารถอัปเดตคำได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขคำ</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-word">คำ</Label>
            <Input
              id="edit-word"
              value={wordText}
              onChange={(e) => setWordText(e.target.value)}
              placeholder="กรอกคำ"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-meaning">ความหมาย (ถ้ามี)</Label>
            <Textarea
              id="edit-meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              placeholder="กรอกความหมาย"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-emotion">อารมณ์</Label>
            <Select
              disabled={loadingEmotions || isSubmitting}
              value={emotionId || ''}
              onValueChange={(value) => setEmotionId(value || null)}
            >
              <SelectTrigger id="edit-emotion">
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
          <div className="flex items-center space-x-2">
            <Switch
              checked={approved}
              onCheckedChange={setApproved}
              disabled={isSubmitting}
              id="approved"
            />
            <Label htmlFor="approved">อนุมัติ</Label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            ยกเลิก
          </Button>
          <Button onClick={updateWord} disabled={isSubmitting || !wordText.trim()}>
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordEditModal;

