'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, Heart, Star, Palette, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ReadyDesigns() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{[key: number]: number}>({
    1: 0, 2: 0, 3: 0, 4: 0
  })
  const readyDesigns = [
    {
      id: 1,
      title: 'فستان زفاف كلاسيكي',
      description: 'فستان زفاف أنيق بتصميم كلاسيكي مع تطريز يدوي',
      category: 'فساتين زفاف',
      images: [
        '/wedding-dress-1.jpg.jpg',
        '/wedding-dress-1a.jpg.jpg',
        '/wedding-dress-1b.jpg.jpg'
      ]
    },
    {
      id: 2,
      title: 'فستان سهرة راقي',
      description: 'فستان سهرة طويل بقصة عصرية ولمسات ذهبية',
      category: 'فساتين سهرة',
      images: [
        '/wedding-dress-2.jpg.jpg',
        '/wedding-dress-2a.jpg.jpg',
        '/wedding-dress-2b.jpg.jpg'
      ]
    },
    {
      id: 3,
      title: 'فستان كوكتيل أنيق',
      description: 'فستان كوكتيل قصير بتصميم عصري ومميز',
      category: 'فساتين كوكتيل',
      images: [
        '/wedding-dress-3.jpg.jpg',
        '/wedding-dress-3a.jpg.jpg',
        '/wedding-dress-3b.jpg.jpg'
      ]
    },
    {
      id: 4,
      title: 'فستان خطوبة مميز',
      description: 'فستان خطوبة بتصميم رومانسي وتفاصيل دقيقة',
      category: 'فساتين خطوبة',
      images: [
        '/wedding-dress-4.jpg.jpg',
        '/wedding-dress-4a.jpg.jpg',
        '/wedding-dress-4b.jpg.jpg'
      ]
    }
  ]

  // دوال التنقل بين صور البطاقة
  const nextCardImage = (designId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndexes(prev => ({
      ...prev,
      [designId]: (prev[designId] + 1) % 3
    }))
  }

  const prevCardImage = (designId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndexes(prev => ({
      ...prev,
      [designId]: prev[designId] === 0 ? 2 : prev[designId] - 1
    }))
  }

  const setCardImage = (designId: number, imageIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndexes(prev => ({
      ...prev,
      [designId]: imageIndex
    }))
  }

  // دوال إدارة المعرض
  const openGallery = (index: number) => {
    setSelectedImageIndex(index)
    setIsGalleryOpen(true)
    document.body.style.overflow = 'hidden' // منع التمرير في الخلفية
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setSelectedImageIndex(null)
    document.body.style.overflow = 'unset' // إعادة التمرير
  }

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      const designId = readyDesigns[selectedImageIndex].id
      setCurrentImageIndexes(prev => ({
        ...prev,
        [designId]: (prev[designId] + 1) % 3
      }))
    }
  }

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      const designId = readyDesigns[selectedImageIndex].id
      setCurrentImageIndexes(prev => ({
        ...prev,
        [designId]: prev[designId] === 0 ? 2 : prev[designId] - 1
      }))
    }
  }

  // إدارة مفتاح Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isGalleryOpen) {
        closeGallery()
      }
      if (event.key === 'ArrowRight' && isGalleryOpen) {
        nextImage()
      }
      if (event.key === 'ArrowLeft' && isGalleryOpen) {
        prevImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset' // تنظيف عند إلغاء المكون
    }
  }, [isGalleryOpen, selectedImageIndex])

  return (
    <section className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              تصاميمنا الجاهزة
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            مجموعة مختارة من أجمل تصاميمنا الجاهزة التي يمكنك طلبها مباشرة أو تخصيصها حسب ذوقك
          </p>

          {/* ملاحظة مهمة */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 max-w-2xl mx-auto">
            <p className="text-green-800 font-medium text-center">
              ✨ الفساتين الجاهزة متوفرة للشراء المباشر - لا يتطلب حجز موعد
            </p>
          </div>
        </motion.div>

        {/* شبكة التصاميم */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          {readyDesigns.map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                {/* الصورة */}
                <div
                  className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 relative overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    openGallery(index)
                  }}
                >


                  {/* الصورة الحالية */}
                  <img
                    src={design.images[currentImageIndexes[design.id]]}
                    alt={`${design.title} - صورة ${currentImageIndexes[design.id] + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />

                  {/* أزرار التنقل */}
                  <button
                    onClick={(e) => prevCardImage(design.id, e)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => nextCardImage(design.id, e)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* مؤشرات الصور */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {design.images.map((_, imgIndex) => (
                      <button
                        key={imgIndex}
                        onClick={(e) => setCardImage(design.id, imgIndex, e)}
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          currentImageIndexes[design.id] === imgIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`عرض الصورة ${imgIndex + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* تأثير التمرير */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                      <Eye className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  
                  {/* زر الإعجاب */}
                  <button className="absolute top-3 left-3 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                    <Heart className="w-4 h-4 text-pink-500" />
                  </button>
                </div>
                
                {/* المعلومات */}
                <Link href={`/designs/${design.id}`}>
                  <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                      {design.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {design.description}
                    </p>
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* زر عرض جميع التصاميم */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/designs"
            className="btn-primary inline-flex items-center space-x-3 space-x-reverse text-lg font-bold"
          >
            <Eye className="w-6 h-6" />
            <span>عرض جميع التصاميم</span>
          </Link>
        </motion.div>

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
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 flex items-center justify-center">
                  <img
                    src={readyDesigns[selectedImageIndex].images[currentImageIndexes[readyDesigns[selectedImageIndex].id]]}
                    alt={`${readyDesigns[selectedImageIndex].title} - صورة ${currentImageIndexes[readyDesigns[selectedImageIndex].id] + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
