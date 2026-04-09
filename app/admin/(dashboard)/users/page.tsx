"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Search,
  Clock,
  User,
  Shield,
  Activity,
  Terminal,
  Zap,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function UsersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { adminusers, loading } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "admin",
      }),
    );
  }, [dispatch]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke executive access for "${name}"?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Revoking access for ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`Executive access for ${name} revoked.`, { id: toastId });
      } else {
        toast.error(
          (resultAction.payload as string) || "Revocation failed.",
          { id: toastId },
        );
      }
    } catch {
      toast.error("An error occurred during access revocation.", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/users/${id}/edit`);
  };

  const handleAdd = () => {
    router.push("/admin/users/new");
  };

  const filteredUsers = useMemo(() => {
    return (adminusers || []).filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [adminusers, searchQuery]);

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <ShieldCheck size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Executive Security Protocols
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Executive <span className="text-[#C8A97E]">Council</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Manage administrative privileges and oversee the elite circle of brand curators.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <Button
            onClick={handleAdd}
            className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
          >
            <Plus size={20} strokeWidth={2.5} /> Invite Member
          </Button>
        </div>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex items-center gap-8 pl-4">
           <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" /> {adminusers.length} Executive Members
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
            Access Control: <span className="text-emerald-500">Encrypted</span>
          </div>
        </div>
        
        <div className="relative group w-full lg:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
          <input
            placeholder="Search council members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                Member Profile
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Clearance & Status
              </TableHead>
              <TableHead className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Council Rank
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Appointed
              </TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Management
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
                        Synchronizing Council Records...
                      </span>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-8 opacity-20">
                      <Shield size={64} strokeWidth={1} />
                      <span className="text-lg font-heading font-medium text-white/50">No council records match your query</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={String(user._id)}
                  className="group hover:bg-white/[0.01] border-white/[0.03] transition-all duration-300 h-28"
                >
                  <TableCell className="px-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-[#C8A97E]/5 border border-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] font-heading font-bold text-xl shadow-inner group-hover:bg-[#C8A97E] group-hover:text-black transition-all duration-500">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[16px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none">
                          {user.name}
                        </span>
                        <div className="flex items-center gap-2 text-white/20 font-bold uppercase tracking-[0.1em]">
                          <Mail size={10} className="text-[#C8A97E]/40" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Shield className="text-[#C8A97E]/40" size={14} />
                        <span className="text-[12px] font-bold uppercase tracking-widest text-[#C8A97E]">
                          {user.role} Privilege
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          user.status === 'active' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-white/10'
                        )} />
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          user.status === "active" ? "text-emerald-400" : "text-white/20"
                        )}>
                          {user.status || "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                    {user.isTenantOwner ? (
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C8A97E]/10 border border-[#C8A97E]/30 shadow-lg shadow-[#C8A97E]/5">
                        <Star size={12} className="text-[#C8A97E]" />
                        <span className="text-[10px] font-bold text-[#C8A97E] uppercase tracking-widest leading-none">Primary Founder</span>
                      </div>
                    ) : (
                      <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Council Member</span>
                    )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 text-white/40">
                      <Clock size={14} className="text-[#C8A97E]/30" />
                      <span className="text-[13px] font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "PENDING"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(String(user._id))}
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                        title="Modify Privileges"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        disabled={deletingId === user._id}
                        onClick={() =>
                          handleDelete(String(user._id), user.name)
                        }
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                        title="Revoke Access"
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

      {/* FOOTER INFO */}
      <section className="flex items-center gap-4 text-white/10 px-6">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Executive Access Interface | Encrypted Brand Backbone Active
        </span>
      </section>
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
          <div className="h-16 w-16 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-2xl shadow-[#C8A97E]/10" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
            Authenticating Council Access...
          </span>
        </div>
      }
    >
      <UsersPageContent />
    </Suspense>
  );
}
