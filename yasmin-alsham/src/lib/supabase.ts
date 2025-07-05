// ملف Supabase معطل للتطوير - نسخة مبسطة للتطوير المحلي
// import { createClient } from '@supabase/supabase-js'

// للتطوير: محاكاة عميل Supabase
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  })
}

// Types for our database tables
export interface User {
  id: string
  email?: string
  password_hash?: string
  full_name: string
  phone?: string
  role: 'admin' | 'worker' | 'client'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id?: string
  phone: string
  full_name: string
  address?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Worker {
  id: string
  user_id: string
  specialization?: string
  experience_years?: number
  hourly_rate?: number
  is_available: boolean
  performance_rating: number
  total_completed_orders: number
  created_at: string
  updated_at: string
}

export interface Fabric {
  id: string
  name_ar: string
  name_en?: string
  description_ar?: string
  description_en?: string
  image_url?: string
  price_per_meter?: number
  is_available: boolean
  category?: string
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_name: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  reminder_sent: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  order_number: string
  client_id?: string
  worker_id?: string
  fabric_id?: string
  appointment_id?: string
  dress_type?: string
  measurements?: any
  special_notes?: string
  special_notes_en?: string
  special_notes_ur?: string
  design_image_url?: string
  final_image_url?: string
  order_date: string
  due_date: string
  completion_date?: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  estimated_price?: number
  final_price?: number
  client_rating?: number
  client_feedback?: string
  created_at: string
  updated_at: string
}

export interface OrderUpdate {
  id: string
  order_id: string
  worker_id?: string
  status: string
  notes?: string
  image_url?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

export interface SystemSetting {
  id: string
  key: string
  value: string
  description?: string
  updated_at: string
}
