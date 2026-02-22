export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type InterviewSettings = {
  questions: string[]
  allowRetakes: boolean
  maxAttempts: number
}

export type ApplicationStatus = 'pending' | 'completed'

export interface Database {
  public: {
    Tables: {
      interviews: {
        Row: {
          id: string
          creator_id: string
          title: string
          settings: InterviewSettings
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          settings: InterviewSettings
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          settings?: InterviewSettings
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          interview_id: string
          candidate_email: string
          video_url: string | null
          status: ApplicationStatus
          created_at: string
        }
        Insert: {
          id?: string
          interview_id: string
          candidate_email: string
          video_url?: string | null
          status?: ApplicationStatus
          created_at?: string
        }
        Update: {
          id?: string
          interview_id?: string
          candidate_email?: string
          video_url?: string | null
          status?: ApplicationStatus
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type InterviewRow = Database['public']['Tables']['interviews']['Row']
export type InterviewInsert = Database['public']['Tables']['interviews']['Insert']
export type ApplicationRow = Database['public']['Tables']['applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
