"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Send } from "lucide-react"

interface NewsletterSectionProps {
  dict: any
  isRTL?: boolean
}

export function NewsletterSection({ dict, isRTL = false }: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setEmail("")
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
      <div className="container mx-auto px-4">
        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-8 ${isRTL ? "text-right" : "text-left"}`}
        >
          <div className="text-white space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8" />
              <h2 className="text-3xl font-bold">اشترك في النشرة الإخبارية</h2>
            </div>
            <p className="text-xl opacity-90">احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني</p>
          </div>

          <div className="flex-1 max-w-md w-full">
            {isSubmitted ? (
              <div className="bg-green-500 text-white p-4 rounded-lg text-center">
                <p className="font-semibold">شكراً لك! تم الاشتراك بنجاح</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white"
                />
                <Button type="submit" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
