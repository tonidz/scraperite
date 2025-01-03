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
      reseller_profiles: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          contact_name: string;
          phone_number: string;
          address: string;
          city: string;
          country: string;
          vat_number: string;
          business_type: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          contact_name: string;
          phone_number: string;
          address: string;
          city: string;
          country: string;
          vat_number: string;
          business_type: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          contact_name?: string;
          phone_number?: string;
          address?: string;
          city?: string;
          country?: string;
          vat_number?: string;
          business_type?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
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
