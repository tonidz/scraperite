export interface Database {
  public: {
    Tables: {
      resellers: {
        Row: {
          id: string
          name: string
          email: string
          company: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          company: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          company?: string
          created_at?: string
        }
      }
    }
  }
}