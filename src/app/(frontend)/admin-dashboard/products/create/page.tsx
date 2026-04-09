"use client";

import React, { useState } from "react";
import { 
  Package, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  DollarSign,
  FileText,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { TaxonomyPicker } from "@/components/admin-next/TaxonomyPicker";
import { MediaPicker } from "@/components/admin-next/MediaPicker";

export default function AdminProductCreatePage() {
  const router = useRouter();
  
  const [product, setProduct] = useState({
    title: "",
    slug: "",
    price: "",
    stock: true,
    description: "",
    categories: [] as string[],
    imageUrl: "",
    imageId: ""
  });
  
  const [creating, setCreating] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.title) {
       setStatus("error");
       setErrorMsg("Product title is required.");
       return;
    }

    setCreating(true);
    setStatus("idle");

    try {
      const res = await fetch(`/api/admin/products/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...product,
           price: parseFloat(product.price || "0"),
           categoriesArr: product.categories.map(id => ({ category: id })),
           images: product.imageUrl ? [{ image: product.imageId }] : []
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStatus("success");
        setTimeout(() => router.push(`/admin-dashboard/products/${data.id}`), 1500);
      } else {
        setStatus("error");
        setErrorMsg("Failed to create product in database.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 pb-32 no-prose">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <Link href="/admin-dashboard/products" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Catalog Entry</p>
                <div className="flex items-center gap-2 text-indigo-600 font-black italic tracking-widest uppercase text-[10px]">
                   <Plus className="w-3 h-3" strokeWidth={3} />
                   New Product Draft
                </div>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <Button 
               onClick={handleCreate}
               disabled={creating}
               className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest px-8 h-11 flex items-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
               {creating ? 'Expanding Catalog...' : 'Publish Item'}
               <Rocket className="w-4 h-4 ml-1" />
            </Button>
         </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
          
          {status === "success" && (
             <div className="mb-10 bg-green-50 border border-green-100 text-green-600 p-8 rounded-[40px] flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-sm border-dashed">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="font-black uppercase tracking-widest text-xs italic leading-none mb-1 text-green-700">Success! Catalog Expanded.</p>
                   <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Redirecting to visual editor...</p>
                </div>
             </div>
          )}

          {status === "error" && (
             <div className="mb-10 bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl flex items-center gap-4 animate-shake">
                <AlertCircle className="w-6 h-6" />
                <p className="font-black uppercase tracking-widest text-xs">{errorMsg}</p>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             
             {/* Main form */}
             <div className="md:col-span-2 space-y-10">
                
                {/* Title & Slug Section */}
                <section className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-10 relative">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Universal Title</label>
                      <div className="relative group">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                            <Package className="w-full h-full" strokeWidth={2.5} />
                         </div>
                         <Input 
                           value={product.title}
                           onChange={(e) => setProduct({...product, title: e.target.value})}
                           className="pl-16 h-20 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-3xl font-black text-2xl uppercase italic tracking-tight placeholder:italic placeholder:opacity-30" 
                           placeholder="Ex: Premium Organic Wheat Flour" 
                         />
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">URL Identifier (Slug)</label>
                      <div className="relative group">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                            <Hash className="w-full h-full" strokeWidth={2.5} />
                         </div>
                         <Input 
                           value={product.slug}
                           onChange={(e) => setProduct({...product, slug: e.target.value})}
                           className="pl-16 h-16 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-3xl font-black text-sm lowercase tracking-widest placeholder:opacity-30" 
                           placeholder="wheat-flour-premium" 
                         />
                      </div>
                   </div>
                </section>

                {/* Content Section */}
                <section className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-4">
                   <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Marketing Description</label>
                      <FileText className="w-5 h-5 text-gray-300" strokeWidth={2.5} />
                   </div>
                   <Textarea 
                      value={product.description}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      className="min-h-[260px] bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-3xl font-medium p-8 leading-relaxed text-sm placeholder:italic placeholder:opacity-30" 
                      placeholder="Share why customers will love this item..."
                   />
                </section>

                {/* Imagery Preview Section */}
                <MediaPicker 
                  selectedUrl={product.imageUrl} 
                  onChange={(url, id) => setProduct({...product, imageUrl: url, imageId: id})} 
                />

             </div>

             {/* Sidebar Controls */}
             <div className="space-y-10">
                
                {/* Price Definition Card */}
                <section className="bg-indigo-600 p-10 rounded-[48px] shadow-[0_30px_60px_rgba(79,70,229,0.2)] text-white group">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Price Point</h3>
                      <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={3} />
                   </div>
                   <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-black opacity-30">$</span>
                      <Input 
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: e.target.value})}
                        className="h-24 bg-transparent border-none text-6xl font-black italic tracking-tighter pl-8 focus-visible:ring-0 placeholder:opacity-20 text-white" 
                        placeholder="0.00"
                      />
                   </div>
                </section>

                {/* Taxonomy & Structure Card */}
                <section className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-4">
                   <TaxonomyPicker 
                     selectedIds={product.categories}
                     onChange={(ids) => setProduct({...product, categories: ids})}
                   />
                </section>

                {/* Initial Stock Configuration */}
                <section className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm relative group overflow-hidden">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-10 border-b border-gray-50 pb-6">Launch Settings</h3>
                   
                   <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[30px] cursor-pointer hover:bg-gray-100 transition-all group/toggle" onClick={() => setProduct({...product, stock: !product.stock})}>
                      <span className="text-[11px] font-black uppercase tracking-widest text-gray-600">Active Stock</span>
                      <div className={`w-14 h-7 rounded-full p-1.5 transition-all duration-500 ${product.stock ? 'bg-indigo-600 shadow-lg shadow-indigo-200' : 'bg-gray-300'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-500 ${product.stock ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                      </div>
                   </div>
                   
                   <p className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center italic leading-relaxed px-2">
                      New products are published to the storefront immediately by default.
                   </p>
                </section>

             </div>

          </div>
      </main>
    </div>
  );
}
