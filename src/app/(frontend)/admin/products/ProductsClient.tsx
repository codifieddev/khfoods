"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { 
  Plus, 
  Package, 
  FileDown, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/utilities/formatPrices";
import type { BaseEntity } from "@/lib/admin-repository";

type AdminColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

export type ProductRow = BaseEntity & {
  title?: string | null;
  sku?: string | null;
  price?: number | null;
  stock?: number | null;
  _status?: string | null;
  images?: Array<
    | {
        url?: string | null;
        thumbnailURL?: string | null;
      }
    | string
    | null
  > | null;
};

interface ProductsClientProps {
  products: ProductRow[];
}

export function ProductsClient({ products }: ProductsClientProps) {
  const columns: AdminColumnDef<ProductRow, unknown>[] = [
    {
      id: "search",
      accessorFn: (row) => `${row.title ?? ""} ${row.sku ?? ""}`.trim(),
      header: "Search",
      cell: () => null,
      meta: { hidden: true },
    },
    {
      accessorKey: "images",
      header: "Product",
      cell: ({ row }) => {
        const product = row.original;
        const mainImage = product.images?.[0];
        const imageUrl =
          typeof mainImage === "object" && mainImage
            ? mainImage.url || mainImage.thumbnailURL
            : null;

        return (
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-transform group-hover:scale-110">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={product.title || "Product"} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-300">
                  <Package className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                {product.title || "Untitled product"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                SKU: {product.sku || "N/A"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Categories",
      cell: () => {
        return (
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-500">
              Food
            </span>
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-primary">
              Organic
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.original.price || 0;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">
              {formatPrice(price, "USD", "en")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              Base Price
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Inventory",
      cell: ({ row }) => {
        const stock = row.original.stock || 0;

        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                stock > 10 ? "bg-emerald-500" : stock > 0 ? "bg-amber-500" : "bg-rose-500"
              )}
            />
            <span className="text-sm font-bold text-slate-700">{stock} In Stock</span>
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
          <span
            className={cn(
              "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
              status === "published"
                ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                : "border border-slate-200 bg-slate-100 text-slate-500"
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100">
                <MoreHorizontal className="h-5 w-5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 p-2 shadow-2xl">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-primary/10 focus:text-primary">
                <Eye className="h-4 w-4" />
                View On Storefront
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-slate-50">
                <Edit className="h-4 w-4" />
                Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                <Trash2 className="h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Catalog Management
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Products Inventory</h1>
          <p className="max-w-lg font-medium text-slate-500">
            Manage your entire product catalog, inventory levels, and publishing status from a unified dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 gap-2 rounded-xl border-slate-200 px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <FileDown className="h-5 w-5" />
            Export CSV
          </Button>
          <Link
            href="/admin/products/new"
            className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-2px] hover:shadow-slate-900/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          columns={columns}
          data={products}
          searchKey="search"
          searchLabel="products"
          emptyMessage="No products found."
        />
      </section>
    </div>
  );
}
