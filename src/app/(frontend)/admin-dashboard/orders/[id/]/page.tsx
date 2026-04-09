"use client";

import React, { useState, useEffect } from "react";
import { 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Package, 
  User, 
  MapPin, 
  CreditCard,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrder({ ...order, status: newStatus });
        setStatusMsg("Status successfully updated!");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
           <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">Loading Order Details...</p>
        </div>
     </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
       <div className="text-center p-12 bg-white rounded-[40px] shadow-sm border border-gray-100">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" strokeWidth={1} />
           <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tight">Order Not Found</h2>
           <Link href="/admin-dashboard" className="h-14 px-8 bg-black text-white rounded-2xl inline-flex items-center font-black uppercase tracking-widest text-[10px]">
              Back to Dashboard
           </Link>
       </div>
    </div>
  );

  const statusColors: any = {
     pending: 'bg-amber-50 text-amber-600 border-amber-100',
     processing: 'bg-blue-50 text-blue-600 border-blue-100',
     shipped: 'bg-indigo-50 text-indigo-600 border-indigo-100',
     delivered: 'bg-green-50 text-green-600 border-green-100',
     cancelled: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 pb-20 no-prose">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Link href="/admin-dashboard" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Order Confirmation</p>
                <div className="flex items-center gap-2">
                   <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase italic leading-none">{order.id}</h1>
                </div>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
             {statusMsg && <span className="text-[10px] font-black uppercase tracking-widest text-green-500 animate-pulse italic mr-4">{statusMsg}</span>}
             <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1">
                {['pending', 'processing', 'shipped', 'delivered'].map((s) => (
                   <button 
                     key={s}
                     onClick={() => updateStatus(s)}
                     disabled={updating}
                     className={`px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all ${order.status === s ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                   >
                      {s}
                   </button>
                ))}
             </div>
         </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
         
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Details (Left side) */}
            <div className="lg:col-span-2 space-y-10">
               
               {/* Order Items Section */}
               <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Contents</h3>
                     <span className="text-[11px] font-bold text-gray-400 italic">Total Items: {order.items?.length || 0}</span>
                  </div>

                  <div className="space-y-6">
                     {(order.items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#f9fafb]/50 rounded-3xl border border-transparent hover:border-gray-100 transition-all group">
                           <div className="flex items-center gap-5">
                              <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                 <Package className="w-8 h-8 text-gray-300" strokeWidth={1} />
                              </div>
                              <div>
                                 <h4 className="font-black text-gray-900 tracking-tight text-lg uppercase italic leading-none mb-2">{item.product_name || "N/A"}</h4>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    Quantity: <span className="bg-white px-2 py-0.5 rounded-md border border-gray-100 text-gray-900">{item.quantity}</span>
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className="text-xl font-black text-gray-900 italic tracking-tight italic">${(item.price || 0).toFixed(2)}</span>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Summary row */}
                  <div className="mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Subtotal</p>
                         <p className="text-xl font-black text-gray-900 italic tracking-tight">${(order.totalWithShipping - (order.shipping_cost || 0)).toFixed(2)}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 text-indigo-500">Shipping</p>
                         <p className="text-xl font-black text-indigo-600 italic tracking-tight">${(order.shipping_cost || 0).toFixed(2)}</p>
                      </div>
                      <div className="col-span-2 text-right">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Receivable</p>
                         <div className="inline-flex items-center gap-1">
                            <span className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">${order.totalWithShipping?.toFixed(2)}</span>
                            <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                               <TrendingUp className="w-5 h-5" />
                            </div>
                         </div>
                      </div>
                  </div>
               </section>

               {/* Activity Sidebar (Integrated for mobile) */}
               <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Logs</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Storefront Connection</span>
                      </div>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="flex gap-4 border-l-2 border-dashed border-gray-100 pl-6 relative">
                         <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1 leading-none italic">Current State</p>
                            <h5 className="font-extrabold text-gray-900 tracking-tight uppercase leading-none mb-1">{order.status}</h5>
                            <p className="text-[10px] font-bold text-gray-400">Last updated on {new Date(order.updatedAt).toLocaleString()}</p>
                         </div>
                      </div>
                      
                      <div className="flex gap-4 border-l-2 border-dashed border-gray-100 pl-6 relative">
                         <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-gray-100 rounded-full shadow-sm" />
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none italic">System Origin</p>
                            <h5 className="font-extrabold text-gray-900 tracking-tight uppercase leading-none mb-1">Created At</h5>
                            <p className="text-[10px] font-bold text-gray-400 italic">Origin Date: {new Date(order.createdAt).toLocaleString()}</p>
                         </div>
                      </div>
                   </div>
               </section>
            </div>

            {/* Customer & Shipping (Right sidebar) */}
            <div className="space-y-10">
               
               {/* Customer Profile Card */}
               <section className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-8">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                           <User className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Client Profile</span>
                     </div>
                     <h2 className="text-3xl font-black text-white leading-none uppercase italic tracking-tighter mb-4">{order.name || "N/A"}</h2>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                           <CreditCard className="w-3.5 h-3.5" />
                           <span className="text-[11px] font-bold tracking-tight uppercase">{order.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-60">
                           <CheckCircle2 className="w-3.5 h-3.5" />
                           <span className="text-[11px] font-bold tracking-tight uppercase italic">{order.isGuest ? 'Guest Checkout' : 'Member Account'}</span>
                        </div>
                     </div>
                  </div>
                  
                  {/* Decorative background blur */}
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
               </section>

               {/* Shipping Destination */}
               <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Shipping Vector</h3>
                     <MapPin className="w-5 h-5 text-indigo-500" />
                  </div>
                  
                  <div className="space-y-6">
                     <div className="bg-gray-50 p-6 rounded-3xl border border-gray-50 text-gray-700 font-bold leading-relaxed shadow-inner">
                        <p className="text-sm uppercase tracking-tight italic">
                           {order.shipping_address?.street || "N/A"}<br />
                           {order.shipping_address?.city || ""}{order.shipping_address?.postcode ? `, ${order.shipping_address.postcode}` : ""}<br />
                           {order.shipping_address?.country || ""}
                        </p>
                     </div>
                     
                     <div className="flex items-center gap-4 p-4 border border-indigo-50 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Truck className="w-5 h-5" />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 italic">Courier Method</p>
                           <p className="font-extrabold uppercase italic tracking-tight">{order.courier_name || "Standard Delivery"}</p>
                        </div>
                     </div>
                  </div>
               </section>

            </div>
         </div>

      </main>
    </div>
  );
}
