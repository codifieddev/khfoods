"use client";

import React from "react";
import Link from "next/link";
import { Heart, Eye, Shuffle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type CategoryKey = "All" | "8 Pack" | "14 pack" | "21 pack" | "6 pack";

type Product = {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  qty: string;
  badge?: string;
};

/* -------------------------------------------------------------------------- */
/* PRODUCTS                                                                   */
/* -------------------------------------------------------------------------- */

const products: Product[] = [
  {
    id: 1,
    name: "Roasted Peanuts: 8 Packs",
    qty: "8 Packs",
    price: "$36.00",
    img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    badge: "-11%",
  },
  {
    id: 2,
    name: "Roasted Peanuts: 14 Packs",
    price: "$55.00",
    qty: "14 Packs",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4971.jpg",
    badge: "-10%",
  },
  {
    id: 3,
    name: "Roasted Peanuts: 21 Packs",
    qty: "21 Packs",
    price: "$75.00",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4622-3-scaled.jpg",
  },
  {
    id: 4,
    name: "Roasted Peanuts: 6 Bags",
    qty: "6 Bags",
    price: "$65.00",
    img: "https://khfood.com/wp-content/uploads/2019/10/6-bags.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN SECTION                                                               */
/* -------------------------------------------------------------------------- */

export default function BrowseKHFoodProducts() {
  return (
    <section className="bg-neutral-50 py-24">
      <div className="max-w-7xl mx-auto ">
        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <FoodCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PRODUCT CARD                                                               */
/* -------------------------------------------------------------------------- */

function FoodCard({ p }: { p: Product }) {
  return (
    <Link href="/products/single" className="block">
      <article className="group relative rounded-2xl overflow-hidden bg-[#f7f7f7] h-[350px] cursor-pointer">
        {/* FULL IMAGE */}
        <div className="absolute inset-0">
          <img
            src={p.img}
            alt={p.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </div>

        {/* TOP LEFT QTY */}
        {p.qty && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-[#FFD100] text-[10px] font-bold px-2 py-1 shadow-sm">
            {p.qty}
          </span>
        )}

        {/* TOP RIGHT BADGE (optional) */}
        {/* {p.badge && (
          <span className="absolute right-3 top-3 z-10 inline-flex items-center rounded-full bg-white/95 text-black text-[10px] font-bold px-2 py-1 shadow-sm">
            {p.badge}
          </span>
        )} */}

        {/* HOVER ICONS (optional) */}
        <div className="absolute right-3 top-14 z-10 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition">
          <IconBtn icon={<Heart className="h-4 w-4" />} />
          <IconBtn icon={<Eye className="h-4 w-4" />} />
          <IconBtn icon={<Shuffle className="h-4 w-4" />} />
        </div>

        {/* BOTTOM CONTENT */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
          <h3 className="text-[15px] font-bold text-white leading-snug mb-2 line-clamp-2">
            {p.name}
          </h3>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[16px] font-bold text-white">{p.price}</span>

            {p.oldPrice && (
              <span className="text-white/70 text-[14px] line-through">
                {p.oldPrice}
              </span>
            )}
          </div>
        </div>

        {/* subtle border/hover ring */}
        <div className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-white/30 transition" />
      </article>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* ICON BUTTON                                                                */
/* -------------------------------------------------------------------------- */

function IconBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
        h-10 w-10 rounded-full bg-white text-neutral-900
        shadow-md flex items-center justify-center
        hover:bg-neutral-900 hover:text-white transition
      "
      aria-label="action"
    >
      {icon}
    </button>
  );
}
