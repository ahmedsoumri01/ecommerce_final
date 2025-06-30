"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage({
  params,
}: {
  params: { locale: string }
}) {
  const isRTL = params.locale === "ar"

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-xl max-w-3xl mx-auto">
            نحن متجر إلكتروني رائد متخصص في بيع أحدث الأجهزة الإلكترونية والتقنية بأفضل الأسعار وأعلى مستويات الجودة
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">قصتنا</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  بدأت رحلتنا في عام 2020 برؤية واضحة: جعل أحدث التقنيات في متناول الجميع. نحن نؤمن بأن التكنولوجيا يجب
                  أن تكون متاحة وميسورة التكلفة للجميع.
                </p>
                <p>
                  منذ تأسيسنا، نمونا لنصبح واحداً من أكثر المتاجر الإلكترونية ثقة في المنطقة، حيث نخدم آلاف العملاء
                  الراضين ونقدم مجموعة واسعة من المنتجات عالية الجودة.
                </p>
                <p>
                  نحن ملتزمون بتقديم تجربة تسوق استثنائية من خلال خدمة العملاء المتميزة والتوصيل السريع والأسعار
                  التنافسية.
                </p>
              </div>
            </div>
            <div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">قيمنا</h2>
            <p className="text-xl text-gray-600">المبادئ التي توجه عملنا كل يوم</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>العملاء أولاً</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">نضع احتياجات عملائنا في المقدمة ونسعى لتجاوز توقعاتهم</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>الجودة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">نختار منتجاتنا بعناية لضمان أعلى مستويات الجودة والأداء</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>الابتكار</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">نواكب أحدث التطورات التقنية لنقدم أفضل المنتجات</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>الثقة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">نبني علاقات طويلة الأمد مع عملائنا قائمة على الثقة والشفافية</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">فريقنا</h2>
            <p className="text-xl text-gray-600">الأشخاص الذين يجعلون كل شيء ممكناً</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "أحمد محمد", role: "المدير التنفيذي", image: "/placeholder.svg?height=300&width=300" },
              { name: "فاطمة علي", role: "مديرة التسويق", image: "/placeholder.svg?height=300&width=300" },
              { name: "محمد سالم", role: "مدير التقنية", image: "/placeholder.svg?height=300&width=300" },
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
