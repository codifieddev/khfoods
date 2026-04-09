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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Edit,
  Trash,
  Mail,
  Phone,
  Search,
  MapPin,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  UserCheck,
  Star,
  Download,
  Filter,
  Sparkles,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { deleteUser, fetchUsers } from "@/lib/store/users/usersThunk";
import { cn } from "@/lib/utils";

function CustomersPageContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { customers, loading, totalCustomers } = useAppSelector(
    (state) => state.adminUsers,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentPage = Number(searchParams.get("currentPage")) || 1;
  const itemsPerPage = Number(searchParams.get("itemsPerPage")) || 10;

  const totalPages = Math.max(
    1,
    Math.ceil((totalCustomers || 0) / itemsPerPage),
  );

  const updateQueryParams = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    dispatch(
      fetchUsers({
        role: "customer",
        itemsPerPage,
        currentPage,
      }),
    );
  }, [dispatch, currentPage, itemsPerPage]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove client "${name}" from the boutique records?`)) return;

    setDeletingId(id);
    const toastId = toast.loading(`Removing client ${name}...`);

    try {
      const resultAction = await dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(resultAction)) {
        toast.success(`Client ${name} archive removed successfully`, { id: toastId });
        dispatch(
          fetchUsers({
            role: "customer",
            itemsPerPage,
            currentPage,
          }),
        );
      } else {
        toast.error(
          (resultAction.payload as string) || "Deletion failed",
          { id: toastId },
        );
      }
    } catch {
      toast.error("An error occurred during client removal", { id: toastId });
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(
      `/admin/customers/${id}/edit?role=customer&currentPage=${currentPage}&itemsPerPage=${itemsPerPage}`,
    );
  };

  const handleAdd = () => {
    router.push("/admin/customers/new");
  };

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)),
    );
  }, [customers, searchQuery]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateQueryParams({ currentPage: page });
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateQueryParams({
      itemsPerPage: Number(e.target.value),
      currentPage: 1,
    });
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <UserCheck size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Client Relationship Management
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Boutique <span className="text-[#C8A97E]">Clientele</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Nurture relationships with our most valued patrons and manage their exclusive profile archives.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <button className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-[#C8A97E]/30 transition-all flex items-center gap-2 group">
            <Download size={16} className="text-[#C8A97E]/40" />
            Export Archive
          </button>
          <Button
            onClick={handleAdd}
            className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
          >
            <Plus size={20} strokeWidth={2.5} /> Enroll Client
          </Button>
        </div>
      </section>

      {/* REFINED TOOLBAR */}
      <section className="flex flex-col lg:flex-row items-center gap-6 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#C8A97E] transition-colors" />
          <input
            placeholder="Search clients by name, email or telephone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 h-14 bg-[#050505] border border-white/5 rounded-2xl text-[13px] font-medium text-white placeholder:text-white/20 focus:border-[#C8A97E]/40 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-8">
           <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="h-10 border-none bg-transparent text-[11px] font-bold uppercase tracking-widest text-white/40 outline-none cursor-pointer focus:text-[#C8A97E] transition-colors"
          >
            <option value={10}>10 items</option>
            <option value={25}>25 items</option>
            <option value={50}>50 items</option>
          </select>
          <div className="h-6 w-px bg-white/5" />
          <div className="flex items-center gap-3 text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" /> {totalCustomers} Active Patrons
          </div>
        </div>
      </section>

      {/* LUXURY DATA TABLE */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Award size={150} className="text-[#C8A97E]" strokeWidth={1} />
        </div>
        
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-20">
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Client Identity
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Communication Path
              </TableHead>
              <TableHead className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Engagement
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Enrolled Since
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
                        Synchronizing Client Directory...
                      </span>
                   </div>
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-8 opacity-20">
                      <Activity size={64} strokeWidth={1} />
                      <span className="text-lg font-heading font-medium text-white/50">No client records match your query</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow
                  key={String(customer._id)}
                  className="group hover:bg-white/[0.01] border-white/[0.03] transition-all duration-300 h-28"
                >
                  <TableCell className="px-10">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-2xl bg-[#C8A97E]/5 border border-[#C8A97E]/20 flex items-center justify-center text-[#C8A97E] font-heading font-bold text-xl shadow-inner group-hover:bg-[#C8A97E] group-hover:text-black transition-all duration-500">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-[16px] font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none">
                          {customer.name}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em]">
                          Luxe Member • {String(customer._id).slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3 text-white/60">
                        <Mail size={14} className="text-[#C8A97E]/40" />
                        <span className="text-[13px] font-medium transition-colors group-hover:text-white">
                          {customer.email}
                        </span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-3 text-white/40">
                          <Phone size={14} className="text-[#C8A97E]/40" />
                          <span className="text-[13px] font-medium">
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
                        <MapPin size={12} className="text-[#C8A97E]" />
                        <span className="text-[12px] font-bold text-white/80">
                          {customer.addresses?.length || 0}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">
                        Active Addresses
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3 text-white/40">
                      <Clock size={14} className="text-[#C8A97E]/30" />
                      <span className="text-[13px] font-medium">
                        {new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(String(customer._id))}
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                        title="Edit Profile"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        disabled={deletingId === customer._id}
                        onClick={() =>
                          handleDelete(String(customer._id), customer.name)
                        }
                        className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center shadow-xl active:scale-95 disabled:opacity-50"
                        title="Remove Account"
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

      {/* LUXURY PAGINATION */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0A0A0A] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#C8A97E]/20" />
        
        <div className="flex items-center gap-4">
          <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.3em]">
            Boutique Directory Record:{" "}
            <span className="text-[#C8A97E] font-black ml-2 tabular-nums text-[14px]">
              {totalCustomers || 0} Patrons
            </span>
          </p>
        </div>

        <div className="flex items-center gap-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-[#C8A97E] disabled:opacity-20 transition-all group"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" strokeWidth={2.5} /> 
            Prev
          </button>

          <div className="px-8 py-3 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-bold text-white uppercase tracking-widest shadow-inner">
            Directory <span className="text-[#C8A97E] mx-1">{currentPage}</span> / {totalPages}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-[#C8A97E] disabled:opacity-20 transition-all group"
          >
            Next
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </button>
        </div>
      </section>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-6">
            <div className="h-16 w-16 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-2xl shadow-[#C8A97E]/10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
              Requesting Access to Member Directory...
            </span>
          </div>
        </div>
      }
    >
      <CustomersPageContent />
    </Suspense>
  );
}
