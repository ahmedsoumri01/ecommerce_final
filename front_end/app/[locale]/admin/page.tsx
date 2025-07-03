"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useKpi } from "@/stores/kpi-store";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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

  // Transform data for charts
  const visitsChartData =
    visitsStats?.byMonth?.map((m: any) => ({
      month: `Month ${m._id}`,
      visits: m.total,
    })) || [];

  const topVisitedChartData =
    topVisited?.map((p: any) => ({
      name: p.name.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
      visits: p.visits,
    })) || [];

  // Pie chart data for orders
  const ordersPieData =
    orderStats?.map((order: any, index: number) => ({
      name: order._id,
      value: order.count,
      fill: `hsl(var(--chart-${index + 1}))`,
    })) || [];

  // Pie chart data for products stock
  const productStockData = productStats
    ? [
        {
          name: "In Stock",
          value: productStats.inStock || 0,
          fill: "hsl(var(--chart-1))",
        },
        {
          name: "Out of Stock",
          value: productStats.outStock || 0,
          fill: "hsl(var(--chart-2))",
        },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
          <p className="text-muted-foreground">
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
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">{userCount ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Products
                </p>
                <p className="text-2xl font-bold">
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
                <p className="text-sm font-medium text-muted-foreground">
                  Orders
                </p>
                <p className="text-2xl font-bold">
                  {orderStats
                    ? orderStats.reduce((a: any, b: any) => a + b.count, 0)
                    : "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {orderStats &&
                    orderStats
                      .map((s: any) => `${s._id}: ${s.count}`)
                      .join(" | ")}
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
                <p className="text-sm font-medium text-muted-foreground">
                  Categories
                </p>
                <p className="text-2xl font-bold">{categoryCount ?? "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circle Charts for Orders and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <p className="text-muted-foreground">
              Breakdown of orders by status
            </p>
          </CardHeader>
          <CardContent>
            {ordersPieData.length > 0 ? (
              <ChartContainer
                config={{
                  pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-1))",
                  },
                  completed: {
                    label: "Completed",
                    color: "hsl(var(--chart-2))",
                  },
                  cancelled: {
                    label: "Cancelled",
                    color: "hsl(var(--chart-3))",
                  },
                  processing: {
                    label: "Processing",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={ordersPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {ordersPieData.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No order data available
              </div>
            )}
            {/* Legend */}
            {ordersPieData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {ordersPieData.map((entry: any, index: any) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Stock Status</CardTitle>
            <p className="text-muted-foreground">
              In stock vs out of stock products
            </p>
          </CardHeader>
          <CardContent>
            {productStockData.length > 0 &&
            productStockData.some((d) => d.value > 0) ? (
              <ChartContainer
                config={{
                  inStock: {
                    label: "In Stock",
                    color: "hsl(var(--chart-1))",
                  },
                  outStock: {
                    label: "Out of Stock",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={productStockData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {productStockData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No product data available
              </div>
            )}
            {/* Legend */}
            {productStockData.length > 0 && (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {productStockData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: index === 0 ? "#22c55e" : "#ef4444",
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-muted-foreground">Common administrative tasks</p>
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
            <p className="text-muted-foreground">Latest system activities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentActivities && (
                <>
                  {recentActivities.users?.map((u: any) => (
                    <div key={u._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New user: {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(u.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.products?.map((p: any) => (
                    <div key={p._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Product added: {p.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.orders?.map((o: any) => (
                    <div key={o._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Order: {o.orderRef}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(o.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivities.categories?.map((c: any) => (
                    <div key={c._id} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Category: {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
            {visitsChartData.length > 0 ? (
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="min-h-[200px]"
              >
                <BarChart data={visitsChartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="visits" fill="var(--color-visits)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Visited Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topVisitedChartData.length > 0 ? (
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="min-h-[200px]"
              >
                <BarChart data={topVisitedChartData}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="visits" fill="var(--color-visits)" radius={8} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
