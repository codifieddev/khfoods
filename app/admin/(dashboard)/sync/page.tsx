"use client";

import { useState } from "react";
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Package, 
  Layers, 
  Info, 
  Database, 
  Globe, 
  Zap, 
  ShieldAlert, 
  ArrowUpRight, 
  ChevronRight,
  DatabaseZap,
  CheckCircle2,
  AlertCircle,
  X,
  Container,
  Activity,
  Target,
  Terminal,
  Cpu,
  Radio,
  Lock,
  Award,
  ShieldCheck,
  Star,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function SyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startSync = async () => {
    setSyncing(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/sync-surplus", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to synchronize brand data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during synchronization.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <RefreshCw size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Executive Data Harmonization
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Market <span className="text-[#C8A97E]">Synchronization</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Align your boutique inventory with the global supply matrix using high-fidelity secure protocols.
          </p>
        </div>

        <div className="flex items-center gap-5">
           <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-[2rem] shadow-2xl">
              <div className="flex items-center gap-4 px-6 border-r border-white/5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Global Link Active</span>
              </div>
              <div className="px-6 flex items-center gap-3 text-white/40">
                 <Lock size={14} className="text-[#C8A97E]/40" />
                 <span className="text-[11px] font-bold uppercase tracking-widest leading-none">AES-256 Encrypted</span>
              </div>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CONTROL COLUMN */}
        <div className="lg:col-span-1 space-y-10">
           <motion.div 
             className="relative bg-[#0A0A0A] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl space-y-10 overflow-hidden group"
             whileHover={{ y: -8 }}
             transition={{ duration: 0.5 }}
           >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C8A97E]/5 -rotate-45 translate-x-20 -translate-y-20 transition-transform group-hover:scale-110 duration-1000" />
              
              <div className="relative z-10 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-[#C8A97E]/5 border border-[#C8A97E]/20 text-[#C8A97E] flex items-center justify-center shadow-inner group-hover:bg-[#C8A97E] group-hover:text-black transition-all duration-500">
                    <DatabaseZap size={24} />
                 </div>
                 <h3 className="text-2xl font-heading font-bold text-white tracking-tight">Refinement Protocol</h3>
              </div>
              
              <p className="relative z-10 text-[14px] font-medium text-white/30 leading-relaxed border-l-4 border-[#C8A97E] pl-6 italic">
                Trigger a high-fidelity synchronization sequence to ingest premium product nodes and harmonize the supply hierarchy.
              </p>
              
              <button 
                onClick={startSync}
                disabled={syncing}
                className={cn(
                  "relative z-10 w-full h-16 rounded-full flex items-center justify-center gap-4 text-[13px] font-bold uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 group/btn",
                  syncing 
                    ? "bg-white/5 text-white/10 cursor-not-allowed border border-white/5" 
                    : "bg-[#C8A97E] text-black hover:bg-white shadow-[#C8A97E]/20"
                )}
              >
                {syncing ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover/btn:scale-125 transition-transform" />}
                {syncing ? "Harmonizing..." : "Initiate Sync"}
              </button>
           </motion.div>

           <div className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[2.5rem] space-y-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Award size={120} className="text-[#C8A97E]" strokeWidth={1} />
              </div>
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20">Operational Status</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase text-emerald-400 tracking-widest">Optimized</span>
                 </div>
              </div>
              <div className="relative z-10 space-y-8">
                 {[
                   { label: "Target Density", val: "Boutique Scale", icon: Layers },
                   { label: "Asset Curation", val: "High Resolution", icon: Zap },
                   { label: "Data Integrity", val: "Pristine", icon: ShieldCheck },
                 ].map((meta, i) => (
                   <div key={i} className="flex items-center justify-between group/item">
                      <div className="flex items-center gap-5 text-white/30 group-hover/item:text-[#C8A97E] transition-colors">
                         <meta.icon size={18} />
                         <span className="text-[11px] font-bold uppercase tracking-widest">{meta.label}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#C8A97E]/60 uppercase tracking-widest italic">{meta.val}</span>
                   </div>
                 ))}
              </div>
              
              <button className="w-full h-12 border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white hover:bg-white/10 transition-all rounded-full italic">System Diagnostics</button>
           </div>
        </div>

        {/* RESULT COLUMN */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result || error ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "relative overflow-hidden p-16 rounded-[3rem] border shadow-2xl min-h-[600px] flex flex-col justify-center",
                    error ? "bg-red-500/[0.02] border-red-500/20" : "bg-emerald-500/[0.02] border-emerald-500/20"
                  )}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-current opacity-[0.03] -rotate-45 translate-x-32 -translate-y-32" />
                  
                  <div className="flex items-center gap-10 mb-16 relative z-10">
                    <div className={cn(
                      "h-24 w-24 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden",
                      error ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                    )}>
                      <div className="absolute inset-0 bg-white/20 opacity-0 animate-pulse" />
                      {error ? <ShieldAlert size={40} strokeWidth={2} /> : <CheckCircle2 size={40} strokeWidth={2} />}
                    </div>
                    <div className="space-y-2">
                        <h2 className={cn("text-4xl font-heading font-bold tracking-tight", error ? "text-red-500" : "text-emerald-400")}>
                          {error ? "Protocol Breach" : "Synchronization Complete"}
                        </h2>
                        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/20">
                          Intelligence Log Entry: {new Date().toLocaleTimeString()} • ID: CC-0{Math.floor(Math.random()*9999)}
                        </p>
                    </div>
                  </div>
                  
                  {result && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-black border border-white/5 p-12 rounded-[2.5rem] shadow-2xl group/card hover:border-[#C8A97E]/30 transition-all duration-700">
                            <div className="h-16 w-16 bg-white/5 text-white/20 flex items-center justify-center rounded-2xl mb-8 border border-white/10 group-hover/card:bg-[#C8A97E] group-hover/card:text-black transition-all duration-700"><Package size={28} /></div>
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/30 mb-4">Premium Nodes Ingested</h4>
                            <div className="flex items-baseline gap-5">
                               <p className="text-7xl font-heading font-bold text-white tracking-tighter">{result.count}</p>
                               <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest italic">Synchronized</span>
                            </div>
                        </div>
                        <div className="bg-[#C8A97E] border border-[#C8A97E]/30 p-12 rounded-[2.5rem] shadow-2xl shadow-[#C8A97E]/10 flex flex-col justify-center text-black">
                            <div className="flex items-center gap-3 mb-6 opacity-40">
                               <Radio size={16} className="animate-pulse" />
                               <h4 className="text-[11px] font-bold uppercase tracking-[0.4em]">Current Phase</h4>
                            </div>
                            <p className="text-3xl font-heading font-bold uppercase tracking-tight leading-tight">Brand Inventory Harmonized</p>
                        </div>
                      </div>
                      
                      <div className="p-10 bg-[#0A0A0A] border border-white/5 rounded-[2rem] shadow-inner italic flex items-start gap-8 border-l-4 border-l-emerald-500/40">
                        <Activity size={28} className="text-emerald-400 flex-shrink-0 mt-1 animate-pulse" />
                        <div className="space-y-4">
                           <p className="text-[15px] font-medium text-white/50 leading-relaxed uppercase tracking-wide">
                              The brand ecosystem has been seamlessly updated with the latest high-fidelity nodes from the verified source.
                           </p>
                           <div className="flex gap-8">
                              <a href="/admin/products" className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2">Manage Assets <ArrowUpRight size={16} /></a>
                              <a href="/admin/categories" className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-[0.2em] hover:text-white transition-all flex items-center gap-2">Curate Collections <ArrowUpRight size={16} /></a>
                           </div>
                        </div>
                      </div>
                      
                      <div className="pt-6">
                         <button onClick={() => setResult(null)} className="h-12 px-10 border border-white/10 text-white/20 text-[11px] font-bold uppercase tracking-[0.3em] hover:text-[#C8A97E] hover:border-[#C8A97E]/30 transition-all rounded-full italic">Archive Report</button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="animate-in slide-in-from-top-6 duration-1000 relative z-10 space-y-12">
                       <div className="bg-black border border-red-500/20 p-12 rounded-[2.5rem] shadow-2xl space-y-8">
                          <div className="flex items-center gap-4">
                             <ShieldAlert className="text-red-500" size={24} />
                             <h4 className="text-[12px] font-bold uppercase tracking-[0.4em] text-red-500">Synchronization Breach Logs</h4>
                          </div>
                          <p className="text-[16px] font-medium text-white/70 leading-relaxed italic uppercase tracking-wider">{error}</p>
                          <div className="pt-8 border-t border-white/5">
                             <p className="text-[12px] text-white/20 font-medium leading-relaxed italic">
                                Harmonization sequence failed. Ensure the secure satellite link is established and encryption keys are verified. Executive intervention may be required.
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-6">
                          <button onClick={startSync} className="h-16 px-14 bg-red-500 text-white font-bold uppercase tracking-[0.2em] text-[13px] shadow-2xl shadow-red-500/20 hover:bg-red-600 transition-all active:scale-95 rounded-full flex items-center gap-4"><RefreshCw size={20} /> Retrigger Sequence</button>
                          <button onClick={() => setError(null)} className="h-16 px-12 border border-white/10 text-white/30 font-bold uppercase tracking-widest text-[11px] hover:text-white transition-all rounded-full italic">Dismiss Log</button>
                       </div>
                    </div>
                  )}
                </motion.div>
             ) : (
                <motion.div 
                   key="idle"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="h-full min-h-[600px] rounded-[3.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-24 bg-[#0A0A0A]/30 shadow-inner group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C8A97E]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative mb-14">
                     <div className="absolute inset-0 bg-[#C8A97E]/5 rounded-full blur-[80px] scale-150 animate-pulse" />
                     <Sparkles size={120} className="text-white/[0.03] group-hover:text-[#C8A97E]/10 transition-colors duration-1000 relative z-10" strokeWidth={0.5} />
                     <RefreshCw size={36} className="absolute -top-10 -right-10 text-[#C8A97E] opacity-10 group-hover:opacity-40 group-hover:rotate-180 transition-all duration-1000" />
                  </div>
                  <h2 className="text-4xl font-heading font-bold tracking-tight text-white/10 group-hover:text-white/20 transition-colors relative z-10">Awaiting Executive Protocol</h2>
                  <p className="max-w-md text-[14px] font-medium text-white/10 mt-8 leading-relaxed italic group-hover:text-white/30 transition-colors relative z-10">
                    Establish the digital bridge to initiate a comprehensive synchronization between the boutique core and the global supply matrix.
                  </p>
                  <div className="mt-14 opacity-0 group-hover:opacity-100 transition-all duration-1000 transform translate-y-8 group-hover:translate-y-0 relative z-10">
                     <button onClick={startSync} className="h-16 px-16 bg-[#C8A97E]/5 border border-[#C8A97E]/30 text-[#C8A97E] font-bold text-[13px] uppercase tracking-[0.3em] hover:bg-[#C8A97E] hover:text-black transition-all shadow-2xl shadow-[#C8A97E]/10 rounded-full">Authorize Sync</button>
                  </div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
