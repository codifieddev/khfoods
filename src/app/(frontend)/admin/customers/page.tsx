import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCustomers } from "@/data/admin/customers";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";

const CustomersAdminPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  const { q, status } = await searchParams;
  const customers = await getAdminCustomers({
    query: q,
    status,
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Customers</p>
            <h1 className="text-3xl font-semibold text-slate-900">Customers</h1>
            <p className="text-sm text-slate-600">
              Customer list and account review now run through the new Mongo-backed admin shell.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/admin">
              Back to dashboard
            </Link>
            <span className="text-sm text-slate-500">Customer admin is now handled here in the Next.js shell.</span>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>
              {status && status !== "all" ? `Filtered by status: ${status}` : "Showing the latest updated customers."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/admin/customers" className="mb-6 flex flex-col gap-3 sm:flex-row">
              <input
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm sm:max-w-sm"
                defaultValue={q ?? ""}
                name="q"
                placeholder="Search by name or email..."
              />
              <input type="hidden" name="status" value={status ?? "all"} />
              <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" type="submit">
                Search
              </button>
            </form>

            <div className="mb-6 flex flex-wrap gap-2">
              {["all", "verified", "unverified", "locked"].map((item) => (
                <Link
                  className={`rounded-full border px-3 py-1 text-sm ${
                    (status ?? "all") === item
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                  href={
                    item === "all"
                      ? q
                        ? `/admin/customers?q=${encodeURIComponent(q)}`
                        : "/admin/customers"
                      : `/admin/customers?status=${item}${q ? `&q=${encodeURIComponent(q)}` : ""}`
                  }
                  key={item}
                >
                  {item}
                </Link>
              ))}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Buyer Type</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href={`/admin/customers/${customer.id}`}>
                        {customer.fullName}
                      </Link>
                      <div className="text-xs text-slate-500">{customer.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize text-slate-900">{customer.isVerified ? "verified" : "unverified"}</div>
                      <div className="text-xs text-slate-500">{customer.isLocked ? "Locked" : "Active"}</div>
                    </TableCell>
                    <TableCell className="capitalize">{customer.lastBuyerType ?? "-"}</TableCell>
                    <TableCell>{customer.orderCount}</TableCell>
                    <TableCell>{customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                ))}
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center text-slate-500" colSpan={5}>
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default CustomersAdminPage;
