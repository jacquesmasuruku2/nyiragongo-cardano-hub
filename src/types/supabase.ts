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
      events: {
        Row: {
          created_at: string
          date_end: string | null
          date_start: string
          description: string
          external_link: string | null
          full_content: string | null
          id: string
          image_url: string | null
          is_upcoming: boolean
          location: string
          moderator: string | null
          reserved_seats: number
          slug: string
          title: string
          total_seats: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_end?: string | null
          date_start: string
          description: string
          external_link?: string | null
          full_content?: string | null
          id?: string
          image_url?: string | null
          is_upcoming?: boolean
          location: string
          moderator?: string | null
          reserved_seats?: number
          slug: string
          title: string
          total_seats?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_end?: string | null
          date_start?: string
          description?: string
          external_link?: string | null
          full_content?: string | null
          id?: string
          image_url?: string | null
          is_upcoming?: boolean
          location?: string
          moderator?: string | null
          reserved_seats?: number
          slug?: string
          title?: string
          total_seats?: number
          updated_at?: string
        }
      }
      event_reservations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
        }
      }
      gallery_photos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: "admin" | "user"
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: "admin" | "user"
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: "admin" | "user"
          user_id?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string
          email: string | null
          photo_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio: string
          email?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string
          email?: string | null
          photo_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          author: string
          category: string
          image_url: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          author: string
          category?: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          author?: string
          category?: string
          image_url?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
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