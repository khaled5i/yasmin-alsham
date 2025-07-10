import { supabase } from './supabase'

// ========================================
// أنواع البيانات
// ========================================

export interface User {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'worker' | 'client'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Worker {
  id: string
  user_id: string
  email: string
  full_name: string
  phone: string
  specialty: string
  role: string
  is_active: boolean
  experience_years?: number
  hourly_rate?: number
  performance_rating?: number
  total_completed_orders?: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  category?: string
  sizes?: string[]
  colors?: string[]
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Design {
  id: number
  title: string
  description?: string
  category: string
  images: string[]
  price: number
  fabric?: string
  colors?: string[]
  sizes?: string[]
  features?: string[]
  occasions?: string[]
  care_instructions?: string[]
  rating?: number
  reviews_count?: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_name: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  client_name: string
  client_phone: string
  description: string
  fabric?: string
  measurements?: any
  price: number
  status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  assigned_worker_id?: string
  due_date: string
  notes?: string
  voice_notes?: any[]
  images?: string[]
  completed_images?: string[]
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

// ========================================
// خدمات المستخدمين
// ========================================

export const userService = {
  // تسجيل الدخول
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { user: data.user, error }
  },

  // تسجيل الخروج
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // الحصول على المستخدم الحالي
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // إنشاء مستخدم جديد
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    return { user: data, error }
  },

  // تحديث مستخدم
  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { user: data, error }
  }
}

// ========================================
// خدمات العمال
// ========================================

export const workerService = {
  // الحصول على جميع العمال
  async getAllWorkers() {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false })
    return { workers: data, error }
  },

  // الحصول على عامل واحد
  async getWorker(id: string) {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single()
    return { worker: data, error }
  },

  // إنشاء عامل جديد
  async createWorker(workerData: Partial<Worker>) {
    const { data, error } = await supabase
      .from('workers')
      .insert([workerData])
      .select()
      .single()
    return { worker: data, error }
  },

  // تحديث عامل
  async updateWorker(id: string, updates: Partial<Worker>) {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { worker: data, error }
  },

  // حذف عامل
  async deleteWorker(id: string) {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات المنتجات
// ========================================

export const productService = {
  // الحصول على جميع المنتجات
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    return { products: data, error }
  },

  // الحصول على منتج واحد
  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    return { product: data, error }
  },

  // إنشاء منتج جديد
  async createProduct(productData: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    return { product: data, error }
  },

  // تحديث منتج
  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { product: data, error }
  },

  // حذف منتج
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات التصاميم
// ========================================

export const designService = {
  // الحصول على جميع التصاميم
  async getAllDesigns() {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    return { designs: data, error }
  },

  // الحصول على تصميم واحد
  async getDesign(id: number) {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', id)
      .single()
    return { design: data, error }
  },

  // الحصول على التصاميم حسب الفئة
  async getDesignsByCategory(category: string) {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('category', category)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    return { designs: data, error }
  },

  // إنشاء تصميم جديد
  async createDesign(designData: Partial<Design>) {
    const { data, error } = await supabase
      .from('designs')
      .insert([designData])
      .select()
      .single()
    return { design: data, error }
  },

  // تحديث تصميم
  async updateDesign(id: number, updates: Partial<Design>) {
    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { design: data, error }
  },

  // حذف تصميم
  async deleteDesign(id: number) {
    const { error } = await supabase
      .from('designs')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات المواعيد
// ========================================

export const appointmentService = {
  // الحصول على جميع المواعيد
  async getAllAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })
    return { appointments: data, error }
  },

  // الحصول على موعد واحد
  async getAppointment(id: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single()
    return { appointment: data, error }
  },

  // الحصول على المواعيد حسب التاريخ
  async getAppointmentsByDate(date: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', date)
      .order('appointment_time', { ascending: true })
    return { appointments: data, error }
  },

  // إنشاء موعد جديد
  async createAppointment(appointmentData: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()
    return { appointment: data, error }
  },

  // تحديث موعد
  async updateAppointment(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { appointment: data, error }
  },

  // حذف موعد
  async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات الطلبات
// ========================================

export const orderService = {
  // الحصول على جميع الطلبات
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    return { orders: data, error }
  },

  // الحصول على طلب واحد
  async getOrder(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()
    return { order: data, error }
  },

  // الحصول على الطلبات حسب الحالة
  async getOrdersByStatus(status: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    return { orders: data, error }
  },

  // إنشاء طلب جديد
  async createOrder(orderData: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()
    return { order: data, error }
  },

  // تحديث طلب
  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { order: data, error }
  },

  // حذف طلب
  async deleteOrder(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات الأقمشة
// ========================================

export const fabricService = {
  // الحصول على جميع الأقمشة
  async getAllFabrics() {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false })
    return { fabrics: data, error }
  },

  // الحصول على قماش واحد
  async getFabric(id: string) {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .eq('id', id)
      .single()
    return { fabric: data, error }
  },

  // إنشاء قماش جديد
  async createFabric(fabricData: Partial<Fabric>) {
    const { data, error } = await supabase
      .from('fabrics')
      .insert([fabricData])
      .select()
      .single()
    return { fabric: data, error }
  },

  // تحديث قماش
  async updateFabric(id: string, updates: Partial<Fabric>) {
    const { data, error } = await supabase
      .from('fabrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { fabric: data, error }
  },

  // حذف قماش
  async deleteFabric(id: string) {
    const { error } = await supabase
      .from('fabrics')
      .delete()
      .eq('id', id)
    return { error }
  }
}

// ========================================
// خدمات المفضلة
// ========================================

export const favoriteService = {
  // الحصول على مفضلات المستخدم
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { favorites: data, error }
  },

  // إضافة إلى المفضلة
  async addToFavorites(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, product_id: productId }])
      .select()
      .single()
    return { favorite: data, error }
  },

  // إزالة من المفضلة
  async removeFromFavorites(userId: string, productId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    return { error }
  },

  // التحقق من وجود المنتج في المفضلة
  async isFavorite(userId: string, productId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()
    return { isFavorite: !!data, error }
  }
}

// ========================================
// خدمات سلة التسوق
// ========================================

export const cartService = {
  // الحصول على سلة المستخدم
  async getUserCart(userId: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { cartItems: data, error }
  },

  // إضافة منتج إلى السلة
  async addToCart(userId: string, productId: string, quantity: number = 1, size?: string, color?: string) {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        user_id: userId,
        product_id: productId,
        quantity,
        selected_size: size,
        selected_color: color
      }])
      .select()
      .single()
    return { cartItem: data, error }
  },

  // تحديث كمية المنتج في السلة
  async updateCartItemQuantity(userId: string, productId: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single()
    return { cartItem: data, error }
  },

  // إزالة منتج من السلة
  async removeFromCart(userId: string, productId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    return { error }
  },

  // تفريغ سلة المستخدم
  async clearUserCart(userId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
    return { error }
  }
}

// ========================================
// خدمات الإحصائيات
// ========================================

export const statsService = {
  // الحصول على إحصائيات الطلبات
  async getOrderStats() {
    const { data, error } = await supabase
      .from('order_stats')
      .select('*')
      .single()
    return { stats: data, error }
  },

  // الحصول على إحصائيات المواعيد
  async getAppointmentStats() {
    const { data, error } = await supabase
      .from('appointment_stats')
      .select('*')
      .single()
    return { stats: data, error }
  }
} 