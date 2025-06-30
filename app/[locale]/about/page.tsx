"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";
import Image from "next/image";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import boutique_image from "@/public/images/tuni_kado_boutique.png";
export default function AboutPage({ params }: { params: { locale: string } }) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t("about_us_page.about_us_title")}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t("about_us_page.about_us_subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("about_us_page.our_story_title")}
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>{t("about_us_page.our_story_p1")}</p>
                <p>{t("about_us_page.our_story_p2")}</p>
                <p>{t("about_us_page.our_story_p3")}</p>
              </div>
            </div>
            <div>
              <Image
                src={boutique_image}
                alt="Our Story"
                width={600}
                height={400}
                className="rounded-lg shadow-lg max-h-[600px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("about_us_page.our_values_title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("about_us_page.our_values_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                ),
                title: t("about_us_page.value_customers_title"),
                desc: t("about_us_page.value_customers_desc"),
              },
              {
                icon: (
                  <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                ),
                title: t("about_us_page.value_quality_title"),
                desc: t("about_us_page.value_quality_desc"),
              },
              {
                icon: (
                  <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                ),
                title: t("about_us_page.value_innovation_title"),
                desc: t("about_us_page.value_innovation_desc"),
              },
              {
                icon: <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />,
                title: t("about_us_page.value_trust_title"),
                desc: t("about_us_page.value_trust_desc"),
              },
            ].map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  {value.icon}
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/*    <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("about_us_page.team_title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("about_us_page.team_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: t("about_us_page.team_member_1_name"),
                role: t("about_us_page.team_member_1_role"),
              },
              {
                name: t("about_us_page.team_member_2_name"),
                role: t("about_us_page.team_member_2_role"),
              },
              {
                name: t("about_us_page.team_member_3_name"),
                role: t("about_us_page.team_member_3_role"),
              },
            ].map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <Image
                    src="/placeholder.svg?height=300&width=300"
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
      </section> */}
    </div>
  );
}
