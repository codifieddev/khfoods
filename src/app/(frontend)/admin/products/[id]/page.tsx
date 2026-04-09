import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminProductForm } from "@/components/admin-next/AdminProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminProductById } from "@/data/admin/products";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import type { Media } from "@/types/cms";
import { formatPrice } from "@/utilities/formatPrices";

const ProductAdminDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const productData = await getAdminProductById({ id });

  if (!productData) {
    notFound();
  }

  const { product, summary } = productData;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Products</p>
            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
            <p className="text-sm text-slate-600">
              Core product fields are editable here. Rich content, media, and advanced variants still live in the legacy editor for now.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline" href="/admin/products">
              Back to products
            </Link>
            {product.slug ? (
              <Link
                className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline"
                href={`/product/${product.slug}`}
                target="_blank"
              >
                View storefront
              </Link>
            ) : null}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Key inventory and publishing information.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Status</p>
                  <p className="mt-1 capitalize text-slate-900">{product._status ?? "draft"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Slug</p>
                  <p className="mt-1 text-slate-900">{product.slug ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Inventory</p>
                  <p className="mt-1 text-slate-900">{summary.inventory}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Images</p>
                  <p className="mt-1 text-slate-900">{summary.imageCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Pricing</p>
                  <p className="mt-1 text-slate-900">
                    {summary.priceMin === null
                      ? "-"
                      : summary.priceMin === summary.priceMax
                        ? formatPrice(summary.priceMin, summary.priceCurrency, "en")
                        : `${formatPrice(summary.priceMin, summary.priceCurrency, "en")} - ${formatPrice(summary.priceMax ?? summary.priceMin, summary.priceCurrency, "en")}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Variants</p>
                  <p className="mt-1 text-slate-900">{summary.variantCount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Created</p>
                  <p className="mt-1 text-slate-900">{product.createdAt ? new Date(product.createdAt).toLocaleString() : "-"}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Updated</p>
                  <p className="mt-1 text-slate-900">{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog Placement</CardTitle>
                <CardDescription>Current category and subcategory relationships.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-700">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Categories</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.categoryTitles.length ? (
                      summary.categoryTitles.map((title) => (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700" key={title}>
                          {title}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">No categories assigned.</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Subcategories</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {summary.subcategoryTitles.length ? (
                      summary.subcategoryTitles.map((title) => (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700" key={title}>
                          {title}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">No subcategories assigned.</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>Current variant inventory and price snapshot.</CardDescription>
              </CardHeader>
              <CardContent>
                {product.variants?.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Pricing</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variants.map((variant) => {
                        const variantPrice = variant.pricing?.[0];

                        return (
                          <TableRow key={variant.id ?? variant.variantSlug ?? `${variant.color}-${variant.size}`}>
                            <TableCell>
                              {variant.variantSlug ?? ([variant.color, variant.size].filter(Boolean).join(" / ") || "Base")}
                            </TableCell>
                            <TableCell>{variant.stock}</TableCell>
                            <TableCell>{typeof variant.weight === "number" ? `${variant.weight} g` : "-"}</TableCell>
                            <TableCell>
                              {variantPrice && typeof variantPrice.value === "number"
                                ? formatPrice(variantPrice.value, variantPrice.currency, "en")
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-slate-500">This product does not use variants.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>Current uploaded images linked to this product.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {product.images?.length ? (
                  product.images.map((image, index) => {
                    const media = typeof image === "object" ? (image as Media) : null;
                    const imageUrl = media?.thumbnailURL || media?.url || null;

                    return (
                      <div className="rounded-2xl border border-slate-200 bg-white p-4" key={media?.id ?? `${image}-${index}`}>
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt={media?.alt ?? product.title} className="mb-3 h-40 w-full rounded-xl object-cover" src={imageUrl} />
                        ) : (
                          <div className="mb-3 flex h-40 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400">
                            No preview
                          </div>
                        )}
                        <p className="truncate text-sm font-medium text-slate-900">{media?.filename ?? `Image ${index + 1}`}</p>
                        <p className="text-xs text-slate-500">{media?.mimeType ?? "Media relation"}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-500">No images attached.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Edit</CardTitle>
                <CardDescription>Safe fields we can manage without the legacy Payload form.</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminProductForm
                  canEditStock={!product.enableVariants}
                  canEditWeight={!product.enableVariantWeights}
                  id={product.id}
                  initialHighlight={product.Highlight}
                  initialSlug={product.slug}
                  initialStatus={product._status}
                  initialStock={product.stock}
                  initialTitle={summary.titleEn || product.title}
                  initialWeight={product.weight}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Migration Boundary</CardTitle>
                <CardDescription>What still needs a dedicated Next.js admin flow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>Still pending: rich text descriptions, media uploads, category reassignment, option sets, and advanced variant pricing.</p>
                <p>This page stays focused on the fast day-to-day edits we already support in the new admin shell.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductAdminDetailPage;

