"use client";

import React from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  img: string;
  badge?: string;
};

// Data for the new section (You can change images/names here)
const products: Product[] = [
  {
    id: 1,
    name: "Roasted Peanuts: 8 Packs",
    price: "$36.00",
    // oldPrice: "$9.00",
    img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    badge: "-11%",
  },
  {
    id: 2,
    name: "Roasted Peanuts: 14 Packs",
    price: "$55.00",
    // oldPrice: "$23.00",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4971.jpg",
    badge: "-10%",
  },
  {
    id: 3,
    name: "Roasted Peanuts: 21 Packs",
    price: "$75.00",
    img: "https://khfood.com/wp-content/uploads/2019/11/2Q6A4622-3-scaled.jpg",
  },
  {
    id: 4,
    name: "Roasted Peanuts: 6 Bags",
    price: "$65.00",
    img: "https://khfood.com/wp-content/uploads/2019/10/6-bags.jpg",
  },
];


const ProductSectionRight: React.FC = () => {
  return (
    <section className="w-full bg-white py-16">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* ✅ LAYOUT LOGIC CHANGE:
           - flex-col-reverse: Mobile par Image (jo HTML m 2nd number pr h) Upar dikhegi.
           - lg:flex-row: Desktop par Left (Grid) aur Right (Image) side-by-side dikhenge.
        */}
        <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-10 items-stretch">

          {/* 1. LEFT SIDE: PRODUCTS GRID (Previously Right) */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="bg-[#f7f7f7] rounded-xl overflow-hidden flex flex-col h-full group"
              >
                {/* Image + badge */}
                <div className="relative pt-4 pb-2 px-4 bg-[#f7f7f7]">
                  {product.badge && (
                    <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[#FFD100] text-[10px] font-bold px-2 py-1 shadow-sm z-10">
                      ⚡ {product.badge}
                    </span>
                  )}

                  <div className="aspect-[5/4] w-full flex items-center justify-center">
                    <img
                      src={product.img}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-6 flex flex-col flex-grow bg-[#f7f7f7]">
                  <div className="flex items-center text-[11px] mb-2">
                    <span className="text-[13px] text-yellow-500 mr-1">★★★★★</span>
                    <span className="text-gray-400 font-medium">(0)</span>
                  </div>

                  <h3 className="text-[15px] font-bold text-[#111] leading-snug mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-auto flex items-center gap-3">
                    <span className="text-[16px] font-bold text-[#111]">
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <span className="text-[13px] text-gray-400 line-through">
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* 2. RIGHT SIDE: PROMO CARD (Previously Left) */}
          <div className="w-full lg:w-[42%] flex-shrink-0 relative overflow-hidden rounded-3xl bg-black text-white min-h-[500px] lg:min-h-0">
            <div className="absolute inset-0">
  <img
    src="/assets/Image/khfoodImage/Image-2.jpg"
    alt="Promo"
    className="h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40" /> {/* change 40 -> 20/50 */}
</div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="relative flex flex-col justify-between h-full p-8 md:p-10">
              <div className="mt-4">
                <p className="text-[11px] tracking-[0.18em] uppercase text-white/70 mb-3">
                  New Collection
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight max-w-sm">
                  Design That <br /> Speaks For Itself
                </h2>
              </div>

              <button className="mt-8 self-start inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 text-[13px] font-bold tracking-[0.16em] uppercase hover:bg-neutral-100 transition">
                Shop Now
                <span className="ml-2 text-lg">↗</span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ProductSectionRight;