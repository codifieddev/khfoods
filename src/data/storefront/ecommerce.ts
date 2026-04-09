import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Product, ProductCategory, ProductSubCategory } from "@/types/cms";

type ProductFilterArgs = {
  color?: string[];
  size?: string[];
  sortBy?: string;
};

type CategoryListingArgs = ProductFilterArgs & {
  locale: Locale;
  slug: string;
};

type SubcategoryListingArgs = ProductFilterArgs & {
  locale: Locale;
  slug: string;
};

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const getRelationId = (value: unknown): string | null => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const relation = value as { id?: unknown; _id?: unknown };

    if (typeof relation.id === "string") {
      return relation.id;
    }

    if (typeof relation._id === "string") {
      return relation._id;
    }

    if (relation._id instanceof ObjectId) {
      return relation._id.toString();
    }
  }

  return null;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeProduct = async (rawProduct: Record<string, unknown>, locale: Locale) =>
  normalizeCollectionDocument("products", rawProduct, locale, 2) as Promise<Product>;

const normalizeCategory = async (rawCategory: Record<string, unknown>, locale: Locale) =>
  normalizeCollectionDocument("productCategories", rawCategory, locale, 1) as Promise<ProductCategory>;

const normalizeSubcategory = async (rawSubcategory: Record<string, unknown>, locale: Locale) =>
  normalizeCollectionDocument("productSubCategories", rawSubcategory, locale, 1) as Promise<ProductSubCategory>;

const getCategoryProductsQuery = (categoryId: string) => ({
  _status: "published",
  "categoriesArr.category": { $in: buildIdCandidates(categoryId) },
});

const getProductPriceValues = (product: Product) => {
  const basePrices =
    product.pricing
      ?.map((price) => price?.value)
      .filter((value): value is number => typeof value === "number") ?? [];

  const variantPrices =
    product.variants
      ?.flatMap((variant) => variant.pricing?.map((price) => price?.value) ?? [])
      .filter((value): value is number => typeof value === "number") ?? [];

  if (product.enableVariantPrices) {
    return variantPrices.length > 0 ? variantPrices : basePrices;
  }

  return basePrices.length > 0 ? basePrices : variantPrices;
};

const getComparablePrice = (product: Product, direction: "asc" | "desc") => {
  const prices = getProductPriceValues(product);

  if (prices.length === 0) {
    return direction === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  }

  return direction === "asc" ? Math.min(...prices) : Math.max(...prices);
};

const sortProducts = (products: Product[], sortBy?: string) => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "priceasc":
      return sortedProducts.sort(
        (left, right) => getComparablePrice(left, "asc") - getComparablePrice(right, "asc"),
      );
    case "pricedesc":
      return sortedProducts.sort(
        (left, right) => getComparablePrice(right, "desc") - getComparablePrice(left, "desc"),
      );
    case "newest":
      return sortedProducts.sort(
        (left, right) =>
          new Date(right.createdAt ?? new Date(0).toISOString()).getTime() -
          new Date(left.createdAt ?? new Date(0).toISOString()).getTime(),
      );
    default:
      return sortedProducts.sort((left, right) => (right.bought ?? 0) - (left.bought ?? 0));
  }
};

const mapHotspotSort = (sortBy?: string) => {
  switch (sortBy) {
    case "-createdAt":
      return "newest";
    case "createdAt":
      return "oldest";
    case "variants.pricing[0].value,pricing.value":
      return "priceasc";
    case "-variants.pricing[0].value,-pricing.value":
      return "pricedesc";
    default:
      return "most-popular";
  }
};

const matchesVariantFilters = (product: Product, filters: ProductFilterArgs) => {
  const selectedColors = filters.color ?? [];
  const selectedSizes = filters.size ?? [];

  if (selectedColors.length === 0 && selectedSizes.length === 0) {
    return true;
  }

  const variants = product.variants ?? [];

  if (variants.length === 0) {
    return false;
  }

  return variants.some((variant) => {
    const colorMatches = selectedColors.length === 0 || selectedColors.includes(variant.color ?? "");
    const sizeMatches = selectedSizes.length === 0 || selectedSizes.includes(variant.size ?? "");
    return colorMatches && sizeMatches;
  });
};

const attachCategorySubcategories = async (category: ProductCategory, locale: Locale) => {
  const db = await getMongoDb();
  const rawSubcategories = await db
    .collection("productSubCategories")
    .find({
      category: { $in: buildIdCandidates(category.id) },
    })
    .sort({ createdAt: 1 })
    .toArray();

  const subcategories = await Promise.all(
    rawSubcategories.map((rawSubcategory) =>
      normalizeCollectionDocument("productSubCategories", rawSubcategory as Record<string, unknown>, locale, 1),
    ),
  );

  return {
    ...category,
    subcategories: {
      docs: subcategories.filter(Boolean) as ProductSubCategory[],
      hasNextPage: false,
      totalDocs: subcategories.length,
    },
  } satisfies ProductCategory;
};

const getNormalizedProducts = async (
  query: Record<string, unknown>,
  locale: Locale,
): Promise<Product[]> => {
  const db = await getMongoDb();
  const rawProducts = await db.collection("products").find(query).toArray();

  return Promise.all(rawProducts.map((rawProduct) => normalizeProduct(rawProduct as Record<string, unknown>, locale)));
};

export const getStorefrontProductBySlug = async ({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) => {
  try {
    const db = await getMongoDb();
    const rawProduct = await db.collection("products").findOne({
      slug,
      _status: "published",
    });

    if (!rawProduct) {
      return null;
    }

    return normalizeProduct(rawProduct as Record<string, unknown>, locale);
  } catch (error) {
    console.error("Error fetching storefront product:", error);
    return null;
  }
};

export const getStorefrontCategoryBySlug = async ({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) => {
  try {
    const db = await getMongoDb();
    const rawCategory = await db.collection("productCategories").findOne({ slug });

    if (!rawCategory) {
      return null;
    }

    const category = await normalizeCategory(rawCategory as Record<string, unknown>, locale);
    return category ? attachCategorySubcategories(category, locale) : null;
  } catch (error) {
    console.error("Error fetching storefront category:", error);
    return null;
  }
};

export const getStorefrontSubcategoryBySlug = async ({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) => {
  try {
    const db = await getMongoDb();
    const rawSubcategory = await db.collection("productSubCategories").findOne({ slug });

    if (!rawSubcategory) {
      return null;
    }

    return normalizeSubcategory(rawSubcategory as Record<string, unknown>, locale);
  } catch (error) {
    console.error("Error fetching storefront subcategory:", error);
    return null;
  }
};

export const getStorefrontCategoryListing = async ({
  color,
  locale,
  size,
  slug,
  sortBy,
}: CategoryListingArgs) => {
  const category = await getStorefrontCategoryBySlug({ locale, slug });

  if (!category) {
    return {
      allProducts: [],
      category: null,
      filteredProducts: [],
    };
  }

  const allProducts = await getNormalizedProducts(getCategoryProductsQuery(category.id), locale);

  return {
    allProducts: sortProducts(allProducts, "most-popular"),
    category,
    filteredProducts: sortProducts(
      allProducts.filter((product) => matchesVariantFilters(product, { color, size })),
      sortBy,
    ),
  };
};

export const getStorefrontSubcategoryListing = async ({
  color,
  locale,
  size,
  slug,
  sortBy,
}: SubcategoryListingArgs) => {
  const subcategory = await getStorefrontSubcategoryBySlug({ locale, slug });

  if (!subcategory || typeof subcategory.category === "string") {
    return {
      allProducts: [],
      category: null,
      filteredProducts: [],
      subcategory: null,
    };
  }

  if (!subcategory.category || typeof subcategory.category === "string") {
    return {
      allProducts: [],
      category: null,
      filteredProducts: [],
      subcategory: null,
    };
  }

  const category = await attachCategorySubcategories(subcategory.category, locale);
  const allProducts = await getNormalizedProducts(getCategoryProductsQuery(category.id), locale);
  const filteredProducts = allProducts.filter((product) => {
    const belongsToSubcategory = product.categoriesArr?.some((entry) =>
      entry.subcategories?.some((relatedSubcategory) => getRelationId(relatedSubcategory) === subcategory.id),
    );

    return belongsToSubcategory && matchesVariantFilters(product, { color, size });
  });

  return {
    allProducts: sortProducts(allProducts, "most-popular"),
    category,
    filteredProducts: sortProducts(filteredProducts, sortBy),
    subcategory,
  };
};

export const searchStorefrontProducts = async ({
  locale,
  search,
}: {
  locale: Locale;
  search: string;
}) => {
  const query = search.trim();

  if (!query) {
    return [];
  }

  try {
    const db = await getMongoDb();
    const searchRegex = new RegExp(escapeRegex(query), "i");
    const rawProducts = await db
      .collection("products")
      .find({
        _status: "published",
        $or: [
          { slug: searchRegex },
          { [`title.${locale}`]: searchRegex },
          { [`title.${defaultLocale}`]: searchRegex },
        ],
      })
      .toArray();

    const products = await Promise.all(
      rawProducts.map((rawProduct) => normalizeProduct(rawProduct as Record<string, unknown>, locale)),
    );

    return sortProducts(products, "most-popular");
  } catch (error) {
    console.error("Error searching storefront products:", error);
    return [];
  }
};

export const getHotspotProducts = async ({
  categoryId,
  locale,
  limit = 4,
  sortBy,
  subcategoryId,
}: {
  categoryId?: string;
  locale: Locale;
  limit?: number;
  sortBy?: string;
  subcategoryId?: string;
}) => {
  const db = await getMongoDb();
  const productsCollection = db.collection("products");
  const query: Record<string, unknown> = {
    _status: "published",
  };

  if (categoryId) {
    query["categoriesArr.category"] = {
      $in: buildIdCandidates(categoryId),
    };
  }

  if (subcategoryId) {
    query["categoriesArr.subcategories"] = {
      $in: buildIdCandidates(subcategoryId),
    };
  }

  const rawProducts = await productsCollection.find(query).toArray();
  const products = await Promise.all(
    rawProducts.map((rawProduct) => normalizeProduct(rawProduct as Record<string, unknown>, locale)),
  );

  return sortProducts(products, mapHotspotSort(sortBy)).slice(0, limit);
};
