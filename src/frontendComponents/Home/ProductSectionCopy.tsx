"use client";

import React from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  qty: string;
  badge?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Roasted Peanuts: 8 Packs (Taiwan)",
    price: "$36.00",
    qty: "8 Packs",
    img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    badge: "-11%",
  },
  {
    id: 2,
    name: "Roasted Peanuts: 14 Packs (Taiwan)",
    price: "$55.00",
    qty: "14 Packs",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4971.jpg",
    badge: "-10%",
  },
  {
    id: 3,
    name: "Roasted Peanuts: 21 Packs (Taiwan)",
    price: "$75.00",
    qty: "21 Packs",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4622-3-scaled.jpg",
  },
  {
    id: 4,
    name: "Roasted Peanuts: 6 Bags (Taiwan)",
    price: "$65.00",
    qty: "6 Bags",
    img: "https://khfood.com/wp-content/uploads/2019/10/6-bags.jpg",
  },
];

const ProductSectionRight: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 items-stretch">
          {/* LEFT SIDE: PRODUCTS GRID */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <Link key={product.id} href="/products/single" className="block">
                {/* ✅ Make card image full width, and content OVER image */}
                <article className="group relative rounded-2xl overflow-hidden bg-[#f7f7f7] h-[350px] sm:h-[350px]">
                  {/* IMAGE: full size background */}
                  <div className="absolute inset-0 ">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 "
                    />
                    {/* overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
                  </div>

                  {/* TOP BADGE (qty) */}
                  {product.qty && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#FFD100] text-[10px] font-bold px-2 py-1 shadow-sm z-10">
                      {product.qty}
                    </span>
                  )}

                  {/* OPTIONAL DISCOUNT BADGE (right) */}
                  {/* {product.badge && (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center rounded-full bg-white/95 text-black text-[12px] font-extrabold px-3 py-2 shadow">
                      {product.badge}
                    </span>
                  )} */}

                  {/* CONTENT OVER IMAGE (bottom) */}
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                    <h3 className="text-[21px] font-bold text-[#ffffff] leading-snug mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-[20px] font-bold text-[#ffffff]">
                        {product.price}
                      </span>

                      {product.oldPrice && (
                        <span className="text-white/70 text-[14px] line-through">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Click affordance */}
                  <div className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-white/30 transition" />
                </article>
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE: PROMO CARD (NO CHANGE) */}
          <div className="w-full lg:w-[42%] flex-shrink-0 relative overflow-hidden rounded-3xl bg-black text-white min-h-[500px] lg:min-h-0">
            <div className="absolute inset-0">
              <img
                src="/assets/Image/khfoodImage/Image-2.jpg"
                alt="Promo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="relative flex flex-col justify-between h-full p-8 md:p-10">
              <div className="mt-4">
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight max-w-sm">
                  Product Ship International (Taiwan)
                </h2>

                <p className="text-[16px] text-white mb-3 font-medium pt-4">
                  Currently, we offer direct shipping to Taiwan only. If you are
                  interested to ship to other countries, please visit Contact Us
                  page to submit your inquiry.
                </p>
              </div>

              <button className="mt-8 self-start inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 text-[13px] font-bold tracking-[0.16em] uppercase hover:bg-neutral-100 transition">
                Shop Now <span className="ml-2 text-lg">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSectionRight;
