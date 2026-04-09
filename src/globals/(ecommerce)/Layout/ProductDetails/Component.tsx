import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import { getShopLayoutData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";
import type { Product } from "@/types/cms";

import { WithImageGalleryExpandableDetails } from "./variants/WithImageGalleryExpandableDetails";

import { ProductBreadcrumbs } from "../../../../components/(ecommerce)/ProductBreadcrumbs";

export const ProductDetails = async ({
  variant,
  product
}: {
  variant?: string;
  product: Product;
}) => {
  try {
    const locale = (await getLocale()) as Locale;
    const { productDetails } = await getShopLayoutData(locale);

    let ProductDetailsComponent: ReactNode = null;
    switch (productDetails.type) {
      case "WithImageGalleryExpandableDetails":
        ProductDetailsComponent = (
          <WithImageGalleryExpandableDetails
            variant={variant}
            productSettings={productDetails}
            product={product}
          />
        );
        break;
    }

    if (!ProductDetailsComponent) {
      notFound();
    }

    const primaryCategory =
      product.categoriesArr?.[0]?.category && typeof product.categoriesArr[0].category !== "string"
        ? product.categoriesArr[0].category
        : null;

    return (
      <>
        <section className="py-20 text-center">
          <p className="uppercase tracking-widest text-sm">
            PRODUCTS / {primaryCategory?.title ?? product.title}
          </p>

          <h1 className="text-5xl font-bold mt-4">
            {product.title}
          </h1>
        </section>

        <ProductBreadcrumbs product={product} />
        {ProductDetailsComponent}
      </>
    );
  } catch (error) {
    // console.log(error);
    notFound();
  }
};
