"use client";

import React from "react";
import { Plus, Trash, Terminal, Tag } from "lucide-react";

interface AttributesSectionProps {
  attributes: { name: string; value: string }[];
  onAttributesChange: (attributes: { name: string; value: string }[]) => void;
}

export const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  onAttributesChange,
}) => {
  const addAttribute = () => {
    onAttributesChange([...attributes, { name: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    onAttributesChange(attributes.filter((_, i) => i !== index));
  };

  const updateAttribute = (index: number, field: "name" | "value", val: string) => {
    const next = [...attributes];
    next[index] = { ...next[index], [field]: val };
    onAttributesChange(next);
  };

  return (
    <div className="bg-[#0A0A0A]/40 border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 border-l-4 border-[#C8A97E] pl-6">
          <Tag size={18} className="text-[#C8A97E]" />
          <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Technical Specs</h3>
        </div>
        <button
          onClick={addAttribute}
          className="h-10 px-6 bg-[#C8A97E]/10 border border-[#C8A97E]/20 text-[#C8A97E] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#C8A97E]/20 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Add Spec
        </button>
      </div>

      <div className="space-y-4">
        {(!attributes || attributes.length === 0) ? (
          <div className="py-12 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-xl opacity-20 italic">
             <Terminal size={24} className="mb-3" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">No Technical Data Mapped</span>
          </div>
        ) : (
          attributes.map((attr, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-black/40 p-5 rounded-xl border border-white/5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Property Name</label>
                <input
                  type="text"
                  value={attr.name}
                  onChange={(e) => updateAttribute(i, "name", e.target.value)}
                  placeholder="e.g. WEIGHT"
                  className="w-full h-12 bg-black border border-white/10 rounded-lg px-4 text-xs font-bold text-white uppercase placeholder:text-white/5 focus:border-[#C8A97E]/40 outline-none transition-all"
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <label className="text-[9px] font-black text-white/30 uppercase tracking-widest">Value</label>
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => updateAttribute(i, "value", e.target.value)}
                    placeholder="e.g. 500G"
                    className="w-full h-12 bg-black border border-white/10 rounded-lg px-4 text-xs font-bold text-white uppercase placeholder:text-white/5 focus:border-[#C8A97E]/40 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => removeAttribute(i)}
                  className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/5 text-white/20 hover:text-red-500 hover:border-red-500/20 transition-all rounded-lg"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
