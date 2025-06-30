export interface Category {
  id: number
  name: string
  nameAr: string
  nameFr: string
  icon: string
  image: string
  productCount: number
  featured: boolean
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Smartphones",
    nameAr: "هواتف ذكية",
    nameFr: "Smartphones",
    icon: "📱",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 45,
    featured: true,
  },
  {
    id: 2,
    name: "Laptops",
    nameAr: "أجهزة لابتوب",
    nameFr: "Ordinateurs portables",
    icon: "💻",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 32,
    featured: true,
  },
  {
    id: 3,
    name: "Headphones",
    nameAr: "سماعات",
    nameFr: "Casques",
    icon: "🎧",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 28,
    featured: true,
  },
  {
    id: 4,
    name: "Cameras",
    nameAr: "كاميرات",
    nameFr: "Appareils photo",
    icon: "📷",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 18,
    featured: true,
  },
  {
    id: 5,
    name: "Television",
    nameAr: "تلفزيون",
    nameFr: "Télévision",
    icon: "📺",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 25,
    featured: true,
  },
  {
    id: 6,
    name: "Gaming",
    nameAr: "ألعاب",
    nameFr: "Jeux",
    icon: "🎮",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 35,
    featured: true,
  },
  {
    id: 7,
    name: "Accessories",
    nameAr: "إكسسوارات",
    nameFr: "Accessoires",
    icon: "⌚",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 67,
    featured: true,
  },
  {
    id: 8,
    name: "Home Appliances",
    nameAr: "أجهزة منزلية",
    nameFr: "Électroménager",
    icon: "🏠",
    image: "/placeholder.svg?height=200&width=200",
    productCount: 42,
    featured: true,
  },
]

export const getFeaturedCategories = () => {
  return categories.filter((category) => category.featured)
}
