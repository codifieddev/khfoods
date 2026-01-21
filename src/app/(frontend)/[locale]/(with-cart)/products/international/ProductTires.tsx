"use client";

import React from "react";
import { Heart, Eye, Shuffle, Check } from "lucide-react";
// import Link from "next/link";


/* -------------------------------------------------------------------------- */
/* TYPES                                    */
/* -------------------------------------------------------------------------- */

// CategoryKey abhi bhi Product type ke liye rakha hai, 
// lekin filtering logic hata diya gaya hai.
type CategoryKey =
  | "All"
  | "8 Pack"
  | "14 pack"
  | "21 pack"
  | "6 pack"; 

type Product = {
  category: Exclude<CategoryKey, "All">;
  name: string;
  price: string;
  href: string;
  image: string;
};

/* -------------------------------------------------------------------------- */
/* PRODUCTS                                    */
/* -------------------------------------------------------------------------- */

const products: Product[] = [
  {
    category: "8 Pack",
    name: "Roasted Peanuts: 8 Packs",
    price: "$36.00",
    href: "/products/kh-namkeen-mix",
    image: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4971.jpg",
  },
  {
    category: "14 pack",
    name: "Roasted Peanuts: 14 Packs",
    price: "$55.00",
    href: "/products/red-chilli-powder",
    image: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4622-3-scaled.jpg",
  },
  {
    category: "21 pack",
    name: "Roasted Peanuts: 21 Packs",
    price: "$75.00",
    href: "/products/veg-pulao",
    image: "https://khfood.com/wp-content/uploads/2019/10/6-bags.jpg",
  },
  {
    category: "6 pack",
    name: "Roasted Peanuts: 6 Bags",
    price: "$65.00",
    href: "/products/peanut-chikki",
    image: "https://khfood.com/wp-content/uploads/2023/08/2Q6A4963.jpg",
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN SECTION                                  */
/* -------------------------------------------------------------------------- */

export default function BrowseKHFoodProducts() {
  // Maine state (useState) aur filtering logic (useMemo) hata diya hai
  // kyunki ab buttons nahi hain.

  return (
    <section className="bg-neutral-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section (agar future mein chahiye ho to uncomment karein) */}
        {/* <div className="mb-8">
            <p className="text-xs tracking-[0.28em] uppercase text-neutral-500">
              KH Food Products
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-neutral-900">
              Explore Our Food Range
            </h2>
        </div> 
        */}

        {/* Grid Section - Ab direct 'products' map ho rahe hain */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <FoodCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* PRODUCT CARD                                  */
/* -------------------------------------------------------------------------- */

import Link from "next/link";

function FoodCard({ p }: { p: Product }) {
  return (
    <Link href="/products/single" className="block">
      <div className="relative rounded-[22px] border bg-white overflow-hidden group cursor-pointer">

        {/* Icons */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20
          flex flex-col gap-3
          opacity-0 translate-x-4
          transition-all duration-300
          group-hover:opacity-100 group-hover:translate-x-0"
          onClick={(e) => e.preventDefault()}
        >
          {/* <IconBtn icon={<Heart size={18} />} /> */}
          {/* <IconBtn icon={<Eye size={18} />} /> */}
          {/* <IconBtn icon={<Shuffle size={18} />} /> */}
          {/* <IconBtn icon={<Check size={18} />} /> */}
        </div>

        <div className="p-6">
          <span className="text-xs font-semibold bg-neutral-900 text-white px-3 py-1 rounded-full">
            {p.category}
          </span>

          <div className="mt-6 flex justify-center">
            <img src={p.image} alt={p.name} className="h-48 object-contain" />
          </div>

          <h3 className="mt-4 text-lg font-semibold">{p.name}</h3>
          <p className="mt-1 font-semibold">{p.price}</p>
        </div>

      </div>
    </Link>
  );
}




/* -------------------------------------------------------------------------- */
/* ICON BUTTON                                   */
/* -------------------------------------------------------------------------- */

function IconBtn({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      className="h-10 w-10 rounded-full bg-white text-neutral-900
      shadow-md flex items-center justify-center
      hover:bg-neutral-900 hover:text-white transition"
    >
      {icon}
    </button>
  );
}