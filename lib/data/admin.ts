export interface Order {
  id: number
  customerName: string
  email: string
  phone: string
  address: string
  items: {
    productId: number
    productName: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
}

export interface AdminProduct {
  id: number
  name: string
  nameAr: string
  nameFr: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  descriptionAr: string
  descriptionFr: string
  stock: number
  rating: number
  reviews: number
  featured: boolean
  createdAt: string
}

export const adminOrders: Order[] = [
  {
    id: 1001,
    customerName: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 50 123 4567",
    address: "الرياض، حي النخيل، شارع الملك فهد",
    items: [
      { productId: 1, productName: "سماعات لاسلكية", quantity: 1, price: 299.99 },
      { productId: 3, productName: "آيفون 15 برو ماكس", quantity: 1, price: 1199.99 },
    ],
    total: 1499.98,
    status: "confirmed",
    orderDate: "2024-01-15T10:30:00Z",
  },
  {
    id: 1002,
    customerName: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966 55 987 6543",
    address: "جدة، حي الزهراء، طريق الملك عبدالعزيز",
    items: [{ productId: 2, productName: "ماك بوك برو", quantity: 1, price: 2499.99 }],
    total: 2499.99,
    status: "shipped",
    orderDate: "2024-01-14T14:20:00Z",
  },
  {
    id: 1003,
    customerName: "محمد سالم",
    email: "mohammed@example.com",
    phone: "+966 56 111 2222",
    address: "الدمام، حي الفيصلية، شارع الأمير محمد",
    items: [
      { productId: 4, productName: "تلفزيون سامسونج", quantity: 1, price: 899.99 },
      { productId: 7, productName: "إيربودز برو", quantity: 2, price: 249.99 },
    ],
    total: 1399.97,
    status: "delivered",
    orderDate: "2024-01-13T09:15:00Z",
  },
  {
    id: 1004,
    customerName: "نورا أحمد",
    email: "nora@example.com",
    phone: "+966 54 333 4444",
    address: "مكة المكرمة، حي العزيزية، شارع إبراهيم الخليل",
    items: [{ productId: 5, productName: "بلايستيشن 5", quantity: 1, price: 499.99 }],
    total: 499.99,
    status: "pending",
    orderDate: "2024-01-16T16:45:00Z",
  },
  {
    id: 1005,
    customerName: "خالد عبدالله",
    email: "khalid@example.com",
    phone: "+966 53 555 6666",
    address: "الطائف، حي الشفا، طريق الرياض",
    items: [
      { productId: 6, productName: "كاميرا كانون", quantity: 1, price: 3899.99 },
      { productId: 9, productName: "ساعة سامسونج", quantity: 1, price: 329.99 },
    ],
    total: 4229.98,
    status: "cancelled",
    orderDate: "2024-01-12T11:30:00Z",
  },
]

export const getOrderStats = () => {
  const totalOrders = adminOrders.length
  const totalRevenue = adminOrders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0)

  const statusCounts = adminOrders.reduce(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalOrders,
    totalRevenue,
    pendingOrders: statusCounts.pending || 0,
    confirmedOrders: statusCounts.confirmed || 0,
    shippedOrders: statusCounts.shipped || 0,
    deliveredOrders: statusCounts.delivered || 0,
    cancelledOrders: statusCounts.cancelled || 0,
  }
}
