"use client";

import React, { useState, useEffect } from "react";
import { Tag, Check, ChevronDown, Layers, Search, X } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaxonomyPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label?: string;
}

export const TaxonomyPicker: React.FC<TaxonomyPickerProps> = ({ selectedIds, onChange, label = "Product Category" }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/taxonomy/list", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setCategories(json.categories || []);
      }
    } catch (err) {
      console.error("Taxonomy picker fetch failure:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
    const next = selectedIds.includes(id) 
      ? selectedIds.filter(val => val !== id) 
      : [...selectedIds, id];
    onChange(next);
  };

  const filtered = categories.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeNames = categories
    .filter(c => selectedIds.includes(c.id))
    .map(c => c.title);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
         <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
         <Layers className="w-4 h-4 text-gray-300" strokeWidth={2.5} />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-15 bg-gray-50/50 border-gray-50 hover:bg-white hover:border-indigo-100 rounded-2xl flex justify-between px-6 transition-all group"
          >
            <div className="flex items-center gap-3 truncate">
               <Tag className={`w-4 h-4 group-hover:text-indigo-600 transition-colors ${selectedIds.length > 0 ? 'text-indigo-600' : 'text-gray-300'}`} />
               {selectedIds.length > 0 ? (
                  <span className="font-extrabold uppercase italic tracking-tight text-gray-900 truncate">
                     {activeNames.join(", ")}
                  </span>
               ) : (
                  <span className="text-gray-400 font-bold uppercase italic tracking-widest text-[11px]">No taxonomy selected</span>
               )}
            </div>
            <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] p-4 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl relative overflow-hidden">
           {/* Decorative Blur */}
           <div className="absolute -left-10 -bottom-10 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-10 pointer-events-none" />

           <div className="space-y-4 relative z-10">
              <div className="relative group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                 <Input 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="h-10 pl-10 bg-gray-50/50 border-gray-50 focus-visible:bg-white focus-visible:ring-indigo-500/20 rounded-xl font-bold uppercase tracking-widest text-[9px] shadow-inner" 
                   placeholder="Search taxonomy..." 
                 />
              </div>

              <div className="max-h-[220px] overflow-y-auto space-y-1 custom-scrollbar pr-1">
                 {loading ? (
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center py-10 italic">Initializing catalog...</p>
                 ) : filtered.length === 0 ? (
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center py-10 italic">No structure found.</p>
                 ) : (
                    filtered.map((cat) => (
                      <button 
                        key={cat.id}
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group/item ${selectedIds.includes(cat.id) ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-900'}`}
                      >
                         <h5 className="font-extrabold uppercase italic tracking-tighter leading-none mb-0.5">{cat.title}</h5>
                         {selectedIds.includes(cat.id) && <Check className="w-4 h-4" strokeWidth={3} />}
                      </button>
                    ))
                 )}
              </div>

              <div className="pt-2 border-t border-gray-50 flex items-center justify-between px-1">
                 <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">{selectedIds.length} Selections</p>
                 <button onClick={() => setOpen(false)} className="text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:scale-105 transition-all">Apply Structure</button>
              </div>
           </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
