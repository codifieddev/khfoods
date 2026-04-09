"use client";

import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Check, ChevronDown, Monitor, Search, X, Maximize2 } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MediaPickerProps {
  selectedUrl: string | null;
  onChange: (url: string, id: string) => void;
  label?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ selectedUrl, onChange, label = "Featured Image" }) => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/admin/media/list", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setMedia(json.docs || []);
      }
    } catch (err) {
      console.error("Media picker fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const selectAsset = (url: string, id: string) => {
    onChange(url, id);
    setOpen(false);
  };

  const filtered = media.filter(m => 
    m.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between px-1">
         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
         <Monitor className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" strokeWidth={2.5} />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative group cursor-pointer">
             <div 
               className={`aspect-[16/6] rounded-3xl border-2 border-dashed transition-all duration-700 relative overflow-hidden flex items-center justify-center p-2 ${selectedUrl ? 'border-transparent bg-gray-50' : 'border-gray-100 bg-gray-50/30 hover:border-amber-200 hover:bg-white active:scale-[0.99]'}`}
             >
                {selectedUrl ? (
                   <img src={selectedUrl} alt="Selection" className="w-full h-full object-cover rounded-2xl shadow-xl transition-all group-hover:brightness-75 group-hover:scale-105 duration-700" />
                ) : (
                   <div className="flex flex-col items-center gap-3 animate-in zoom-in-50 duration-500 text-gray-300 group-hover:text-amber-500 transition-colors">
                      <ImageIcon className="w-10 h-10" strokeWidth={1} />
                      <span className="text-[9px] font-black uppercase tracking-widest italic opacity-50">Choose Visual Asset</span>
                   </div>
                )}
                
                {selectedUrl && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500">
                         <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                   </div>
                )}
             </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[520px] p-0 bg-white/95 backdrop-blur-2xl border border-gray-100 rounded-[40px] shadow-2xl relative overflow-hidden">
           {/* Decorative Design Elements */}
           <div className="absolute -right-20 -top-20 w-48 h-48 bg-amber-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

           <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3 group-focus-within:translate-x-1 transition-transform">
                 <div className="w-10 h-10 bg-amber-50 border border-amber-100 text-amber-500 rounded-xl flex items-center justify-center shadow-inner">
                    <ImageIcon className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="text-xs font-black uppercase text-gray-900 leading-none mb-1 tracking-widest italic">Asset Catalog</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-60">Global Media Selection</p>
                 </div>
              </div>
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                 <Input 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="h-11 w-[220px] pl-10 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-amber-500/20 rounded-2xl font-bold uppercase tracking-widest text-[9px] shadow-sm italic placeholder:opacity-30" 
                   placeholder="Search library..." 
                 />
              </div>
           </div>

           <div className="p-6 max-h-[360px] overflow-y-auto grid grid-cols-3 gap-3 custom-scrollbar relative z-10">
              {loading ? (
                 <div className="col-span-3 py-20 text-center animate-pulse">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Syncing Asset Index...</p>
                 </div>
              ) : filtered.length === 0 ? (
                 <div className="col-span-3 py-20 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">No assets match your query.</p>
                 </div>
              ) : (
                 filtered.map((item) => (
                   <div 
                     key={item.id}
                     onClick={() => selectAsset(item.url, item.id)}
                     className={`group/item aspect-square bg-gray-50 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-1 ${selectedUrl === item.url ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-transparent hover:border-amber-300 hover:shadow-xl hover:scale-95'}`}
                   >
                      <div className="w-full h-full relative overflow-hidden rounded-xl">
                         <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                         {selectedUrl === item.url && (
                            <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[2px] flex items-center justify-center">
                               <div className="w-8 h-8 bg-white text-amber-500 rounded-lg shadow-2xl flex items-center justify-center scale-100 animate-in zoom-in-50 duration-300">
                                  <Check className="w-5 h-5" strokeWidth={3} />
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                 ))
              )}
           </div>

           <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between group-hover:bg-white transition-colors">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">{filtered.length} Indexed Assets</span>
              <button 
                onClick={() => setOpen(false)}
                className="h-10 px-6 bg-white border border-gray-100 text-gray-900 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-black hover:text-white hover:border-black transition-all shadow-sm active:scale-95"
              >
                 Dismiss
              </button>
           </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
