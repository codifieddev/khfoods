"use client";

import React, { useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit,
  FileText,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchForms, deleteForm } from "@/lib/store/forms/formsThunk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RootState } from "@/lib/store/store";
import { cn } from "@/lib/utils";

export default function FormsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { allForms, loading } = useAppSelector(
    (state: RootState) => state.adminForms,
  );

  const handleDelete = async (id: string, name: string) => {
    if (
      confirm(`Are you sure you want to retire the engagement portal "${name}"?`)
    ) {
      try {
        await dispatch(deleteForm(id)).unwrap();
        toast.success("Engagement portal retired successfully");
      } catch (err) {
        toast.error("Retirement failed: Access Denied");
      }
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Zap size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Executive Communication Architectures
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Engagement <span className="text-[#C8A97E]">Portals</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Design and oversee the high-end digital touchpoints that connect your brand with the elite clientele.
          </p>
        </div>

        <Button
          onClick={() => router.push("/admin/forms/new")}
          className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
        >
          <Plus size={20} strokeWidth={2.5} /> Design Portal
        </Button>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-8 pl-4">
           <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" /> {allForms.length} Active Portals
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
            Data Collection: <span className="text-emerald-500">Optimized</span>
          </div>
        </div>
      </section>

      {/* PORTALS GRID */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl">
          <div className="h-12 w-12 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
            Establishing Portal Connections...
          </span>
        </div>
      ) : allForms.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <FileText size={64} strokeWidth={1} className="text-white/10" />
          <div className="text-center space-y-3 relative z-10">
            <h3 className="text-xl font-heading font-medium text-white/30 tracking-tight">
              No engagement portals found
            </h3>
            <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.2em]">
              Initiate your first communication portal to begin data collection.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/forms/new")}
            className="text-[#C8A97E] hover:text-white uppercase text-[11px] font-bold tracking-widest italic gap-2 transition-all"
          >
            Design First Portal <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allForms.map((form) => (
            <div
              key={form._id}
              className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] space-y-8 hover:border-[#C8A97E]/30 transition-all duration-500 group shadow-2xl relative overflow-hidden flex flex-col h-64"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A97E]/[0.02] -rotate-45 translate-x-16 -translate-y-16" />

              <div className="relative z-10 flex items-center gap-6">
                 <div className="h-16 w-16 bg-[#C8A97E]/5 border border-[#C8A97E]/20 rounded-2xl flex items-center justify-center text-[#C8A97E] shadow-inner group-hover:bg-[#C8A97E] group-hover:text-black transition-all duration-500">
                    <FileText size={24} />
                 </div>
                 <div className="space-y-1">
                    <h2 className="text-xl font-heading font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors truncate w-48">
                      {form.name}
                    </h2>
                    <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
                      {form.fields?.length || 0} Exclusive Fields
                    </p>
                 </div>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] text-white/10 uppercase font-bold tracking-widest">
                  <span className="text-[#C8A97E]/20">UUID:</span>
                  <span className="group-hover:text-white/30 transition-colors">
                    {form._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/admin/forms/${form._id}/edit`)}
                    className="h-10 w-10 border border-white/5 bg-white/5 rounded-xl text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all flex items-center justify-center"
                    title="Modify Architecture"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(form._id, form.name)}
                    className="h-10 w-10 border border-white/5 bg-white/5 rounded-xl text-white/30 hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center"
                    title="Retire Portal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER INTEL */}
      <div className="flex items-center gap-4 text-white/10 px-8">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Executive Interface Protocol | Dynamic Assets Active
        </span>
      </div>
    </div>
  );
}
