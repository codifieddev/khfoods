"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  quantity?: string;
  badge?: string;
  images?: {
    url: string;
  }[];
};

const FALLBACK_IMAGES: string[] = [
  "/assets/Image/khfoodImage/2Q6A4963.jpg",
  "https://khfood.com/wp-content/uploads/2019/11/2Q6A4971.jpg",
  "https://khfood.com/wp-content/uploads/2019/11/2Q6A4622-3-scaled.jpg",
  "https://khfood.com/wp-content/uploads/2019/10/6-bags.jpg",
];

const ProductSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/collections/products", {
          cache: "no-store", // 🔥 admin update turant reflect hoga
        });

        const data = await res.json();

        setProducts(data.docs || []);
      } catch (error) {
        console.error("Product fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-16">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">

          {/* LEFT PROMO CARD (NO CHANGE) */}
          <div className="w-full lg:w-[42%] flex-shrink-0 relative overflow-hidden rounded-3xl bg-black text-white min-h-[500px]">
            <img
              src="/assets/Image/khfoodImage/Image-2.jpg"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative flex flex-col justify-between h-full p-8 md:p-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold">
                  FREE SHIPPING Within US
                </h2>
                <p className="text-[16px] pt-4">
                  We ship orders to all states in US including AK, HI, PR at no cost.
                </p>
              </div>

              <button className="rounded-full bg-white text-black px-8 py-3 text-[13px] font-bold uppercase">
                Shop now ↗
              </button>
            </div>
          </div>

          {/* RIGHT PRODUCTS GRID (DYNAMIC) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.slice(0, 4).map((product, index) => {
              const image =
                product.images?.[0]?.url || FALLBACK_IMAGES[index];

              return (
                <Link key={product.id} href="/products/single">
                  <article className="bg-[#f7f7f7] rounded-xl overflow-hidden flex flex-col h-full group cursor-pointer">

                    {/* Image */}
                    <div className="relative pt-4 pb-2 px-4">
                      {product.quantity && (
                        <span className="absolute left-3 top-3 rounded-full bg-[#FFD100] text-[10px] font-bold px-2 py-1">
                          {product.quantity}
                        </span>
                      )}

                      <div className="aspect-[5/4] flex items-center justify-center">
                        <img
                          src={image}
                          alt={product.title}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-5 pb-4 flex flex-col flex-grow">
                      <h3 className="text-[15px] font-bold mb-2 line-clamp-2">
                        {product.title}
                      </h3>

                      <div className="mt-auto flex items-center gap-3">
                        <span className="text-[16px] font-bold">
                          ${product.price}
                        </span>

                        {product.oldPrice && (
                          <span className="text-[13px] text-gray-400 line-through">
                            ${product.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>

                  </article>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductSection;
