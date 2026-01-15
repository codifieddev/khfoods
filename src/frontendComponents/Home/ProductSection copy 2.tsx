"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Product } from "@/payload-types";
import { Media } from "@/components/Media";
import { Link } from "@/i18n/routing";

// ✅ Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ProductSection() {
  return (
    <div className="w-full bg-gray-50 py-8">
      <ProductListing type="left" catType="domestic" />
      <ProductListing type="right" catType="international" />
    </div>
  );
}

function ProductListing({
  type,
  catType,
}: {
  type: "left" | "right";
  catType: string;
}) {
  const [allproduct, setAllProduct] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navId = useMemo(() => `${type}-${catType}`, [type, catType]);
  const prevClass = `swiper-prev-${navId}`;
  const nextClass = `swiper-next-${navId}`;

  useEffect(() => {
    if (catType) void getAllProduct(catType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catType]);

  const getAllProduct = async (catTypeSlug: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/products");
      const prd: Product[] = response.data?.docs ?? [];

      const filterPrd: Product[] = prd.filter((item) => {
        if (item.categoriesArr && item.categoriesArr.length > 0) {
          const data = item.categoriesArr[0].category;
          if (typeof data === "object" && data !== null && "slug" in data) {
            return (data as any).slug === catTypeSlug;
          }
        }
        return false;
      });

      setAllProduct(filterPrd);
    } catch (err) {
      alert("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full px-4 py-6 ${
        type === "left" ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className="w-[90%] mx-auto">
        <div
          className={`flex flex-col ${
            type === "left" ? "lg:flex-row-reverse" : "lg:flex-row"
          } gap-6 items-stretch`}
        >
          {/* Marking Card */}
          <div className="w-full lg:w-96 flex-shrink-0">
            {type === "left" ? (
              <ProductMarking />
            ) : (
              <ProductInernationalMarking />
            )}
          </div>

          {/* ✅ Swiper Column (make it fill height) */}
          <div className="flex-1 min-w-0 h-full">
            <div className="relative h-full">
              {/* Nav Buttons */}
              <button
                type="button"
                className={`${prevClass} hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50`}
                aria-label="Previous"
              >
                <span className="text-xl leading-none">‹</span>
              </button>

              <button
                type="button"
                className={`${nextClass} hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50`}
                aria-label="Next"
              >
                <span className="text-xl leading-none">›</span>
              </button>

              {isLoading ? (
                <Swiper 
                  modules={[Navigation, A11y]}
                  navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                  }}
                  spaceBetween={16}
                  slidesPerView={"auto"}
                  className="h-full !py-0"
                >
                  {[...Array(6)].map((_, index) => (
                    <SwiperSlide key={index} className="!w-64 !h-full">
                      <SkeletonCard />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : allproduct.length > 0 ? (
                <Swiper
                  modules={[Navigation, A11y]}
                  navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                  }}
                  spaceBetween={16}
                  slidesPerView={"auto"}
                  className="h-full !py-0 "
                >
                  {allproduct.slice(0, 8).map((product) => (
                    <SwiperSlide key={product.id} className="!w-64 !h-full">
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="w-full text-center py-12">
                  <p className="text-gray-500">No products available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const productImage = product.images?.[0] || null;

  return (
    <Link href={`/product/${product.slug}`} prefetch className="block h-full">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center h-64 overflow-hidden p-0 m-0">
          {productImage ? (
            <div className="w-full h-full relative">
              <Media
                resource={productImage}
                imgClassName="w-full h-full object-cover"
                priority={false}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}

          {product.Highlight && (
            <div className="absolute top-4 left-4 bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
              {product.Highlight}
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-3">
            <span className="text-sm text-gray-500">Price</span>
            <span className="text-xl font-bold text-gray-900">
              ${product?.pricing?.[0]?.value || "0.00"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative bg-gray-200 p-6 flex items-center justify-center h-64">
        <div className="w-24 h-24 bg-gray-300 rounded" />
      </div>
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

function ProductMarking() {
  return (
    <div className="h-full bg-orange-200 rounded-xl p-6 flex flex-col justify-between shadow-lg min-h-[300px]">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 leading-tight mb-4">
          FREE SHIPPING within US
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          We ship orders to all states including AK, HI, and PR at no cost.
        </p>
      </div>
      <button className="mt-6 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto">
        View All
      </button>
    </div>
  );
}

function ProductInernationalMarking() {
  return (
    <div className="h-full bg-orange-200 rounded-xl p-6 flex flex-col justify-between shadow-lg min-h-[300px]">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 leading-tight mb-4">
          Product Ship International
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          Currently, we offer direct shipping to Taiwan only. If you are
          interested to ship to other countries, please visit Contact Us page to
          submit your inquiry.
        </p>
      </div>
      <button className="mt-6 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 w-full sm:w-auto">
        View All
      </button>
    </div>
  );
}
