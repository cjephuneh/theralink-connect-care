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
      appointments: {
        Row: {
          client_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          payment_id: string | null
          session_type: string
          start_time: string
          status: string
          therapist_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          session_type: string
          start_time: string
          status?: string
          therapist_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          payment_id?: string | null
          session_type?: string
          start_time?: string
          status?: string
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          dashboard_type: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dashboard_type?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dashboard_type?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          dashboard_type: string
          id: string
          is_read: boolean
          message: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dashboard_type: string
          id?: string
          is_read?: boolean
          message: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dashboard_type?: string
          id?: string
          is_read?: boolean
          message?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      friend_details: {
        Row: {
          areas_of_experience: string | null
          communication_preferences: string | null
          created_at: string
          experience_description: string | null
          friend_id: string
          id: string
          personal_story: string | null
          updated_at: string
        }
        Insert: {
          areas_of_experience?: string | null
          communication_preferences?: string | null
          created_at?: string
          experience_description?: string | null
          friend_id: string
          id?: string
          personal_story?: string | null
          updated_at?: string
        }
        Update: {
          areas_of_experience?: string | null
          communication_preferences?: string | null
          created_at?: string
          experience_description?: string | null
          friend_id?: string
          id?: string
          personal_story?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          profile_image_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          client_id: string
          comment: string
          created_at: string
          id: string
          rating: number
          therapist_id: string
        }
        Insert: {
          client_id: string
          comment: string
          created_at?: string
          id?: string
          rating: number
          therapist_id: string
        }
        Update: {
          client_id?: string
          comment?: string
          created_at?: string
          id?: string
          rating?: number
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          appointment_id: string | null
          client_id: string | null
          content: string
          created_at: string
          id: string
          therapist_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          client_id?: string | null
          content: string
          created_at?: string
          id?: string
          therapist_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string | null
          content?: string
          created_at?: string
          id?: string
          therapist_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_details: {
        Row: {
          application_status: string | null
          created_at: string
          education: string | null
          has_insurance: boolean | null
          id: string
          insurance_info: string | null
          is_verified: boolean | null
          languages: string | null
          license_number: string | null
          license_type: string | null
          session_formats: string | null
          therapist_id: string
          therapy_approaches: string | null
          updated_at: string
        }
        Insert: {
          application_status?: string | null
          created_at?: string
          education?: string | null
          has_insurance?: boolean | null
          id?: string
          insurance_info?: string | null
          is_verified?: boolean | null
          languages?: string | null
          license_number?: string | null
          license_type?: string | null
          session_formats?: string | null
          therapist_id: string
          therapy_approaches?: string | null
          updated_at?: string
        }
        Update: {
          application_status?: string | null
          created_at?: string
          education?: string | null
          has_insurance?: boolean | null
          id?: string
          insurance_info?: string | null
          is_verified?: boolean | null
          languages?: string | null
          license_number?: string | null
          license_type?: string | null
          session_formats?: string | null
          therapist_id?: string
          therapy_approaches?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_details_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string
          hourly_rate: number | null
          id: string
          rating: number | null
          specialization: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id: string
          rating?: number | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string
          hourly_rate?: number | null
          id?: string
          rating?: number | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference: string
          status: string
          therapist_id: string | null
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference: string
          status: string
          therapist_id?: string | null
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference?: string
          status?: string
          therapist_id?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_contact_message: {
        Args: {
          p_name: string
          p_email: string
          p_subject: string
          p_message: string
          p_user_id?: string
        }
        Returns: undefined
      }
      insert_therapist_details: {
        Args: {
          p_therapist_id: string
          p_education: string
          p_license_number: string
          p_license_type: string
          p_therapy_approaches: string
          p_languages: string
          p_insurance_info: string
          p_session_formats: string
          p_has_insurance: boolean
        }
        Returns: undefined
      }
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
