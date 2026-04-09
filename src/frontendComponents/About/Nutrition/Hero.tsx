

import { ProductCategory, ProductSubCategory } from "@/types/cms";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

type Heroprops = {
  category?: ProductCategory;
  subcategory?: ProductSubCategory;
};

export const HeroSection = async ({ category, subcategory }: Heroprops) => {
  const t = await getTranslations("Breadcrumbs");
  const locale = await getLocale();

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 to-orange-800/90 z-10"></div>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=1600&h=900&fit=crop')",
        }}
      ></div>
      <div className="relative z-20 text-center text-white px-4">
        {/* Breadcrumb Navigation */}
        {category && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol
              role="list"
              className="flex items-center justify-center space-x-2 text-sm"
            >
              <li>
                <Link
                  href={`/our-products/${category.slug}`}
                  className="text-amber-300 hover:text-amber-200 uppercase tracking-widest font-light"
                >
                  {t("products")} / {category.title}
                </Link>
              </li>
              {subcategory && (
                <>
                  <li>
                    <svg
                      viewBox="0 0 6 20"
                      aria-hidden="true"
                      className="h-4 w-auto text-amber-300/50"
                    >
                      <path
                        d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
                        fill="currentColor"
                      />
                    </svg>
                  </li>
                  <li>
                    <Link
                      href={`/category/${category.slug}/${subcategory.slug}`}
                      className="text-amber-300 hover:text-amber-200 uppercase tracking-widest font-light"
                    >
                      {subcategory.title}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>
        )}

        <h1 className="text-6xl md:text-7xl font-bold mb-6">
          {subcategory?.title || category?.title || "NUTRITION"}
        </h1>
        <div className="w-24 h-1 bg-amber-300 mx-auto"></div>
      </div>
    </section>
  );
};


