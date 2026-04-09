import { getStorefrontPageByDomain } from "@/data/storefront/pages";

export async function getTenantByDomain(
  domain: string,
  slug: string,
  locale: "en" | "zh"
) {
  try {
    return await getStorefrontPageByDomain({ domain, slug, locale });
  } catch (error) {
    console.error("Error in getTenantByDomain:", error);
    return null;
  }
}
