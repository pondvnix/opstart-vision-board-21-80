
export interface Word {
  id: string;
  word: string;
  meaning?: string | null;
  contributor_id?: string | null;
  emotion_id?: string | null;
  approved: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Emotion {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
}

export interface Contributor {
  id: string;
  auth_id?: string;
  name: string;
  avatar_url?: string | null;
  bio?: string | null;
  total_contributions: number;
  created_at?: string;
  updated_at?: string;
}

export interface Template {
  id: string;
  template_text: string;
  placeholders?: any;
  contributor_id?: string | null;
  emotion_id?: string | null;
  approved: boolean;
  usage_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Sentence {
  id: string;
  sentence_text: string;
  template_id?: string | null;
  emotion_id?: string | null;
  creator_id?: string | null;
  likes_count: number;
  shares_count: number;
  created_at?: string;
}
