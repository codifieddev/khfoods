import { Plus, Image as ImageIcon, Search, Copy, Trash2, Maximize2, FileText, Download, MoreVertical } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { AdminRepository } from "@/lib/admin-repository";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

const MediaPage = async () => {
  const media = await AdminRepository.find<any>("media", {}, { sort: { createdAt: -1 } });
  
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.3em]">
             Asset Repository
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Media Library</h1>
          <p className="text-slate-500 font-medium max-w-lg">Centralized digital asset management for your entire store. Upload, optimize, and organize your images, videos, and documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 border-slate-200 font-bold rounded-xl px-6 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
             Sync Library
          </Button>
          <Button className="h-12 bg-slate-900 text-white font-bold rounded-xl px-8 shadow-xl shadow-slate-900/10 hover:translate-y-[-2px] active:scale-95">
            <Plus className="h-5 w-5 mr-2" />
            Upload Assets
          </Button>
        </div>
      </section>

      {/* Library Toolbar */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         <div className="relative w-full max-w-md">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assets by name, type, or tags..." 
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-bold shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20"
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               Filter by:
            </div>
            <select className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20">
               <option>All Types</option>
               <option>Images Only</option>
               <option>Videos</option>
               <option>Documents</option>
            </select>
         </div>
      </section>

      {/* Media Grid */}
      <section className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {media.length > 0 ? (
          media.map((asset) => (
            <div key={asset.id} className="group relative flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
               {/* Asset Preview */}
               <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 border border-slate-50">
                  {asset.url || asset.thumbnailURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={asset.thumbnailURL || asset.url} 
                      alt={asset.alt || asset.filename} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-200">
                       <ImageIcon className="h-12 w-12" />
                    </div>
                  )}

                  {/* Hover Actions Bar */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2 p-4">
                     <button title="View Detail" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl transition-transform hover:scale-110 active:scale-90">
                        <Maximize2 className="h-5 w-5" />
                     </button>
                     <button title="Copy Permalink" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-slate-900 shadow-xl transition-transform hover:scale-110 active:scale-90">
                        <Copy className="h-5 w-5" />
                     </button>
                     <button title="Delete Asset" className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xl transition-transform hover:scale-110 active:scale-90">
                        <Trash2 className="h-5 w-5" />
                     </button>
                  </div>
               </div>

               {/* Asset Meta */}
               <div className="flex flex-col px-1 pb-1 pt-2">
                  <span className="truncate text-sm font-bold tracking-tight text-slate-900">{asset.filename || "Untitled Asset"}</span>
                  <div className="flex items-center justify-between mt-0.5">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asset.filesize ? Math.round(asset.filesize / 1024) + " KB" : (asset.mimeType || "Binary")}</span>
                     <button className="h-6 w-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            </div>
          ))
        ) : (
           <div className="col-span-full flex flex-col items-center justify-center py-24 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 text-slate-300">
                 <ImageIcon className="h-8 w-8" />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900">Library is currently empty</h4>
                 <p className="text-sm font-semibold text-slate-500 max-w-sm mt-1 mx-auto">Upload your first high-resolution images or videos to populate your multi-industry media library.</p>
              </div>
              <Button variant="outline" className="font-bold border-slate-200">
                 Bulk Upload Assets
              </Button>
           </div>
        )}
      </section>

      {/* Capacity Info Section */}
      <section className="rounded-2xl bg-slate-900 p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-slate-900/10 border border-white/5">
          <div className="flex flex-col gap-1 items-center md:items-start">
             <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Storage Hub Status</div>
             <h4 className="text-xl font-bold tracking-tight">Active Performance Optimization</h4>
          </div>
          <div className="h-px w-full bg-white/10 md:h-12 md:w-px" />
          <div className="flex-1 flex flex-col gap-2">
             <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white/60">REMAINING STORAGE CAPACITY</span>
                <span className="text-primary hover:underline cursor-pointer">UPGRADE HUB</span>
             </div>
             <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-24 bg-primary shadow-[0_0_15px_rgba(234,186,136,0.2)]" />
             </div>
          </div>
          <div className="flex gap-4">
             <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">TOTAL FILES</p>
                <p className="text-xl font-bold">{media.length}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">STORAGE USED</p>
                <p className="text-xl font-bold">1.2 GB</p>
             </div>
          </div>
      </section>
    </div>
  );
};

export default MediaPage;
