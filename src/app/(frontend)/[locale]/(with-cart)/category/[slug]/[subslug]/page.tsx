import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { getStorefrontSubcategoryListing } from "@/data/storefront/ecommerce";
import { ProductList } from "@/globals/(ecommerce)/Layout/ProductList/Component";
import { type Locale } from "@/i18n/config";

const SubcategoryPage = async ({
  params,
  searchParams
}: {
  params: Promise<{ slug: string; subslug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) => {
  try {
    const locale = (await getLocale()) as Locale;
    const { color, size, sortBy } = await searchParams;
    const { subslug } = await params;

    const colorArr = color ? color.split(",") : [];
    const sizeArr = size ? size.split(",") : [];
    const { allProducts, category, filteredProducts, subcategory } = await getStorefrontSubcategoryListing({
      color: colorArr,
      locale,
      size: sizeArr,
      slug: subslug,
      sortBy,
    });

    if (!subcategory || !category) {
      notFound();
    }

    return (
      <ProductList
        allProducts={allProducts}
        filteredProducts={filteredProducts}
        title={subcategory.title}
        category={category}
        subcategory={subcategory}
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

export default SubcategoryPage;
