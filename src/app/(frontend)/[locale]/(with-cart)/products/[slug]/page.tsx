import React from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { type Locale } from "@/i18n/config";
import { getStorefrontProductBySlug } from "@/data/storefront/commerce";
import ProductPageClient from "./ProductPageClient";

import { type Metadata } from "next";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getStorefrontProductBySlug({ slug, locale });

  if (!product) return {};

  const ogImage = product.images?.[0];
  const imageUrl = typeof ogImage === "object" && ogImage !== null && "url" in ogImage ? ogImage.url : "";

  return {
    title: `${product.title} | KH Foods`,
    description: product.metaDescription || `Buy ${product.title} at KH Foods. Highest quality peanuts and more.`,
    openGraph: {
      title: product.title,
      description: product.metaDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await getStorefrontProductBySlug({ slug, locale });

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-20">
      <ProductPageClient product={product} />
    </main>
  );
}
