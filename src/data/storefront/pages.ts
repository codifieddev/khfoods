import "server-only";

import { getMongoDb } from "@/data/mongo/client";
import { findMongoDocumentById } from "@/data/mongo/documents";
import {
  getCollectionDocumentById,
  normalizeCollectionDocument,
} from "@/data/storefront/mongoPayload";
import { type Locale } from "@/i18n/config";

type StorefrontPageLookupArgs = {
  domain?: string;
  locale: Locale;
  slug: string;
};

export const getStorefrontPageByDomain = async ({
  domain = "default",
  locale,
  slug,
}: StorefrontPageLookupArgs) => {
  try {
    const db = await getMongoDb();

    const directPage = await db.collection("pages").findOne({
      slug,
      _status: "published",
    });

    if (directPage) {
      return normalizeCollectionDocument("pages", directPage as Record<string, unknown>, locale, 2);
    }

    const rawWebsite =
      domain === "default" || !domain
        ? await db.collection("websites").findOne({}, { sort: { createdAt: 1 } })
        : await db.collection("websites").findOne({ "domains.domain": domain });

    if (!rawWebsite) {
      return null;
    }

    const websiteId =
      typeof rawWebsite._id === "string" ? rawWebsite._id : rawWebsite._id?.toString?.() ?? null;

    if (!websiteId) {
      return null;
    }

    const website = await getCollectionDocumentById("websites", websiteId, locale, 0);

    if (!website?.id) {
      return null;
    }

    const scopedPage = await db.collection("pages").findOne({
      slug,
      website: website.id,
      _status: "published",
    });

    if (!scopedPage) {
      return null;
    }

    return normalizeCollectionDocument("pages", scopedPage as Record<string, unknown>, locale, 2);
  } catch (error) {
    console.error("Error fetching storefront page by domain:", error);
    return null;
  }
};

export const getStaticStorefrontPageSlugs = async () => {
  const db = await getMongoDb();
  const pages = await db
    .collection("pages")
    .find(
      {
        _status: "published",
      },
      {
        projection: {
          slug: 1,
        },
      },
    )
    .toArray();

  return pages
    .map((doc) => (typeof doc.slug === "string" ? doc.slug : null))
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0 && slug !== "home");
};

export const getStorefrontPageById = async ({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}) => {
  try {
    const page = await findMongoDocumentById("pages", id);

    if (!page) {
      return null;
    }

    return normalizeCollectionDocument("pages", page as Record<string, unknown>, locale, 2);
  } catch (error) {
    console.error("Error fetching storefront page by id:", error);
    return null;
  }
};
