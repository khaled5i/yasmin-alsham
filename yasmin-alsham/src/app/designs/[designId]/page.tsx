'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ArrowRight, Heart, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { allDesigns } from '@/data/designs'

export default function DesignDetailPage() {
  const params = useParams()
  const designId = parseInt(params.designId as string)

  // حالة المعرض
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  // جلب بيانات التصميم من البيانات المشتركة
  const designData = allDesigns.find(design => design.id === designId)

  // إذا لم يتم العثور على التصميم
  if (!designData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">التصميم غير موجود</h1>
          <Link
            href="/designs"
            className="inline-flex items-center space-x-2 space-x-reverse text-pink-600 hover:text-pink-700 transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى التصاميم</span>
          </Link>
        </div>
      </div>
    )
  }

  // دوال المعرض
  const openGallery = (index: number) => {
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setSelectedImageIndex(null)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % designData.images.length)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? designData.images.length - 1 : selectedImageIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* التنقل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/designs"
            className="inline-flex items-center space-x-2 space-x-reverse text-pink-600 hover:text-pink-700 transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى التصاميم</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* معرض الصور */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* الصورة الرئيسية */}
            <div className="mb-6">
              <div
                className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded-2xl overflow-hidden cursor-pointer group relative"
                onClick={() => openGallery(0)}
              >
                {/* عرض الصورة الفعلية */}
                <Image
                  src={designData.images[0]}
                  alt={designData.title}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* تأثير التمرير */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                    <Eye className="w-8 h-8 text-pink-600" />
                  </div>
                </div>

                {/* شارة الفئة فقط */}
                <div className="absolute top-4 right-4">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {designData.category}
                  </div>
                </div>
              </div>
            </div>

            {/* الصور المصغرة */}
            <div className="grid grid-cols-4 gap-3">
              {designData.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 overflow-hidden relative"
                  onClick={() => openGallery(index)}
                >
                  <Image
                    src={image}
                    alt={`${designData.title} - صورة ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12vw"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* تفاصيل التصميم */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* العنوان والوصف */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                {designData.title}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                {designData.description}
              </p>
            </div>

            {/* المميزات */}
            {designData.features && designData.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">مميزات التصميم</h3>
                <div className="grid gap-3">
                  {designData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* المقاسات */}
            {designData.sizes && designData.sizes.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">المقاسات المتاحة</h3>
                <div className="flex flex-wrap gap-3">
                  {designData.sizes.map((size, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white border border-pink-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors duration-300"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* المناسبات */}
            {designData.occasions && designData.occasions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">مناسب للمناسبات</h3>
                <div className="flex flex-wrap gap-3">
                  {designData.occasions.map((occasion, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* زر الاستفسار */}
            <div className="flex">
              <a
                href={`https://wa.me/+966598862609?text=أريد استفسار عن ${designData.title}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
              >
                استفسار عبر الواتساب
              </a>
            </div>

            {/* تعليمات العناية */}
            {designData.care_instructions && designData.care_instructions.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border border-pink-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2 space-x-reverse">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <span>تعليمات العناية</span>
                </h3>
                <div className="grid gap-2">
                  {designData.care_instructions.map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* نافذة المعرض المنبثقة */}
        {isGalleryOpen && selectedImageIndex !== null && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeGallery}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-title"
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              {/* زر الإغلاق */}
              <button
                onClick={closeGallery}
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors duration-300"
                aria-label="إغلاق المعرض"
              >
                <X className="w-6 h-6" />
              </button>

              {/* أزرار التنقل */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors duration-300"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors duration-300"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* الصورة */}
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative">
                  <Image
                    src={designData.images[selectedImageIndex]}
                    alt={`${designData.title} - صورة ${selectedImageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>

                {/* معلومات الصورة */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="gallery-title" className="text-2xl font-bold text-gray-800">
                      {designData.title}
                    </h3>
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {designData.category}
                    </span>
                  </div>

                  {/* مؤشر الصور */}
                  <div className="flex justify-center mt-6 space-x-2 space-x-reverse">
                    {designData.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          index === selectedImageIndex ? 'bg-pink-500' : 'bg-gray-300'
                        }`}
                        aria-label={`الانتقال إلى الصورة ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
