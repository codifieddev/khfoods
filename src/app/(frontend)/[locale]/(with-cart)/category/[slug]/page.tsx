import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getStorefrontCategoryListing } from "@/data/storefront/ecommerce";
import { ProductList } from "@/globals/(ecommerce)/Layout/ProductList/Component";
import { type Locale } from "@/i18n/config";

const CategoryPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  try {
    const locale = (await getLocale()) as Locale;
    const { slug } = await params;
    const { color, size, sortBy } = await searchParams;

    const colorArr = color ? color.split(",") : [];
    const sizeArr = size ? size.split(",") : [];
    const { allProducts, category, filteredProducts } = await getStorefrontCategoryListing({
      color: colorArr,
      locale,
      size: sizeArr,
      slug,
      sortBy,
    });

    if (!category) {
      notFound();
    }

    return (
      <ProductList
        allProducts={allProducts}
        filteredProducts={filteredProducts}
        title={category.title}
        category={category}
        searchParams={{
          color: colorArr,
          size: sizeArr,
          sortBy: sortBy ?? "most-popular"
        }}
      />
    );
  } catch (error) {
    console.log(error);
    notFound();
  }
};

export default CategoryPage;
