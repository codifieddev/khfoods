"use client";

import React, { useState, useEffect } from "react";
import { 
  Image as ImageIcon, 
  Search, 
  Plus, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink,
  Info,
  Maximize2,
  Trash2,
  FileIcon,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { MediaDropzone } from "@/components/admin-next/MediaDropzone";

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media/list", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMedia(data.docs || []);
      }
    } catch (err) {
      console.error("Media fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = media.filter(m => 
    m.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Media Library
            </div>
         </div>
         <Button 
            onClick={() => setShowUploader(!showUploader)}
            className={`${showUploader ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-gray-800'} text-white rounded-xl font-black text-xs uppercase tracking-widest px-6 h-11 flex items-center gap-2 group shadow-lg active:scale-95 transition-all`}
         >
            {showUploader ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />}
            {showUploader ? 'Close Uploader' : 'Upload Asset'}
         </Button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10">
         
         {/* Dropzone Area */}
         {showUploader && (
            <div className="mb-16 animate-in slide-in-from-top-4 duration-500">
               <MediaDropzone 
                 onSuccess={() => {
                    fetchMedia();
                    setShowUploader(false);
                 }} 
               />
            </div>
         )}

         {/* Page Header */}
         <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                     <ImageIcon className="w-6 h-6" />
                  </span>
                  <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase italic leading-none">Catalog Assets</h1>
               </div>
               <p className="text-gray-500 font-medium">Browse, manage and copy resource IDs for {media.length} global media files.</p>
            </div>

            {/* Search Controls */}
            <div className="relative w-full md:min-w-[400px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <Input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search by filename or ID..." 
                 className="pl-12 h-14 bg-white border-gray-100 rounded-2xl focus-visible:ring-black font-medium shadow-sm transition-all text-sm italic" 
               />
            </div>
         </header>

         {/* Visual Gallery Grid */}
         {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                   <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
                ))}
             </div>
         ) : filteredMedia.length === 0 ? (
             <div className="bg-white rounded-[40px] border border-gray-100 p-20 text-center shadow-sm">
                <ImageIcon className="w-16 h-16 text-gray-100 mx-auto mb-6" strokeWidth={1} />
                <p className="font-black uppercase tracking-widest text-xs text-gray-400 italic">No assets match your search.</p>
             </div>
         ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMedia.map((item) => (
                   <div key={item.id} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all relative">
                      {/* Image Preview Container */}
                      <div className="aspect-square bg-[#f9fafb] relative overflow-hidden flex items-center justify-center group-hover:p-1 transition-all">
                         <div className="w-full h-full relative z-0">
                            {item.mimeType?.startsWith("image/") ? (
                               <img 
                                 src={item.url || "/placeholder.jpg"} 
                                 alt={item.filename} 
                                 className="w-full h-full object-cover group-hover:rounded-2xl transition-all duration-700"
                               />
                            ) : (
                               <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                  <FileIcon className="w-12 h-12 mb-2" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">{item.extension || "FILE"}</span>
                               </div>
                            )}
                         </div>
                         
                         {/* Hover Overlay Controls */}
                         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 z-10">
                            <button 
                              onClick={() => handleCopy(item.id)}
                              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-lg"
                              title="Copy ID"
                            >
                               {copiedId === item.id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </button>
                            <a 
                              href={item.url} 
                              target="_blank" 
                              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-900 hover:scale-110 active:scale-95 transition-all shadow-lg"
                              title="Open Original"
                            >
                               <ExternalLink className="w-5 h-5" />
                            </a>
                         </div>
                      </div>

                      {/* File Details footer */}
                      <div className="p-4 bg-white">
                         <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight italic flex-1" title={item.filename}>
                               {item.filename}
                            </h4>
                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                               <Trash2 className="w-3.5 h-3.5" />
                            </button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{(item.filesize / 1024).toFixed(1)} KB</span>
                             <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{item.width}x{item.height}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
         )}

      </main>
    </div>
  );
}
