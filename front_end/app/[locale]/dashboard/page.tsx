"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, FileText, Bell } from "lucide-react";

export default function ClientDashboard({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
          <p className="text-gray-600">
            Here's your personal dashboard overview.
          </p>
        </CardHeader>
      </Card>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Notifications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium">Documents</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
