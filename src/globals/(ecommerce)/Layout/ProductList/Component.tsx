import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getShopLayoutData } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";
import {
  type Product,
  type ProductCategory,
  type ProductSubCategory,
} from "@/types/cms";

import { None } from "./variants/filters/None";
import { WithSidebar } from "./variants/filters/WithSidebar/WithSidebar";
import { WithInlinePrice } from "./variants/listings/WithInlinePrice";
import { HeroSection } from "@/frontendComponents/About/Nutrition/Hero";

export const ProductList = async ({
  allProducts,
  filteredProducts,
  title,
  category,
  subcategory,
  searchParams,
}: {
  allProducts: Product[];
  filteredProducts: Product[];
  title: string;
  category?: ProductCategory;
  subcategory?: ProductSubCategory;
  searchParams: {
    size: string[];
    color: string[];
    sortBy: string;
  };
}) => {
  try {
    const locale = (await getLocale()) as Locale;
    const { productList } = await getShopLayoutData(locale);
 
    let ProductDetailsComponent: typeof WithSidebar | typeof None = None;
    switch (productList?.filters) {
      case "withSidebar":
        ProductDetailsComponent = WithSidebar;
        break;
      default:
        ProductDetailsComponent = None;
    }

    return (
      <div>
        {(category ||
          (subcategory && typeof subcategory.category !== "string")) && (
          <HeroSection
            category={subcategory && typeof subcategory.category !== "string" ? subcategory?.category ?? undefined : category ?? undefined}
            subcategory={subcategory && subcategory}
          />
        )}
        {/* {category && <ListingBreadcrumbs category={category} />}
        {subcategory && typeof subcategory.category !== "string" && (
          <ListingBreadcrumbs
            category={subcategory.category}
            subcategory={subcategory}
          />
        )} */}
        <ProductDetailsComponent
          products={allProducts}
          title={title}
          category={category ?? undefined}
          searchParams={searchParams}
        >
          <WithInlinePrice products={filteredProducts} />
        </ProductDetailsComponent>
      </div>
    );
  } catch (error) {
    // console.log(error);
    return notFound();
  }
};
