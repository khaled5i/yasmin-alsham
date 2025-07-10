'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ReadyDesigns from '@/components/ReadyDesigns'
import Services from '@/components/Services'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('appointments') // غيّرها إذا اسم الجدول مختلف
        .select('*')
      if (error) setError(error.message)
      else setData(data)
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ReadyDesigns />
        <Services />
        <About />
        <FAQ />

        {/* ✅ قسم اختبار الاتصال مع Supabase */}
        <div className="bg-gray-100 p-4 mt-8">
          <h2 className="text-lg font-bold">نتائج من Supabase:</h2>
          {error ? (
            <p className="text-red-600">خطأ: {error}</p>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
