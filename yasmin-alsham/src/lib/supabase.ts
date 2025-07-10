import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// دالة للحصول على معرف المستخدم الحالي
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // محاولة الحصول من Supabase أولاً
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (user && !error) {
      return user.id
    }

    // إذا لم يكن هناك مستخدم في Supabase، نتحقق من localStorage
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('yasmin-auth-user')
      if (savedUser) {
        const user = JSON.parse(savedUser)
        return user.id || null
      }
    }

    return null
  } catch (error) {
    console.error('خطأ في الحصول على معرف المستخدم:', error)
    return null
  }
}
