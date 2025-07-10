import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// دالة الحصول على معرف المستخدم الحالي
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('خطأ في الحصول على المستخدم:', error)
      return null
    }
    
    return user?.id || null
  } catch (error) {
    console.error('خطأ في الحصول على معرف المستخدم:', error)
    return null
  }
}

// دالة تسجيل الدخول
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

// دالة التسجيل
export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  return { data, error }
}

// دالة تسجيل الخروج
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// دالة التحقق من حالة المصادقة
export const getAuthStatus = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// دالة مراقبة تغييرات المصادقة
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}
