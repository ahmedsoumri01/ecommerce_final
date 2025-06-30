"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const { t } = useClientDictionary(params.locale);

  const isRTL = params.locale === "ar";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t("contact_us_page.contact_us_title")}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t("contact_us_page.contact_us_subtitle")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {t("contact_us_page.info_title")}
                </h2>
                <p className="text-gray-600 mb-8">
                  {t("contact_us_page.info_description")}
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {t("contact_us_page.address_label")}
                      </h3>
                      <p className="text-gray-600">
                        {t("contact_us_page.address_value")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <Phone className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {t("contact_us_page.phone_label")}
                      </h3>
                      <p className="text-gray-600">
                        {t("contact_us_page.phone_value")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <Mail className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {t("contact_us_page.email_label")}
                      </h3>
                      <p className="text-gray-600">
                        {t("contact_us_page.email_value")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold mb-1">
                        {t("contact_us_page.hours_label")}
                      </h3>
                      <p className="text-gray-600">
                        {t("contact_us_page.hours_value")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("contact_us_page.form_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("contact_us_page.name_label")}
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t("contact_us_page.name_placeholder")}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        {t("contact_us_page.email_label")}
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t("contact_us_page.email_placeholder")}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("contact_us_page.subject_label")}
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t("contact_us_page.subject_placeholder")}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("contact_us_page.message_label")}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={t("contact_us_page.message_placeholder")}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    {t("contact_us_page.submit_button")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
