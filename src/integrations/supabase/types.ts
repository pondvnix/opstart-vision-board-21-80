export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contributor_rankings: {
        Row: {
          contributor_id: string | null
          created_at: string | null
          id: string
          period_end: string | null
          period_start: string | null
          rank_type: string
          score: number | null
          updated_at: string | null
        }
        Insert: {
          contributor_id?: string | null
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank_type: string
          score?: number | null
          updated_at?: string | null
        }
        Update: {
          contributor_id?: string | null
          created_at?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          rank_type?: string
          score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contributor_rankings_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
        ]
      }
      contributors: {
        Row: {
          auth_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          total_contributions: number | null
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          total_contributions?: number | null
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          total_contributions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      emotions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sentences: {
        Row: {
          created_at: string | null
          creator_id: string | null
          emotion_id: string | null
          id: string
          likes_count: number | null
          sentence_text: string
          shares_count: number | null
          template_id: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          emotion_id?: string | null
          id?: string
          likes_count?: number | null
          sentence_text: string
          shares_count?: number | null
          template_id?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          emotion_id?: string | null
          id?: string
          likes_count?: number | null
          sentence_text?: string
          shares_count?: number | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sentences_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentences_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sentences_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      statistics: {
        Row: {
          created_at: string | null
          date_recorded: string | null
          id: string
          period: string | null
          stat_type: string
          stat_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          period?: string | null
          stat_type: string
          stat_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          period?: string | null
          stat_type?: string
          stat_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      templates: {
        Row: {
          approved: boolean | null
          contributor_id: string | null
          created_at: string | null
          emotion_id: string | null
          id: string
          placeholders: Json | null
          template_text: string
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          approved?: boolean | null
          contributor_id?: string | null
          created_at?: string | null
          emotion_id?: string | null
          id?: string
          placeholders?: Json | null
          template_text: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          approved?: boolean | null
          contributor_id?: string | null
          created_at?: string | null
          emotion_id?: string | null
          id?: string
          placeholders?: Json | null
          template_text?: string
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotions"
            referencedColumns: ["id"]
          },
        ]
      }
      words: {
        Row: {
          approved: boolean | null
          contributor_id: string | null
          created_at: string | null
          emotion_id: string | null
          id: string
          meaning: string | null
          updated_at: string | null
          word: string
        }
        Insert: {
          approved?: boolean | null
          contributor_id?: string | null
          created_at?: string | null
          emotion_id?: string | null
          id?: string
          meaning?: string | null
          updated_at?: string | null
          word: string
        }
        Update: {
          approved?: boolean | null
          contributor_id?: string | null
          created_at?: string | null
          emotion_id?: string | null
          id?: string
          meaning?: string | null
          updated_at?: string | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "words_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "contributors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "words_emotion_id_fkey"
            columns: ["emotion_id"]
            isOneToOne: false
            referencedRelation: "emotions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
