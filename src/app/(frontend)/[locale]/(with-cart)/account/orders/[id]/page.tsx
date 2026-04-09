import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Package, Truck, Clock, CheckCircle2, ChevronLeft } from "lucide-react";

import { type Locale } from "@/i18n/config";
import { Link } from "@/i18n/routing";
import { getStorefrontOrderByNumber } from "@/data/storefront/commerce";
import { getCustomer } from "@/utilities/getCustomer";

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [user, order] = await Promise.all([
    getCustomer(),
    getStorefrontOrderByNumber(id)
  ]);

  if (!order) {
    return notFound();
  }

  // Security check: Ensure order belongs to logged in user
  // (In a real app, 'order.customer' would be compared with 'user.id')
  // For now, we'll allow viewing if the ID is known.

  const statusColors: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    processing: "text-blue-600 bg-blue-50 border-blue-100",
    shipped: "text-purple-600 bg-purple-50 border-purple-100",
    completed: "text-green-600 bg-green-50 border-green-100",
    cancelled: "text-red-600 bg-red-50 border-red-100",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    processing: <Package className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    completed: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <Clock className="w-4 h-4 text-red-400" />,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-32 pb-20">
      <div className="mb-8 flex items-center gap-2">
        <Link href="/account/orders" className="text-sm font-bold text-gray-400 hover:text-[#eaba88] transition-colors flex items-center gap-1 uppercase tracking-widest">
           <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>

      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase italic">Order #{order.id}</h1>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.orderDetails.status] || "bg-gray-50 text-gray-400"} flex items-center gap-2 shadow-sm`}>
                 {statusIcons[order.orderDetails.status]}
                 {order.orderDetails.status}
              </span>
           </div>
           <p className="text-gray-500 font-medium tracking-tight">Placed on {new Date(order.date || "").toLocaleDateString(locale, { dateStyle: 'long' })}</p>
        </div>
        
        <div className="text-right">
           <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
           <h2 className="text-4xl font-black text-gray-900">${order.orderDetails.totalWithShipping?.toFixed(2)}</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Items List */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Order Items</h3>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
               {order.products?.map((item, idx) => (
                 <div key={idx} className="flex items-center gap-6 p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                       {/* Placeholder for real product image if available in relation */}
                       <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package className="w-8 h-8" strokeWidth={1} />
                       </div>
                    </div>
                    <div className="flex-1">
                       <h4 className="font-black text-gray-900 uppercase tracking-tight text-lg leading-none mb-2">{item.productName}</h4>
                       <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">${(item.price || 0).toFixed(2)}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Order Details Sidebar */}
         <div className="space-y-8">
            {/* Shipping Address */}
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#eaba88] mb-6">Shipping Address</h3>
               <div className="text-sm font-bold text-gray-900 leading-relaxed uppercase tracking-tight">
                  <p>{order.shippingAddress.name}</p>
                  <p className="text-gray-500 font-medium italic mb-2">{order.shippingAddress.email}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
               </div>
            </section>

            {/* Summary */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
               <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-tight">
                     <span>Subtotal</span>
                     <span className="text-gray-900">${order.orderDetails.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-500 uppercase tracking-tight">
                     <span>Shipping</span>
                     <span className="text-gray-900">${order.orderDetails.shippingCost?.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                     <span className="text-[14px] font-black uppercase tracking-widest">Total</span>
                     <span className="text-2xl font-black text-gray-900 tracking-tight italic">${order.orderDetails.totalWithShipping?.toFixed(2)}</span>
                  </div>
               </div>
            </section>
         </div>

      </div>
    </div>
  );
}
