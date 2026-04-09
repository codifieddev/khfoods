"use client";

import React, { useEffect, useState } from "react";
import { Terminal, FileSpreadsheet, Eye, ArrowRight, Package, User as UserIcon, Calendar, Sparkles, Award, ShieldCheck, Mail, Database } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchSubmissions, fetchForms } from "@/lib/store/forms/formsThunk";
import { fetchProducts } from "@/lib/store/products/productsThunk";
import { RootState } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function FormSubmissionsPage() {
  const dispatch = useAppDispatch();
  const { submissions, allForms, loading } = useAppSelector((state: RootState) => state.adminForms);
  const { allProducts } = useAppSelector((state: RootState) => state.adminProducts);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const getFormName = (id: string) => allForms.find((f: any) => f._id === id)?.name || "PRIMARY PORTAL";
  const getProductName = (id: string) => allProducts.find((p: any) => p._id === id)?.name || "DIRECT INQUIRY";

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Mail size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Boutique Client Inquiries
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Client <span className="text-[#C8A97E]">Inquiries</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Review and manage the personalized communication transmissions received from your distinguished clientele.
          </p>
        </div>

        <div className="flex items-center gap-5">
           <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-4">
            <Sparkles size={14} className="animate-pulse" /> {submissions.length} Total Transmissions
          </div>
        </div>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-8 pl-4">
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
            Registry Status: <span className="text-emerald-500 font-bold">Synchronized</span>
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
            <Database size={14} className="text-[#C8A97E]/40" /> Archive Mode: High-Fidelity
          </div>
        </div>
      </section>

      {/* SUBMISSIONS LIST */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl">
          <div className="h-12 w-12 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
            Parsing Inquiry Grid...
          </span>
        </div>
      ) : submissions.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <FileSpreadsheet size={64} strokeWidth={1} className="text-white/10" />
          <div className="text-center space-y-3 relative z-10">
            <h3 className="text-xl font-heading font-medium text-white/30 tracking-tight">
              No inquiries detected
            </h3>
            <p className="text-[11px] font-bold text-white/10 uppercase tracking-[0.2em]">
              The brand inquiry registry is currently undisturbed.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {submissions.map((sub: any) => (
            <div 
              key={sub._id}
              className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem] shadow-2xl hover:border-[#C8A97E]/30 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-10 group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A97E]/[0.01] -rotate-45 translate-x-16 -translate-y-16" />
               
              <div className="flex flex-col md:flex-row md:items-center gap-12 flex-1 relative z-10">
                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] font-bold text-[#C8A97E]/30 uppercase tracking-[0.2em]">Source Portal</span>
                  <span className="text-[16px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none">
                    {getFormName(sub.formId)}
                  </span>
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">Target Reference</span>
                  <div className="flex items-center gap-3 text-[13px] font-medium text-white/50">
                    <Package size={14} className="text-[#C8A97E]/40" />
                    {getProductName(sub.productId)}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">Captured Timestamp</span>
                  <div className="flex items-center gap-3 text-[13px] font-medium text-white/50">
                    <Calendar size={14} className="text-[#C8A97E]/40" />
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "N/A"}
                  </div>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-white/5 border border-white/10 text-white/40 hover:text-black hover:bg-white transition-all text-[11px] font-bold uppercase tracking-widest h-12 px-8 gap-3 rounded-full relative z-10"
                  >
                    <Eye size={18} /> View Inquiry
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0A0A0A] border-[#C8A97E]/20 text-white max-w-3xl rounded-[3rem] p-1 shadow-[0_0_100px_rgba(200,169,126,0.1)]">
                   <div className="bg-black rounded-[2.9rem] p-12 max-h-[85vh] overflow-y-auto scrollbar-none">
                    <DialogHeader className="border-b border-white/10 pb-8 mb-10">
                      <div className="flex items-center gap-4 text-[#C8A97E] mb-4">
                        <Award size={20} />
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Curation Report</span>
                      </div>
                      <DialogTitle className="text-3xl font-heading font-bold tracking-tight">
                        Client <span className="text-[#C8A97E]">Submission Details</span>
                      </DialogTitle>
                      <div className="flex items-center gap-5 text-[11px] font-bold text-white/20 uppercase tracking-widest mt-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Ref: {sub._id.slice(-12).toUpperCase()}</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Portal: {getFormName(sub.formId)}</span>
                      </div>
                    </DialogHeader>

                    <div className="space-y-8">
                      {sub.data && Object.entries(sub.data).map(([key, val]: [string, any]) => (
                        <div key={key} className="space-y-3 p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-[#C8A97E]/20 transition-all">
                          <Label className="text-[11px] font-bold text-[#C8A97E]/50 uppercase tracking-[0.2em]">
                            {key.replace(/-/g, ' ')}
                          </Label>
                          <div className="text-[15px] font-medium text-white/80 tracking-wide">
                            {Array.isArray(val) ? val.join(", ") : String(val)}
                          </div>
                        </div>
                      ))}

                      <div className="pt-10 border-t border-white/10 space-y-6">
                         <div className="flex items-center gap-3 text-white/10">
                           <ShieldCheck size={16} />
                           <span className="text-[11px] font-bold uppercase tracking-[0.3em]">Boutique Metadata</span>
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                               <span className="text-[9px] text-[#C8A97E]/30 font-bold uppercase tracking-widest">Client Identity</span>
                               <span className="block text-[12px] font-medium text-white/40 truncate">{sub.userId || "ANONYMOUS_CLIENT"}</span>
                            </div>
                            {sub.productId && (
                               <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl space-y-1">
                                  <span className="text-[9px] text-[#C8A97E]/30 font-bold uppercase tracking-widest">Product Catalog Ref</span>
                                  <span className="block text-[12px] font-medium text-white/40 truncate">{sub.productId}</span>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                   </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}

      {/* FOOTER INTEL */}
      <div className="flex items-center gap-4 text-white/10 px-8">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Executive Insight Registry | Synchronized Communication Node Active
        </span>
      </div>
    </div>
  );
}
