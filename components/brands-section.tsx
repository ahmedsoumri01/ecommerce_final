import Image from "next/image";
import TuniKadoLogo from "@/public/images/logo/tunikado_logo.png";
import SamsungLogo from "@/public/images/logo/samsung_logo.png";
import HocoLogo from "@/public/images/logo/hoco_logo.png";
import AppleLogo from "@/public/images/logo/apple_logo.png";
interface Brand {
  id: number;
  name: string;
  logo: any;
}

const brands: Brand[] = [
  { id: 1, name: "Tunikado", logo: TuniKadoLogo },
  { id: 2, name: "Samsung", logo: SamsungLogo },
  { id: 3, name: "Hoco", logo: HocoLogo },
  { id: 4, name: "apple ", logo: AppleLogo },
];

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
  );
}
