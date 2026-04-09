"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  Search, 
  Plus, 
  ChevronRight, 
  Filter, 
  Edit3, 
  Trash2,
  TrendingUp,
  Box,
  Truck,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products/list", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.docs || []);
      }
    } catch (err) {
      console.error("Products fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 pb-20 no-prose">
      {/* Top Navbar (Same as Dashboard for consistency) */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Link href="/admin-dashboard" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">KH</div>
                Product Inventory
            </div>
         </div>
         <Button className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-11 flex items-center gap-2 group shadow-lg active:scale-95 transition-all">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            New Product
         </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
         
         {/* Page Header */}
         <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
                     <Box className="w-6 h-6" />
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Management</h1>
               </div>
               <p className="text-gray-500 font-medium">Control titles, stock levels, and pricing for {products.length} catalog items.</p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:min-w-[320px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter products..." 
                    className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-black font-medium shadow-sm transition-all" 
                  />
               </div>
               <Button variant="outline" className="h-14 w-14 rounded-2xl border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center text-gray-400">
                  <Filter className="w-5 h-5" />
               </Button>
            </div>
         </header>

         {/* Products Table */}
         <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
               <thead className="bg-[#f9fafb]/50 border-b border-gray-50">
                  <tr>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Item</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Price</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Stock Status</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-400 animate-pulse">
                           <Box className="w-12 h-12" strokeWidth={1} />
                           <p className="font-black uppercase tracking-widest text-xs">Loading Catalog...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No matching products found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                               <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                                   <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <Package className="w-8 h-8" strokeWidth={1} />
                                   </div>
                               </div>
                               <div>
                                  <h4 className="font-black text-gray-900 tracking-tight text-lg uppercase italic leading-none mb-2">{product.title}</h4>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Slug: {product.slug}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="font-black text-gray-900 italic text-xl tracking-tight">${(product.price || 0).toFixed(2)}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${(product.stock === 0 || product.stock === false) ? 'bg-red-500 ring-4 ring-red-500/10' : 'bg-green-500 ring-4 ring-green-500/10'}`} />
                               <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">{(product.stock === 0 || product.stock === false) ? 'Out of Stock' : 'In Stock'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" className="h-11 px-4 hover:bg-black hover:text-white rounded-xl transition-all">
                                   <Edit3 className="w-4 h-4 mr-2" />
                                   <span className="text-[11px] font-black uppercase tracking-widest">Edit</span>
                                </Button>
                                <Button variant="ghost" className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>

      </main>
    </div>
  );
}
