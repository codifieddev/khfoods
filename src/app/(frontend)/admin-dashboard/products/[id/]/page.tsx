"use client";

import React, { useState, useEffect } from "react";
import { 
  Package, 
  ArrowLeft, 
  Save, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Hash,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";

export default function AdminProductEditPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/list`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const item = data.docs.find((p: any) => p.id === id);
        if (item) setProduct(item);
        else setErrorMsg("Product not found");
      }
    } catch (err) {
      setErrorMsg("Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      const res = await fetch(`/api/admin/products/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          price: product.price,
          slug: product.slug,
          stock: product.stock,
          description: product.description
        }),
      });

      if (res.ok) {
        setStatus("success");
        router.refresh();
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setErrorMsg("Failed to update product.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
           <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">Loading Product Data...</p>
        </div>
     </div>
  );

  if (errorMsg && !product) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcfd]">
       <div className="bg-white p-12 rounded-[40px] text-center shadow-xl border border-gray-100">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
           <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tight">Oops! {errorMsg}</h2>
           <Link href="/admin-dashboard/products" className="inline-flex h-14 px-8 bg-black text-white rounded-2xl items-center font-black uppercase tracking-widest text-xs">
              Back to Inventory
           </Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-gray-900 pb-32 no-prose">
      {/* Dynamic Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6">
            <Link href="/admin-dashboard/products" className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 leading-none">Modify Product</p>
                <div className="flex items-center gap-2">
                   <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight italic leading-none">{product.title}</h1>
                </div>
            </div>
         </div>
         
         <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
               <Trash2 className="w-5 h-5" />
            </Button>
            <Button 
               onClick={handleSave}
               disabled={saving}
               className="bg-black hover:bg-gray-800 text-white rounded-xl font-black text-xs uppercase tracking-widest px-8 h-11 flex items-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
               {saving ? 'Updating...' : 'Save Product'}
               <Save className="w-4 h-4 ml-1" />
            </Button>
         </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">
          
          {status === "success" && (
             <div className="mb-10 bg-green-50 border border-green-100 text-green-600 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="font-black uppercase tracking-widest text-xs italic">Changes synced with database successfully!</p>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             
             {/* Main form */}
             <div className="md:col-span-2 space-y-10">
                
                {/* Title & Slug Section */}
                <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Product Identity</label>
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                            <Box className="w-full h-full" strokeWidth={2.5} />
                         </div>
                         <Input 
                           value={product.title}
                           onChange={(e) => setProduct({...product, title: e.target.value})}
                           className="pl-12 h-15 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-2xl font-black text-lg uppercase italic tracking-tight" 
                           placeholder="Full Product Title" 
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Universal Slug (URL)</label>
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                            <Hash className="w-full h-full" strokeWidth={2.5} />
                         </div>
                         <Input 
                           value={product.slug}
                           onChange={(e) => setProduct({...product, slug: e.target.value})}
                           className="pl-12 h-15 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-2xl font-black text-sm lowercase tracking-widest" 
                           placeholder="product-url-slug" 
                         />
                      </div>
                   </div>
                </section>

                {/* Description Section */}
                <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-3">
                   <div className="flex items-center justify-between px-1">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Detailed Description</label>
                      <FileText className="w-4 h-4 text-gray-300" strokeWidth={2.5} />
                   </div>
                   <Textarea 
                      value={product.description || ""}
                      onChange={(e) => setProduct({...product, description: e.target.value})}
                      className="min-h-[220px] bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded-2xl font-medium p-6 leading-relaxed" 
                      placeholder="Share the story of this product..."
                   />
                </section>

             </div>

             {/* Sidebar controls */}
             <div className="space-y-8">
                
                {/* Price Section */}
                <section className="bg-indigo-600 p-8 rounded-[40px] shadow-[0_20px_40px_rgba(79,70,229,0.15)] text-white group">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Price Tag</h3>
                      <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={3} />
                   </div>
                   <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black opacity-40">$</span>
                      <Input 
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                        className="h-20 bg-transparent border-none text-5xl font-black italic tracking-tighter pl-6 focus-visible:ring-0" 
                      />
                   </div>
                </section>

                {/* Inventory Controls */}
                <section className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-gray-50 pb-4">Availability</h3>
                   
                   <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setProduct({...product, stock: !product.stock})}>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-600">Stock Toggle</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${product.stock ? 'bg-green-500' : 'bg-gray-300'}`}>
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${product.stock ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                   </div>
                   
                   <p className="mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center italic">
                      Setting to "Inactive" will hide this item from the storefront catalog.
                   </p>
                </section>

             </div>

          </div>
      </main>
    </div>
  );
}
