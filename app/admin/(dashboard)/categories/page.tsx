"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import {
  FolderTree,
  Plus,
  Edit,
  Trash,
  Search,
  ChevronRight,
  ChevronDown,
  Package,
  Layout,
  FileText,
  Save,
  X,
  Boxes,
  Tag,
  Upload,
  Globe,
  Sparkles,
  Award,
  Download,
  Filter,
  Activity,
  Zap,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  fetchCategories,
  bulkImportCategories,
} from "@/lib/store/categories/categoriesThunk";
import {
  CategoryRecord,
  CategoryType,
} from "@/lib/store/categories/categoriesSlices";
import { TacticalImportModal } from "@/components/admin/TacticalImportModal";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { ImageIcon, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const categorySampleData = [
  {
    name: "ROASTED PEANUTS",
    slug: "roasted-peanuts",
    type: "product",
    description: "Premium selection of our signature roasted peanuts.",
    pageStatus: "published",
    metaTitle: "Premium Roasted Peanuts | KHFood",
    metaDescription: "Explore our collection of the finest roasted peanuts.",
  },
];

type CategoryDraft = {
  name: string;
  slug: string;
  type: CategoryType;
  parentId: string | null;
  description: string;
  pageStatus: string;
  bannerImageUrl: string;
  metaTitle: string;
  metaDescription: string;
};

function createDraft(type: CategoryType = "product"): CategoryDraft {
  return {
    name: "",
    slug: "",
    type,
    parentId: null,
    description: "",
    pageStatus: "published",
    bannerImageUrl: "",
    metaTitle: "",
    metaDescription: "",
  };
}

function toDraft(record: CategoryRecord): CategoryDraft {
  return {
    name: record.name || record.title || "",
    slug: record.slug || "",
    type: record.type || "product",
    parentId: record.parentId || null,
    description: record.description || "",
    pageStatus: record.pageStatus || "published",
    bannerImageUrl: record.bannerImageUrl || "",
    metaTitle: record.metaTitle || "",
    metaDescription: record.metaDescription || "",
  };
}

function CategoriesPageContent() {
  const [saving, setSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState<CategoryType | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDraft>(createDraft());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showImportModal, setShowImportModal] = useState(false);

  const { allCategories: categories, categoryLoading: loading } =
    useAppSelector((state: RootState) => state.adminCategories);

  const dispatch = useAppDispatch();

  const resetForm = () => {
    setForm(createDraft(typeFilter || "product"));
    setEditingId(null);
    setShowForm(false);
  };

  const handleImport = async (data: any[]) => {
    const resultAction = await dispatch(bulkImportCategories(data));
    if (bulkImportCategories.fulfilled.match(resultAction)) {
      dispatch(fetchCategories());
      return { message: `${data.length} COLLECTIONS SYNCHRONIZED` };
    } else {
      throw new Error(
        (resultAction.payload as any)?.message || "Import failed",
      );
    }
  };

  const totals = useMemo(
    () => ({
      all: categories.length,
      product: categories.filter((item) => item.type === "product").length,
      portfolio: categories.filter((item) => item.type === "portfolio").length,
      blog: categories.filter((item) => item.type === "blog").length,
    }),
    [categories],
  );

  const openCreate = (parentId: string | null = null) => {
    setForm({ ...createDraft(typeFilter || "product"), parentId });
    setEditingId(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEdit = (record: CategoryRecord) => {
    setForm(toDraft(record));
    setEditingId(record._id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.name) {
      toast.error("Collection signature required.");
      return;
    }

    setSaving(true);
    const tId = toast.loading("REFINING TAXONOMY...");
    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, payload })).unwrap();
        toast.success("COLLECTION UPDATED", { id: tId });
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("NEW HUB DEPLOYED", { id: tId });
      }
      resetForm();
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error(
        "DEPLOYMENT FAILURE: " + (err?.message || "Operation Terminated"),
        { id: tId },
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: CategoryRecord) => {
    if (
      !confirm(
        `Are you sure you want to remove collection "${record.name || record.title}" from the brand archives?`,
      )
    )
      return;
    const tId = toast.loading("PURGING COLLECTION...");
    try {
      await dispatch(deleteCategory(record._id!)).unwrap();
      toast.success("COLLECTION REMOVED", { id: tId });
      dispatch(fetchCategories());
    } catch (err: any) {
      toast.error("PURGE FAILURE", { id: tId });
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSet = new Set(expandedNodes);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedNodes(newSet);
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories;
    if (typeFilter) {
      filtered = filtered.filter((c) => c.type === typeFilter);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => {
        const name = c.name || c.title || "";
        return (
          name.toLowerCase().includes(lowerQuery) ||
          c.slug.toLowerCase().includes(lowerQuery)
        );
      });
    }
    return filtered;
  }, [categories, searchQuery, typeFilter]);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryRecord & { children: any[] }>();
    const roots: any[] = [];

    filteredCategories.forEach((c) => map.set(c._id, { ...c, children: [] }));

    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(c);
      } else {
        roots.push(c);
      }
    });

    return roots;
  }, [filteredCategories]);

  const renderRows = (nodes: any[], depth: number = 0): React.ReactNode[] => {
    return nodes.flatMap((node) => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedNodes.has(node._id) || searchQuery.length > 0;
      const name = node.name || node.title || "Unnamed Collection";

      const row = (
        <TableRow
          key={node._id}
          className={`group border-white/[0.03] hover:bg-white/[0.01] transition-all duration-300 h-24 ${depth > 0 ? "bg-white/[0.005]" : ""}`}
        >
          <TableCell
            className="w-full sm:w-[50%] px-10"
            style={{ paddingLeft: `${depth * 3 + 2.5}rem` }}
          >
            <div className="flex items-center gap-6">
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(node._id, e)}
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-xl transition-all border",
                    isExpanded 
                      ? "bg-[#C8A97E]/10 border-[#C8A97E]/40 text-[#C8A97E]" 
                      : "bg-white/5 border-white/5 text-white/20 hover:text-white"
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
              )}

              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-500",
                  depth === 0 
                    ? "bg-[#C8A97E]/5 border-[#C8A97E]/20 text-[#C8A97E] group-hover:bg-[#C8A97E] group-hover:text-black" 
                    : "bg-white/5 border-white/5 text-white/20 group-hover:border-[#C8A97E]/30"
                )}
              >
                <FolderTree size={18} />
              </div>

              <div className="flex flex-col space-y-1">
                <span
                  className={cn(
                    "font-bold text-white tracking-tight group-hover:text-[#C8A97E] transition-colors leading-none",
                    depth === 0 ? "text-[16px]" : "text-[14px]"
                  )}
                >
                  {name}
                </span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">
                  Path: /{node.slug}
                </span>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <span className="text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 border border-[#C8A97E]/20 bg-[#C8A97E]/5 text-[#C8A97E] rounded-full">
              {node.type}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Zap size={14} className="text-[#C8A97E] opacity-40 group-hover:animate-pulse" />
              <span className="text-[12px] font-bold text-white/40 group-hover:text-white/60 transition-colors">
                {node.children.length} Sub-Categories
              </span>
            </div>
          </TableCell>
          <TableCell className="text-right px-10">
            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <button
                className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                onClick={() => openCreate(node._id)}
                title="Assemble Sub-Category"
              >
                <Plus size={18} />
              </button>
              <button
                className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                onClick={() => openEdit(node)}
                title="Refine Collection"
              >
                <Edit size={18} />
              </button>
              <button
                className="h-11 w-11 rounded-xl border border-white/5 bg-white/5 text-white/30 hover:text-[#C8A97E] hover:border-[#C8A97E]/30 hover:bg-[#C8A97E]/10 transition-all flex items-center justify-center shadow-xl active:scale-95"
                onClick={() => handleDelete(node)}
                title="Purge Collection"
              >
                <Trash size={18} />
              </button>
            </div>
          </TableCell>
        </TableRow>
      );

      if (isExpanded && hasChildren) {
        return [row, ...renderRows(node.children, depth + 1)];
      }

      return [row];
    });
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[1600px]">
      {/* LUXURY HEADER */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-8 border-b border-[#C8A97E]/10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[#C8A97E]">
            <Award size={16} />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
              Product Curatorship
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            Bespoke <span className="text-[#C8A97E]">Collections</span>
          </h1>
          <p className="text-[15px] font-medium text-white/40 max-w-xl leading-relaxed">
            Organize exquisite products into intuitive collections and maintain high-end navigation structures.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <button
            className="h-12 px-6 bg-white/5 border border-white/10 text-white/40 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white hover:border-[#C8A97E]/30 transition-all flex items-center gap-3 group"
            onClick={() => setShowImportModal(true)}
          >
            <Upload size={16} className="text-[#C8A97E]/40" />
            Bulk Import
          </button>
          <Button
            className="h-12 px-10 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/10 flex items-center gap-3"
            onClick={() => openCreate(null)}
          >
            <Plus size={20} strokeWidth={2.5} /> Forge Collection
          </Button>
        </div>
      </section>

      {/* STATS CLUSTER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Total Collections", val: totals.all, icon: Boxes, color: "#C8A97E" },
          { label: "Primary Collections", val: totals.product, icon: Package, color: "#C8A97E" },
          { label: "Sub-Collections", val: totals.portfolio, icon: Layout, color: "#C8A97E" },
          { label: "News Archives", val: totals.blog, icon: FileText, color: "#C8A97E" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-[#C8A97E]/30 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">
                {stat.label}
              </span>
              <stat.icon
                size={16}
                className="text-[#C8A97E] opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
            </div>
            <div className="text-4xl font-bold text-white tracking-widest font-heading">
              {stat.val}
            </div>
          </div>
        ))}
      </section>

      {/* INLINE EDITOR FORM */}
      {showForm && (
        <section className="bg-[#0A0A0A] border-l-4 border-[#C8A97E] p-10 space-y-12 shadow-2xl rounded-r-[2rem] animate-in slide-in-from-top-6 duration-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A97E]/5 rotate-45 translate-x-32 -translate-y-32" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-[#C8A97E]/5 border border-[#C8A97E]/20 rounded-2xl flex items-center justify-center text-[#C8A97E] shadow-inner">
                <Tag size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
                  {editingId ? "Refine" : "Create"} <span className="text-[#C8A97E]">Collection</span>
                </h3>
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">
                  Define bespoke product grouping for boutique navigation.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="h-12 w-12 rounded-full bg-white/5 border border-white/10 text-white/20 hover:text-white transition-all flex items-center justify-center"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Collection Signature</label>
                <input
                  placeholder="e.g. VINTAGE RESERVES"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Digital Path (Slug)</label>
                <input
                  placeholder="vintage-reserves"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] font-medium text-[#C8A97E] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Archive Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as CategoryType,
                    }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] font-bold text-white uppercase tracking-widest focus:border-[#C8A97E]/30 outline-none appearance-none cursor-pointer"
                >
                  <option value="product">Product Category</option>
                  <option value="portfolio">Visual Collection</option>
                  <option value="blog">Store News</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Hierarchical Parent</label>
                <select
                  value={form.parentId || "none"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      parentId:
                        e.target.value === "none" ? null : e.target.value,
                    }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] font-bold text-white uppercase tracking-widest focus:border-[#C8A97E]/30 outline-none appearance-none cursor-pointer"
                >
                  <option value="none">-- PRIMARY COLLECTION (ROOT) --</option>
                  {categories
                    .filter((c) => c.type === form.type && c._id !== editingId)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name || c.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Visibility Status</label>
                <select
                  value={form.pageStatus}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, pageStatus: e.target.value }))
                  }
                  className="w-full h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] font-bold text-white uppercase tracking-widest focus:border-[#C8A97E]/30 outline-none appearance-none cursor-pointer"
                >
                  <option value="published">Visible</option>
                  <option value="draft">Hidden</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-widest pl-2">Cover Asset</label>
                <div className="flex gap-4">
                  <input
                    placeholder="SECURE ASSET URL"
                    value={form.bannerImageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: e.target.value,
                      }))
                    }
                    className="flex-1 h-14 bg-[#050505] border border-white/5 rounded-2xl px-6 text-[14px] text-white focus:border-[#C8A97E]/30 outline-none transition-all"
                  />
                  <MediaLibraryModal
                    onSelect={(media) =>
                      setForm((prev) => ({
                        ...prev,
                        bannerImageUrl: media.url,
                      }))
                    }
                    trigger={
                      <button
                        type="button"
                        className="h-14 w-14 rounded-2xl bg-[#C8A97E]/10 border border-[#C8A97E]/30 text-[#C8A97E] hover:bg-[#C8A97E] hover:text-black flex items-center justify-center transition-all duration-500 shadow-lg shadow-[#C8A97E]/10"
                      >
                        <ImageIcon size={22} />
                      </button>
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-5 pt-10 border-t border-white/10">
              <button
                type="button"
                onClick={resetForm}
                className="h-14 px-10 bg-white/5 border border-white/5 text-white/30 text-[11px] font-bold uppercase tracking-widest rounded-full hover:text-white transition-all flex items-center gap-3"
              >
                Abort Changes
              </button>
              <button
                type="submit"
                disabled={saving}
                className="h-14 px-14 bg-[#C8A97E] text-black text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-white transition-all shadow-xl shadow-[#C8A97E]/20 flex items-center gap-4"
              >
                {saving ? (
                  <div className="h-5 w-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Save size={20} strokeWidth={2.5} />
                )}
                {editingId ? "Authorize Update" : "Establish Collection"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* REFINED FILTER & SEARCH */}
      <section className="flex flex-col lg:flex-row items-center gap-8 bg-[#0A0A0A] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 px-2">
          {(["", "product", "portfolio", "blog"] as const).map((type) => (
            <button
              key={type || "all"}
              onClick={() => setTypeFilter(type)}
              className={cn(
                "px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 whitespace-nowrap border",
                typeFilter === type
                  ? "bg-[#C8A97E] text-black border-[#C8A97E] shadow-lg shadow-[#C8A97E]/20"
                  : "bg-white/5 border-white/5 text-white/30 hover:text-white hover:border-white/20"
              )}
            >
              {type || "Unified Taxonomy"}
            </button>
          ))}
        </div>

        <div className="relative flex-1 w-full group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C8A97E] transition-colors"
            size={18}
          />
          <input
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-14 pr-6 bg-[#050505] border border-white/5 rounded-[1.5rem] text-[14px] text-white placeholder:text-white/20 focus:border-[#C8A97E]/30 outline-none transition-all"
          />
        </div>
      </section>

      {/* DATA TABLE */}
      <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="hover:bg-transparent border-none h-20">
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Category Structure
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Status
              </TableHead>
              <TableHead className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                Items
              </TableHead>
              <TableHead className="text-right text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 px-10">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-96 text-center">
                   <div className="flex flex-col items-center gap-6">
                      <div className="h-12 w-12 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-lg shadow-[#C8A97E]/10" />
                      <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 animate-pulse">
                        Curating Collections...
                      </span>
                   </div>
                </TableCell>
              </TableRow>
            ) : tree.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4} className="h-96 text-center p-12">
                   <div className="flex flex-col items-center gap-8 opacity-20">
                      <FolderTree size={64} strokeWidth={1} />
                      <span className="text-lg font-heading font-medium text-white/50">No collections found in this section</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : (
              renderRows(tree)
            )}
          </TableBody>
        </Table>
      </section>

      {/* FOOTER INTEL */}
      <div className="flex items-center gap-4 text-white/10 px-6">
        <Globe size={16} />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">
          Store Admin Access | Taxonomy Synchronization: Stable
        </span>
      </div>

      <TacticalImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImport}
        sampleData={categorySampleData}
        title="Boutique Collection Injection"
        description="Synchronize bulk brand archives via secure digital manifest."
        fileName="categories"
      />
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      <Suspense
        fallback={
          <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
            <div className="h-16 w-16 border-2 border-[#C8A97E]/10 border-t-[#C8A97E] rounded-full animate-spin shadow-2xl shadow-[#C8A97E]/10" />
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#C8A97E]/40 italic animate-pulse">
              Initializing Category Hub...
            </span>
          </div>
        }
      >
        <CategoriesPageContent />
      </Suspense>
    </div>
  );
}
