"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { Plus, Settings2, Edit, Trash2, ListTree, GripVertical } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import type { BaseEntity } from "@/lib/admin-repository";

type AdminColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

export type AttributeSetRow = BaseEntity & {
  name?: string | null;
  attributes?: Array<{
    label?: string | null;
    type?: string | null;
  }> | null;
};

interface AttributesClientProps {
  attributeSets: AttributeSetRow[];
}

export function AttributesClient({ attributeSets }: AttributesClientProps) {
  const columns: AdminColumnDef<AttributeSetRow, unknown>[] = [
    {
      id: "search",
      accessorFn: (row) => `${row.name ?? ""}`.trim(),
      header: "Search",
      cell: () => null,
      meta: { hidden: true },
    },
    {
      accessorKey: "name",
      header: "Attribute Set Name",
      cell: ({ row }) => {
        const set = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-primary shadow-lg shadow-slate-900/10">
              <Settings2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                {set.name || "Untitled set"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Total Fields: {set.attributes?.length || 0}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "attributes",
      header: "Schema Composition",
      cell: ({ row }) => {
        const attributes = row.original.attributes || [];

        return (
          <div className="flex max-w-md flex-wrap gap-2">
            {attributes.length > 0 ? (
              attributes.slice(0, 3).map((attr, index) => (
                <span key={`${attr.label ?? "attr"}-${index}`} className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-slate-600">
                  {attr.label || "Field"} ({attr.type || "text"})
                </span>
              ))
            ) : (
              <span className="text-[11px] font-bold italic text-slate-400">No attributes defined yet</span>
            )}
            {attributes.length > 3 && (
              <span className="text-[10px] font-bold text-primary">+{attributes.length - 3} More</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "usage",
      header: "Linked Products",
      cell: () => (
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-700">12 Products</span>
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Last Sync",
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return (
          <span className="text-sm font-bold text-slate-500">
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100">
              <Edit className="h-5 w-5 text-slate-400 transition-colors hover:text-primary" />
            </Button>
            <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-rose-50">
              <Trash2 className="h-5 w-5 text-slate-400 transition-colors hover:text-rose-600" />
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
            Dynamic Schema Engine
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Attribute Specification</h1>
          <p className="max-w-lg font-medium text-slate-500">
            Build universal product schemas for any industry. Define field types, validation rules, and specialized variants dynamically.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 gap-2 rounded-xl border-slate-200 px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <ListTree className="h-5 w-5" />
            Manage Categories
          </Button>
          <Link
            href="/admin/attributes/new"
            className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-2px] hover:shadow-slate-900/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create Attribute Set
          </Link>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          columns={columns}
          data={attributeSets}
          searchKey="search"
          searchLabel="attribute sets"
          emptyMessage="No attribute sets found."
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-100">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-tight text-slate-900">Flexible Architectures</h4>
            <p className="text-xs font-semibold leading-relaxed text-slate-500">
              Unlike legacy systems, this engine allows you to swap product specification schemas on the fly. Whether you sell food items or high-end electronics, the UI adapts to your attribute sets.
            </p>
          </div>
        </div>
        <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm ring-1 ring-slate-100">
            <Settings2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold uppercase tracking-tight text-slate-900">Variant Inheritance</h4>
            <p className="text-xs font-semibold leading-relaxed text-slate-500">
              Attributes marked as "Variant-Capable" will automatically generate variant selectors in the product editor. Optimized for fast-moving inventory with complex sizing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
