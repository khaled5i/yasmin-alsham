import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  appointmentService, 
  orderService, 
  workerService,
  type Appointment as DBAppointment,
  type Order as DBOrder,
  type Worker as DBWorker
} from '@/lib/database'
import { getCurrentUserId } from '@/lib/supabase'

// دالة مساعدة لتحويل الأخطاء
const handleError = (error: any): string => {
  if (error?.message) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'خطأ غير معروف'
}

// دالة مساعدة لمعالجة الأخطاء في المتجر
const setError = (set: any, error: any) => {
  set({ error: handleError(error), isLoading: false })
}

// تعريف أنواع البيانات (محولة من قاعدة البيانات)
export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  appointmentDate: string
  appointmentTime: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  clientName: string
  clientPhone: string
  description: string
  fabric: string
  measurements: {
    // المقاسات الأساسية
    shoulder?: number // الكتف
    shoulderCircumference?: number // دوران الكتف
    chest?: number // الصدر
    waist?: number // الخصر
    hips?: number // الأرداف

    // مقاسات التفصيل المتقدمة
    dartLength?: number // طول البنس
    bodiceLength?: number // طول الصدرية
    neckline?: number // فتحة الصدر
    armpit?: number // الإبط

    // مقاسات الأكمام
    sleeveLength?: number // طول الكم
    forearm?: number // الزند
    cuff?: number // الأسوارة

    // مقاسات الطول
    frontLength?: number // طول الأمام
    backLength?: number // طول الخلف

    // للتوافق مع النظام القديم (سيتم إزالتها لاحقاً)
    length?: number // طول الفستان (قديم)
    shoulders?: number // عرض الكتف (قديم)
    sleeves?: number // طول الأكمام (قديم)
  }
  price: number
  status: 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled'
  assignedWorker?: string
  dueDate: string
  notes?: string
  voiceNotes?: Array<{
    id: string
    data: string
    timestamp: number
    duration?: number
  }> // ملاحظات صوتية متعددة
  images?: string[] // مصفوفة من base64 strings للصور
  completedImages?: string[] // صور العمل المكتمل (للعمال فقط)
  createdAt: string
  updatedAt: string
}

export interface Worker {
  id: string
  email: string
  password: string
  full_name: string
  phone: string
  specialty: string
  role: 'worker'
  is_active: boolean
  createdAt: string
  updatedAt: string
}

interface DataState {
  // البيانات
  appointments: Appointment[]
  orders: Order[]
  workers: Worker[]
  
  // حالة التحميل
  isLoading: boolean
  error: string | null

  // إدارة المواعيد
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>
  deleteAppointment: (id: string) => Promise<void>
  getAppointment: (id: string) => Appointment | undefined
  loadAppointments: () => Promise<void>

  // إدارة الطلبات
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  getOrder: (id: string) => Order | undefined
  loadOrders: () => Promise<void>

  // دوال خاصة للعمال
  startOrderWork: (orderId: string, workerId: string) => Promise<void>
  completeOrder: (orderId: string, workerId: string, completedImages?: string[]) => Promise<void>

  // إدارة العمال
  addWorker: (worker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => Promise<void>
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<void>
  deleteWorker: (id: string) => Promise<void>
  getWorker: (id: string) => Worker | undefined
  loadWorkers: () => Promise<void>

  // وظائف مساعدة
  clearError: () => void
  loadData: () => Promise<void>
  
  // إحصائيات
  getStats: () => {
    totalAppointments: number
    totalOrders: number
    totalWorkers: number
    pendingAppointments: number
    activeOrders: number
    completedOrders: number
    totalRevenue: number
  }
}

// دالة تحويل من قاعدة البيانات إلى الواجهة المحلية
const mapDBAppointmentToLocal = (dbAppointment: DBAppointment): Appointment => ({
  id: dbAppointment.id,
  clientName: dbAppointment.client_name,
  clientPhone: dbAppointment.client_phone,
  appointmentDate: dbAppointment.appointment_date,
  appointmentTime: dbAppointment.appointment_time,
  notes: dbAppointment.notes || undefined,
  status: dbAppointment.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
  createdAt: dbAppointment.created_at,
  updatedAt: dbAppointment.updated_at
})

const mapLocalAppointmentToDB = (localAppointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Omit<DBAppointment, 'id' | 'created_at' | 'updated_at'> => ({
  client_name: localAppointment.clientName,
  client_phone: localAppointment.clientPhone,
  appointment_date: localAppointment.appointmentDate,
  appointment_time: localAppointment.appointmentTime,
  status: localAppointment.status,
  notes: localAppointment.notes
})

const mapDBOrderToLocal = (dbOrder: DBOrder): Order => ({
  id: dbOrder.id,
  clientName: dbOrder.client_name,
  clientPhone: dbOrder.client_phone,
  description: dbOrder.description,
  fabric: dbOrder.fabric || '',
  measurements: dbOrder.measurements || {},
  price: dbOrder.price,
  status: dbOrder.status as 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled',
  assignedWorker: dbOrder.assigned_worker_id || undefined,
  dueDate: dbOrder.due_date,
  notes: dbOrder.notes || undefined,
  voiceNotes: dbOrder.voice_notes || undefined,
  images: dbOrder.images || undefined,
  completedImages: dbOrder.completed_images || undefined,
  createdAt: dbOrder.created_at,
  updatedAt: dbOrder.updated_at
})

const mapLocalOrderToDB = (localOrder: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Omit<DBOrder, 'id' | 'created_at' | 'updated_at'> => ({
  client_name: localOrder.clientName,
  client_phone: localOrder.clientPhone,
  description: localOrder.description,
  fabric: localOrder.fabric,
  measurements: localOrder.measurements,
  price: localOrder.price,
  status: localOrder.status,
  assigned_worker_id: localOrder.assignedWorker,
  due_date: localOrder.dueDate,
  notes: localOrder.notes,
  voice_notes: localOrder.voiceNotes,
  images: localOrder.images,
  completed_images: localOrder.completedImages
})

const mapDBWorkerToLocal = (dbWorker: DBWorker): Worker => ({
  id: dbWorker.id,
  email: dbWorker.email,
  password: '', // لا نعيد كلمة المرور
  full_name: dbWorker.full_name,
  phone: dbWorker.phone || '',
  specialty: dbWorker.specialty || '',
  role: 'worker' as const,
  is_active: dbWorker.is_active,
  createdAt: dbWorker.created_at,
  updatedAt: dbWorker.updated_at
})

const mapLocalWorkerToDB = (localWorker: Omit<Worker, 'id' | 'createdAt' | 'updatedAt' | 'role'>): Omit<DBWorker, 'id' | 'created_at' | 'updated_at'> => ({
  user_id: '',
  email: localWorker.email,
  full_name: localWorker.full_name,
  phone: localWorker.phone,
  specialty: localWorker.specialty,
  role: 'worker',
  is_active: localWorker.is_active,
  experience_years: undefined,
  hourly_rate: undefined,
  performance_rating: undefined,
  total_completed_orders: undefined
})

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // البيانات الأولية
      appointments: [],
      orders: [],
      workers: [],
      isLoading: false,
      error: null,

      // إدارة المواعيد
      addAppointment: async (appointmentData) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbAppointment = mapLocalAppointmentToDB(appointmentData)
          const { appointment, error } = await appointmentService.createAppointment(dbAppointment)
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (appointment) {
            const localAppointment = mapDBAppointmentToLocal(appointment)
            set((state) => ({
              appointments: [...state.appointments, localAppointment],
              error: null,
              isLoading: false
            }))
            console.log('✅ تم إضافة موعد جديد:', localAppointment)
          }
        } catch (error) {
          set({ error: 'خطأ في إضافة الموعد', isLoading: false })
          console.error('خطأ في إضافة الموعد:', error)
        }
      },

      updateAppointment: async (id, updates) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbUpdates: Partial<DBAppointment> = {}
          if (updates.clientName) dbUpdates.client_name = updates.clientName
          if (updates.clientPhone) dbUpdates.client_phone = updates.clientPhone
          if (updates.appointmentDate) dbUpdates.appointment_date = updates.appointmentDate
          if (updates.appointmentTime) dbUpdates.appointment_time = updates.appointmentTime
          if (updates.status) dbUpdates.status = updates.status
          if (updates.notes !== undefined) dbUpdates.notes = updates.notes

          const { appointment, error } = await appointmentService.updateAppointment(id, dbUpdates)
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (appointment) {
            const localAppointment = mapDBAppointmentToLocal(appointment)
            set((state) => ({
              appointments: state.appointments.map(apt =>
                apt.id === id ? localAppointment : apt
              ),
              error: null,
              isLoading: false
            }))
            console.log('✅ تم تحديث الموعد:', id)
          }
        } catch (error) {
          set({ error: 'خطأ في تحديث الموعد', isLoading: false })
          console.error('خطأ في تحديث الموعد:', error)
        }
      },

      deleteAppointment: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          const { error } = await appointmentService.deleteAppointment(id)
          
          if (error) {
            setError(set, error)
            return
          }

          set((state) => ({
            appointments: state.appointments.filter(appointment => appointment.id !== id),
            error: null,
            isLoading: false
          }))
          console.log('✅ تم حذف الموعد:', id)
        } catch (error) {
          set({ error: 'خطأ في حذف الموعد', isLoading: false })
          console.error('خطأ في حذف الموعد:', error)
        }
      },

      getAppointment: (id) => {
        const state = get()
        return state.appointments.find(appointment => appointment.id === id)
      },

      loadAppointments: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const { appointments, error } = await appointmentService.getAllAppointments()
          
          if (error) {
            setError(set, error)
            return
          }

          const localAppointments = appointments?.map(mapDBAppointmentToLocal) || []
          set({ appointments: localAppointments, error: null, isLoading: false })
        } catch (error) {
          set({ error: 'خطأ في تحميل المواعيد', isLoading: false })
          console.error('خطأ في تحميل المواعيد:', error)
        }
      },

      // إدارة الطلبات
      addOrder: async (orderData) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbOrder = mapLocalOrderToDB(orderData)
          const { order, error } = await orderService.createOrder(dbOrder)
          
          if (error) {
            setError(set, error)
            return
          }

          if (order) {
            const localOrder = mapDBOrderToLocal(order)
            set((state) => ({
              orders: [...state.orders, localOrder],
              error: null,
              isLoading: false
            }))
            console.log('✅ تم إضافة طلب جديد:', localOrder)
          }
        } catch (error) {
          set({ error: 'خطأ في إضافة الطلب', isLoading: false })
          console.error('خطأ في إضافة الطلب:', error)
        }
      },

      updateOrder: async (id, updates) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbUpdates: Partial<DBOrder> = {}
          if (updates.clientName) dbUpdates.client_name = updates.clientName
          if (updates.clientPhone) dbUpdates.client_phone = updates.clientPhone
          if (updates.description) dbUpdates.description = updates.description
          if (updates.fabric) dbUpdates.fabric = updates.fabric
          if (updates.measurements) dbUpdates.measurements = updates.measurements
          if (updates.price) dbUpdates.price = updates.price
          if (updates.status) dbUpdates.status = updates.status
          if (updates.assignedWorker) dbUpdates.assigned_worker_id = updates.assignedWorker
          if (updates.dueDate) dbUpdates.due_date = updates.dueDate
          if (updates.notes !== undefined) dbUpdates.notes = updates.notes
          if (updates.voiceNotes) dbUpdates.voice_notes = updates.voiceNotes
          if (updates.images) dbUpdates.images = updates.images
          if (updates.completedImages) dbUpdates.completed_images = updates.completedImages

          const { order, error } = await orderService.updateOrder(id, dbUpdates)
          
          if (error) {
            setError(set, error)
            return
          }

          if (order) {
            const localOrder = mapDBOrderToLocal(order)
            set((state) => ({
              orders: state.orders.map(ord =>
                ord.id === id ? localOrder : ord
              ),
              error: null,
              isLoading: false
            }))
            console.log('✅ تم تحديث الطلب:', id)
          }
        } catch (error) {
          set({ error: 'خطأ في تحديث الطلب', isLoading: false })
          console.error('خطأ في تحديث الطلب:', error)
        }
      },

      deleteOrder: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          const { error } = await orderService.deleteOrder(id)
          
          if (error) {
            setError(set, error)
            return
          }

          set((state) => ({
            orders: state.orders.filter(order => order.id !== id),
            error: null,
            isLoading: false
          }))
          console.log('✅ تم حذف الطلب:', id)
        } catch (error) {
          set({ error: 'خطأ في حذف الطلب', isLoading: false })
          console.error('خطأ في حذف الطلب:', error)
        }
      },

      getOrder: (id) => {
        const state = get()
        return state.orders.find(order => order.id === id)
      },

      loadOrders: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const { orders, error } = await orderService.getAllOrders()
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          const localOrders = orders?.map(mapDBOrderToLocal) || []
          set({ orders: localOrders, error: null, isLoading: false })
        } catch (error) {
          set({ error: 'خطأ في تحميل الطلبات', isLoading: false })
          console.error('خطأ في تحميل الطلبات:', error)
        }
      },

      // دوال خاصة للعمال
      startOrderWork: async (orderId, workerId) => {
        set({ isLoading: true, error: null })
        
        try {
          const { order, error } = await orderService.updateOrder(orderId, {
            status: 'in_progress',
            assigned_worker_id: workerId
          })
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (order) {
            const localOrder = mapDBOrderToLocal(order)
            set((state) => ({
              orders: state.orders.map(ord =>
                ord.id === orderId ? localOrder : ord
              ),
              error: null,
              isLoading: false
            }))
            console.log('✅ تم بدء العمل على الطلب:', orderId)
          }
        } catch (error) {
          set({ error: 'خطأ في بدء العمل على الطلب', isLoading: false })
          console.error('خطأ في بدء العمل على الطلب:', error)
        }
      },

      completeOrder: async (orderId, workerId, completedImages) => {
        set({ isLoading: true, error: null })
        
        try {
          const { order, error } = await orderService.updateOrder(orderId, {
            status: 'completed',
            completed_images: completedImages
          })
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (order) {
            const localOrder = mapDBOrderToLocal(order)
            set((state) => ({
              orders: state.orders.map(ord =>
                ord.id === orderId ? localOrder : ord
              ),
              error: null,
              isLoading: false
            }))
            console.log('✅ تم إكمال الطلب:', orderId)
          }
        } catch (error) {
          set({ error: 'خطأ في إكمال الطلب', isLoading: false })
          console.error('خطأ في إكمال الطلب:', error)
        }
      },

      // إدارة العمال
      addWorker: async (workerData) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbWorker = mapLocalWorkerToDB(workerData)
          const { worker, error } = await workerService.createWorker(dbWorker)
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (worker) {
            const localWorker = mapDBWorkerToLocal(worker)
            set((state) => ({
              workers: [...state.workers, localWorker],
              error: null,
              isLoading: false
            }))
            console.log('✅ تم إضافة عامل جديد:', localWorker)
          }
        } catch (error) {
          set({ error: 'خطأ في إضافة العامل', isLoading: false })
          console.error('خطأ في إضافة العامل:', error)
        }
      },

      updateWorker: async (id, updates) => {
        set({ isLoading: true, error: null })
        
        try {
          const dbUpdates: Partial<DBWorker> = {}
          if (updates.email) dbUpdates.email = updates.email
          if (updates.full_name) dbUpdates.full_name = updates.full_name
          if (updates.phone) dbUpdates.phone = updates.phone
          if (updates.specialty) dbUpdates.specialty = updates.specialty
          if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active

          const { worker, error } = await workerService.updateWorker(id, dbUpdates)
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          if (worker) {
            const localWorker = mapDBWorkerToLocal(worker)
            set((state) => ({
              workers: state.workers.map(wrk =>
                wrk.id === id ? localWorker : wrk
              ),
              error: null,
              isLoading: false
            }))
            console.log('✅ تم تحديث العامل:', id)
          }
        } catch (error) {
          set({ error: 'خطأ في تحديث العامل', isLoading: false })
          console.error('خطأ في تحديث العامل:', error)
        }
      },

      deleteWorker: async (id) => {
        set({ isLoading: true, error: null })
        
        try {
          const { error } = await workerService.deleteWorker(id)
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          set((state) => ({
            workers: state.workers.filter(worker => worker.id !== id),
            error: null,
            isLoading: false
          }))
          console.log('✅ تم حذف العامل:', id)
        } catch (error) {
          set({ error: 'خطأ في حذف العامل', isLoading: false })
          console.error('خطأ في حذف العامل:', error)
        }
      },

      getWorker: (id) => {
        const state = get()
        return state.workers.find(worker => worker.id === id)
      },

      loadWorkers: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const { workers, error } = await workerService.getAllWorkers()
          
          if (error) {
            set({ error: handleError(error), isLoading: false })
            return
          }

          const localWorkers = workers?.map(mapDBWorkerToLocal) || []
          set({ workers: localWorkers, error: null, isLoading: false })
        } catch (error) {
          set({ error: 'خطأ في تحميل العمال', isLoading: false })
          console.error('خطأ في تحميل العمال:', error)
        }
      },

      // وظائف مساعدة
      clearError: () => {
        set({ error: null })
      },

      loadData: async () => {
        set({ isLoading: true, error: null })
        
        try {
          await Promise.all([
            get().loadAppointments(),
            get().loadOrders(),
            get().loadWorkers()
          ])
          
          set({ isLoading: false })
        } catch (error) {
          set({ error: 'خطأ في تحميل البيانات', isLoading: false })
          console.error('خطأ في تحميل البيانات:', error)
        }
      },
      
      // إحصائيات
      getStats: () => {
        const state = get()
        const totalAppointments = state.appointments.length
        const totalOrders = state.orders.length
        const totalWorkers = state.workers.length
        const pendingAppointments = state.appointments.filter(apt => apt.status === 'pending').length
        const activeOrders = state.orders.filter(order => order.status === 'in_progress').length
        const completedOrders = state.orders.filter(order => order.status === 'completed').length
        const totalRevenue = state.orders
          .filter(order => order.status === 'completed' || order.status === 'delivered')
          .reduce((sum, order) => sum + order.price, 0)

        return {
          totalAppointments,
          totalOrders,
          totalWorkers,
          pendingAppointments,
          activeOrders,
          completedOrders,
          totalRevenue
        }
      }
    }),
    {
      name: 'yasmin-alsham-data',
      partialize: (state) => ({
        appointments: state.appointments,
        orders: state.orders,
        workers: state.workers
      })
    }
  )
)
