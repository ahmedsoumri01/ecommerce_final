"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, ShoppingCart, Tags } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { getDictionary } from "@/lib/dictionaries";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const { t, dict } = useClientDictionary(params.locale);

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

  // Add state for chart view (month/day)
  const [visitsView, setVisitsView] = useState<"month" | "day">("month");
  const [topVisitedView, setTopVisitedView] = useState<"month" | "day">(
    "month"
  );

  // Chart data for visits
  const visitsChartData =
    visitsView === "month"
      ? visitsStats?.byMonth?.map((m: any) => ({
          label: `Month ${m._id}`,
          visits: m.total,
        })) || []
      : visitsStats?.byDay?.map((d: any) => ({
          label: d._id,
          visits: d.total,
        })) || [];

  // Chart data for top visited products
  let topVisitedChartData: { id: string; name: string; visits: number }[] = [];
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  if (
    topVisitedView === "month" &&
    topVisited &&
    (topVisited as any).byMonth &&
    Array.isArray((topVisited as any).byMonth)
  ) {
    // Find the current month entry
    const monthEntry = (topVisited as any).byMonth.find(
      (m: any) => m._id === thisMonth
    );
    if (monthEntry && Array.isArray(monthEntry.products)) {
      topVisitedChartData = monthEntry.products.map((p: any) => ({
        id: p._id,
        name: p.name?.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
        visits: p.visits,
      }));
    }
  } else if (
    topVisitedView === "day" &&
    topVisited &&
    (topVisited as any).byDay &&
    Array.isArray((topVisited as any).byDay)
  ) {
    // Find the current day entry
    const dayEntry = (topVisited as any).byDay.find(
      (d: any) => d._id === today
    );
    if (dayEntry && Array.isArray(dayEntry.products)) {
      topVisitedChartData = dayEntry.products.map((p: any) => ({
        id: p._id,
        name: p.name?.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
        visits: p.visits,
      }));
    }
  } else if (Array.isArray(topVisited)) {
    // fallback for old data shape
    topVisitedChartData = topVisited.map((p: any) => ({
      id: p._id || p.id,
      name: p.name?.length > 10 ? p.name.substring(0, 10) + "..." : p.name,
      visits: p.visits,
    }));
  }

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
          name: t("adminDashboard.kpi.inStock"),
          value: productStats.inStock || 0,
          fill: "hsl(var(--chart-1))",
        },
        {
          name: t("adminDashboard.kpi.outStock"),
          value: productStats.outStock || 0,
          fill: "hsl(var(--chart-2))",
        },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const BAR_COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6699",
    "#A28BFE",
    "#FFB347",
    "#B6E880",
    "#FF6F61",
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("adminDashboard.title")}</CardTitle>
          <p className="text-muted-foreground">{t("adminDashboard.subtitle")}</p>
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
                  {t("adminDashboard.kpi.users")}
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
                  {t("adminDashboard.kpi.products")}
                </p>
                <p className="text-2xl font-bold">
                  {productStats?.total ?? "-"}
                </p>
                <p className="text-xs text-green-600">
                  {t("adminDashboard.kpi.inStock")}: {productStats?.inStock ?? "-"} / {t("adminDashboard.kpi.outStock")}: {productStats?.outStock ?? "-"}
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
                  {t("adminDashboard.kpi.orders")}
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
                  {t("adminDashboard.kpi.categories")}
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
            <CardTitle>{t("adminDashboard.kpi.orderStatusDistribution")}</CardTitle>
            <p className="text-muted-foreground">
              {t("adminDashboard.kpi.orderStatusDistributionDesc")}
            </p>
          </CardHeader>
          <CardContent>
            {ordersPieData.length > 0 ? (
              <ChartContainer
                config={{
                  pending: {
                    label: t("adminDashboard.kpi.pending"),
                    color: "hsl(var(--chart-1))",
                  },
                  completed: {
                    label: t("adminDashboard.kpi.completed"),
                    color: "hsl(var(--chart-2))",
                  },
                  cancelled: {
                    label: t("adminDashboard.kpi.cancelled"),
                    color: "hsl(var(--chart-3))",
                  },
                  processing: {
                    label: t("adminDashboard.kpi.processing"),
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
                {t("adminDashboard.kpi.noOrderData")}
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
            <CardTitle>{t("adminDashboard.kpi.productStockStatus")}</CardTitle>
            <p className="text-muted-foreground">
              {t("adminDashboard.kpi.productStockStatusDesc")}
            </p>
          </CardHeader>
          <CardContent>
            {productStockData.length > 0 &&
            productStockData.some((d) => d.value > 0) ? (
              <ChartContainer
                config={{
                  inStock: {
                    label: t("adminDashboard.kpi.inStock"),
                    color: "hsl(var(--chart-1))",
                  },
                  outStock: {
                    label: t("adminDashboard.kpi.outStock"),
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
                {t("adminDashboard.kpi.noProductData")}
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
            <CardTitle>{t("adminDashboard.kpi.quickActions")}</CardTitle>
            <p className="text-muted-foreground">{t("adminDashboard.kpi.quickActionsDesc")}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href={`/${params.locale}/admin/users`}>
                <Button className="w-full h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  {t("adminDashboard.kpi.manageUsers")}
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/products`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Package className="h-6 w-6 mb-2" />
                  {t("adminDashboard.kpi.addProduct")}
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/categories`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <Tags className="h-6 w-6 mb-2" />
                  {t("adminDashboard.kpi.categoriesBtn")}
                </Button>
              </Link>
              <Link href={`/${params.locale}/admin/orders`}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col items-center justify-center bg-transparent"
                >
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  {t("adminDashboard.kpi.viewOrders")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("adminDashboard.kpi.recentActivity")}</CardTitle>
            <p className="text-muted-foreground">{t("adminDashboard.kpi.recentActivityDesc")}</p>
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
                          {t("adminDashboard.kpi.newUser")}: {u.firstName} {u.lastName}
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
                          {t("adminDashboard.kpi.productAdded")}: {p.name}
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
                          {t("adminDashboard.kpi.order")}: {o.orderRef}
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
                          {t("adminDashboard.kpi.category")}: {c.name}
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
        <Card className="p-0">
          <CardHeader>
            <CardTitle className="!p-0">
              {t("adminDashboard.kpi.visitsBy")} {visitsView === "month" ? t("adminDashboard.kpi.month") : t("adminDashboard.kpi.day")}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={visitsView === "month" ? "default" : "outline"}
                onClick={() => setVisitsView("month")}
              >
                {t("adminDashboard.kpi.month")}
              </Button>
              <Button
                size="sm"
                variant={visitsView === "day" ? "default" : "outline"}
                onClick={() => setVisitsView("day")}
              >
                {t("adminDashboard.kpi.day")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {visitsChartData.length > 0 ? (
              <ChartContainer
                config={{
                  visits: {
                    label: t("adminDashboard.kpi.visitsBy"),
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="min-h-[170px] sm:min-h-[200px]"
              >
                <BarChart data={visitsChartData}>
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="visits" radius={8}>
                    {visitsChartData.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-month-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                {t("adminDashboard.kpi.noData")}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("adminDashboard.kpi.topVisitedProducts")} ({topVisitedView === "month" ? t("adminDashboard.kpi.month") : t("adminDashboard.kpi.day")})
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant={topVisitedView === "month" ? "default" : "outline"}
                onClick={() => setTopVisitedView("month")}
              >
                {t("adminDashboard.kpi.month")}
              </Button>
              <Button
                size="sm"
                variant={topVisitedView === "day" ? "default" : "outline"}
                onClick={() => setTopVisitedView("day")}
              >
                {t("adminDashboard.kpi.day")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topVisitedChartData.length > 0 ? (
              <ChartContainer
                config={{
                  visits: {
                    label: t("adminDashboard.kpi.visitsBy"),
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="min-h-[180px] sm:min-h-[200px]"
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
                  <Bar dataKey="visits" radius={8}>
                    {topVisitedChartData.map((entry, index) => (
                      <Cell
                        key={`cell-product-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          window.open(
                            `/${params.locale}/products/${entry.id}`,
                            "_blank"
                          )
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                {t("adminDashboard.kpi.noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
