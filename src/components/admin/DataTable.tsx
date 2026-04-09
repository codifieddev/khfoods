"use client";

import {
  flexRender, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel, 
  useReactTable, 
  type ColumnDef, 
  type SortingState, 
  type ColumnFiltersState, 
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type TableColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  meta?: {
    hidden?: boolean;
  };
};

interface DataTableProps<TData, TValue> {
  columns: TableColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  searchLabel?: string;
  emptyMessage?: string;
}

const getColumnId = <TData, TValue>(column: TableColumnDef<TData, TValue>) => {
  if (typeof column.id === "string") {
    return column.id;
  }

  if (typeof column.accessorKey === "string") {
    return column.accessorKey;
  }

  return undefined;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchLabel,
  emptyMessage = "No records found in this view.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    return columns.reduce<VisibilityState>((acc, column) => {
      const columnId = getColumnId(column);
      if (columnId && column.meta?.hidden) {
        acc[columnId] = false;
      }
      return acc;
    }, {});
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="space-y-6">
      {/* Table Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${searchLabel ?? searchKey}...`}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="pl-10 h-11 rounded-xl border-slate-200 bg-white font-medium shadow-sm focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 gap-2 font-bold px-4 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
          <span>Sort By:</span>
          <Button variant="ghost" className="h-9 px-2 gap-1 font-bold text-slate-900">
            Last Updated <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <Table>
          <TableHeader className="bg-slate-50/50 border-b border-slate-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-14 font-bold text-slate-500 uppercase text-[11px] tracking-widest px-6 first:rounded-tl-2xl">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4 font-medium text-slate-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-48 text-center text-slate-400 font-bold italic">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm font-bold text-slate-500">
          {data.length === 0 ? (
            <>
              Showing <span className="text-slate-900">0</span> to <span className="text-slate-900">0</span> of <span className="text-slate-900">0</span> results
            </>
          ) : (
            <>
              Showing <span className="text-slate-900">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="text-slate-900">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)}</span> of <span className="text-slate-900">{data.length}</span> results
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-10 w-10 p-0 rounded-xl border-slate-200 transition-transform active:scale-90"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: table.getPageCount() }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => table.setPageIndex(idx)}
                className={cn(
                  "h-10 w-10 rounded-xl text-sm font-bold transition-all",
                  table.getState().pagination.pageIndex === idx 
                    ? "bg-slate-900 text-white shadow-lg" 
                    : "bg-white border border-slate-100 text-slate-600 hover:bg-slate-50"
                )}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-10 w-10 p-0 rounded-xl border-slate-200 transition-transform active:scale-90"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
