"use client";

import { format } from "date-fns";
import { type ColumnDef } from "@tanstack/react-table";
import {
  ExternalLink,
  MoreVertical,
  CreditCard,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/utilities/formatPrices";
import type { BaseEntity } from "@/lib/admin-repository";

type AdminColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

export type OrderRow = BaseEntity & {
  shippingAddress?: {
    name?: string | null;
    email?: string | null;
  } | null;
  orderDetails?: {
    totalWithShipping?: number | null;
    currency?: string | null;
    status?: string | null;
  } | null;
};

interface OrdersClientProps {
  orders: OrderRow[];
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const columns: AdminColumnDef<OrderRow, unknown>[] = [
    {
      id: "search",
      accessorFn: (row) =>
        `${row.id ?? ""} ${row.shippingAddress?.name ?? ""} ${row.shippingAddress?.email ?? ""}`.trim(),
      header: "Search",
      cell: () => null,
      meta: { hidden: true },
    },
    {
      accessorKey: "id",
      header: "Order Info",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-800 transition-all group-hover:bg-slate-200">
              #{String(order.id).slice(-6).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="line-clamp-1 text-sm font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary">
                {order.shippingAddress?.name || "Anonymous"}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {order.shippingAddress?.email || "No email"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        const date = row.original.createdAt;

        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">
              {date ? format(new Date(date), "MMM d, yyyy") : "-"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              {date ? format(new Date(date), "h:mm a") : "-"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "orderDetails",
      header: "Financials",
      cell: ({ row }) => {
        const order = row.original;
        const total = order.orderDetails?.totalWithShipping || 0;
        const currency = order.orderDetails?.currency || "USD";

        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">
              {formatPrice(total, currency, "en")}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight text-slate-400">
              <CreditCard className="h-3 w-3" /> Stripe
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Fulfillment Status",
      cell: ({ row }) => {
        const status = row.original.orderDetails?.status || "pending";

        return (
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
              status === "completed"
                ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                : status === "pending"
                  ? "border-amber-100 bg-amber-50 text-amber-600"
                  : "border-slate-100 bg-slate-50 text-slate-500"
            )}
          >
            {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
            {status === "pending" && <Clock className="h-3 w-3" />}
            {status === "shipping" && <Truck className="h-3 w-3" />}
            {status}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Management",
      cell: () => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="h-10 gap-2 rounded-xl border border-slate-100 px-3 font-bold text-slate-600 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white">
              Detail <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-100">
              <MoreVertical className="h-5 w-5 text-slate-300" />
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
            Order Operations
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Purchase Ledger</h1>
          <p className="max-w-lg font-medium text-slate-500">
            Monitor all customer transactions, track fulfillment progress, and manage refund request cycles from a centralized operation center.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-bold shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            Daily Report
          </Button>
          <Button className="h-12 rounded-xl bg-slate-900 px-8 font-bold text-white shadow-xl shadow-slate-900/10 hover:translate-y-[-1px] active:scale-95">
            Manage Refunds
          </Button>
        </div>
      </section>

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <DataTable
          columns={columns}
          data={orders}
          searchKey="search"
          searchLabel="orders"
          emptyMessage="No orders found."
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600 shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none text-slate-400">
              Awaiting Pickup
            </p>
            <p className="mt-1 text-lg font-bold leading-none text-slate-900">12 Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none text-slate-400">
              In Transit
            </p>
            <p className="mt-1 text-lg font-bold leading-none text-slate-900">4 Orders</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none text-slate-400">
              Delivered Today
            </p>
            <p className="mt-1 text-lg font-bold leading-none text-slate-900">28 Orders</p>
          </div>
        </div>
      </section>
    </div>
  );
}
