"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useKpi } from "@/stores/kpi-store";
import { Bar } from "@/components/ui/BarChart";

export default function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const {
    userCount,
    productStats,
    orderStats,
    categoryCount,
    recentActivities,
    visitsStats,
    topVisited,
    fetchUserCount,
    fetchProductStats,
    fetchOrderStats,
    fetchCategoryCount,
    fetchRecentActivities,
    fetchVisitsStats,
    fetchTopVisited,
  } = useKpi();

  useEffect(() => {
    fetchUserCount();
    fetchProductStats();
    fetchOrderStats();
    fetchCategoryCount();
    fetchRecentActivities();
    fetchVisitsStats();
    fetchTopVisited();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <p className="text-gray-600">
            Overview of your system's performance and key metrics.
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userCount ?? "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {productStats?.total ?? "-"}
                </p>
                <p className="text-xs text-green-600">
                  In Stock: {productStats?.inStock ?? "-"} / Out:{" "}
                  {productStats?.outStock ?? "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderStats ? orderStats.reduce((a: any, b: any) => a + b.count, 0) : "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {orderStats &&
                    orderStats.map((s: any) => `${s._id}: ${s.count}`).join(" | ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tags className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categoryCount ?? "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-gray-600">Common administrative tasks</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/${params.locale}/admin/users`}>
                <Button className="w-full h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  Manage Users
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/products`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Package className="h-6 w-6 mb-2" />
                  Add Product
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/categories`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Tags className="h-6 w-6 mb-2" />
                  Categories
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/orders`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  View Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-gray-600">Latest system activities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivities && (
                <>
                  {recentActivities.users.map((u: any) => (
                    <div key={u._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New user: {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(u.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.products.map((p: any) => (
                    <div key={p._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Product added: {p.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.orders.map((o: any) => (
                    <div key={o._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order: {o.orderRef}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(o.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.categories.map((c: any) => (
                    <div key={c._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Category: {c.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visits by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {visitsStats && (
              <Bar
                data={{
                  labels: visitsStats.byMonth.map((m: any) => `Month ${m._id}`),
                  datasets: [
                    {
                      label: "Visits",
                      data: visitsStats.byMonth.map((m: any) => m.total),
                      backgroundColor: "#6366f1",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Visited Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topVisited && (
              <Bar
                data={{
                  labels: topVisited.map((p: any) => p.name),
                  datasets: [
                    {
                      label: "Visits",
                      data: topVisited.map((p: any) => p.visits),
                      backgroundColor: "#f59e42",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">API Services</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Email Service</p>
                <p className="text-xs text-gray-500">Degraded</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
