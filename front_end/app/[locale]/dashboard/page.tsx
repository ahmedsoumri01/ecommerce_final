"use client";

import { useProtectedRoute } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, FileText, LogOut, Bell } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { resetAllStores } from "@/lib/store-reset";

export default function ClientDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const { user, isLoading } = useProtectedRoute("client");
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    resetAllStores();
    router.push(`/${params.locale}/login`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                My Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                Welcome back, {user?.firstName}!
              </CardTitle>
              <p className="text-gray-600">
                Here's your personal dashboard overview.
              </p>
            </CardHeader>
          </Card>

          {/* Profile Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Name:</span>
                    <span>
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Role:</span>
                    <span className="capitalize">{user?.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className="text-green-600 capitalize">
                      {user?.accountStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-gray-600">Things you can do from here</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center">
                  <User className="h-6 w-6 mb-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Settings className="h-6 w-6 mb-2" />
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <FileText className="h-6 w-6 mb-2" />
                  My Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
