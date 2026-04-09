import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminCustomerForm } from "@/components/admin-next/AdminCustomerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminCustomerById } from "@/data/admin/customers";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { formatPrice } from "@/utilities/formatPrices";

const CustomerAdminDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const customerData = await getAdminCustomerById({ id });

  if (!customerData) {
    notFound();
  }

  const { customer, orders, summary } = customerData;
  const isLocked =
    typeof customer.lockUntil === "string" && new Date(customer.lockUntil).getTime() > Date.now();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Customers</p>
            <h1 className="text-3xl font-semibold text-slate-900">{customer.fullName || customer.email}</h1>
            <p className="text-sm text-slate-600">
              Customer account details, addresses, and recent orders in the new admin shell.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/admin/customers">
              Back to customers
            </Link>
            <span className="text-sm text-slate-500">Legacy Payload editor removed from the live admin path.</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Account status and basic profile information.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Email</p>
                  <p className="mt-1 text-slate-900">{customer.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Verification</p>
                  <p className="mt-1 text-slate-900">{customer._verified === false ? "Unverified" : "Verified"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Account State</p>
                  <p className="mt-1 text-slate-900">{isLocked ? "Locked" : "Active"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Last Buyer Type</p>
                  <p className="mt-1 capitalize text-slate-900">{customer.lastBuyerType ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Orders</p>
                  <p className="mt-1 text-slate-900">{summary.orderCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
                  <p className="mt-1 text-slate-900">{customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Addresses</CardTitle>
                <CardDescription>Saved delivery addresses for this customer.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.shippings?.length ? (
                  customer.shippings.map((shipping) => (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700" key={shipping.id ?? shipping.name}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">{shipping.name}</p>
                        {shipping.default ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">Default</span>
                        ) : null}
                      </div>
                      <p>{shipping.address}</p>
                      <p>
                        {shipping.city}, {shipping.region} {shipping.postalCode}
                      </p>
                      <p className="uppercase">{shipping.country}</p>
                      <p>{shipping.phone}</p>
                      {shipping.email ? <p>{shipping.email}</p> : null}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No shipping addresses saved.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Orders placed by this customer.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Link className="font-medium text-slate-900 underline-offset-4 hover:underline" href={`/admin/orders/${order.id}`}>
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell className="capitalize">{order.status}</TableCell>
                        <TableCell>{formatPrice(order.totalWithShipping, order.currency, "en")}</TableCell>
                        <TableCell>{order.trackingNumber ?? "-"}</TableCell>
                        <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell className="text-center text-slate-500" colSpan={5}>
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Edit</CardTitle>
                <CardDescription>Safe account fields we can manage outside the legacy editor.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminCustomerForm
                  id={customer.id}
                  initialBirthDate={customer.birthDate}
                  initialEmail={customer.email}
                  initialFirstName={customer.firstName}
                  initialIsLocked={isLocked}
                  initialIsVerified={customer._verified !== false}
                  initialLastBuyerType={customer.lastBuyerType}
                  initialLastName={customer.lastName}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Migration Boundary</CardTitle>
                <CardDescription>What still needs a dedicated Next.js admin flow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Still pending: full shipping-address editing workflows, password recovery edge cases, and future auth-specific admin tools.</p>
                <p>This page focuses on the daily support flow: identify the customer, review addresses, and check order history quickly.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CustomerAdminDetailPage;
