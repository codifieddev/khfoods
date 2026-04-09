import "server-only";

import { defaultLocale, type Locale } from "@/i18n/config";
import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";

import type { Post } from "@/types/cms";
import type { Filter, Document, Sort } from "mongodb";

export const POSTS_PAGE_SIZE = 12;

type PostArchiveResult = {
  docs: Post[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

const publicPostFilter = {
  $or: [{ _status: "published" }, { _status: { $exists: false } }],
};

const defaultPostSort: Sort = {
  publishedAt: -1,
  updatedAt: -1,
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildLocalizedFieldPaths = (field: string, locale: Locale) => {
  const fields = [field, `${field}.${locale}`];

  if (locale !== defaultLocale) {
    fields.push(`${field}.${defaultLocale}`);
  }

  return fields;
};

const buildPostSearchFilter = (query: string, locale: Locale): Filter<Document> => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {};
  }

  const regex = new RegExp(escapeRegex(trimmedQuery), "i");
  const fields = [
    ...buildLocalizedFieldPaths("title", locale),
    ...buildLocalizedFieldPaths("meta.title", locale),
    ...buildLocalizedFieldPaths("meta.description", locale),
    "slug",
  ];

  return {
    $or: fields.map((field) => ({
      [field]: regex,
    })),
  };
};

const normalizePostDocuments = async (
  documents: Document[],
  locale: Locale,
  depth: number,
) => {
  const normalizedDocuments = await Promise.all(
    documents.map((document) =>
      normalizeCollectionDocument("posts", document as Record<string, unknown>, locale, depth),
    ),
  );

  return normalizedDocuments.filter(Boolean) as Post[];
};

export const getPostsPage = async ({
  locale,
  page = 1,
  limit = POSTS_PAGE_SIZE,
  query,
}: {
  locale: Locale;
  page?: number;
  limit?: number;
  query?: string;
}): Promise<PostArchiveResult> => {
  const db = await getMongoDb();
  const postsCollection = db.collection("posts");
  const currentPage = Math.max(1, Math.floor(page));
  const filter: Filter<Document> = {
    ...publicPostFilter,
    ...buildPostSearchFilter(query ?? "", locale),
  };

  const totalDocs = await postsCollection.countDocuments(filter);
  const totalPages = totalDocs > 0 ? Math.ceil(totalDocs / limit) : 1;
  const docs = await postsCollection
    .find(filter)
    .sort(defaultPostSort)
    .skip((currentPage - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    docs: await normalizePostDocuments(docs, locale, 1),
    totalDocs,
    totalPages,
    page: currentPage,
    limit,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
};

export const getPublishedPostSlugs = async () => {
  const db = await getMongoDb();
  const postsCollection = db.collection("posts");
  const documents = await postsCollection
    .find(
      {
        ...publicPostFilter,
        slug: { $type: "string", $ne: "" },
      },
      {
        projection: {
          slug: 1,
        },
      },
    )
    .toArray();

  return documents
    .map((document) => document.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
};

export const getPostCount = async () => {
  const db = await getMongoDb();
  return db.collection("posts").countDocuments(publicPostFilter);
};

export const getArchiveBlockPosts = async ({
  categoryIds,
  limit = 3,
  locale,
}: {
  categoryIds?: string[];
  limit?: number;
  locale: Locale;
}) => {
  const db = await getMongoDb();
  const postsCollection = db.collection("posts");
  const normalizedCategoryIds = (categoryIds ?? []).filter(Boolean);
  const filter: Filter<Document> = {
    ...publicPostFilter,
    ...(normalizedCategoryIds.length > 0
      ? {
          categories: {
            $in: normalizedCategoryIds,
          },
        }
      : {}),
  };

  const documents = await postsCollection.find(filter).sort(defaultPostSort).limit(limit).toArray();

  return normalizePostDocuments(documents, locale, 1);
};

export const getPostBySlug = async ({
  slug,
  locale,
  draft = false,
}: {
  slug: string;
  locale: Locale;
  draft?: boolean;
}) => {
  if (!slug) {
    return null;
  }

  const db = await getMongoDb();
  const postsCollection = db.collection("posts");
  const filter: Filter<Document> = {
    slug,
    ...(draft ? {} : publicPostFilter),
  };

  const document = await postsCollection.findOne(filter, {
    sort: defaultPostSort,
  });

  if (!document) {
    return null;
  }

  return normalizeCollectionDocument("posts", document as Record<string, unknown>, locale, 2) as Promise<Post | null>;
};
