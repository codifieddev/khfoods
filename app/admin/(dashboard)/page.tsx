"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Activity,
  Package,
  ShoppingCart,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Users,
  Star,
} from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 51000 },
  { month: "Mar", revenue: 38000 },
  { month: "Apr", revenue: 62000 },
  { month: "May", revenue: 73000 },
  { month: "Jun", revenue: 81000 },
  { month: "Jul", revenue: 94000 },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { allProducts } = useAppSelector((state: RootState) => state.adminProducts);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-6">
        <div className="h-10 w-10 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-[0_0_20px_rgba(200,169,126,0.1)]" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C8A97E]/30 animate-pulse italic">Initializing Sector...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 max-w-[1600px]">
      
      {/* EXECUTIVE HEADER */}
      <section className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]/40">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              EXECUTIVE DASHBOARD
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tighter leading-[0.9]">
            Welcome Back, <span className="text-[#C8A97E]">KHFOOD Admin</span>
          </h1>
          <p className="text-lg font-medium text-white/40 max-w-2xl leading-relaxed italic">
            Monitor your luxury brand performance and manage your world-class peanut collections with ease.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <button className="h-14 px-10 bg-[#C8A97E] text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-2xl flex items-center gap-3">
              EXPORT REPORT
           </button>
        </div>
      </section>

      {/* TACTICAL STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "ROASTED PRODUCTS", val: "2", icon: Package, trend: "+2.1%" },
          { label: "COLLECTIONS", val: "0", icon: Layers, trend: "+12.4%" },
          { label: "BOUTIQUE ORDERS", val: "142", icon: ShoppingCart, trend: "+12%" },
          { label: "MEMBER BASE", val: "1,204", icon: Users, trend: "+5.1%" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-10 group hover:border-[#C8A97E]/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 group-hover:bg-[#C8A97E]/10 group-hover:text-[#C8A97E] transition-all">
                <stat.icon size={28} />
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-black text-emerald-400">
                <TrendingUp size={10} /> {stat.trend}
              </div>
            </div>
            <div>
               <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/10 mb-2">{stat.label}</p>
               <p className="text-5xl font-heading font-black text-white tracking-tighter leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* REVENUE CHART */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl space-y-12">
              <div className="flex items-center justify-between px-2">
                 <div className="space-y-2">
                    <h3 className="text-3xl font-heading font-bold text-white tracking-tight">Brand <span className="text-[#C8A97E]">Revenue Performance</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">MONTHLY ANALYTICS OVERVIEW</p>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                       <div className="h-2 w-2 rounded-full bg-[#C8A97E]" />
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Previous Year</span>
                    </div>
                 </div>
              </div>

              <div className="h-[450px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C8A97E" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#C8A97E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="0" stroke="#ffffff08" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#ffffff30"
                      fontSize={11}
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      dy={25}
                    />
                    <YAxis
                      stroke="#ffffff30"
                      fontSize={11}
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#121212]/95 backdrop-blur-xl border border-[#C8A97E]/20 p-6 rounded-2xl shadow-3xl">
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{label}</p>
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-[#C8A97E]" />
                                <p className="text-xl font-black text-white tracking-tighter">${payload[0].value?.toLocaleString()}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#C8A97E"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>

        {/* BOUTIQUE LOGS */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl h-full flex flex-col justify-between overflow-hidden relative">
            <div className="space-y-14">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-heading font-bold text-white tracking-tight">Boutique <span className="text-[#C8A97E]">Logs</span></h3>
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#C8A97E]/5 border border-[#C8A97E]/10">
                  <Activity className="text-[#C8A97E]/40" size={16} />
                </div>
              </div>

              <div className="space-y-10">
                {[
                  {
                    title: "Large Pack Shipped",
                    client: "Sarah J. - London · 2 min ago",
                    icon: ShoppingCart,
                  },
                  {
                    title: "New Member Account",
                    client: "David M. · 1 hour ago",
                    icon: Users,
                  },
                  {
                    title: "Product Stock Update",
                    client: "Roasted Peanuts: 8pk · 3 hours ago",
                    icon: Package,
                  },
                  {
                    title: "Review Published",
                    client: "★★★★★ Excellent · 5 hours ago",
                    icon: Star,
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-7 group cursor-pointer transition-all hover:translate-x-2">
                    <div className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-[1.25rem] bg-white/[0.03] border border-white/5 text-white/10 group-hover:bg-[#C8A97E]/10 group-hover:text-[#C8A97E] group-hover:border-[#C8A97E]/20 transition-all duration-500">
                      <activity.icon size={20} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className="text-[16px] font-black text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none mb-2.5">
                        {activity.title}
                      </p>
                      <div className="flex items-center gap-2">
                         <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-none">
                            {activity.client}
                         </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 p-10 bg-[#C8A97E]/5 border border-[#C8A97E]/20 rounded-[2.5rem] flex flex-col gap-6 group hover:border-[#C8A97E]/40 transition-all duration-500">
               <div className="flex items-center gap-4 text-[#C8A97E]">
                  <Shield size={18} strokeWidth={2.5} />
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] leading-none">SYSTEM SECURITY</span>
               </div>
               <p className="text-[13px] font-bold text-white/40 leading-relaxed italic">
                 All transactions are encrypted with enterprise-grade protocols. Operational health is <span className="text-emerald-500 font-black">nominal</span>.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layers({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m2.6 12.08 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
      <path d="m2.6 17.08 8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9" />
    </svg>
  );
}
