"use client";

import React from "react";
import { Info, Terminal, Type } from "lucide-react";
import { slugify } from "@/lib/admin-products/utils";

interface GeneralInformationProps {
  name: string;
  sku: string;
  slug: string;
  description: string;
  onFormChange: (field: string, value: any) => void;
  onSlugChange: (slug: string) => void;
}

export const GeneralInformation: React.FC<GeneralInformationProps> = ({
  name,
  sku,
  slug,
  description,
  onFormChange,
  onSlugChange,
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onFormChange("name", val);
    if (val && !slug) {
      onSlugChange(slugify(val));
    }
  };

  return (
    <div className="bg-[#0A0A0A]/40 border border-white/5 rounded-2xl p-10 space-y-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
         <Info size={60} className="text-[#C8A97E]" />
      </div>
      
      <div className="flex items-center gap-4 border-l-4 border-[#C8A97E] pl-6">
        <Terminal size={20} className="text-[#C8A97E]" />
        <h3 className="text-xl font-black text-white uppercase tracking-[0.3em]">GENERAL INTEL</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Name Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
            <Type size={12} className="text-[#C8A97E]" /> ASSET DESIGNATION
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="ENTER UNIT NAME..."
            className="w-full h-16 bg-black border border-white/5 rounded-xl px-6 text-[13px] font-bold uppercase tracking-widest text-white focus:border-[#C8A97E]/40 outline-none transition-all placeholder:text-white/10"
          />
        </div>

        {/* SKU Field */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
            <Terminal size={12} className="text-[#C8A97E]" /> SERIAL SKU
          </label>
          <input
            type="text"
            value={sku}
            onChange={(e) => onFormChange("sku", e.target.value)}
            placeholder="SERIAL-ID-X..."
            className="w-full h-16 bg-black border border-white/5 rounded-xl px-6 text-[13px] font-bold uppercase tracking-widest text-white focus:border-[#C8A97E]/40 outline-none transition-all placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Slug Field */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
          NETWORK PATH (SLUG)
        </label>
        <div className="relative">
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#C8A97E]/40 uppercase tracking-[0.2em] border-r border-white/5 pr-4">
            /PRODUCT/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="auto-generated-slug"
            className="w-full h-16 bg-black border border-white/5 rounded-xl pl-32 pr-6 text-[13px] font-bold text-white/60 lowercase tracking-widest focus:border-[#C8A97E]/40 outline-none transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">TECHNICAL BRIEF BRIEFING</label>
        <textarea
          value={description}
          onChange={(e) => onFormChange("description", e.target.value)}
          placeholder="DESCRIBE UNIT CAPABILITIES..."
          className="w-full min-h-[160px] bg-black border border-white/5 rounded-xl p-6 text-[13px] font-bold text-white uppercase tracking-widest leading-relaxed focus:border-[#C8A97E]/40 outline-none transition-all placeholder:text-white/10 resize-none"
        />
      </div>
    </div>
  );
};
