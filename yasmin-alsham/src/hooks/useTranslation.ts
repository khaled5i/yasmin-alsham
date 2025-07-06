'use client'

import { useState, useEffect } from 'react'

// نوع البيانات للترجمات
type TranslationKey = string
type TranslationValue = string | { [key: string]: string }
type Translations = { [key: string]: TranslationValue }

// الترجمات العربية
const arTranslations: Translations = {
  // التنقل والعناوين الرئيسية
  'dashboard': 'لوحة التحكم',
  'orders': 'الطلبات',
  'appointments': 'المواعيد',
  'settings': 'الإعدادات',
  'workers': 'العمال',
  'reports': 'التقارير',
  'logout': 'تسجيل الخروج',
  'welcome': 'مرحباً',
  'welcome_back': 'مرحباً بعودتك',
  
  // الأزرار والإجراءات
  'add_new_order': 'إضافة طلب جديد',
  'book_appointment': 'حجز موعد',
  'view_details': 'عرض التفاصيل',
  'edit': 'تعديل',
  'delete': 'حذف',
  'save': 'حفظ',
  'cancel': 'إلغاء',
  'submit': 'إرسال',
  'search': 'بحث',
  'filter': 'تصفية',
  'export': 'تصدير',
  'print': 'طباعة',
  'back': 'رجوع',
  'next': 'التالي',
  'previous': 'السابق',
  'close': 'إغلاق',
  'confirm': 'تأكيد',
  'loading': 'جاري التحميل...',
  'saving': 'جاري الحفظ...',
  
  // حالات الطلبات
  'pending': 'في الانتظار',
  'in_progress': 'قيد التنفيذ',
  'completed': 'مكتمل',
  'delivered': 'تم التسليم',
  'cancelled': 'ملغي',
  
  // نصوص عامة
  'name': 'الاسم',
  'email': 'البريد الإلكتروني',
  'phone': 'رقم الهاتف',
  'address': 'العنوان',
  'date': 'التاريخ',
  'time': 'الوقت',
  'status': 'الحالة',
  'price': 'السعر',
  'total': 'المجموع',
  'description': 'الوصف',
  'notes': 'ملاحظات',
  'client_name': 'اسم الزبونة',
  'client_phone': 'رقم هاتف الزبونة',
  
  // رسائل النجاح والخطأ
  'success': 'نجح',
  'error': 'خطأ',
  'warning': 'تحذير',
  'info': 'معلومات',
  'order_added_success': 'تم إضافة الطلب بنجاح',
  'order_updated_success': 'تم تحديث الطلب بنجاح',
  'order_deleted_success': 'تم حذف الطلب بنجاح',
  'fill_required_fields': 'يرجى ملء جميع الحقول المطلوبة',

  // نصوص إضافية مطلوبة
  'admin_dashboard': 'لوحة تحكم المدير',
  'worker_dashboard': 'لوحة تحكم العامل',
  'admin': 'مدير',
  'worker': 'عامل',
  'change_language': 'تغيير اللغة',
  'my_active_orders': 'طلباتي النشطة',
  'completed_orders': 'الطلبات المكتملة',
  'total_orders': 'إجمالي الطلبات',
  'total_revenue': 'إجمالي الإيرادات',
  'recent_orders': 'الطلبات الحديثة',
  'quick_actions': 'إجراءات سريعة',
  'view_all_orders': 'عرض جميع الطلبات',
  'add_order': 'إضافة طلب',
  'manage_workers': 'إدارة العمال',
  'view_reports': 'عرض التقارير',
  'client_name_required': 'اسم الزبونة *',
  'phone_required': 'رقم الهاتف *',
  'order_description_required': 'وصف الطلب *',
  'delivery_date_required': 'موعد التسليم *',
  'price_sar': 'السعر (ريال سعودي)',
  'measurements_cm': 'المقاسات (بالسنتيمتر)',
  'additional_notes': 'ملاحظات إضافية',
  'voice_notes_optional': 'ملاحظات صوتية (اختيارية)',
  'design_images': 'صور التصميم',
  'fabric_type': 'نوع القماش',
  'responsible_worker': 'العامل المسؤول',
  'choose_worker': 'اختر العامل المسؤول',
  'order_status': 'حالة الطلب',
  'back_to_dashboard': 'العودة إلى لوحة التحكم',
  'overview_today': 'نظرة عامة على أنشطة اليوم',
  'welcome_worker': 'مرحباً بك في مساحة العمل',

  // نصوص الفوتر
  'home': 'الرئيسية',
  'track_order': 'استعلام عن الطلب',
  'fabrics': 'الأقمشة',
  'contact_us': 'تواصلي معنا',
  'yasmin_alsham': 'ياسمين الشام',
  'custom_dress_tailoring': 'تفصيل فساتين حسب الطلب'
}

// الترجمات الإنجليزية
const enTranslations: Translations = {
  // التنقل والعناوين الرئيسية
  'dashboard': 'Dashboard',
  'orders': 'Orders',
  'appointments': 'Appointments',
  'settings': 'Settings',
  'workers': 'Workers',
  'reports': 'Reports',
  'logout': 'Logout',
  'welcome': 'Welcome',
  'welcome_back': 'Welcome Back',
  
  // الأزرار والإجراءات
  'add_new_order': 'Add New Order',
  'book_appointment': 'Book Appointment',
  'view_details': 'View Details',
  'edit': 'Edit',
  'delete': 'Delete',
  'save': 'Save',
  'cancel': 'Cancel',
  'submit': 'Submit',
  'search': 'Search',
  'filter': 'Filter',
  'export': 'Export',
  'print': 'Print',
  'back': 'Back',
  'next': 'Next',
  'previous': 'Previous',
  'close': 'Close',
  'confirm': 'Confirm',
  'loading': 'Loading...',
  'saving': 'Saving...',
  
  // حالات الطلبات
  'pending': 'Pending',
  'in_progress': 'In Progress',
  'completed': 'Completed',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  
  // نصوص عامة
  'name': 'Name',
  'email': 'Email',
  'phone': 'Phone',
  'address': 'Address',
  'date': 'Date',
  'time': 'Time',
  'status': 'Status',
  'price': 'Price',
  'total': 'Total',
  'description': 'Description',
  'notes': 'Notes',
  'client_name': 'Client Name',
  'client_phone': 'Client Phone',
  
  // رسائل النجاح والخطأ
  'success': 'Success',
  'error': 'Error',
  'warning': 'Warning',
  'info': 'Info',
  'order_added_success': 'Order added successfully',
  'order_updated_success': 'Order updated successfully',
  'order_deleted_success': 'Order deleted successfully',
  'fill_required_fields': 'Please fill all required fields',

  // نصوص إضافية مطلوبة
  'admin_dashboard': 'Admin Dashboard',
  'worker_dashboard': 'Worker Dashboard',
  'admin': 'Admin',
  'worker': 'Worker',
  'change_language': 'Change Language',
  'my_active_orders': 'My Active Orders',
  'completed_orders': 'Completed Orders',
  'total_orders': 'Total Orders',
  'total_revenue': 'Total Revenue',
  'recent_orders': 'Recent Orders',
  'quick_actions': 'Quick Actions',
  'view_all_orders': 'View All Orders',
  'add_order': 'Add Order',
  'manage_workers': 'Manage Workers',
  'view_reports': 'View Reports',
  'client_name_required': 'Client Name *',
  'phone_required': 'Phone Number *',
  'order_description_required': 'Order Description *',
  'delivery_date_required': 'Delivery Date *',
  'price_sar': 'Price (SAR)',
  'measurements_cm': 'Measurements (cm)',
  'additional_notes': 'Additional Notes',
  'voice_notes_optional': 'Voice Notes (Optional)',
  'design_images': 'Design Images',
  'fabric_type': 'Fabric Type',
  'responsible_worker': 'Responsible Worker',
  'choose_worker': 'Choose Responsible Worker',
  'order_status': 'Order Status',
  'back_to_dashboard': 'Back to Dashboard',
  'overview_today': 'Overview of today\'s activities',
  'welcome_worker': 'Welcome to your workspace',

  // نصوص الفوتر
  'home': 'Home',
  'track_order': 'Track Order',
  'fabrics': 'Fabrics',
  'contact_us': 'Contact Us',
  'yasmin_alsham': 'Yasmin Alsham',
  'custom_dress_tailoring': 'Custom Dress Tailoring'
}

// Hook للترجمة
export function useTranslation() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar')

  // تحميل اللغة المحفوظة عند بدء التطبيق
  useEffect(() => {
    const savedLanguage = localStorage.getItem('dashboard-language') as 'ar' | 'en'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // حفظ اللغة عند تغييرها
  const changeLanguage = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage)
    localStorage.setItem('dashboard-language', newLanguage)
  }

  // دالة الترجمة
  const t = (key: TranslationKey): string => {
    const translations = language === 'ar' ? arTranslations : enTranslations
    const translation = translations[key]
    
    if (typeof translation === 'string') {
      return translation
    }
    
    // إذا لم توجد الترجمة، أرجع المفتاح نفسه
    return key
  }

  // التحقق من اللغة الحالية
  const isArabic = language === 'ar'
  const isEnglish = language === 'en'

  return {
    language,
    changeLanguage,
    t,
    isArabic,
    isEnglish
  }
}
