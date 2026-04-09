"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { categories, products } from "@/data/products";
import { PageHero, ProductPill, SectionHeading } from "./shared";

export default function CategoryPage() {
  const params = useParams<{ id?: string }>();
  const categoryId = params?.id ?? "";
  const [query, setQuery] = useState("");

  const activeCategory = useMemo(
    () => categories.find((item) => item.id === categoryId) ?? null,
    [categoryId],
  );

  const filtered = useMemo(() => {
    const list = activeCategory
      ? products.filter((item) => item.category.toLowerCase().includes(activeCategory.name.toLowerCase()))
      : products;

    if (!query) return list;

    return list.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  }, [activeCategory, query]);

  return (
    <div>
      <PageHero
        eyebrow={activeCategory ? "Category" : "Menu"}
        title={activeCategory ? activeCategory.name : "Our full menu"}
        description={
          activeCategory
            ? activeCategory.description
            : "Browse the full range or jump directly into a category."
        }
        ctaHref="/contact"
        ctaLabel="Ask about catering"
        image={activeCategory?.img || categories[0].img}
      />

      <section className="mx-auto max-w-7xl px-[5%] py-14">
        <div className="crumbs">
          <Link href="/">Home</Link>
          <ChevronRight size={12} className="opacity-50" />
          <span>Shop</span>
          {activeCategory ? <ChevronRight size={12} className="opacity-50" /> : null}
          {activeCategory ? <strong>{activeCategory.name}</strong> : null}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Menu"
            title={activeCategory ? `All ${activeCategory.name.toLowerCase()} picks` : "Explore every category."}
            description="Search, browse, and find the right thing for the moment."
          />

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm font-medium outline-none transition focus:border-secondary"
              placeholder="Search menu..."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductPill
              key={product.id}
              title={product.title}
              description={`${product.price} · ${product.category}`}
              href={`/product/${product.id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
