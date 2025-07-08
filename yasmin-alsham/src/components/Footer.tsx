'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Scissors,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Search,
  Palette,
  Heart,
  Star
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'الرئيسية', icon: Scissors },
    { href: '/book-appointment', label: 'حجز موعد', icon: Calendar },
    { href: '/track-order', label: 'تتبع الطلب', icon: Search },
    { href: '/fabrics', label: 'الأقمشة', icon: Palette }
  ]

  const workingHours = [
    { day: 'السبت - الخميس', time: '4:00 م - 10:00 م' },
    { day: 'الجمعة', time: 'مغلق' }
  ]

  const socialLinks = [
    {
      name: 'فيسبوك',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: 'إنستغرام',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.875-1.387-2.026-1.387-3.323s.49-2.448 1.297-3.323c.875-.897 2.026-1.387 3.323-1.387s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z"/>
        </svg>
      )
    },
    {
      name: 'واتساب',
      href: 'https://wa.me/+966598862609',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-12">
          {/* معلومات المحل */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  ياسمين الشام
                </h3>
                <p className="text-gray-400 text-sm">تفصيل فساتين حسب الطلب</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              نحن متخصصون في تفصيل الفساتين الراقية بلمسة دمشقية أصيلة. نجمع بين التراث العريق والتصاميم العصرية لنقدم لك فساتين تعكس شخصيتك وتبرز جمالك الطبيعي.
            </p>

            <div className="flex items-center space-x-4 space-x-reverse">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* تخطيط مدمج للهاتف المحمول - روابط سريعة واتصل بنا */}
          <div className="md:hidden col-span-1">
            <div className="grid grid-cols-2 gap-4">
              {/* روابط سريعة - هاتف محمول */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-bold mb-3 text-pink-400">روابط سريعة</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link
                        href={link.href}
                        className="icon-text-spacing text-gray-300 hover:text-pink-400 transition-colors duration-300 group text-sm"
                      >
                        <link.icon className="w-4 h-4 menu-item-icon group-hover:scale-110 transition-transform duration-300" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* معلومات التواصل - هاتف محمول */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-base font-bold mb-3 text-pink-400">تواصل معنا</h4>
                <div className="space-y-2">
                  <div className="icon-text-spacing items-start text-gray-300">
                    <MapPin className="w-4 h-4 text-pink-400 mt-1 menu-item-icon flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">العنوان</p>
                      <p className="text-xs text-gray-400 leading-tight">الخبر الشمالية، التقاطع السادس</p>
                    </div>
                  </div>

                  <div className="icon-text-spacing items-start text-gray-300">
                    <Phone className="w-4 h-4 text-pink-400 mt-1 menu-item-icon flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">الهاتف</p>
                      <a href="tel:+966598862609" className="text-xs text-gray-400 hover:text-pink-400 transition-colors duration-300" dir="ltr">
                        +966 598 862 609
                      </a>
                    </div>
                  </div>

                  <div className="icon-text-spacing items-start text-gray-300">
                    <Clock className="w-4 h-4 text-pink-400 mt-1 menu-item-icon flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">ساعات العمل</p>
                      <p className="text-xs text-gray-400">السبت - الخميس</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* روابط سريعة - سطح المكتب */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="hidden md:block md:col-span-1"
          >
            <h4 className="text-base md:text-lg lg:text-xl font-bold mb-3 md:mb-4 lg:mb-6 text-pink-400">روابط سريعة</h4>
            <ul className="space-y-2 lg:space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="icon-text-spacing text-gray-300 hover:text-pink-400 transition-colors duration-300 group"
                  >
                    <link.icon className="w-4 h-4 menu-item-icon group-hover:scale-110 transition-transform duration-300" />
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* معلومات التواصل - سطح المكتب */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden md:block md:col-span-1"
          >
            <h4 className="text-base md:text-lg lg:text-xl font-bold mb-3 md:mb-4 lg:mb-6 text-pink-400">تواصل معنا</h4>
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              <div className="icon-text-spacing items-start text-gray-300">
                <MapPin className="w-5 h-5 text-pink-400 mt-1 menu-item-icon" />
                <div>
                  <p className="font-medium">العنوان</p>
                  <p className="text-sm text-gray-400">الخبر الشمالية، التقاطع السادس، شارع الأمير مشعل، الخبر، السعودية</p>
                </div>
              </div>

              <div className="icon-text-spacing items-start text-gray-300">
                <Phone className="w-5 h-5 text-pink-400 mt-1 menu-item-icon" />
                <div>
                  <p className="font-medium">أرقام الهاتف</p>
                  <div className="space-y-1">
                    <div>
                      <p className="text-xs text-gray-500">قسم التفصيل</p>
                      <a href="tel:+966598862609" className="text-sm text-gray-400 hover:text-pink-400 transition-colors duration-300" dir="ltr">
                        +966 598 862 609
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">قسم الفساتين الجاهزة</p>
                      <a href="tel:+966501503639" className="text-sm text-gray-400 hover:text-pink-400 transition-colors duration-300" dir="ltr">
                        +966 501 503 639
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="icon-text-spacing items-start text-gray-300">
                <Mail className="w-5 h-5 text-pink-400 mt-1 menu-item-icon" />
                <div>
                  <p className="font-medium">البريد الإلكتروني</p>
                  <a href="mailto:info@yasminalsham.com" className="text-sm text-gray-400 hover:text-pink-400 transition-colors duration-300">
                    info@yasminalsham.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* أوقات العمل */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-1"
          >
            <h4 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-pink-400">ساعات العمل</h4>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3 space-x-reverse text-gray-300 mb-4">
                <Clock className="w-5 h-5 text-pink-400" />
                <span className="font-medium">جدول العمل</span>
              </div>
              
              {workingHours.map((schedule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-300">{schedule.day}</span>
                  <span className={`font-medium ${schedule.time === 'مغلق' ? 'text-red-400' : 'text-pink-400'}`}>
                    {schedule.time}
                  </span>
                </motion.div>
              ))}
              
              <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/30">
                <p className="text-sm text-gray-300 text-center">
                  <Heart className="w-4 h-4 inline-block ml-1 text-pink-400" />
                  نعمل بحب وشغف
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* خط الفصل */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 my-12"
        ></motion.div>

        {/* حقوق النشر */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gray-400 text-sm text-center md:text-right">
            <p>© {currentYear} ياسمين الشام. جميع الحقوق محفوظة</p>
          </div>
          
          <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-pink-400 transition-colors duration-300">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-pink-400 transition-colors duration-300">
              الشروط والأحكام
            </Link>
            <div className="flex items-center space-x-1 space-x-reverse">
              <span>صُنع بـ</span>
              <Heart className="w-4 h-4 text-pink-400" />
              <span>في دمشق</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
