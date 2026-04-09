import { unstable_cache } from "next/cache";

import { getStorefrontGlobal, type StorefrontGlobal } from "@/data/storefront/globals";
import { type Locale } from "@/i18n/config";

import type { AppGlobalsMap } from "@/types/cms";

type Global = keyof AppGlobalsMap;

async function getGlobal(slug: Global, depth = 5, locale: Locale) {
  void depth;
  return getStorefrontGlobal(slug as StorefrontGlobal, locale);
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedGlobal = <T extends Global>(
  slug: T,
  locale: Locale,
  depth?: number,
): (() => Promise<AppGlobalsMap[T]>) =>
  unstable_cache(
    async (): Promise<AppGlobalsMap[T]> => {
      return (await getGlobal(slug, depth, locale)) as AppGlobalsMap[T];
    },
    [slug],
    {
      tags: [`global_${slug}`],
      revalidate: 900
    },
  );
