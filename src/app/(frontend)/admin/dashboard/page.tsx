import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";

import { StatsCard } from "@/components/admin-native/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardSnapshot } from "@/data/admin/dashboard";
import { formatPrice } from "@/utilities/formatPrices";
import { cn } from "@/lib/cn";

// Mock data for the chart - we'll implement real chart in a client component if needed
const mockChartData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 3400 },
  { name: 'May', total: 2900 },
  { name: 'Jun', total: 4500 },
];

const DashboardPage = async () => {
  const stats = await getAdminDashboardSnapshot();

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 font-medium">Welcome back, Admin. Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary">
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue, stats.currency, "en")}
          icon={TrendingUp}
          description="Total earnings from all time"
          trend={{ value: 12.5, isUp: true }}
          iconClassName="text-emerald-600 bg-emerald-50"
        />
        <StatsCard
          title="Total Orders"
          value={stats.orders}
          icon={ShoppingBag}
          description={`${stats.ordersLast30Days} in the last 30 days`}
          trend={{ value: 8.2, isUp: true }}
          iconClassName="text-blue-600 bg-blue-50"
        />
        <StatsCard
          title="Active Customers"
          value={stats.customers}
          icon={Users}
          description="Total registered users"
          trend={{ value: 2.4, isUp: false }}
          iconClassName="text-amber-600 bg-amber-50"
        />
        <StatsCard
          title="Live Products"
          value={stats.products}
          icon={Package}
          description={`${stats.pendingOrders} orders awaiting fulfillment`}
          iconClassName="text-purple-600 bg-purple-50"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-7">
        {/* Sales Overview Chart (Placeholder UI) */}
        <Card className="lg:col-span-4 border-slate-200 shadow-sm overflow-hidden group">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Sales Overview</CardTitle>
                <CardDescription>Monthly revenue growth throughout the current year.</CardDescription>
              </div>
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
                <option>Last 6 Months</option>
                <option>Yearly</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="relative h-[300px] w-full items-end justify-between flex gap-4 px-4">
              {mockChartData.map((item, idx) => {
                const height = (item.total / 5000) * 100;
                return (
                  <div key={item.name} className="flex flex-1 flex-col items-center gap-3">
                    <div className="relative w-full group/bar">
                      <div 
                        className="w-full rounded-t-xl bg-slate-100 transition-all duration-500 group-hover/bar:bg-primary/30" 
                        style={{ height: `${height}%` }}
                      >
                        <div 
                          className="absolute bottom-0 w-full rounded-t-xl bg-primary shadow-[0_0_20px_rgba(234,186,136,0.3)] transition-all duration-300 group-hover/bar:brightness-110" 
                          style={{ height: idx === 5 ? '100%' : '60%' }} 
                        />
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover/bar:opacity-100">
                          <div className="rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-xl">
                            ${item.total}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-50 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                <CardDescription>Latest customer purchases across regions.</CardDescription>
              </div>
              <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="divide-y divide-slate-100">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 transition-colors hover:bg-slate-50/80">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-bold">
                        {order.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{order.name}</span>
                        <span className="text-xs font-medium text-slate-500">{order.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(order.totalWithShipping, stats.currency, "en")}
                      </span>
                      <span className={cn(
                        "mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        order.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                        order.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-600"
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                  <AlertCircle className="mb-3 h-10 w-10 opacity-20" />
                  <p className="text-sm font-medium">No recent orders found</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 bg-slate-50/30 border-t border-slate-100">
            <button className="w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-900 hover:shadow-sm">
              Export Activity Log
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
