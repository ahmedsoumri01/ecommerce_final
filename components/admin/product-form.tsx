"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ProductFormProps {
  product?: any
  onSave: (data: any) => void
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    nameAr: product?.nameAr || "",
    nameFr: product?.nameFr || "",
    brand: product?.brand || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    description: product?.description || "",
    descriptionAr: product?.descriptionAr || "",
    descriptionFr: product?.descriptionFr || "",
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nameAr">اسم المنتج (عربي)</Label>
          <Input id="nameAr" name="nameAr" value={formData.nameAr} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="name">اسم المنتج (إنجليزي)</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">العلامة التجارية</Label>
          <Input id="brand" name="brand" value={formData.brand} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="category">الفئة</Label>
          <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">السعر</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">السعر الأصلي (اختياري)</Label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            value={formData.originalPrice}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
        <Textarea
          id="descriptionAr"
          name="descriptionAr"
          value={formData.descriptionAr}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="description">الوصف (إنجليزي)</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="flex gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(value) => handleSwitchChange("inStock", value)}
          />
          <Label htmlFor="inStock">متوفر في المخزون</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(value) => handleSwitchChange("featured", value)}
          />
          <Label htmlFor="featured">منتج مميز</Label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          {product ? "تحديث المنتج" : "إضافة المنتج"}
        </Button>
      </div>
    </form>
  )
}
