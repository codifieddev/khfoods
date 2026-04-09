"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from "lucide-react";
import { Product } from "@/types/cms";
import RichText from "@/components/RichText";

type Props = {
  product: Product;
};

export default function ProductPageClient({ product }: Props) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [qty, setQty] = useState(1);

  // Normalize images
  const images = useMemo(() => {
    return (product.images || [])
      .map((img) => (typeof img === "string" ? img : img?.url))
      .filter(Boolean) as string[];
  }, [product.images]);

  const currentHero = images[heroIndex] || "/placeholder.png";

  const next = () => setHeroIndex((i) => (i + 1) % images.length);
  const prev = () => setHeroIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  // Determine pricing display
  const mainPrice = product.pricing?.[0]?.value || 0;

  const handleAddToCart = () => {
    console.log("ADD TO CART 👉", {
      id: product.id,
      title: product.title,
      price: mainPrice,
      quantity: qty,
      image: currentHero,
    });
    alert(`${product.title} added to cart ✅`);
  };

  return (
    <div className="md:max-w-7xl w-[95%] mx-auto px-4 md:px-8 pt-10 md:pt-40 pb-20">
      <section className="bg-white relative mb-12 md:mb-20">
        <div className="lg:flex lg:items-start gap-12 relative">
          
          {/* Left Side: Image Gallery */}
          <div className="lg:w-[55%] w-full lg:sticky lg:top-32 lg:self-start z-10 mb-8 lg:mb-0">
            <div className="bg-gradient-to-b from-[#f9fafb] to-[#e5e7eb] border border-neutral-200 rounded-[12px] relative overflow-hidden shadow-sm">
               <div className="flex h-full min-h-[400px] sm:min-h-[500px]">
                
                {/* Desktop Thumbnails */}
                {images.length > 1 && (
                  <div className="hidden md:flex flex-col gap-3 pt-10 pb-10 pl-6 pr-2">
                    {images.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        className={`relative h-16 w-16 rounded-xl overflow-hidden border transition-all ${
                          idx === heroIndex
                            ? "border-black shadow-md ring-1 ring-black"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={url} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image View */}
                <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-8">
                  <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center transition-all duration-500">
                    <img
                      src={currentHero}
                      alt={product.title}
                      className="h-full w-auto max-h-[480px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Mobile Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-sm border flex items-center justify-center md:hidden active:scale-95 transition-all">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-sm border flex items-center justify-center md:hidden active:scale-95 transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 right-4">
                    <button className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700 shadow-sm hover:bg-white transition-colors">
                      <Maximize2 className="w-3 h-3" /> Zoom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:w-[45%] flex flex-col pt-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black text-white">New</span>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${product.stock ? 'text-green-700' : 'text-red-700'}`}>
                  {product.stock ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <h5 className="text-3xl font-bold text-gray-900">${mainPrice.toFixed(2)}</h5>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 border-l-4 border-[#e6b27f] pl-4">
              <RichText data={product.description} />
            </div>

            {/* Selection Controls */}
            <div className="flex flex-col gap-6 pt-8 border-t border-gray-100">
              <div className="flex gap-4 items-center">
                <div className="w-32">
                  <div className="relative flex items-center">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="absolute left-3 text-gray-400 hover:text-black font-bold p-1 transition-colors"
                    >
                      <Minus className="w-4 h-4 cursor-pointer" />
                    </button>
                    <input
                      type="number"
                      value={qty}
                      readOnly
                      className="w-full text-center bg-gray-50 border border-gray-200 rounded-lg py-4 font-bold text-gray-900 focus:outline-none"
                    />
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="absolute right-3 text-gray-400 hover:text-black font-bold p-1 transition-colors"
                    >
                      <Plus className="w-4 h-4 cursor-pointer" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.stock}
                  className="flex-1 bg-[#eaba88] hover:bg-[#d8a876] text-black font-bold uppercase py-4 rounded-lg shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                >
                  ADD TO CART
                </button>
              </div>

              {/* Dynamic Accordions for Details */}
              <div className="mt-8 space-y-3">
                {product.details?.map((detail, idx) => (
                  <SlimAccordion key={idx} title={detail.title}>
                    <RichText data={detail.content} />
                  </SlimAccordion>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SlimAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50/50"
      >
        <span className="text-[14px] font-bold uppercase tracking-wide text-gray-800">{title}</span>
        {open ? <Minus className="h-4 w-4 text-gray-400" /> : <Plus className="h-4 w-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-gray-600 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
