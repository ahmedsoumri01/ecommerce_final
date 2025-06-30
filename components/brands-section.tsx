import Image from "next/image"

interface Brand {
  id: number
  name: string
  logo: string
}

const brands: Brand[] = [
  { id: 1, name: "Apple", logo: "/placeholder.svg?height=80&width=120" },
  { id: 2, name: "Samsung", logo: "/placeholder.svg?height=80&width=120" },
  { id: 3, name: "Sony", logo: "/placeholder.svg?height=80&width=120" },
  { id: 4, name: "Dell", logo: "/placeholder.svg?height=80&width=120" },
]

export function BrandsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={120}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
