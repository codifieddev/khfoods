"use client";

import Link from "next/link";
import { format } from "date-fns";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, FileText, Globe, ArrowUpRight, Copy, Trash2, Edit3 } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { BaseEntity } from "@/lib/admin-repository";

type AdminColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

export type PageRow = BaseEntity & {
  title?: string | Record<string, string> | null;
  slug?: string | null;
  layout?: unknown[] | null;
  _status?: string | null;
};

interface PagesClientProps {
  pages: PageRow[];
}

export function PagesClient({ pages }: PagesClientProps) {
  const columns: AdminColumnDef<PageRow, unknown>[] = [
    {
      id: "search",
      accessorFn: (row) => `${typeof row.title === "string" ? row.title : row.title?.en ?? ""} ${row.slug ?? ""}`.trim(),
      header: "Search",
      cell: () => null,
      meta: { hidden: true },
    },
    {
      accessorKey: "title",
      header: "Page Identity",
      cell: ({ row }) => {
        const page = row.original;
        const locale = "en";
        const title = typeof page.title === "object" && page.title ? page.title[locale] : page.title;

        return (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-primary shadow-lg shadow-slate-900/10">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                {title || "Untitled page"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">/{page.slug || "home"}</span>
                <div className="h-2 w-2 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Static Component</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "layout",
      header: "Layout Structure",
      cell: ({ row }) => {
        const layout = row.original.layout || [];

        return (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(layout.length, 3) }).map((_, index) => (
                <div key={index} className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-white bg-slate-100 text-[10px] font-bold uppercase text-slate-500">
                  B
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">{layout.length} Blocks</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original._status || "draft";

        return (
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full ring-2 ring-white", status === "published" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-slate-300 shadow-sm")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", status === "published" ? "text-emerald-600" : "text-slate-400")}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Modified",
      cell: ({ row }) => {
        const date = row.original.updatedAt;

        return (
          <span className="text-sm font-bold uppercase tracking-tight text-slate-500">
            {date ? format(new Date(date), "MMM d, h:mm a") : "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Operations",
      cell: () => {
        return (
          <div className="flex items-center gap-3">
            <Button variant="ghost" title="Edit Content" className="h-10 w-10 rounded-xl p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
              <Edit3 className="h-4.5 w-4.5" />
            </Button>
            <Button variant="ghost" title="Duplicate Page" className="h-10 w-10 rounded-xl p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
              <Copy className="h-4.5 w-4.5" />
            </Button>
            <Button variant="ghost" title="Delete Permanent" className="h-10 w-10 rounded-xl p-0 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="h-4.5 w-4.5" />
            </Button>
            <div className="mx-1 h-6 w-px bg-slate-100" />
            <Button variant="ghost" title="Visit Live" className="h-10 w-10 rounded-xl p-0 text-slate-400 transition-all hover:bg-slate-900 hover:text-primary">
              <Globe className="h-4.5 w-4.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Content Experience
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Site Architecture</h1>
          <p className="max-w-lg font-medium text-slate-500">
            Build and manage localized marketing pages, informative content structures, and dynamic storefront layouts from a unified visual interface.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            Drafts Hub
          </Button>
          <Link
            href="/admin/pages/new"
            className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-1px] active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create New Page
          </Link>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          columns={columns}
          data={pages}
          searchKey="search"
          searchLabel="pages"
          emptyMessage="No pages found."
        />
      </section>

      <section className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-300">
          <ArrowUpRight className="h-8 w-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">Advanced Component Library</h4>
          <p className="mt-1 max-w-sm text-sm font-semibold text-slate-500">
            Our native CMS engine supports 24+ high-conversion blocks for building landing pages that wow.
          </p>
        </div>
        <Button variant="link" className="group font-bold text-primary">
          Explore Documentation <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Button>
      </section>
    </div>
  );
}
