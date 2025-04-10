
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Word } from '../../types/supabase';
import WordAddModal from './WordAddModal';
import WordEditModal from './WordEditModal';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const WordManagement: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setWords(data || []);
    } catch (error) {
      console.error('Error fetching words:', error);
      toast.error('ไม่สามารถโหลดข้อมูลคำได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = () => {
    setShowAddModal(true);
  };

  const handleEditWord = (word: Word) => {
    setSelectedWord(word);
    setShowEditModal(true);
  };

  const deleteWord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setWords(words.filter(word => word.id !== id));
      toast.success('ลบคำสำเร็จ');
    } catch (error) {
      console.error('Error deleting word:', error);
      toast.error('ไม่สามารถลบคำได้');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">จัดการคำ</h2>
        <Button onClick={handleAddWord}>เพิ่มคำใหม่</Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : words.length === 0 ? (
        <div className="text-center p-12 text-gray-500">ไม่มีคำในระบบ</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คำ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ความหมาย</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">อารมณ์</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {words.map((word) => (
                <tr key={word.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{word.word}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{word.meaning || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{word.emotion_id || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 rounded text-xs font-semibold 
                        ${word.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {word.approved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditWord(word)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('ต้องการลบคำนี้ใช่หรือไม่?')) {
                          deleteWord(word.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <WordAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchWords();
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedWord && (
        <WordEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedWord(null);
          }}
          onSuccess={() => {
            fetchWords();
            setShowEditModal(false);
            setSelectedWord(null);
          }}
          word={selectedWord}
        />
      )}
    </div>
  );
};

export default WordManagement;
