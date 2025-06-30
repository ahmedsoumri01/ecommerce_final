"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      setShowIndicator(!online)
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  useEffect(() => {
    if (isOnline && showIndicator) {
      const timer = setTimeout(() => setShowIndicator(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, showIndicator])

  if (!showIndicator && isOnline) return null

  return (
    <div className="fixed top-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className={`shadow-lg ${isOnline ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <CardContent className="flex items-center gap-3 p-4">
          {isOnline ? (
            <>
              <Wifi className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">تم الاتصال بالإنترنت</span>
            </>
          ) : (
            <>
              <WifiOff className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">لا يوجد اتصال بالإنترنت</span>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
