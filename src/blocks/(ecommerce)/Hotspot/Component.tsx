import { getLocale } from "next-intl/server";
import { type ReactNode } from "react";

import {
  paddingBottomClasses,
  paddingTopClasses,
  spacingBottomClasses,
  spacingTopClasses
} from "@/blocks/globals";
import RichText from "@/components/RichText";
import { getHotspotProducts } from "@/data/storefront/ecommerce";
import { WithInlinePrice } from "@/globals/(ecommerce)/Layout/ProductList/variants/listings/WithInlinePrice";
import { type Locale } from "@/i18n/config";
import { type Product } from "@/types/cms";
import { cn } from "@/utilities/cn";

// Define HotspotBlock interface locally since it's not in payload-types
interface HotspotBlockProps {
  blockType?: string;
  appearance?: string;
  type?: string;
  title?: any;
  products?: any[];
  enableLiveSearch?: boolean;
  categories?: any[];
  populateBy?: string;
  relationTo?: string;
  margin?: any;
  padding?: any;
  className?: string;
  category?: any;
  limit?: number;
  paddingBottom?: string;
  paddingTop?: string;
  spacingBottom?: string;
  spacingTop?: string;
  subcategory?: any;
  sort?: string;
}

import { WithInlinePriceSlider } from "./variants/WithInlinePriceSlider";

export const HotspotBlock = async ({
  appearance,
  type,
  category,
  limit,
  paddingBottom,
  paddingTop,
  spacingBottom,
  spacingTop,
  subcategory,
  title,
  sort,
  products
}: HotspotBlockProps) => {
  const locale = (await getLocale()) as Locale;
  let productsToShow: Product[] = [];

  switch (type) {
    case "category": {
      productsToShow = await getHotspotProducts({
        categoryId: typeof category === "string" ? category : category?.id,
        limit: limit ?? 4,
        locale,
        sortBy: sort,
      });
      break;
    }
    case "subcategory": {
      productsToShow = await getHotspotProducts({
        limit: limit ?? 4,
        locale,
        sortBy: sort,
        subcategoryId: typeof subcategory === "string" ? subcategory : subcategory?.id,
      });
      break;
    }
    case "manual": {
      productsToShow = products?.every((product) => typeof product !== "string") ? products : [];
      break;
    }
  }

  let HotspotComponent: ReactNode | null = null;

  switch (appearance) {
    case "default": {
      HotspotComponent = (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          <WithInlinePrice products={productsToShow} />;
        </div>
      );
      break;
    }
    case "slider": {
      HotspotComponent = <WithInlinePriceSlider products={productsToShow} />;
      break;
    }
    case "sliderLoop": {
      HotspotComponent = <WithInlinePriceSlider opts={{ loop: true }} products={productsToShow} />;
      break;
    }
  }

  return (
    <section
      className={cn(
        "container",
        spacingTopClasses[spacingTop ?? "medium"],
        spacingBottomClasses[spacingBottom ?? "medium"],
        paddingTopClasses[paddingTop ?? "medium"],
        paddingBottomClasses[paddingBottom ?? "medium"],
      )}
    >
      {title && <RichText data={title} className="mb-6" />}
      {HotspotComponent}
    </section>
  );
};


