"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Bell, Shield, Mail, Globe } from "lucide-react";

export default function AdminSettings({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <div className="flex items-center justify-center text-4xl font-bold">
      This page still under development
    </div>
  );
  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">
              Manage your system settings and preferences
            </p>
          </div>
          <Button className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="My E-commerce Store" />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input id="siteUrl" defaultValue="https://mystore.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue="Your one-stop shop for quality products"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      defaultValue="admin@mystore.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      defaultValue="support@mystore.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">
                      New Order Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Get notified when new orders are placed
                    </p>
                  </div>
                  <Switch id="orderNotifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockNotifications">
                      Low Stock Alerts
                    </Label>
                    <p className="text-sm text-gray-500">
                      Alert when products are running low
                    </p>
                  </div>
                  <Switch id="lowStockNotifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="userRegistrations">
                      User Registration Notifications
                    </Label>
                    <p className="text-sm text-gray-500">
                      Notify when new users register
                    </p>
                  </div>
                  <Switch id="userRegistrations" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="twoFactor" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sessionTimeout">Auto Session Timeout</Label>
                    <p className="text-sm text-gray-500">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Switch id="sessionTimeout" defaultChecked />
                </div>
                <Separator />
                <div>
                  <Label htmlFor="sessionDuration">
                    Session Duration (minutes)
                  </Label>
                  <Input
                    id="sessionDuration"
                    type="number"
                    defaultValue="60"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Localization
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Backup Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">v2.1.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">Connected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">85% Used</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Backup:</span>
                  <span className="font-medium">2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
