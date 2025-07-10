'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  favoriteService, 
  cartService, 
  productService,
  type Product as DBProduct
} from '@/lib/database'
import { getCurrentUserId } from '@/lib/supabase'

// تعريف نوع المنتج
export interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  sizes?: string[]
  colors?: string[]
}

// تعريف عنصر السلة
export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

// تعريف حالة المتجر
interface ShopState {
  // المفضلة
  favorites: Product[]
  addToFavorites: (product: Product) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  clearFavorites: () => Promise<void>
  loadFavorites: () => Promise<void>

  // السلة
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  isInCart: (productId: string) => boolean
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getCartItemsCount: () => number
  loadCart: () => Promise<void>

  // حالة التحميل
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

// دالة تحويل من قاعدة البيانات إلى الواجهة المحلية
const mapDBProductToLocal = (dbProduct: DBProduct): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  image: dbProduct.image || '',
  description: dbProduct.description,
  category: dbProduct.category,
  sizes: dbProduct.sizes || [],
  colors: dbProduct.colors || []
})

// إنشاء المتجر
export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // المفضلة
      favorites: [],
      
      addToFavorites: async (product: Product) => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await favoriteService.addToFavorites(userId, product.id)
          
          if (error) {
            console.error('خطأ في إضافة المنتج للمفضلة:', error)
            set({ isLoading: false })
            return
          }

          const { favorites } = get()
          if (!favorites.find(item => item.id === product.id)) {
            set({ favorites: [...favorites, product], isLoading: false })
          }
        } catch (error) {
          console.error('خطأ في إضافة المنتج للمفضلة:', error)
          set({ isLoading: false })
        }
      },

      removeFromFavorites: async (productId: string) => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await favoriteService.removeFromFavorites(userId, productId)
          
          if (error) {
            console.error('خطأ في إزالة المنتج من المفضلة:', error)
            set({ isLoading: false })
            return
          }

          const { favorites } = get()
          set({ favorites: favorites.filter(item => item.id !== productId), isLoading: false })
        } catch (error) {
          console.error('خطأ في إزالة المنتج من المفضلة:', error)
          set({ isLoading: false })
        }
      },

      isFavorite: (productId: string) => {
        const { favorites } = get()
        return favorites.some(item => item.id === productId)
      },

      clearFavorites: async () => {
        set({ isLoading: true })
        
        try {
          // هنا نحتاج إلى حذف جميع المفضلة من قاعدة البيانات
          // للتطوير، سنقوم فقط بمسح المفضلة المحلية
          set({ favorites: [], isLoading: false })
        } catch (error) {
          console.error('خطأ في مسح المفضلة:', error)
          set({ isLoading: false })
        }
      },

      loadFavorites: async () => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { favorites, error } = await favoriteService.getUserFavorites(userId)
          
          if (error) {
            console.error('خطأ في تحميل المفضلة:', error)
            set({ isLoading: false })
            return
          }

          // تحويل البيانات من قاعدة البيانات
          const localFavorites = favorites?.map(fav => mapDBProductToLocal(fav.products)) || []
          set({ favorites: localFavorites, isLoading: false })
        } catch (error) {
          console.error('خطأ في تحميل المفضلة:', error)
          set({ isLoading: false })
        }
      },

      // السلة
      cart: [],

      addToCart: async (product: Product, quantity = 1, size?: string, color?: string) => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await cartService.addToCart(userId, product.id, quantity, size, color)
          
          if (error) {
            console.error('خطأ في إضافة المنتج للسلة:', error)
            set({ isLoading: false })
            return
          }

          const { cart } = get()
          const existingItem = cart.find(item => 
            item.id === product.id && 
            item.selectedSize === size && 
            item.selectedColor === color
          )

          if (existingItem) {
            // إذا كان المنتج موجود، زيادة الكمية
            set({
              cart: cart.map(item =>
                item.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isLoading: false
            })
          } else {
            // إضافة منتج جديد
            const newItem: CartItem = {
              ...product,
              quantity,
              selectedSize: size,
              selectedColor: color
            }
            set({ cart: [...cart, newItem], isLoading: false })
          }
        } catch (error) {
          console.error('خطأ في إضافة المنتج للسلة:', error)
          set({ isLoading: false })
        }
      },

      removeFromCart: async (productId: string) => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await cartService.removeFromCart(userId, productId)
          
          if (error) {
            console.error('خطأ في إزالة المنتج من السلة:', error)
            set({ isLoading: false })
            return
          }

          const { cart } = get()
          set({ cart: cart.filter(item => item.id !== productId), isLoading: false })
        } catch (error) {
          console.error('خطأ في إزالة المنتج من السلة:', error)
          set({ isLoading: false })
        }
      },

      isInCart: (productId: string) => {
        const { cart } = get()
        return cart.some(item => item.id === productId)
      },

      updateCartItemQuantity: async (productId: string, quantity: number) => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await cartService.updateCartItemQuantity(userId, productId, quantity)
          
          if (error) {
            console.error('خطأ في تحديث كمية المنتج:', error)
            set({ isLoading: false })
            return
          }

          const { cart } = get()
          if (quantity <= 0) {
            set({ cart: cart.filter(item => item.id !== productId), isLoading: false })
          } else {
            set({
              cart: cart.map(item =>
                item.id === productId ? { ...item, quantity } : item
              ),
              isLoading: false
            })
          }
        } catch (error) {
          console.error('خطأ في تحديث كمية المنتج:', error)
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { error } = await cartService.clearUserCart(userId)
          
          if (error) {
            console.error('خطأ في مسح السلة:', error)
            set({ isLoading: false })
            return
          }

          set({ cart: [], isLoading: false })
        } catch (error) {
          console.error('خطأ في مسح السلة:', error)
          set({ isLoading: false })
        }
      },

      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getCartItemsCount: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.quantity, 0)
      },

      loadCart: async () => {
        set({ isLoading: true })
        
        try {
          const userId = await getCurrentUserId()
          if (!userId) {
            console.error('لا يوجد مستخدم مسجل دخول')
            set({ isLoading: false })
            return
          }
          
          const { cartItems, error } = await cartService.getUserCart(userId)
          
          if (error) {
            console.error('خطأ في تحميل السلة:', error)
            set({ isLoading: false })
            return
          }

          // تحويل البيانات من قاعدة البيانات
          const localCartItems: CartItem[] = cartItems?.map(item => ({
            ...mapDBProductToLocal(item.products),
            quantity: item.quantity,
            selectedSize: item.selected_size || undefined,
            selectedColor: item.selected_color || undefined
          })) || []

          set({ cart: localCartItems, isLoading: false })
        } catch (error) {
          console.error('خطأ في تحميل السلة:', error)
          set({ isLoading: false })
        }
      },

      // حالة التحميل
      isLoading: false,
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      }
    }),
    {
      name: 'yasmin-alsham-shop',
      partialize: (state) => ({
        favorites: state.favorites,
        cart: state.cart
      })
    }
  )
)

// دالة مساعدة لتنسيق السعر
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('en')} ريال`
}

// دالة مساعدة لإنشاء رسالة واتساب للسلة
export const generateWhatsAppMessage = (cart: CartItem[]): string => {
  if (cart.length === 0) return ''

  let message = '🌸 *طلب جديد من ياسمين الشام* 🌸\n\n'
  message += '📋 *تفاصيل الطلب:*\n'
  
  cart.forEach((item, index) => {
    message += `\n${index + 1}. *${item.name}*\n`
    message += `   💰 السعر: ${formatPrice(item.price)}\n`
    message += `   📦 الكمية: ${item.quantity}\n`
    
    if (item.selectedSize) {
      message += `   📏 المقاس: ${item.selectedSize}\n`
    }
    
    if (item.selectedColor) {
      message += `   🎨 اللون: ${item.selectedColor}\n`
    }
    
    message += `   💵 المجموع الفرعي: ${formatPrice(item.price * item.quantity)}\n`
  })

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  message += `\n💰 *إجمالي الطلب: ${formatPrice(total)}*\n\n`
  message += '📞 يرجى التواصل معي لتأكيد الطلب وترتيب التسليم.\n'
  message += '🙏 شكراً لكم'

  return encodeURIComponent(message)
}
