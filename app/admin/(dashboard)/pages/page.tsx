"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchPagesThunk, deletePageThunk } from "@/lib/store/pages/pageThunk";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash,
  Globe,
  FileText,
  ShieldAlert,
  Database,
  Terminal,
  Sparkles,
  Award,
  Clock,
  Layout,
  Eye,
  Activity,
  ShieldCheck,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { Page } from "@/lib/store/pages/pageType";
import { cn } from "@/lib/utils";

function PagesPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allPages: pages, isLoading: loading } = useSelector(
    (state: RootState) => state.pages
  );

  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPagesThunk());
  }, [dispatch]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove the page "${title}" from the brand archives?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Removing ${title}...`);

    try {
      const resultAction = await dispatch(deletePageThunk(id));
      if (deletePageThunk.fulfilled.match(resultAction)) {
        toast.success(`${title} archive removed successfully`, { id: toastId });
      } else {
        toast.error(`Removal failed: ${resultAction.payload || "Access Denied"}`, { id: toastId });
      }
    } catch (err) {
      toast.error("Network interference detected. Retry protocol.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Layout size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Executive Content Control
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Digital <span className="text-[#C8A97E]">Narratives</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Compose and manage the premium digital experiences of the KHFood brand with absolute precision.
          </p>
        </div>

        <Button
          className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
          onClick={() => router.push("/admin/pages/new")}
        >
          <Plus size={20} strokeWidth={2.5} /> Design Page
        </Button>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-8 pl-4">
           <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" /> {pages.length} Active Narratives
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
            Global Content Synchronization: <span className="text-emerald-500">Active</span>
          </div>
        </div>
        
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
          <input
            placeholder="Search narratvies..."
            className="w-full pl-14 pr-6 h-12 bg-[#050505] border border-white/5 rounded-2xl text-[13px] font-medium text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
          />
        </div>
      </section>

      {/* LUXURY DATA TABLE */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award size={150} className="text-[#C8A97E]" strokeWidth={1} />
        </div>
        
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none h-20">
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Narrative Identity
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Digital Address
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Visibility Protocol
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Last Refined
              </TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Curation
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="h-96 text-center">
                   <div className="flex flex-col items-center gap-6">
                      <div className="h-10 w-10 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 animate-pulse">
                        Synchronizing Digital Narratives...
                      </span>
                   </div>
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-8 opacity-20">
                      <FileText size={64} strokeWidth={1} />
                      <span className="text-lg font-heading font-medium text-white/50">No narrative archives found</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page: Page) => (
                <TableRow
                  key={page._id || Math.random().toString()}
                  className="group hover:bg-white/[0.01] border-white/[0.03] transition-all duration-300 h-28"
                >
                  <TableCell className="px-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-[#C8A97E]/5 border border-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] font-heading font-bold text-xl shadow-inner group-hover:bg-[#C8A97E] group-hover:text-black transition-all duration-500">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[16px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none">
                          {page.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-[0.1em]">
                          <Globe size={10} className="text-[#C8A97E]/40" />
                          <span>/{page.slug}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-[13px] font-medium text-white/60 font-mono tracking-wider italic">
                      /{page.slug}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                       <div className={cn(
                         "w-2 h-2 rounded-full",
                         page.isPublished ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-white/20"
                       )} />
                       <span
                         className={cn(
                           "text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 border rounded-full",
                           page.isPublished 
                             ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                             : "border-white/10 bg-white/5 text-white/40"
                         )}
                       >
                         {page.isPublished ? "Live Presence" : "Private Draft"}
                       </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 text-white/40">
                      <Clock size={14} className="text-[#C8A97E]/30" />
                      <span className="text-[13px] font-medium">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => router.push(`/admin/pages/${page._id}/edit`)}
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                        title="Refine Narrative"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        disabled={deletingId === page._id}
                        onClick={() =>
                          page._id &&
                          handleDelete(page._id, page.title || "Untitled")
                        }
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                        title="Remove Archive"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* FOOTER INTEL */}
      <div className="flex items-center gap-4 text-white/10 px-6">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Executive Content Authoring Interface | High-Fidelity Protocols Active
        </span>
      </div>
    </div>
  );
}

export default function PagesPage() {
  return (
    <Suspense fallback={
       <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="h-16 w-16 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-2xl shadow-[#C8A97E]/10" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
            Establishing Secure Narrative Link...
          </span>
       </div>
    }>
      <PagesPageContent />
    </Suspense>
  );
}
