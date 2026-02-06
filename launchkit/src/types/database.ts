export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          subscription: 'free' | 'pro'
          subscription_id: string | null
          subscription_status: 'active' | 'canceled' | 'past_due' | null
          brand_limit: number
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          subscription?: 'free' | 'pro'
          subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          brand_limit?: number
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription?: 'free' | 'pro'
          subscription_id?: string | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | null
          brand_limit?: number
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string
          tagline: string | null
          bio: string
          colors: Json
          template_type: string
          ola_domain_id: string | null
          ola_contact_id: string | null
          ola_zone_id: string | null
          deployment_url: string | null
          error_message: string | null
          last_deployed_at: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain: string
          tagline?: string | null
          bio: string
          colors: Json
          template_type?: string
          ola_domain_id?: string | null
          ola_contact_id?: string | null
          ola_zone_id?: string | null
          deployment_url?: string | null
          error_message?: string | null
          last_deployed_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string
          tagline?: string | null
          bio?: string
          colors?: Json
          template_type?: string
          ola_domain_id?: string | null
          ola_contact_id?: string | null
          ola_zone_id?: string | null
          deployment_url?: string | null
          error_message?: string | null
          last_deployed_at?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          brand_id: string
          name: string
          price: string | null
          link: string
          emoji: string | null
          position: number
          visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          name: string
          price?: string | null
          link: string
          emoji?: string | null
          position?: number
          visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          name?: string
          price?: string | null
          link?: string
          emoji?: string | null
          position?: number
          visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
      deployments: {
        Row: {
          id: string
          brand_id: string
          deployment_url: string
          status: string
          build_log: string | null
          retry_count: number
          started_at: string | null
          completed_at: string | null
          deployed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          deployment_url: string
          status?: string
          build_log?: string | null
          retry_count?: number
          started_at?: string | null
          completed_at?: string | null
          deployed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          deployment_url?: string
          status?: string
          build_log?: string | null
          retry_count?: number
          started_at?: string | null
          completed_at?: string | null
          deployed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_domain_available: {
        Args: {
          domain_name: string
        }
        Returns: boolean
      }
      get_user_brand_count: {
        Args: {
          user_uuid: string
        }
        Returns: number
      }
      get_brand_service_count: {
        Args: {
          brand_uuid: string
        }
        Returns: number
      }
      get_brand_by_domain: {
        Args: {
          domain_name: string
        }
        Returns: {
          id: string
          name: string
          tagline: string | null
          bio: string
          colors: Json
          template_type: string
          status: string
        }[]
      }
      get_services_by_domain: {
        Args: {
          domain_name: string
        }
        Returns: {
          id: string
          name: string
          price: string | null
          link: string
          emoji: string | null
          position: number
        }[]
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