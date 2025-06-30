"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OfflinePage({
  params,
}: {
  params: { locale: string }
}) {
  const isRTL = params.locale === "ar"

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isRTL ? "rtl" : "ltr"}`}>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <CardTitle className="text-2xl">لا يوجد اتصال بالإنترنت</CardTitle>
          <CardDescription>يبدو أنك غير متصل بالإنترنت. تحقق من اتصالك وحاول مرة أخرى.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.reload()} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
