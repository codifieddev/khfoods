"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchProducts,
  deleteProduct,
  bulkImportProducts,
} from "@/lib/store/products/productsThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash,
  Image as ImageIcon,
  Package,
  Search,
  MoreVertical,
  Filter,
  Download,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RootState } from "@/lib/store/store";
import { TacticalImportModal } from "@/components/admin/TacticalImportModal";

function ProductsPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { allProducts: products, loading } = useAppSelector(
    (state: RootState) => state.adminProducts,
  );

  const [hasMounted, setHasMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleImport = async (data: any[]) => {
    setImporting(true);
    try {
      const resultAction = await dispatch(bulkImportProducts(data));
      if (bulkImportProducts.fulfilled.match(resultAction)) {
        dispatch(fetchProducts());
        return resultAction.payload;
      } else {
        throw new Error(
          (resultAction.payload as string) || "Bulk import failed.",
        );
      }
    } finally {
      setImporting(false);
    }
  };

  const productSampleData = [
    {
      name: "Gourmet Roasted Peanuts",
      sku: "KH-ROAST-001",
      price: 36.00,
      status: "active",
      description: "Premium hand-roasted peanuts from Taiwan.",
    },
  ];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the collection?`)) return;
    const toastId = toast.loading(`Removing ${name}...`);
    try {
      const resultAction = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(resultAction)) {
        toast.success(`${name} has been removed.`, { id: toastId });
        dispatch(fetchProducts());
      } else {
        toast.error("Failed to remove product.", { id: toastId });
      }
    } catch (err) {
      toast.error("Network error.", { id: toastId });
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Return a stable shell if not mounted to prevent hydration errors
  if (!hasMounted) {
    return (
      <div className="flex flex-col space-y-12 pb-20 max-w-[1600px] opacity-0">
        <div className="h-96 flex items-center justify-center">
          <div className="h-10 w-10 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Sparkles size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Atelier Stock Management
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Product <span className="text-[#C8A97E]">Catalog</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Manage your exquisite offerings and maintain precise stock integrity for your esteemed clientele.
          </p>
        </div>

        <div className="flex items-center gap-5">
           <button
            className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-[#C8A97E]/30 transition-all flex items-center gap-2 group"
            onClick={() => setShowImportModal(true)}
            disabled={importing}
          >
            <ImageIcon size={16} className="text-[#C8A97E]/40" />
            Bulk Import Products
          </button>
          <TacticalImportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={handleImport}
            sampleData={productSampleData}
            title="Batch Import"
            description="Synchronize your store inventory with the central management hub."
            fileName="khfood_products"
          />
          <Link href="/admin/products/new">
            <button className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3">
              <Plus size={20} strokeWidth={2.5} /> Add New Product
            </button>
          </Link>
        </div>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center gap-6 bg-[#0A0A0A] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
          <input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 h-14 bg-[#050505] border border-white/5 rounded-2xl text-[13px] font-medium text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <button className="h-14 px-8 flex-1 lg:flex-none border border-white/5 bg-[#050505] text-white/40 hover:text-white hover:border-[#C8A97E]/30 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3">
            <Filter size={16} className="text-[#C8A97E]/40" /> Filters
          </button>
          <button className="h-14 px-8 border border-white/5 bg-[#050505] text-white/40 hover:text-white hover:border-[#C8A97E]/30 text-[11px] font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-3">
            <Download size={16} className="text-[#C8A97E]/40" /> Export Data
          </button>
        </div>
      </section>

      {/* BOUTIQUE TABLE CONTAINER */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-20">
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Product Image
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                SKU / Reference
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Market Status
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Availability
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 text-right px-10">
                Management
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-96 text-center">
                  <div className="flex flex-col items-center gap-6">
                    <div className="h-10 w-10 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 animate-pulse">
                      Syncing Product Data...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="h-[500px] text-center p-12">
                  <div className="flex flex-col items-center gap-8">
                    <div className="h-24 w-24 rounded-full border border-[#C8A97E]/10 flex items-center justify-center bg-[#C8A97E]/5 shadow-inner">
                      <Package size={48} strokeWidth={1} className="text-[#C8A97E]/30" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-lg font-heading font-medium text-white/50">No products matched your search</p>
                       <p className="text-[12px] font-medium text-white/20 uppercase tracking-widest">Adjust your filters or add a new item</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((prod) => (
                <TableRow
                  key={prod._id}
                  className="group border-white/[0.03] hover:bg-white/[0.01] transition-all duration-300 h-24"
                >
                  <TableCell className="px-10">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-[#050505] border border-white/5 group-hover:border-[#C8A97E]/40 transition-all duration-500 shadow-lg">
                        {prod.gallery && prod.gallery[0] ? (
                          <img
                            src={String(prod.gallery[0].url)}
                            alt={prod.name}
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white/10">
                            <ImageIcon size={22} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1 overflow-hidden">
                        <span className="text-[14px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors truncate">
                          {prod.name}
                        </span>
                        <div className="flex items-center gap-2">
                           <span className="text-[16px] font-bold text-[#C8A97E]">
                             ${prod.pricing?.price || "0"}
                           </span>
                           <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">USD</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold text-white/40 px-3 py-1 bg-white/5 rounded-md uppercase tracking-[0.1em] border border-white/5 group-hover:border-[#C8A97E]/20 transition-all">
                      {prod.sku || "REF-PENDING"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                        prod.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                          : "bg-white/5 text-white/30 border-white/10",
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          prod.status === "active" ? "bg-emerald-400" : "bg-white/30",
                        )}
                      />
                      {prod.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-white/40 group-hover:text-[#C8A97E]/60 transition-colors">
                      <TrendingUp size={14} className="text-[#C8A97E]/40" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">
                        Exquisite Stock
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-90"
                        onClick={() => router.push(`/admin/products/${prod._id}`)}
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all flex items-center justify-center group/btn shadow-xl active:scale-90"
                        onClick={() => handleDelete(String(prod._id), prod.name)}
                        title="Delete Product"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-white hover:border-white/20 transition-all flex items-center justify-center shadow-xl"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="h-10 w-10 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
            Curating Product Catalog...
          </span>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
