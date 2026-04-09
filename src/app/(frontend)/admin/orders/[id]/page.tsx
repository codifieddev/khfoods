import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminOrderActions } from "@/components/admin-next/AdminOrderActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminOrderById } from "@/data/admin/orders";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { formatPrice } from "@/utilities/formatPrices";

const OrderAdminDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const orderData = await getAdminOrderById({ id });

  if (!orderData) {
    notFound();
  }

  const { order, products } = orderData;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Orders</p>
            <h1 className="text-3xl font-semibold text-slate-900">Order {order.id}</h1>
            <p className="text-sm text-slate-600">
              Direct Mongo-backed order detail with update actions in the new admin shell.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/admin/orders">
              Back to orders
            </Link>
            <span className="text-sm text-slate-500">Legacy Payload editor removed from the live admin path.</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>High-level order information.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                  <p className="mt-1 capitalize text-slate-900">{order.orderDetails.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Total</p>
                  <p className="mt-1 text-slate-900">
                    {formatPrice(order.orderDetails.totalWithShipping, order.orderDetails.currency, "en")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Customer Email</p>
                  <p className="mt-1 text-slate-900">{order.shippingAddress?.email ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Transaction ID</p>
                  <p className="mt-1 text-slate-900">{order.orderDetails.transactionID ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Tracking Number</p>
                  <p className="mt-1 text-slate-900">{order.orderDetails.trackingNumber ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
                  <p className="mt-1 text-slate-900">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Products captured in the order.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Variant</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id ?? `${product.productName}-${product.variantSlug ?? "base"}`}>
                        <TableCell>
                          <div className="font-medium text-slate-900">{product.productName ?? product.productDoc?.title ?? "Product"}</div>
                          {product.productDoc?.slug ? (
                            <div className="text-xs text-slate-500">{product.productDoc.slug}</div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {product.variantSlug ?? ([product.color, product.size].filter(Boolean).join(" / ") || "-")}
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {typeof product.price === "number"
                            ? formatPrice(product.price, order.orderDetails.currency, "en")
                            : "-"}
                        </TableCell>
                        <TableCell>{formatPrice(product.priceTotal ?? 0, order.orderDetails.currency, "en")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Delivery details for this order.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-700">
                <p>{order.shippingAddress?.name ?? "-"}</p>
                <p>{order.shippingAddress?.address ?? "-"}</p>
                <p>
                  {order.shippingAddress?.city ?? "-"}, {order.shippingAddress?.region ?? "-"} {order.shippingAddress?.postalCode ?? "-"}
                </p>
                <p className="uppercase">{order.shippingAddress?.country ?? "-"}</p>
                <p>{order.shippingAddress?.email ?? "-"}</p>
                <p>{order.shippingAddress?.phone ?? "-"}</p>
                {order.shippingAddress?.pickupPointID ? <p>Pickup Point: {order.shippingAddress.pickupPointID}</p> : null}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Update order status and metadata.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOrderActions
                  id={order.id}
                  initialNote={order.orderDetails.orderNote}
                  initialShippingDate={order.orderDetails.shippingDate}
                  initialStatus={order.orderDetails.status}
                  initialTrackingNumber={order.orderDetails.trackingNumber}
                  labelUrl={order.printLabel?.labelurl}
                />
              </CardContent>
            </Card>

            {order.invoice ? (
              <Card>
                <CardHeader>
                  <CardTitle>Invoice</CardTitle>
                  <CardDescription>Billing details saved with the order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                  <p>{order.invoice.name ?? "-"}</p>
                  <p>{order.invoice.address ?? "-"}</p>
                  <p>
                    {order.invoice.city ?? "-"}, {order.invoice.region ?? "-"} {order.invoice.postalCode ?? "-"}
                  </p>
                  <p className="uppercase">{order.invoice.country ?? "-"}</p>
                  {order.invoice.tin ? <p>TIN: {order.invoice.tin}</p> : null}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrderAdminDetailPage;
