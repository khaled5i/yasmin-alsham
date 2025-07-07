'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useShopStore, formatPrice } from '@/store/shopStore'

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, addToCart } = useShopStore()
  const [addedToCart, setAddedToCart] = useState<string[]>([])

  const handleAddToCart = (product: any) => {
    addToCart(product)
    setAddedToCart(prev => [...prev, product.id])
    setTimeout(() => {
      setAddedToCart(prev => prev.filter(id => id !== product.id))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pt-16 lg:pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* التنقل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 lg:mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 space-x-reverse text-pink-600 hover:text-pink-700 transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-sm lg:text-base">العودة للصفحة الرئيسية</span>
          </Link>
        </motion.div>

        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              المفضلة
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            الفساتين التي أعجبتك وتريدين الاحتفاظ بها
          </p>
        </motion.div>

        {/* المحتوى */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              لا توجد عناصر في المفضلة
            </h3>
            <p className="text-gray-500 mb-8">
              ابدئي بإضافة الفساتين التي تعجبك إلى المفضلة
            </p>
            <Link
              href="/designs"
              className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-lg transition-all duration-300"
            >
              <span>تصفح الفساتين</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100"
              >
                {/* صورة المنتج */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* زر إزالة من المفضلة */}
                  <button
                    onClick={() => removeFromFavorites(product.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* تفاصيل المنتج */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-pink-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {/* أزرار الإجراءات */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addedToCart.includes(product.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 space-x-reverse py-2 px-4 rounded-lg transition-all duration-300 ${
                        addedToCart.includes(product.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {addedToCart.includes(product.id) ? 'تم الإضافة' : 'أضف للسلة'}
                      </span>
                    </button>
                    
                    <Link
                      href={`/designs/${product.id}`}
                      className="px-4 py-2 border border-pink-300 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors duration-300"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* إحصائيات */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-100 inline-block">
              <p className="text-gray-600">
                لديك <span className="font-bold text-pink-600">{favorites.length}</span> فستان في المفضلة
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
