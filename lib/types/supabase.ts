export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_session_id: string;
          stripe_payment_intent_id: string | null;
          customer_email: string;
          customer_name: string | null;
          shipping_address: Json | null;
          billing_address: Json | null;
          items: Json;
          subtotal: number;
          shipping_cost: number;
          total: number;
          currency: string;
          status: string;
          payment_status: string;
          admin_email_sent: boolean | null;
          customer_email_sent: boolean | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id: string;
          stripe_payment_intent_id?: string | null;
          customer_email: string;
          customer_name?: string | null;
          shipping_address?: Json | null;
          billing_address?: Json | null;
          items: Json;
          subtotal: number;
          shipping_cost?: number;
          total: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          admin_email_sent?: boolean | null;
          customer_email_sent?: boolean | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string;
          stripe_payment_intent_id?: string | null;
          customer_email?: string;
          customer_name?: string | null;
          shipping_address?: Json | null;
          billing_address?: Json | null;
          items?: Json;
          subtotal?: number;
          shipping_cost?: number;
          total?: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          admin_email_sent?: boolean | null;
          customer_email_sent?: boolean | null;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          content: string;
          image_url: string | null;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          content: string;
          image_url?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          video_url?: string | null;
          created_at?: string;
        };
      };
      product_metadata: {
        Row: {
          id: string;
          product_id: string;
          lang: string;
          title: string;
          description: string;
          features: string[] | null;
          specifications: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          lang: string;
          title: string;
          description: string;
          features?: string[] | null;
          specifications?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          lang?: string;
          title?: string;
          description?: string;
          features?: string[] | null;
          specifications?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reseller_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string | null;
          contact_name: string | null;
          phone_number: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          vat_number: string | null;
          business_type: string | null;
          status: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name?: string | null;
          contact_name?: string | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          vat_number?: string | null;
          business_type?: string | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string | null;
          contact_name?: string | null;
          phone_number?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          vat_number?: string | null;
          business_type?: string | null;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
