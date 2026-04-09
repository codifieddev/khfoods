"use client";

import React from "react";
import { Check, LayoutGrid, Monitor, ShieldAlert, Zap } from "lucide-react";
import { CategoryRecord } from "@/lib/store/categories/categoriesSlices";

interface PublicationSidebarProps {
  status: string;
  templateKey: string;
  allCategories: CategoryRecord[];
  categoryIds: string[];
  primaryCategoryId: string;
  relatedProductCandidates: any[];
  relatedProductIds: string[];
  onFormChange: (field: string, value: any) => void;
  onToggleCategory: (id: string) => void;
  onToggleRelatedProduct: (id: string) => void;
  allForms: any[];
  formId: string;
}

export const PublicationSidebar: React.FC<PublicationSidebarProps> = ({
  status,
  templateKey,
  allCategories,
  categoryIds,
  primaryCategoryId,
  relatedProductCandidates,
  relatedProductIds,
  onFormChange,
  onToggleCategory,
  onToggleRelatedProduct,
  allForms,
  formId,
}) => {
  return (
    <div className="space-y-8">
      {/* Deployment Logic */}
      <div className="bg-[#0A0A0A]/40 border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl">
        <div className="flex items-center gap-4 border-l-4 border-[#C8A97E] pl-6">
          <Monitor size={18} className="text-[#C8A97E]" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">DEPLOYMENT LOGIC</h3>
        </div>

        <div className="space-y-3">
           {[
             { id: 'active', label: 'COMBAT READY (ACTIVE)' },
             { id: 'draft', label: 'UNDERCOVER (DRAFT)' },
             { id: 'archived', label: 'DECOMMISSIONED (ARCHIVED)' },
           ].map((s) => (
             <button 
               key={s.id}
               onClick={() => onFormChange("status", s.id)}
               className={`w-full h-16 px-6 border rounded-xl flex items-center justify-between transition-all group ${
                 status === s.id 
                   ? "bg-[#C8A97E]/10 border-[#C8A97E]/40 shadow-[0_0_20px_rgba(200,169,126,0.05)]" 
                   : "bg-black/40 border-white/5 opacity-40 hover:opacity-100"
               }`}
             >
                <div className="flex items-center gap-4">
                   <div className={`h-2 w-2 rounded-full ${status === s.id ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/10"}`} />
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${status === s.id ? "text-white" : "text-white/40"}`}>{s.label}</span>
                </div>
                {status === s.id && <Check size={14} className="text-[#C8A97E]" />}
             </button>
           ))}
        </div>
      </div>

      {/* Sector Assignment */}
      <div className="bg-[#0A0A0A]/40 border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl">
        <div className="flex items-center gap-4 border-l-4 border-[#C8A97E] pl-6">
          <LayoutGrid size={18} className="text-[#C8A97E]" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">SECTOR ASSIGNMENT</h3>
        </div>

        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
           {allCategories.map((cat) => (
             <div key={cat._id} className="space-y-1">
               <label 
                 className={`flex items-center gap-4 h-14 px-5 rounded-xl border cursor-pointer transition-all ${
                   categoryIds.includes(cat._id) ? "bg-[#C8A97E]/5 border-[#C8A97E]/20" : "bg-black/40 border-white/5 hover:border-[#C8A97E]/10"
                 }`}
               >
                  <div className="relative">
                     <input 
                       type="checkbox" 
                       className="peer hidden" 
                       checked={categoryIds.includes(cat._id)}
                       onChange={() => onToggleCategory(cat._id)}
                     />
                     <div className="h-4 w-4 bg-black border border-white/10 rounded-none peer-checked:bg-[#C8A97E] peer-checked:border-[#C8A97E] transition-all flex items-center justify-center">
                        <Check size={10} className="text-black font-black scale-0 peer-checked:scale-100 transition-transform" />
                     </div>
                  </div>
                  <div className="flex-1">
                     <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${categoryIds.includes(cat._id) ? "text-white" : "text-white/20"}`}>{cat.name || cat.title}</span>
                  </div>
                  {categoryIds.includes(cat._id) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onFormChange("primaryCategoryId", cat._id);
                      }}
                      className={`h-8 px-4 text-[9px] font-black uppercase tracking-tighter border transition-all rounded-md ${
                        primaryCategoryId === cat._id ? "bg-[#C8A97E] text-black border-[#C8A97E]" : "bg-transparent text-[#C8A97E] border-[#C8A97E]/30 hover:bg-[#C8A97E]/10"
                      }`}
                    >
                      {primaryCategoryId === cat._id ? "PRIMARY" : "SET PRIMARY"}
                    </button>
                  )}
               </label>
             </div>
           ))}
        </div>
      </div>

      {/* Operational Support */}
      <div className="bg-[#0A0A0A]/40 border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl">
        <div className="flex items-center gap-4 border-l-4 border-[#C8A97E] pl-6">
          <ShieldAlert size={18} className="text-[#C8A97E]" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">OPERATIONAL SUPPORT</h3>
        </div>

        <div className="max-h-[200px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
           {relatedProductCandidates.map((p) => (
             <label 
               key={p._id}
               className={`flex items-center gap-4 h-14 px-5 rounded-xl border cursor-pointer transition-all ${
                 relatedProductIds.includes(p._id) ? "bg-[#C8A97E]/5 border-[#C8A97E]/20" : "bg-black/40 border-white/5"
               }`}
             >
                <input 
                   type="checkbox" 
                   className="peer hidden" 
                   checked={relatedProductIds.includes(p._id)}
                   onChange={() => onToggleRelatedProduct(p._id)}
                />
                <div className="h-4 w-4 bg-black border border-white/10 rounded-none peer-checked:bg-[#C8A97E] peer-checked:border-[#C8A97E] transition-all flex items-center justify-center">
                   <Check size={10} className="text-black font-black" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${relatedProductIds.includes(p._id) ? "text-white" : "text-white/20"}`}>{p.name}</span>
             </label>
           ))}
        </div>
      </div>
    </div>
  );
};
