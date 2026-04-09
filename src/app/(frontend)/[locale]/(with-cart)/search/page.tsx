import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

import { searchStorefrontProducts } from "@/data/storefront/ecommerce";
import { WithInlinePrice } from "@/globals/(ecommerce)/Layout/ProductList/variants/listings/WithInlinePrice";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";

// Force dynamic rendering since search depends on search params
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type SearchPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ search: string }>;
};

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale } = await params;
  const { search } = await searchParams;
  
  // For dynamic pages, we still need setRequestLocale
  setRequestLocale(locale);
  const products = await searchStorefrontProducts({ locale, search: search ?? "" });

  const t = await getTranslations("Search");

  return (
    <main className="container">
      <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-gray-200 pt-24 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {t("results")} {search}
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 pb-24 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
        <WithInlinePrice products={products} />
      </div>
    </main>
  );
};
export default SearchPage;
