"use client";

import React, { useState, useEffect } from "react";
import { 
  Tag, 
  Layers, 
  Settings2, 
  Plus, 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  Edit3, 
  Trash2,
  TableProperties,
  MoreVertical,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";

export default function AdminTaxonomyPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "attributes">("categories");
  const [data, setData] = useState<any>({ categories: [], attributes: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/taxonomy/list", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Taxonomy fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = activeTab === "categories" 
    ? data.categories.filter((c: any) => c.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : data.attributes.filter((a: any) => a.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 pb-20 no-prose">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <Link href="/admin-dashboard" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-3 font-black uppercase tracking-widest text-sm">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">KH</div>
                Taxonomy Structure
            </div>
         </div>
         <Button className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-11 flex items-center gap-2 group shadow-lg active:scale-95 transition-all">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            Add {activeTab === "categories" ? "Category" : "Attribute"}
         </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
         
         {/* Page Header */}
         <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-inner">
                     <Layers className="w-6 h-6" />
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Catalog Logic</h1>
               </div>
               <p className="text-gray-500 font-medium">Define your store's categories, product variants and global taxonomy attributes.</p>
            </div>

            {/* View Switcher Tabs */}
            <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl border border-gray-50">
               <button 
                 onClick={() => { setActiveTab("categories"); setSearchTerm(""); }}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "categories" ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
               >
                  <Tag className="w-3 h-3" />
                  Categories
               </button>
               <button 
                 onClick={() => { setActiveTab("attributes"); setSearchTerm(""); }}
                 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === "attributes" ? 'bg-white text-black shadow-sm ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
               >
                  <Settings2 className="w-3 h-3" />
                  Attributes
               </button>
            </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List Table Area */}
            <div className="lg:col-span-2 space-y-6">
                <div className="relative group">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                   <Input 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-purple-500/30 font-medium shadow-sm" 
                     placeholder={`Search ${activeTab}...`} 
                   />
                </div>

                <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                      <thead className="bg-[#f9fafb]/50 border-b border-gray-50">
                         <tr>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{activeTab === "categories" ? "Category Name" : "Attribute Type"}</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{activeTab === "categories" ? "Slug" : "Values"}</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {loading ? (
                            <tr><td colSpan={3} className="px-8 py-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Structure...</td></tr>
                         ) : filteredItems.length === 0 ? (
                            <tr><td colSpan={3} className="px-8 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">No structure found.</td></tr>
                         ) : (
                           filteredItems.map((item: any) => (
                             <tr key={item.id} className="hover:bg-gray-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${activeTab === "categories" ? 'bg-indigo-50 border-indigo-100 text-indigo-400' : 'bg-amber-50 border-amber-100 text-amber-400'}`}>
                                         {activeTab === "categories" ? <Tag className="w-4 h-4" /> : <Settings2 className="w-4 h-4" />}
                                      </div>
                                      <h4 className="font-black text-gray-900 tracking-tight text-lg uppercase italic leading-none">{item.title || item.name}</h4>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   {activeTab === "categories" ? (
                                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">/{item.slug}</span>
                                   ) : (
                                     <div className="flex flex-wrap gap-1">
                                        {item.defaultvalues?.slice(0, 3).map((v: any, idx: number) => (
                                           <span key={idx} className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{v.value}</span>
                                        ))}
                                        {item.defaultvalues?.length > 3 && <span className="text-[9px] font-black text-gray-300">+{item.defaultvalues.length - 3}</span>}
                                     </div>
                                   )}
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-2.5 hover:bg-black hover:text-white rounded-xl transition-all shadow-sm">
                                         <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                                         <Trash2 className="w-4 h-4" />
                                      </button>
                                   </div>
                                </td>
                             </tr>
                           ))
                         )}
                      </tbody>
                   </table>
                </div>
            </div>

            {/* Action Cards Area */}
            <div className="space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 px-1">Structural Health</h3>
                
                <div className="bg-indigo-600 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                         <TableProperties className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Database Link</span>
                   </div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">Connected</h4>
                   <p className="text-[11px] font-bold opacity-70 uppercase tracking-[0.1em]">Verified MongoDB Collections Sync.</p>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-30 transition-opacity" />
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center shadow-inner border border-green-100">
                         <Activity className="w-5 h-5" />
                      </div>
                      <div>
                         <h5 className="text-xs font-black uppercase tracking-widest text-gray-900">Live Status</h5>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Storefront Sync</p>
                      </div>
                   </div>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed italic">
                      Taxonomy updates were successfully propagated to the checkout engine and storefront navigation categories.
                   </p>
                </div>
            </div>
         </div>

      </main>
    </div>
  );
}
