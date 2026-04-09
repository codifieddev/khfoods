import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Product } from "@/types/cms";

type RawLocalizedValue = string | Record<string, string> | null | undefined;

type RawPricing = {
  currency?: string | null;
  value?: number | null;
};

type RawVariant = {
  pricing?: RawPricing[] | null;
  stock?: number | null;
};

type RawCategoryEntry = {
  category?: string | { id?: string; title?: string } | null;
  subcategories?: (string | { id?: string; title?: string })[] | null;
};

type RawProduct = Record<string, unknown> & {
  Highlight?: RawLocalizedValue;
  _id?: ObjectId | string;
  _status?: "draft" | "published" | null;
  categoriesArr?: RawCategoryEntry[] | null;
  createdAt?: string;
  enableVariantPrices?: boolean | null;
  enableVariantWeights?: boolean | null;
  enableVariants?: boolean | null;
  id?: string;
  images?: unknown[] | null;
  pricing?: RawPricing[] | null;
  slug?: string | null;
  stock?: number | null;
  title?: RawLocalizedValue;
  updatedAt?: string;
  variants?: RawVariant[] | null;
  weight?: number | null;
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const pickLocalizedString = (value: RawLocalizedValue, locale: Locale) => {
  if (typeof value === "string") {
    return value;
  }

  if (isPlainObject(value)) {
    const localizedValue = value[locale];

    if (typeof localizedValue === "string") {
      return localizedValue;
    }

    const fallbackValue = value[defaultLocale];

    if (typeof fallbackValue === "string") {
      return fallbackValue;
    }

    const firstValue = Object.values(value).find((entry) => typeof entry === "string");
    return typeof firstValue === "string" ? firstValue : "";
  }

  return "";
};

const toDocumentId = (document: { id?: string; _id?: string | ObjectId }) =>
  document.id || (typeof document._id === "string" ? document._id : document._id?.toString?.() ?? "");

const getPricingRange = ({
  enableVariantPrices,
  pricing,
  variants,
}: {
  enableVariantPrices?: boolean | null;
  pricing?: RawPricing[] | null;
  variants?: RawVariant[] | null;
}) => {
  const priceSource = enableVariantPrices ? (variants ?? []).flatMap((variant) => variant.pricing ?? []) : (pricing ?? []);

  const prices = priceSource.filter(
    (entry): entry is { currency?: string | null; value: number } => typeof entry?.value === "number",
  );

  if (prices.length === 0) {
    return {
      currency: "USD",
      max: null,
      min: null,
    };
  }

  const values = prices.map((entry) => entry.value);

  return {
    currency: prices.find((entry) => typeof entry.currency === "string" && entry.currency)?.currency ?? "USD",
    max: Math.max(...values),
    min: Math.min(...values),
  };
};

const getInventoryCount = (product: RawProduct) => {
  if (!product.enableVariants) {
    return typeof product.stock === "number" ? product.stock : 0;
  }

  return (product.variants ?? []).reduce((sum, variant) => sum + (typeof variant.stock === "number" ? variant.stock : 0), 0);
};

const mapProductSummary = (product: RawProduct, locale: Locale) => {
  const pricing = getPricingRange(product);

  return {
    categoryCount: product.categoriesArr?.length ?? 0,
    createdAt: product.createdAt ?? null,
    id: toDocumentId(product),
    inventory: getInventoryCount(product),
    priceCurrency: pricing.currency,
    priceMax: pricing.max,
    priceMin: pricing.min,
    slug: product.slug ?? "",
    status: product._status ?? "draft",
    title: pickLocalizedString(product.title, locale) || "Untitled product",
    type: product.enableVariants ? "variant" : "simple",
    updatedAt: product.updatedAt ?? null,
    variantCount: product.variants?.length ?? 0,
  };
};

const getRawProductById = async (id: string) => {
  const db = await getMongoDb();

  for (const candidate of buildIdCandidates(id)) {
    const product = await db.collection("products").findOne({
      $or: [{ _id: candidate as never }, { id: candidate as never }],
    });

    if (product) {
      return product as RawProduct;
    }
  }

  return null;
};

export const getAdminProducts = async ({
  limit = 30,
  query,
  status,
  locale = defaultLocale,
}: {
  limit?: number;
  locale?: Locale;
  query?: string;
  status?: string;
}) => {
  const db = await getMongoDb();
  const filters: Record<string, unknown>[] = [];
  const normalizedQuery = query?.trim();

  if (status && status !== "all") {
    filters.push({ _status: status });
  }

  if (normalizedQuery) {
    const regex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    filters.push({
      $or: [{ id: regex }, { slug: regex }, { "title.en": regex }, { "title.zh": regex }, { "Highlight.en": regex }],
    });
  }

  const where = filters.length ? { $and: filters } : {};
  const rawProducts = (await db
    .collection("products")
    .find(where)
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray()) as RawProduct[];

  return rawProducts.map((product) => mapProductSummary(product, locale));
};

export const getAdminProductById = async ({
  id,
  locale = defaultLocale,
}: {
  id: string;
  locale?: Locale;
}) => {
  const rawProduct = await getRawProductById(id);

  if (!rawProduct) {
    return null;
  }

  const normalizedProduct = (await normalizeCollectionDocument(
    "products",
    rawProduct as Record<string, unknown>,
    locale,
    2,
  )) as Product | null;

  if (!normalizedProduct) {
    return null;
  }

  const categoryTitles = Array.from(
    new Set(
      (normalizedProduct.categoriesArr ?? [])
        .map((entry) => (typeof entry.category === "object" ? entry.category.title : null))
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const subcategoryTitles = Array.from(
    new Set(
      (normalizedProduct.categoriesArr ?? [])
        .flatMap((entry) =>
          (entry.subcategories ?? []).map((subcategory) =>
            typeof subcategory === "object" ? subcategory.title : null,
          ),
        )
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const pricing = getPricingRange(rawProduct);

  return {
    product: normalizedProduct,
    summary: {
      categoryTitles,
      imageCount: normalizedProduct.images?.length ?? 0,
      inventory: getInventoryCount(rawProduct),
      priceCurrency: pricing.currency,
      priceMax: pricing.max,
      priceMin: pricing.min,
      subcategoryTitles,
      titleEn: pickLocalizedString(rawProduct.title, "en"),
      variantCount: rawProduct.variants?.length ?? 0,
    },
  };
};

const mergeLocalizedValue = ({
  existing,
  nextValue,
}: {
  existing: RawLocalizedValue;
  nextValue: string;
}) => {
  if (isPlainObject(existing)) {
    return {
      ...existing,
      [defaultLocale]: nextValue,
    };
  }

  if (typeof existing === "string" && existing.length > 0) {
    return {
      [defaultLocale]: nextValue,
      zh: existing,
    };
  }

  return {
    [defaultLocale]: nextValue,
  };
};

export const updateAdminProduct = async ({
  highlight,
  id,
  slug,
  status,
  stock,
  title,
  weight,
}: {
  highlight?: string;
  id: string;
  slug?: string;
  status?: Product["_status"];
  stock?: number | null;
  title?: string;
  weight?: number | null;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    throw new Error("Unauthorized");
  }

  const rawProduct = await getRawProductById(id);

  if (!rawProduct) {
    throw new Error("Product not found");
  }

  const updateFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (title !== undefined) {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new Error("Title is required");
    }

    updateFields.title = mergeLocalizedValue({
      existing: rawProduct.title,
      nextValue: normalizedTitle,
    });
  }

  if (highlight !== undefined) {
    updateFields.Highlight = highlight.trim()
      ? mergeLocalizedValue({
          existing: rawProduct.Highlight,
          nextValue: highlight.trim(),
        })
      : null;
  }

  if (slug !== undefined) {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
      throw new Error("Slug is required");
    }

    updateFields.slug = normalizedSlug;
  }

  if (status !== undefined) {
    updateFields._status = status ?? "draft";
  }

  if (stock !== undefined && !rawProduct.enableVariants) {
    updateFields.stock = stock ?? 0;
  }

  if (weight !== undefined && !rawProduct.enableVariantWeights) {
    updateFields.weight = weight ?? 0;
  }

  const db = await getMongoDb();

  await db.collection("products").updateOne(
    { _id: rawProduct._id as never },
    {
      $set: updateFields,
    },
  );

  return getAdminProductById({ id, locale: defaultLocale });
};
