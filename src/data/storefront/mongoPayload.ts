import "server-only";

import { ObjectId } from "mongodb";

import { Administrators } from "@/data/schemas/Administrators";
import { Attributes } from "@/data/schemas/Attribute";
import { Categories } from "@/data/schemas/Categories";
import { Courier } from "@/data/schemas/Courier";
import { Customers } from "@/data/schemas/Customer";
import { Media as MediaCollection } from "@/data/schemas/Media";
import { Orders } from "@/data/schemas/Order";
import { Pages } from "@/data/schemas/Pages";
import { Payment } from "@/data/schemas/Payment";
import { Permission } from "@/data/schemas/permission";
import { Posts } from "@/data/schemas/Post";
import { Presets } from "@/data/schemas/Presets";
import { ProductCategories } from "@/data/schemas/ProductCategories";
import { ProductSubCategories } from "@/data/schemas/ProductSubCategories";
import { Products } from "@/data/schemas/Product";
import { Roles } from "@/data/schemas/UserRoles";
import { Websites } from "@/data/schemas/Tenants";
import { getMongoDb } from "@/data/mongo/client";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { CollectionConfig } from "@/types/cms";

/**
 * Unified collection configuration mapping.
 * Uses native schemas from @/data/schemas instead of legacy CMS collections.
 */
const collectionConfigs: Record<string, CollectionConfig> = {
  administrators: Administrators,
  attributes: Attributes,
  categories: Categories,
  courier: Courier,
  customers: Customers,
  media: MediaCollection,
  orders: Orders,
  pages: Pages,
  payment: Payment,
  permission: Permission,
  posts: Posts,
  presets: Presets,
  productCategories: ProductCategories,
  productSubCategories: ProductSubCategories,
  products: Products,
  roles: Roles,
  websites: Websites,
};

export type SupportedCollectionSlug = keyof typeof collectionConfigs;

type NormalizeContext = {
  cache: Map<string, unknown>;
};

const isPlainObject = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const cloneValue = <T>(value: T): T => {
  if (value === undefined) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
};

const getDefaultValue = (field: { defaultValue?: unknown }) => {
  if (typeof field.defaultValue === "function") {
    return undefined;
  }
  return cloneValue(field.defaultValue);
};

const pickLocalizedValue = (value: unknown, locale: Locale) => {
  if (!isPlainObject(value)) {
    return value;
  }

  if (locale in value) {
    return value[locale];
  }

  if (defaultLocale in value) {
    return value[defaultLocale];
  }

  return Object.values(value).find((item) => item !== null && item !== undefined) ?? null;
};

const normalizeObjectId = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    // Check if it's a MongoDB ObjectId (instanceof may fail with multiple library versions)
    if (value instanceof ObjectId || (value as any)._bsontype === "ObjectID" || (value as any)._bsontype === "ObjectId") {
      return value.toString();
    }

    if ("id" in value && typeof value.id === "string") {
      return value.id;
    }

    if ("_id" in value) {
      const subId = (value as any)._id;
      if (typeof subId === "string") return subId;
      if (subId && (subId instanceof ObjectId || subId._bsontype === "ObjectID" || subId._bsontype === "ObjectId")) {
        return subId.toString();
      }
    }
  }

  return undefined;
};

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const isPolymorphicRelationValue = (value: unknown): value is { relationTo: string; value: unknown } =>
  isPlainObject(value) && typeof value.relationTo === "string" && "value" in value;

const serializeRelationValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => serializeRelationValue(item));
  }

  if (isPolymorphicRelationValue(value)) {
    return {
      relationTo: value.relationTo,
      value: serializeRelationValue(value.value),
    };
  }

  const id = normalizeObjectId(value);
  return id ?? value;
};

const getRawDocumentById = async (collectionSlug: SupportedCollectionSlug, id: string) => {
  const db = await getMongoDb();
  const collection = db.collection(collectionSlug);

  for (const candidate of buildIdCandidates(id)) {
    const document = await collection.findOne({ _id: candidate as any });
    if (document) {
      return document;
    }
  }

  return null;
};

/**
 * Native storefront document retrieval.
 * Performs deep normalization based on native schemas.
 */
export const getCollectionDocumentById = async <T = Record<string, unknown>>(
  collectionSlug: SupportedCollectionSlug,
  id: string,
  locale: Locale,
  depth = 0,
  context: NormalizeContext = { cache: new Map<string, unknown>() },
): Promise<T | null> => {
  const cacheKey = `${collectionSlug}:${id}:${locale}:${depth}`;

  if (context.cache.has(cacheKey)) {
    return context.cache.get(cacheKey) as T | null;
  }

  const rawDocument = await getRawDocumentById(collectionSlug, id);

  if (!rawDocument) {
    context.cache.set(cacheKey, null);
    return null;
  }

  const normalizedDocument = await normalizeCollectionDocument(
    collectionSlug,
    rawDocument as Record<string, unknown>,
    locale,
    depth,
    context,
  );

  context.cache.set(cacheKey, normalizedDocument);
  return normalizedDocument as T;
};

const resolveRelation = async (
  relationTo: string,
  value: unknown,
  locale: Locale,
  depth: number,
  context: NormalizeContext,
) => {
  if (!value) {
    return value;
  }

  if (!(relationTo in collectionConfigs)) {
    return serializeRelationValue(value);
  }

  const supportedCollection = relationTo as SupportedCollectionSlug;

  if (Array.isArray(value)) {
    const resolved = await Promise.all(
      value.map((item) => resolveRelation(supportedCollection, item, locale, depth, context)),
    );

    return resolved;
  }

  if (isPolymorphicRelationValue(value)) {
    const resolvedValue = await resolveRelation(value.relationTo, value.value, locale, depth, context);
    return {
      relationTo: value.relationTo,
      value: resolvedValue,
    };
  }

  if (depth <= 0) {
    return serializeRelationValue(value);
  }

  const id = normalizeObjectId(value);

  if (!id) {
    return serializeRelationValue(value);
  }

  return (
    (await getCollectionDocumentById(supportedCollection, id, locale, depth - 1, context)) ??
    serializeRelationValue(value)
  );
};

/**
 * Recursive field normalization for native document structures.
 */
const normalizeFieldValue = async (
  source: Record<string, any>,
  fields: any[],
  locale: Locale,
  depth: number,
  context: NormalizeContext,
) => {
  for (const field of fields) {
    if (!field || typeof field !== "object") {
      continue;
    }

    switch (field.type) {
      case "tabs": {
        for (const tab of field.tabs ?? []) {
          if (tab?.name) {
            const localizedValue = tab.localized ? pickLocalizedValue(source[tab.name], locale) : source[tab.name];
            const currentValue = localizedValue && typeof localizedValue === "object" ? localizedValue : {};
            source[tab.name] = currentValue;
            await normalizeFieldValue(currentValue, tab.fields ?? [], locale, depth, context);
          } else {
            await normalizeFieldValue(source, tab?.fields ?? [], locale, depth, context);
          }
        }
        break;
      }
      case "row":
      case "collapsible": {
        await normalizeFieldValue(source, field.fields ?? [], locale, depth, context);
        break;
      }
      case "group": {
        const currentValue =
          source[field.name] && typeof source[field.name] === "object" ? source[field.name] : {};
        source[field.name] = currentValue;
        await normalizeFieldValue(currentValue, field.fields ?? [], locale, depth, context);
        break;
      }
      case "array": {
        let value = source[field.name];

        if (field.localized) {
          value = pickLocalizedValue(value, locale);
          source[field.name] = value;
        }

        if ((value === undefined || value === null) && field.defaultValue !== undefined) {
          source[field.name] = getDefaultValue(field);
          value = source[field.name];
        }

        if (Array.isArray(value)) {
          const resolvedItems = await Promise.all(
            value.map(async (item: unknown) => {
              if (!isPlainObject(item)) {
                return item;
              }

              const clonedItem = cloneValue(item);
              await normalizeFieldValue(clonedItem, field.fields ?? [], locale, depth, context);
              return clonedItem;
            }),
          );

          source[field.name] = resolvedItems;
        }
        break;
      }
      case "blocks": {
        let value = source[field.name];

        if (field.localized) {
          value = pickLocalizedValue(value, locale);
          source[field.name] = value;
        }

        if (Array.isArray(value)) {
          const resolvedBlocks = await Promise.all(
            value.map(async (item: unknown) => {
              if (!isPlainObject(item)) {
                return item;
              }

              const clonedItem = cloneValue(item);
              const blockConfig = field.blocks?.find(
                (entry: { slug?: string }) => entry.slug === clonedItem.blockType,
              );

              if (blockConfig?.fields) {
                await normalizeFieldValue(clonedItem, blockConfig.fields, locale, depth, context);
              }

              return clonedItem;
            }),
          );

          source[field.name] = resolvedBlocks;
        }
        break;
      }
      default: {
        if (!field.name) {
          break;
        }

        let value = source[field.name];

        if (field.localized) {
          value = pickLocalizedValue(value, locale);
          source[field.name] = value;
        }

        if ((value === undefined || value === null) && field.defaultValue !== undefined) {
          source[field.name] = getDefaultValue(field);
          value = source[field.name];
        }

        if (field.type === "relationship" || field.type === "upload") {
          source[field.name] = await resolveRelation(field.relationTo, value, locale, depth, context);
        }
      }
    }
  }

  return source;
};

/**
 * Main entry point for native document normalization.
 */
export const normalizeCollectionDocument = async (
  collectionSlug: SupportedCollectionSlug,
  rawDocument: Record<string, unknown> | null,
  locale: Locale,
  depth = 0,
  context: NormalizeContext = { cache: new Map<string, unknown>() },
) => {
  if (!rawDocument) {
    return null;
  }

  const source = cloneValue(rawDocument);
  const config = collectionConfigs[collectionSlug as string];

  if (!config) {
    return source;
  }

  await normalizeFieldValue(source as Record<string, any>, config.fields ?? [], locale, depth, context);

  const normalizedDocument = source as Record<string, any>;

  if (!normalizedDocument.id) {
    normalizedDocument.id =
      typeof normalizedDocument._id === "string"
        ? normalizedDocument._id
        : normalizedDocument._id?.toString?.() ?? null;
  }

  delete normalizedDocument._id;
  delete normalizedDocument.__v;

  return normalizedDocument;
};
