export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      case_translations: {
        Row: {
          canonical_url: string | null
          case_id: string
          created_at: string
          description: string | null
          h1_tag: string | null
          id: string
          language: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          results: string[]
          short_description: string | null
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          case_id: string
          created_at?: string
          description?: string | null
          h1_tag?: string | null
          id?: string
          language: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          results?: string[]
          short_description?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          case_id?: string
          created_at?: string
          description?: string | null
          h1_tag?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          results?: string[]
          short_description?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_translations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          budget_range: string | null
          canonical_url: string | null
          category: Database["public"]["Enums"]["case_category"]
          client_name: string | null
          created_at: string
          description: string | null
          gallery_images: string[] | null
          h1_tag: string | null
          id: string
          is_active: boolean
          is_featured: boolean | null
          main_image: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          project_date: string | null
          project_duration: string | null
          project_url: string | null
          results: string[] | null
          short_description: string | null
          slug: string
          sort_order: number | null
          technologies: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          canonical_url?: string | null
          category?: Database["public"]["Enums"]["case_category"]
          client_name?: string | null
          created_at?: string
          description?: string | null
          gallery_images?: string[] | null
          h1_tag?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          main_image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          project_date?: string | null
          project_duration?: string | null
          project_url?: string | null
          results?: string[] | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          technologies?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          canonical_url?: string | null
          category?: Database["public"]["Enums"]["case_category"]
          client_name?: string | null
          created_at?: string
          description?: string | null
          gallery_images?: string[] | null
          h1_tag?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean | null
          main_image?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          project_date?: string | null
          project_duration?: string | null
          project_url?: string | null
          results?: string[] | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          technologies?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          clients_served: string | null
          created_at: string
          description: string | null
          founding_year: string | null
          id: string
          language: string
          mission: string | null
          projects_completed: string | null
          team_size: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          clients_served?: string | null
          created_at?: string
          description?: string | null
          founding_year?: string | null
          id?: string
          language?: string
          mission?: string | null
          projects_completed?: string | null
          team_size?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          clients_served?: string | null
          created_at?: string
          description?: string | null
          founding_year?: string | null
          id?: string
          language?: string
          mission?: string | null
          projects_completed?: string | null
          team_size?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          clicked_at: string | null
          company_id: string
          created_at: string
          error_message: string | null
          id: string
          opened_at: string | null
          replied_at: string | null
          sent_at: string | null
          status: string
          template_id: string
        }
        Insert: {
          clicked_at?: string | null
          company_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          status?: string
          template_id: string
        }
        Update: {
          clicked_at?: string | null
          company_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          opened_at?: string | null
          replied_at?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "parsed_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          last_updated: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          last_updated?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          last_updated?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_seo: {
        Row: {
          canonical_url: string | null
          created_at: string
          h1_tag: string | null
          id: string
          language: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_slug: string
          page_title: string | null
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          h1_tag?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug: string
          page_title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          h1_tag?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_slug?: string
          page_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      parsed_companies: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          company_type: Database["public"]["Enums"]["company_type"]
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          email: string | null
          id: string
          industry: string | null
          notes: string | null
          parsed_at: string
          phone: string | null
          region: string | null
          registration_date: string | null
          registration_number: string | null
          source_url: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          company_type?: Database["public"]["Enums"]["company_type"]
          country: Database["public"]["Enums"]["country_code"]
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          parsed_at?: string
          phone?: string | null
          region?: string | null
          registration_date?: string | null
          registration_number?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          company_type?: Database["public"]["Enums"]["company_type"]
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          notes?: string | null
          parsed_at?: string
          phone?: string | null
          region?: string | null
          registration_date?: string | null
          registration_number?: string | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      parser_configs: {
        Row: {
          country: Database["public"]["Enums"]["country_code"]
          created_at: string
          id: string
          is_active: boolean
          last_parsed_date: string | null
          parsing_frequency: number | null
          source_name: string
          source_url: string
          updated_at: string
        }
        Insert: {
          country: Database["public"]["Enums"]["country_code"]
          created_at?: string
          id?: string
          is_active?: boolean
          last_parsed_date?: string | null
          parsing_frequency?: number | null
          source_name: string
          source_url: string
          updated_at?: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country_code"]
          created_at?: string
          id?: string
          is_active?: boolean
          last_parsed_date?: string | null
          parsing_frequency?: number | null
          source_name?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_translations: {
        Row: {
          advantages: string[]
          canonical_url: string | null
          created_at: string
          description: string | null
          faq: Json
          features: string[]
          h1_tag: string | null
          id: string
          language: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          service_id: string
          short_description: string | null
          title: string
          updated_at: string
        }
        Insert: {
          advantages?: string[]
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json
          features?: string[]
          h1_tag?: string | null
          id?: string
          language: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          service_id: string
          short_description?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          advantages?: string[]
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json
          features?: string[]
          h1_tag?: string | null
          id?: string
          language?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          service_id?: string
          short_description?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_translations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          advantages: string[] | null
          canonical_url: string | null
          created_at: string
          description: string | null
          faq: Json | null
          features: string[] | null
          h1_tag: string | null
          id: string
          is_active: boolean
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          price_from: number | null
          price_to: number | null
          short_description: string | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          advantages?: string[] | null
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          features?: string[] | null
          h1_tag?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          advantages?: string[] | null
          canonical_url?: string | null
          created_at?: string
          description?: string | null
          faq?: Json | null
          features?: string[] | null
          h1_tag?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          price_from?: number | null
          price_to?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          key: string
          language: string
          section: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          language?: string
          section: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language?: string
          section?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          description: string | null
          experience: string | null
          id: string
          image: string | null
          is_active: boolean
          name: string
          position: string
          skills: string[] | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          experience?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          name: string
          position: string
          skills?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          experience?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          name?: string
          position?: string
          skills?: string[] | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor"
      case_category:
        | "website"
        | "ecommerce"
        | "mobile"
        | "landing"
        | "corporate"
        | "startup"
        | "redesign"
        | "crm"
      company_type: "ip" | "ooo" | "zao" | "pao" | "other"
      country_code: "by" | "ru" | "kz"
      lead_status:
        | "new"
        | "contacted"
        | "proposal_sent"
        | "in_negotiation"
        | "closed_won"
        | "closed_lost"
        | "not_interested"
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
      app_role: ["admin", "editor"],
      case_category: [
        "website",
        "ecommerce",
        "mobile",
        "landing",
        "corporate",
        "startup",
        "redesign",
        "crm",
      ],
      company_type: ["ip", "ooo", "zao", "pao", "other"],
      country_code: ["by", "ru", "kz"],
      lead_status: [
        "new",
        "contacted",
        "proposal_sent",
        "in_negotiation",
        "closed_won",
        "closed_lost",
        "not_interested",
      ],
    },
  },
} as const
