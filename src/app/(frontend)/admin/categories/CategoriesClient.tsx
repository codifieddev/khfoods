"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Tags, Layers, FolderTree, ArrowRight, Settings } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import type { BaseEntity } from "@/lib/admin-repository";

type AdminColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

export type CategoryRow = BaseEntity & {
  name?: string | null;
  slug?: string | null;
  parentId?: string | null;
  _productCount?: number | null;
};

interface CategoriesClientProps {
  categories: CategoryRow[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const columns: AdminColumnDef<CategoryRow, unknown>[] = [
    {
      id: "search",
      accessorFn: (row) => `${row.name ?? ""} ${row.slug ?? ""}`.trim(),
      header: "Search",
      cell: () => null,
      meta: { hidden: true },
    },
    {
      accessorKey: "name",
      header: "Category Hierarchy",
      cell: ({ row }) => {
        const category = row.original;
        const isChild = !!category.parentId;

        return (
          <div className={cn("flex items-center gap-4 transition-transform duration-200 hover:translate-x-1", isChild && "ml-12")}>
            {isChild ? (
              <div className="flex items-center gap-2">
                <div className="h-6 w-px bg-slate-200" />
                <div className="h-px w-4 bg-slate-200" />
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-400">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/50 bg-primary text-slate-900 shadow-lg shadow-primary/10">
                <Tags className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className={cn("line-clamp-1 text-sm font-bold tracking-tight text-slate-900", !isChild && "text-base tracking-normal uppercase")}>
                {category.name || "Untitled category"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Slug: {category.slug || "auto-generated"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "products",
      header: "Linked Elements",
      cell: ({ row }) => {
        const count = row.original._productCount || 0;

        return (
          <div className="flex items-center gap-2">
            <span className="rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-1 text-xs font-bold text-slate-600">
              {count} Products
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Update",
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return (
          <span className="text-sm font-bold uppercase tracking-tight text-slate-500">
            {date ? new Date(date).toLocaleDateString() : "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => {
        return (
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-10 rounded-xl border border-transparent px-3 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100">
                  <Settings className="h-5 w-5 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 p-2 shadow-2xl">
                <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-slate-50">
                  Add Subcategory
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-slate-50">
                  Move Category
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-xl px-4 py-3 text-sm font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            Catalog Hierarchy
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Categories Management</h1>
          <p className="max-w-lg font-medium text-slate-500">
            Manage your storefront's organizational structure with nested, multi-level category trees. Optimized for deep taxonomy hierarchies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 gap-2 rounded-xl border-slate-200 px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <FolderTree className="h-5 w-5" />
            Reorder Tree
          </Button>
          <Link
            href="/admin/categories/new"
            className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-2px] hover:shadow-slate-900/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Category
          </Link>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          columns={columns}
          data={categories}
          searchKey="search"
          searchLabel="categories"
          emptyMessage="No categories found."
        />
      </section>

      <section className="flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Main Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border border-slate-200 bg-slate-100" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Sub-category</span>
        </div>
        <Link href="/admin/attributes" className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-900 transition-all hover:underline">
          Manage Attributes <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
