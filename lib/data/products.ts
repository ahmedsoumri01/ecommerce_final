import productTestImg from "@/public/images/iphone.jpg";

export interface Product {
  id: number;
  name: string;
  nameAr: string;
  nameFr: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryAr: string;
  categoryFr: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: 1,
    name: "WH-1000XM4 Wireless Noise Cancelling Headphones",
    nameAr: "سماعات لاسلكية بإلغاء الضوضاء WH-1000XM4",
    nameFr: "Casque sans fil à réduction de bruit WH-1000XM4",
    brand: "Sony",
    price: 299.99,
    originalPrice: 349.99,
    image: productTestImg,
    category: "Headphones",
    categoryAr: "سماعات",
    categoryFr: "Casques",
    description:
      "Industry-leading noise canceling with Dual Noise Sensor technology",
    descriptionAr: "إلغاء ضوضاء رائد في الصناعة مع تقنية المستشعر المزدوج",
    descriptionFr:
      "Réduction de bruit leader avec technologie Dual Noise Sensor",
    rating: 4.8,
    reviews: 1250,
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "MacBook Pro 16-inch M2 Pro",
    nameAr: "ماك بوك برو 16 بوصة M2 Pro",
    nameFr: "MacBook Pro 16 pouces M2 Pro",
    brand: "Apple",
    price: 2499.99,
    image: productTestImg,
    category: "Laptops",
    categoryAr: "أجهزة لابتوب",
    categoryFr: "Ordinateurs portables",
    description: "Supercharged by M2 Pro chip for next-level performance",
    descriptionAr: "مدعوم بشريحة M2 Pro للأداء من المستوى التالي",
    descriptionFr:
      "Suralimenté par la puce M2 Pro pour des performances de niveau supérieur",
    rating: 4.9,
    reviews: 890,
    inStock: true,
    featured: true,
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max 256GB",
    nameAr: "آيفون 15 برو ماكس 256 جيجا",
    nameFr: "iPhone 15 Pro Max 256 Go",
    brand: "Apple",
    price: 1199.99,
    image: productTestImg,
    category: "Smartphones",
    categoryAr: "هواتف ذكية",
    categoryFr: "Smartphones",
    description: "Titanium design with A17 Pro chip and advanced camera system",
    descriptionAr: "تصميم من التيتانيوم مع شريحة A17 Pro ونظام كاميرا متقدم",
    descriptionFr:
      "Design en titane avec puce A17 Pro et système de caméra avancé",
    rating: 4.7,
    reviews: 2100,
    inStock: true,
    featured: true,
  },
  {
    id: 4,
    name: 'Samsung 65" QLED 4K Smart TV',
    nameAr: "تلفزيون سامسونج 65 بوصة QLED 4K ذكي",
    nameFr: 'TV Samsung 65" QLED 4K Smart',
    brand: "Samsung",
    price: 899.99,
    originalPrice: 1199.99,
    image: productTestImg,
    category: "Television",
    categoryAr: "تلفزيون",
    categoryFr: "Télévision",
    description: "Quantum Dot technology with HDR10+ and smart features",
    descriptionAr: "تقنية Quantum Dot مع HDR10+ والميزات الذكية",
    descriptionFr:
      "Technologie Quantum Dot avec HDR10+ et fonctionnalités intelligentes",
    rating: 4.6,
    reviews: 750,
    inStock: true,
    featured: true,
  },
  {
    id: 5,
    name: "PlayStation 5 Console",
    nameAr: "جهاز بلايستيشن 5",
    nameFr: "Console PlayStation 5",
    brand: "Sony",
    price: 499.99,
    image: productTestImg,
    category: "Gaming",
    categoryAr: "ألعاب",
    categoryFr: "Jeux",
    description: "Next-gen gaming with ultra-high speed SSD and ray tracing",
    descriptionAr: "ألعاب الجيل التالي مع SSD فائق السرعة وتتبع الأشعة",
    descriptionFr:
      "Jeux nouvelle génération avec SSD ultra-rapide et ray tracing",
    rating: 4.8,
    reviews: 1800,
    inStock: false,
    featured: true,
  },
  {
    id: 6,
    name: "Canon EOS R5 Mirrorless Camera",
    nameAr: "كاميرا كانون EOS R5 بدون مرآة",
    nameFr: "Appareil photo Canon EOS R5 sans miroir",
    brand: "Canon",
    price: 3899.99,
    image: productTestImg,
    category: "Cameras",
    categoryAr: "كاميرات",
    categoryFr: "Appareils photo",
    description: "45MP full-frame sensor with 8K video recording",
    descriptionAr: "مستشعر 45 ميجابكسل كامل الإطار مع تسجيل فيديو 8K",
    descriptionFr: "Capteur plein format 45MP avec enregistrement vidéo 8K",
    rating: 4.9,
    reviews: 420,
    inStock: true,
    featured: true,
  },
  {
    id: 7,
    name: "AirPods Pro (2nd Generation)",
    nameAr: "إيربودز برو (الجيل الثاني)",
    nameFr: "AirPods Pro (2ème génération)",
    brand: "Apple",
    price: 249.99,
    image: productTestImg,
    category: "Headphones",
    categoryAr: "سماعات",
    categoryFr: "Casques",
    description: "Active Noise Cancellation with Adaptive Transparency",
    descriptionAr: "إلغاء الضوضاء النشط مع الشفافية التكيفية",
    descriptionFr: "Réduction active du bruit avec transparence adaptative",
    rating: 4.7,
    reviews: 3200,
    inStock: true,
    featured: true,
  },
  {
    id: 8,
    name: "Dell XPS 13 Plus Laptop",
    nameAr: "لابتوب ديل XPS 13 Plus",
    nameFr: "Ordinateur portable Dell XPS 13 Plus",
    brand: "Dell",
    price: 1299.99,
    image: productTestImg,
    category: "Laptops",
    categoryAr: "أجهزة لابتوب",
    categoryFr: "Ordinateurs portables",
    description: "13.4-inch OLED display with Intel 12th Gen processors",
    descriptionAr: "شاشة OLED 13.4 بوصة مع معالجات إنتل الجيل الثاني عشر",
    descriptionFr:
      "Écran OLED 13,4 pouces avec processeurs Intel 12e génération",
    rating: 4.5,
    reviews: 680,
    inStock: true,
    featured: true,
  },
  {
    id: 9,
    name: "Samsung Galaxy Watch 6",
    nameAr: "ساعة سامسونج جالاكسي 6",
    nameFr: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    price: 329.99,
    image: productTestImg,
    category: "Accessories",
    categoryAr: "إكسسوارات",
    categoryFr: "Accessoires",
    description: "Advanced health monitoring with sleep coaching",
    descriptionAr: "مراقبة صحية متقدمة مع تدريب النوم",
    descriptionFr: "Surveillance de santé avancée avec coaching du sommeil",
    rating: 4.4,
    reviews: 920,
    inStock: true,
    featured: true,
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );
};

export const getFeaturedProducts = () => {
  return products.filter((product) => product.featured);
};
