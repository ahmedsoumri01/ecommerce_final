"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  cta: string
  ctaLink: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  isRTL?: boolean
}

export function HeroCarousel({ slides, isRTL = false }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
          }`}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className={`grid md:grid-cols-2 gap-8 items-center w-full ${isRTL ? "text-right" : "text-left"}`}>
              <div className="text-white space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">{slide.title}</h1>
                <p className="text-xl md:text-2xl opacity-90">{slide.subtitle}</p>
                <p className="text-lg opacity-80 max-w-lg">{slide.description}</p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                  {slide.cta}
                </Button>
              </div>
              <div className="relative">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  )
}
