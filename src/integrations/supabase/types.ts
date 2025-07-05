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
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          date: string
          id: string
          intern_id: string | null
          notes: string | null
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date: string
          id?: string
          intern_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          id?: string
          intern_id?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "attendance_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string | null
          criteria: Json
          description: string | null
          icon_url: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          created_at?: string | null
          criteria: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          created_at?: string | null
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_url: string | null
          course_id: string | null
          id: string
          intern_id: string | null
          issued_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          intern_id?: string | null
          issued_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          course_id?: string | null
          id?: string
          intern_id?: string | null
          issued_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          enrolled_at: string | null
          id: string
          intern_id: string | null
          progress_percentage: number | null
          status: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          intern_id?: string | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          enrolled_at?: string | null
          id?: string
          intern_id?: string | null
          progress_percentage?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number | null
          id: string
          instructor_id: string | null
          status: Database["public"]["Enums"]["course_status"] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number | null
          id?: string
          instructor_id?: string | null
          status?: Database["public"]["Enums"]["course_status"] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          topic_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          topic_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "discussion_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_topics: {
        Row: {
          content: string
          course_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          lesson_id: string | null
          title: string
        }
        Insert: {
          content: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lesson_id?: string | null
          title: string
        }
        Update: {
          content?: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lesson_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_topics_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_topics_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      interns: {
        Row: {
          created_at: string | null
          department: string
          email: string
          end_date: string | null
          id: string
          intern_id: string
          is_active: boolean | null
          name: string
          phone: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          end_date?: string | null
          id?: string
          intern_id: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          end_date?: string | null
          id?: string
          intern_id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          start_date?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          intern_id: string | null
          is_completed: boolean | null
          lesson_id: string | null
          notes: string | null
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          intern_id?: string | null
          is_completed?: boolean | null
          lesson_id?: string | null
          notes?: string | null
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          intern_id?: string | null
          is_completed?: boolean | null
          lesson_id?: string | null
          notes?: string | null
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_data: Json | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_required: boolean | null
          module_id: string | null
          order_index: number
          title: string
        }
        Insert: {
          content_data?: Json | null
          content_type: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_required?: boolean | null
          module_id?: string | null
          order_index: number
          title: string
        }
        Update: {
          content_data?: Json | null
          content_type?: Database["public"]["Enums"]["content_type"]
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_required?: boolean | null
          module_id?: string | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempt_number: number
          completed_at: string | null
          id: string
          intern_id: string | null
          max_score: number
          quiz_id: string | null
          score: number
        }
        Insert: {
          answers: Json
          attempt_number: number
          completed_at?: string | null
          id?: string
          intern_id?: string | null
          max_score: number
          quiz_id?: string | null
          score: number
        }
        Update: {
          answers?: Json
          attempt_number?: number
          completed_at?: string | null
          id?: string
          intern_id?: string | null
          max_score?: number
          quiz_id?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          id: string
          options: Json | null
          order_index: number
          points: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["quiz_question_type"]
          quiz_id: string | null
        }
        Insert: {
          correct_answer: string
          id?: string
          options?: Json | null
          order_index: number
          points?: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["quiz_question_type"]
          quiz_id?: string | null
        }
        Update: {
          correct_answer?: string
          id?: string
          options?: Json | null
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["quiz_question_type"]
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          passing_score: number | null
          time_limit_minutes: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          passing_score?: number | null
          time_limit_minutes?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          intern_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          intern_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          intern_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: false
            referencedRelation: "interns"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scores: {
        Row: {
          badges_earned: number | null
          courses_completed: number | null
          id: string
          intern_id: string | null
          quizzes_passed: number | null
          total_points: number | null
          updated_at: string | null
        }
        Insert: {
          badges_earned?: number | null
          courses_completed?: number | null
          id?: string
          intern_id?: string | null
          quizzes_passed?: number | null
          total_points?: number | null
          updated_at?: string | null
        }
        Update: {
          badges_earned?: number | null
          courses_completed?: number | null
          id?: string
          intern_id?: string | null
          quizzes_passed?: number | null
          total_points?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_scores_intern_id_fkey"
            columns: ["intern_id"]
            isOneToOne: true
            referencedRelation: "interns"
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
      attendance_status: "present" | "absent" | "late"
      content_type: "video" | "pdf" | "quiz" | "assignment" | "text"
      course_status: "draft" | "published" | "archived"
      enrollment_status: "enrolled" | "completed" | "dropped"
      quiz_question_type: "multiple_choice" | "true_false" | "short_answer"
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
    Enums: {
      attendance_status: ["present", "absent", "late"],
      content_type: ["video", "pdf", "quiz", "assignment", "text"],
      course_status: ["draft", "published", "archived"],
      enrollment_status: ["enrolled", "completed", "dropped"],
      quiz_question_type: ["multiple_choice", "true_false", "short_answer"],
    },
  },
} as const
