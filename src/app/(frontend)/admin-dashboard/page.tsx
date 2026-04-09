import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  MoreVertical,
  Activity,
  DollarSign
} from "lucide-react";

import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export const dynamic = "force-dynamic";

async function getAdminData() {
  const db = await getMongoDb();
  
  // Parallel fetch for speed
  const [orders, products, customers] = await Promise.all([
    db.collection("orders").find().sort({ createdAt: -1 }).limit(5).toArray(),
    db.collection("products").countDocuments(),
    db.collection("customers").countDocuments(),
  ]);

  const allOrders = await db.collection("orders").find({}, { projection: { "orderDetails.totalWithShipping": 1 } }).toArray();
  const totalRevenue = allOrders.reduce((acc, order) => acc + (order.orderDetails?.totalWithShipping || 0), 0);

  return {
    recentOrders: orders,
    productCount: products,
    customerCount: customers,
    totalRevenue,
    orderCount: allOrders.length
  };
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
  
  const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;

  if (!admin) {
    redirect("/admin-login");
  }

  const stats = await getAdminData();

  return (
    <div className="min-h-screen bg-transparent text-gray-900 pb-20 no-prose">
      <main className="max-w-7xl mx-auto py-10">
         
         {/* Welcome Header */}
         <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 uppercase italic leading-none mb-3">Dashboard Overview</h1>
            <p className="text-gray-500 font-medium">Real-time statistics for KH Foods shop management.</p>
         </header>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard 
              label="Revenue" 
              value={`$${stats.totalRevenue.toLocaleString()}`} 
              icon={<DollarSign />} 
              trend="+12%" 
              trendUp={true} 
              bg="bg-indigo-50" 
              color="text-indigo-600"
            />
            <StatCard 
              label="Total Orders" 
              value={stats.orderCount.toString()} 
              icon={<ShoppingBag />} 
              trend="+5%" 
              trendUp={true} 
              bg="bg-green-50" 
              color="text-green-600"
            />
            <StatCard 
              label="Active Products" 
              value={stats.productCount.toString()} 
              icon={<Package />} 
              trend="Stable" 
              trendUp={null} 
              bg="bg-amber-50" 
              color="text-amber-600"
            />
            <StatCard 
              label="Total Customers" 
              value={stats.customerCount.toString()} 
              icon={<Users />} 
              trend="+24%" 
              trendUp={true} 
              bg="bg-blue-50" 
              color="text-blue-600"
            />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Orders Table */}
            <div className="lg:col-span-2">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Latest Shipments</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">See all transactions</button>
               </div>
               
               <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50/50 border-b border-gray-50">
                        <tr>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Activity</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {stats.recentOrders.map((order: any) => (
                          <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                             <td className="px-8 py-6 font-bold text-gray-900 tracking-tight">#{order.id}</td>
                             <td className="px-8 py-6">
                                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-50 text-gray-600 border border-gray-100">
                                   {order.orderDetails?.status}
                                </span>
                             </td>
                             <td className="px-8 py-6 font-black text-gray-900 italic">${(order.orderDetails?.totalWithShipping || 0).toFixed(2)}</td>
                             <td className="px-8 py-6 text-right">
                                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                                   <ChevronRight className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* System Status Sidebar */}
            <div className="space-y-6">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">System Health</h3>
               <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-inner">
                        <Activity className="w-6 h-6 animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1 uppercase italic">Database Live</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">MongoDB Sync Cluster</p>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <HealthBar label="API Response" value="98%" color="bg-blue-500" />
                     <HealthBar label="Inventory Sync" value="100%" color="bg-green-500" />
                     <HealthBar label="Server Load" value="14%" color="bg-amber-500" />
                  </div>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-green-100/50 transition-colors" />
               </div>
            </div>
         </div>

      </main>
    </div>
  );
}

function StatCard({ label, value, icon, trend, trendUp, bg, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
       <div className="flex items-center justify-between mb-8">
          <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform`}>
             {React.cloneElement(icon, { className: "w-6 h-6" })}
          </div>
          {trendUp !== null && (
             <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {trend}
             </div>
          )}
       </div>
       <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</h4>
       <p className="text-3xl font-black text-gray-900 italic tracking-tight">{value}</p>
       <div className={`absolute top-0 right-0 w-32 h-32 ${bg} opacity-20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-40 transition-all`} />
    </div>
  );
}

function HealthBar({ label, value, color }: any) {
  return (
    <div>
       <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500">{label}</span>
          <span className="text-[10px] font-black text-gray-900">{value}</span>
       </div>
       <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100">
          <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: value }} />
       </div>
    </div>
  );
}
