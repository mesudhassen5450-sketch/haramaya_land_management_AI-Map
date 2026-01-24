export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      disputes: {
        Row: {
          assigned_to: string | null
          complainant_id: string | null
          created_at: string | null
          description: string
          dispute_id: string
          dispute_type: string
          evidence_files: Json | null
          id: string
          parcel_id: string | null
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          respondent_id: string | null
          status: Database["public"]["Enums"]["dispute_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          complainant_id?: string | null
          created_at?: string | null
          description: string
          dispute_id: string
          dispute_type: string
          evidence_files?: Json | null
          id?: string
          parcel_id?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          respondent_id?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          complainant_id?: string | null
          created_at?: string | null
          description?: string
          dispute_id?: string
          dispute_type?: string
          evidence_files?: Json | null
          id?: string
          parcel_id?: string | null
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          respondent_id?: string | null
          status?: Database["public"]["Enums"]["dispute_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_complainant_id_fkey"
            columns: ["complainant_id"]
            isOneToOne: false
            referencedRelation: "land_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "land_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          category: string
          created_at: string
          id: string
          inquiry_id: string
          message: string
          priority: string
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          inquiry_id: string
          message: string
          priority?: string
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          inquiry_id?: string
          message?: string
          priority?: string
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      land_owners: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          kebele: string | null
          national_id: string | null
          owner_type: string | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          kebele?: string | null
          national_id?: string | null
          owner_type?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          kebele?: string | null
          national_id?: string | null
          owner_type?: string | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      land_parcels: {
        Row: {
          area_sqm: number
          boundaries: Json | null
          coordinates: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          kebele: string | null
          land_use: Database["public"]["Enums"]["land_use_type"]
          location: string | null
          notes: string | null
          owner_id: string | null
          parcel_id: string
          registration_date: string | null
          status: Database["public"]["Enums"]["parcel_status"] | null
          title_deed_number: string | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          area_sqm: number
          boundaries?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          kebele?: string | null
          land_use?: Database["public"]["Enums"]["land_use_type"]
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          parcel_id: string
          registration_date?: string | null
          status?: Database["public"]["Enums"]["parcel_status"] | null
          title_deed_number?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          area_sqm?: number
          boundaries?: Json | null
          coordinates?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          kebele?: string | null
          land_use?: Database["public"]["Enums"]["land_use_type"]
          location?: string | null
          notes?: string | null
          owner_id?: string | null
          parcel_id?: string
          registration_date?: string | null
          status?: Database["public"]["Enums"]["parcel_status"] | null
          title_deed_number?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_parcels_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "land_owners"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          bank_name: string | null
          created_at: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string
          processed_by: string | null
          receipt_number: string
          reference_number: string | null
          tax_assessment_id: string
        }
        Insert: {
          amount: number
          bank_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          processed_by?: string | null
          receipt_number: string
          reference_number?: string | null
          tax_assessment_id: string
        }
        Update: {
          amount?: number
          bank_name?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          processed_by?: string | null
          receipt_number?: string
          reference_number?: string | null
          tax_assessment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_tax_assessment_id_fkey"
            columns: ["tax_assessment_id"]
            isOneToOne: false
            referencedRelation: "tax_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          kebele: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          kebele?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          kebele?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_valuations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          assessed_value: number
          created_at: string | null
          id: string
          infrastructure_score: number | null
          is_current: boolean | null
          location_factor: number | null
          market_value: number | null
          notes: string | null
          parcel_id: string
          valuated_by: string | null
          valuation_date: string
          valuation_method: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          assessed_value: number
          created_at?: string | null
          id?: string
          infrastructure_score?: number | null
          is_current?: boolean | null
          location_factor?: number | null
          market_value?: number | null
          notes?: string | null
          parcel_id: string
          valuated_by?: string | null
          valuation_date?: string
          valuation_method?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          assessed_value?: number
          created_at?: string | null
          id?: string
          infrastructure_score?: number | null
          is_current?: boolean | null
          location_factor?: number | null
          market_value?: number | null
          notes?: string | null
          parcel_id?: string
          valuated_by?: string | null
          valuation_date?: string
          valuation_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_valuations_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      role_audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          target_user_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tax_assessments: {
        Row: {
          assessed_value: number
          created_at: string | null
          created_by: string | null
          due_date: string
          exemption_amount: number | null
          exemption_type: string | null
          fiscal_year: number
          id: string
          notes: string | null
          parcel_id: string
          penalty_amount: number | null
          status: Database["public"]["Enums"]["payment_status"] | null
          tax_amount: number
          tax_id: string
          tax_rate: number
          total_due: number
          updated_at: string | null
          valuation_id: string | null
        }
        Insert: {
          assessed_value: number
          created_at?: string | null
          created_by?: string | null
          due_date: string
          exemption_amount?: number | null
          exemption_type?: string | null
          fiscal_year: number
          id?: string
          notes?: string | null
          parcel_id: string
          penalty_amount?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tax_amount: number
          tax_id: string
          tax_rate: number
          total_due: number
          updated_at?: string | null
          valuation_id?: string | null
        }
        Update: {
          assessed_value?: number
          created_at?: string | null
          created_by?: string | null
          due_date?: string
          exemption_amount?: number | null
          exemption_type?: string | null
          fiscal_year?: number
          id?: string
          notes?: string | null
          parcel_id?: string
          penalty_amount?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          tax_amount?: number
          tax_id?: string
          tax_rate?: number
          total_due?: number
          updated_at?: string | null
          valuation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_assessments_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "land_parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tax_assessments_valuation_id_fkey"
            columns: ["valuation_id"]
            isOneToOne: false
            referencedRelation: "property_valuations"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rates: {
        Row: {
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          id: string
          land_use: Database["public"]["Enums"]["land_use_type"]
          rate: number
          zone: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          id?: string
          land_use: Database["public"]["Enums"]["land_use_type"]
          rate: number
          zone?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          id?: string
          land_use?: Database["public"]["Enums"]["land_use_type"]
          rate?: number
          zone?: string | null
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          roles: Database["public"]["Enums"]["app_role"][]
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          roles?: Database["public"]["Enums"]["app_role"][]
          status?: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          roles?: Database["public"]["Enums"]["app_role"][]
          status?: string
          token?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_invitation: {
        Args: { _token: string; _user_id: string }
        Returns: boolean
      }
      get_invitation_by_token: {
        Args: { _token: string }
        Returns: {
          email: string
          expires_at: string
          id: string
          roles: Database["public"]["Enums"]["app_role"][]
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "land_officer"
        | "tax_officer"
        | "surveyor"
        | "legal_officer"
        | "citizen"
      dispute_status:
        | "open"
        | "under_review"
        | "resolved"
        | "escalated"
        | "closed"
      land_use_type:
        | "residential"
        | "commercial"
        | "agricultural"
        | "public"
        | "mixed"
      parcel_status: "registered" | "pending" | "disputed" | "inactive"
      payment_status: "paid" | "pending" | "overdue" | "partial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "land_officer",
        "tax_officer",
        "surveyor",
        "legal_officer",
        "citizen",
      ],
      dispute_status: [
        "open",
        "under_review",
        "resolved",
        "escalated",
        "closed",
      ],
      land_use_type: [
        "residential",
        "commercial",
        "agricultural",
        "public",
        "mixed",
      ],
      parcel_status: ["registered", "pending", "disputed", "inactive"],
      payment_status: ["paid", "pending", "overdue", "partial"],
    },
  },
} as const
