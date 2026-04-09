"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  Filter,
  Download,
  Clock,
  AlertCircle,
  Truck,
  Plus,
  X,
  Edit,
  Edit2,
  Trash,
  Package,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  Sparkles,
  Shield,
  Bell,
  MapPin,
  FileText,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Status Configuration
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: { label: "Pending Review", color: "#C8A97E", icon: Clock },
  confirmed: { label: "Confirmed", color: "#10B981", icon: CheckCircle2 },
  shipped: { label: "In Transit", color: "#C8A97E", icon: Truck },
  delivered: { label: "Delivered", color: "#10B981", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "#EF4444", icon: XCircle },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"list" | "view" | "edit" | "create">("list");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.data || data.orders || []);
    } catch (err) {
      toast.error("Failed to fetch boutique manifests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Transaction ${newStatus.toUpperCase()} synchronized`);
        fetchOrders();
        if (view !== "list") setView("list");
      }
    } catch (err) {
      toast.error("Status synchronization failed");
    }
  };

  const handleCreateOrder = async (orderData: any) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        toast.success("NEW MANIFEST ESTABLISHED");
        fetchOrders();
        setView("list");
      } else {
        const err = await res.json();
        toast.error(err.message || "Boutique transaction failed");
      }
    } catch (err) {
      toast.error("Network synchronization failure");
    }
  };

  const filteredOrders = orders.filter(
    (ord) =>
      ord.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Truck size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Order Manifest Management
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Boutique <span className="text-[#C8A97E]">Manifests</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Oversee order distribution and boutique deliveries with high-end precision.
          </p>
        </div>

        <div className="flex items-center gap-5">
           {view === "list" ? (
             <>
               <button
                  className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-[#C8A97E]/30 transition-all flex items-center gap-2 group"
                >
                  <Download size={16} className="text-[#C8A97E]/40" />
                  Export Manifest
                </button>
                <button
                  onClick={() => setView("create")}
                  className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
                >
                  <Plus size={20} strokeWidth={2.5} /> Forge Manifest
                </button>
             </>
           ) : (
              <button
                onClick={() => setView("list")}
                className="h-12 px-10 bg-white/5 border border-white/10 text-white/60 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-[#C8A97E]/30 transition-all flex items-center gap-3"
              >
                <X size={18} /> Return to Manifest
              </button>
           )}
        </div>
      </section>

      {view === "list" && (
        <>
          {/* REFINED TOOLBAR */}
          <section className="flex flex-col lg:flex-row items-center gap-6 bg-[#0A0A0A] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
              <input
                placeholder="Identify order by ID or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 h-14 bg-[#050505] border border-white/5 rounded-2xl text-[14px] font-medium text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
              />
            </div>
          </section>

          {/* LUXURY TABLE CONTAINER */}
          <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/[0.02] border-b border-white/5">
                  <tr className="h-20">
                    <th className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">Order Reference</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Customer</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Status</th>
                    <th className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">Total Value</th>
                    <th className="text-right text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="h-8 w-8 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]/40">Fetching Orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-64 text-center text-white/20 font-heading">No manifests found</td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => {
                      const status = STATUS_CONFIG[ord.status] || STATUS_CONFIG["pending"];
                      return (
                        <tr key={ord._id} className="border-t border-white/[0.03] hover:bg-white/[0.01] transition-all duration-300 group h-24">
                          <td className="px-10 py-6">
                            <div className="flex flex-col">
                               <span className="text-[14px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors">{ord.orderId}</span>
                               <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{new Date(ord.createdAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col">
                               <span className="text-[13px] font-bold text-white/80">{ord.customerName}</span>
                               <span className="text-[11px] text-white/20">{ord.email}</span>
                            </div>
                          </td>
                          <td>
                             <div className="flex items-center gap-3">
                                <status.icon size={14} className="text-[#C8A97E] opacity-60" />
                                <span className="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 border border-[#C8A97E]/20 bg-[#C8A97E]/5 text-[#C8A97E] rounded-full">{status.label}</span>
                             </div>
                          </td>
                          <td>
                             <span className="text-[16px] font-bold text-white">${ord.totalAmount?.toLocaleString()}</span>
                          </td>
                          <td className="text-right px-10">
                             <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => { setSelectedOrder(ord); setView("view"); }}
                                  className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] transition-all flex items-center justify-center shadow-xl"
                                ><Eye size={18} /></button>
                                <button
                                  onClick={() => { setSelectedOrder(ord); setView("edit"); }}
                                  className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white transition-all flex items-center justify-center shadow-xl"
                                ><Edit2 size={18} /></button>
                             </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {view === "view" && selectedOrder && (
        <OrderDetailsView order={selectedOrder} onClose={() => setView("list")} />
      )}

      {view === "edit" && selectedOrder && (
        <OrderStatusEdit order={selectedOrder} onUpdate={handleUpdateStatus} onCancel={() => setView("list")} />
      )}

      {view === "create" && (
        <CreateOrderForm onSubmit={handleCreateOrder} onCancel={() => setView("list")} />
      )}
    </div>
  );
}

function OrderDetailsView({ order, onClose }: { order: any, onClose: () => void }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG["pending"];
  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
       <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
             <div className="space-y-4">
                <h2 className="text-4xl font-heading font-bold text-white">{order.orderId}</h2>
                <div className="flex items-center gap-4">
                   <span className="px-5 py-2 rounded-full border border-[#C8A97E]/20 bg-[#C8A97E]/5 text-[#C8A97E] text-[11px] font-bold uppercase tracking-wider">
                     <status.icon size={14} className="inline mr-2" /> {status.label}
                   </span>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-10">
                 <div className="space-y-1">
                    <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Customer</p>
                    <p className="text-[15px] font-bold text-white">{order.customerName}</p>
                 </div>
                <div className="space-y-1">
                   <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Total Value</p>
                   <p className="text-2xl font-bold text-[#C8A97E]">${order.totalAmount?.toLocaleString()}</p>
                </div>
             </div>
          </div>
       </section>

        <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <h3 className="text-2xl font-heading font-bold text-white mb-8">Order <span className="text-[#C8A97E]">Items</span></h3>
          <div className="space-y-6">
             {order.products?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                   <div className="h-16 w-16 bg-white/5 rounded-xl flex items-center justify-center text-[#C8A97E]"><Package size={24} /></div>
                   <div className="flex-1">
                      <p className="text-[14px] font-bold text-white">Product ID: {item.productId}</p>
                      <p className="text-[11px] text-white/20 uppercase font-black">Quantity: {item.quantity} units</p>
                   </div>
                </div>
             ))}
          </div>
       </section>
    </div>
  );
}

function OrderStatusEdit({ order, onUpdate, onCancel }: { order: any, onUpdate: (id: string, s: string) => void, onCancel: () => void }) {
  const [status, setStatus] = useState(order.status);
  return (
    <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-12 shadow-2xl">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-3xl font-heading font-bold text-white underline decoration-[#C8A97E]/30 decoration-4 underline-offset-8">Update <span className="text-[#C8A97E]">Order Status</span></h3>
          <button onClick={onCancel} className="text-white/20 hover:text-white transition-colors"><XCircle size={32} strokeWidth={1} /></button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
             <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">Target Status</label>
             <select 
               value={status}
               onChange={(e) => setStatus(e.target.value)}
               className="w-full h-16 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/40 outline-none transition-all appearance-none"
             >
                <option value="pending">Pending</option>
                <option value="confirmed">Order Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
             </select>
          </div>
          <div className="flex flex-col justify-end">
             <button
               onClick={() => onUpdate(order._id, status)}
               className="h-16 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center justify-center gap-3"
             >Update Order Logistics</button>
          </div>
       </div>
    </section>
  );
}

function CreateOrderForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void, onCancel: () => void }) {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ productId: string, name: string, price: number, quantity: number }[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(data => {
      setAllProducts(data.data || []);
      setLoadingProducts(false);
    });
  }, []);

  const totalAmount = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const addItem = (prod: any) => {
    const existing = selectedItems.find(i => i.productId === prod._id);
    if (existing) {
      setSelectedItems(selectedItems.map(i => i.productId === prod._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setSelectedItems([...selectedItems, { productId: prod._id, name: prod.name, price: prod.price || 0, quantity: 1 }]);
    }
  };

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.productId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !email || selectedItems.length === 0) {
      toast.error("Complete all protocol requirements");
      return;
    }
    onSubmit({
      customerName,
      email,
      products: selectedItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      totalAmount,
      status: "pending"
    });
  };

  return (
    <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-12 shadow-2xl space-y-12">
       <div className="flex items-center justify-between">
          <h3 className="text-3xl font-heading font-bold text-white">Create <span className="text-[#C8A97E]">New Order</span></h3>
          <button onClick={onCancel} className="text-white/20 hover:text-white"><XCircle size={32} strokeWidth={1} /></button>
       </div>

       <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Customer Name</label>
                   <input 
                     value={customerName}
                     onChange={e => setCustomerName(e.target.value)}
                     placeholder="NAME OF CUSTOMER..."
                     className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-white focus:border-[#C8A97E]/30 outline-none" 
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Email Address</label>
                   <input 
                     type="email"
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     placeholder="CUSTOMER EMAIL..."
                     className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-white focus:border-[#C8A97E]/30 outline-none" 
                   />
                </div>
             </div>

             <div className="space-y-6">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Product Selection</label>
                <div className="h-96 overflow-y-auto bg-black rounded-[2rem] border border-white/5 p-4 space-y-4 custom-scrollbar">
                   {loadingProducts ? <p className="text-center text-white/20">Identifing Products...</p> : 
                    allProducts.map(p => (
                      <div key={p._id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl group hover:border-[#C8A97E]/30 border border-transparent transition-all">
                         <div>
                            <p className="text-[13px] font-bold text-white">{p.name}</p>
                            <p className="text-[11px] text-[#C8A97E] font-black">${p.price}</p>
                         </div>
                         <button type="button" onClick={() => addItem(p)} className="h-10 w-10 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center text-[#C8A97E] hover:bg-[#C8A97E] hover:text-black transition-all"><Plus size={18} /></button>
                      </div>
                    ))
                   }
                </div>
             </div>
          </div>

          <div className="space-y-10">
             <div className="space-y-6">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Order Items</label>
                <div className="space-y-4 min-h-[300px]">
                   {selectedItems.map(item => (
                     <div key={item.productId} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                        <div className="flex-1">
                           <p className="text-[14px] font-bold text-white">{item.name}</p>
                           <p className="text-[11px] text-white/30 uppercase font-black">Value: ${item.price} × {item.quantity}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(item.productId)} className="text-red-500/50 hover:text-red-500 transition-colors"><Trash size={18} /></button>
                     </div>
                   ))}
                   {selectedItems.length === 0 && <div className="h-40 border border-dashed border-white/5 rounded-[2rem] flex items-center justify-center text-white/10 italic">No Items Selected</div>}
                </div>
             </div>

             <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]">Total Order Value</span>
                   <span className="text-4xl font-bold text-[#C8A97E]">${totalAmount.toLocaleString()}</span>
                </div>
                <button 
                  type="submit"
                  className="w-full h-16 bg-[#C8A97E] text-black font-bold uppercase tracking-[0.3em] text-[13px] rounded-full hover:bg-white transition-all shadow-2xl"
                >Place Order</button>
             </div>
          </div>
       </form>
    </section>
  );
}
