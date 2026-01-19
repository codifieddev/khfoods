"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, ShoppingCart } from "lucide-react";
import { FaPlus, FaRegWindowMinimize } from "react-icons/fa";
import SimilarProducts from "./SimilarProducts";

// ---------------- STATIC DATA ----------------

const HERO_IMAGES = [
  "/product.png",
  "/product.png",
  "/product.png",
  "/product.png",
];

type RangeRow = {
  sku: string;
  name: string;
  airRetention: string;
  commonSize: string;
  ertro: string;
  casing: string;
  compound: string;
  sidewall: string;
  bead: string;
  weight: string;
  rating: string;
};

const RANGE_ROWS: RangeRow[] = [
  {
    sku: "GR.001.57.584.V002.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "27.5x2.25",
    ertro: "57-584",
    casing: "60tpi",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "680",
    rating: "E-25",
  },
  {
    sku: "GR.001.57.622.V002.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.25",
    ertro: "57-622",
    casing: "60tpi",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "725",
    rating: "E-25",
  },
  {
    sku: "GR.001.61.622.V002.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.4",
    ertro: "61-622",
    casing: "60tpi",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "765",
    rating: "E-25",
  },
  {
    sku: "GR.001.57.584.V003.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "27.5x2.25",
    ertro: "57-584",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "690",
    rating: "E-25",
  },
  {
    sku: "GR.001.57.622.V003.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.25",
    ertro: "57-622",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "730",
    rating: "E-25",
  },
  {
    sku: "GR.001.61.622.V003.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.4",
    ertro: "61-622",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "770",
    rating: "E-25",
  },
  {
    sku: "GR.001.57.584.V006.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "27.5x2.25",
    ertro: "57-584",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Tan",
    bead: "Folding",
    weight: "700",
    rating: "E-25",
  },
  {
    sku: "GR.001.57.622.V006.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.25",
    ertro: "57-622",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Tan",
    bead: "Folding",
    weight: "740",
    rating: "E-25",
  },
  {
    sku: "GR.001.61.622.V006.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.4",
    ertro: "61-622",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Tan",
    bead: "Folding",
    weight: "770",
    rating: "E-25",
  },
  {
    sku: "GR.001.66.622.V003.R",
    name: "Peak",
    airRetention: "Tubeless Ready",
    commonSize: "29x2.6",
    ertro: "66-622",
    casing: "120tpi + Sidewall Protection",
    compound: "Dynamic A/T",
    sidewall: "Black",
    bead: "Folding",
    weight: "790",
    rating: "E-25",
  },
];

// Config options (match screenshot style)
const CONFIG = {
  system: ["tubeless-ready", "tubeless-complete"] as const,
  color: ["black", "tan"] as const,
  width: ["40mm", "45mm", "50mm"] as const,
};

type Variant = {
  system: (typeof CONFIG.system)[number];
  color: (typeof CONFIG.color)[number];
  width: (typeof CONFIG.width)[number];
  sku: string;
  price: number;
  stockLabel: "IN STOCK" | "OUT OF STOCK";
};

// Static variant matrix for the top configurator
const VARIANTS: Variant[] = [
  { system: "tubeless-ready", color: "black", width: "40mm", sku: "PK-TR-BLK-40", price: 72, stockLabel: "IN STOCK" },
  { system: "tubeless-ready", color: "black", width: "45mm", sku: "PK-TR-BLK-45", price: 72, stockLabel: "IN STOCK" },
  { system: "tubeless-ready", color: "tan", width: "40mm", sku: "PK-TR-TAN-40", price: 72, stockLabel: "IN STOCK" },
  { system: "tubeless-complete", color: "black", width: "40mm", sku: "PK-TC-BLK-40", price: 90, stockLabel: "IN STOCK" },
  { system: "tubeless-complete", color: "tan", width: "40mm", sku: "PK-TC-TAN-40", price: 90, stockLabel: "IN STOCK" },
];

// ---------------- SUB-COMPONENTS ----------------

type PrettyAccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const PrettyAccordion: React.FC<PrettyAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        className="w-full flex justify-between items-center py-4 text-left group"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="font-semibold text-gray-900 group-hover:text-black text-[15px]">
          {title}
        </span>
        <span className="text-[16px] text-gray-500 group-hover:text-black">
          {open ? <FaRegWindowMinimize /> : <FaPlus />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[900px] opacity-100 pb-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

function HowToBuyPanel() {
  return (
    <div className="space-y-3">
      <BuyRow region="USA" shopLabel="US Shop" dealerLabel="Dealer Locator" />
      <BuyRow region="UK" shopLabel="UK Shop" dealerLabel="Dealer Locator" />
      <div className="grid grid-cols-2 sm:grid-cols-[1fr_2fr] gap-4 pt-2 border-t border-dashed border-gray-200 mt-2">
        <p className="uppercase text-[11px] font-bold text-neutral-500 tracking-wide">
          Global
        </p>
        <p className="text-[12px] text-neutral-600">
          Check with your local Goodyear distributor for availability in your region.
        </p>
      </div>
    </div>
  );
}

type BuyRowProps = { region: string; shopLabel: string; dealerLabel: string };

function BuyRow({ region, shopLabel, dealerLabel }: BuyRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1fr] gap-4 items-center">
      <p className="uppercase text-[11px] font-bold text-neutral-500 tracking-wide col-span-2 sm:col-span-1">
        {region}
      </p>
      <a
        href="#"
        className="text-[13px] font-medium text-neutral-900 hover:text-green-700 underline underline-offset-2 decoration-neutral-300 hover:decoration-green-700 transition-all"
      >
        {shopLabel}
      </a>
      <a
        href="#"
        className="text-[13px] font-medium text-neutral-900 hover:text-green-700 underline underline-offset-2 decoration-neutral-300 hover:decoration-green-700 transition-all"
      >
        {dealerLabel}
      </a>
    </div>
  );
}

const ResponsiveRangeTable: React.FC<{ rows: RangeRow[] }> = ({ rows }) => {
  const desktopHeaders = [
    "SKU",
    "Name",
    "Air Retention",
    "Size",
    "ETRTO",
    "Casing",
    "Compound",
    "Color",
    "Bead",
    "Weight",
    "E-Rating",
  ];

  return (
    <div className="max-h-[520px] overflow-auto">
      <table className="min-w-full text-left text-[13px] hidden md:table">
        <thead className="bg-gray-100 sticky top-0 z-10 shadow-sm">
          <tr>
            {desktopHeaders.map((h) => (
              <th
                key={h}
                className="py-3 px-4 font-bold text-gray-700 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, idx) => (
            <tr
              key={row.sku}
              className={`transition-colors hover:bg-[#FFD100] ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <td className="py-3 px-4 font-mono text-xs text-gray-500">{row.sku}</td>
              <td className="py-3 px-4 font-bold text-gray-900">{row.name}</td>
              <td className="py-3 px-4">{row.airRetention}</td>
              <td className="py-3 px-4">{row.commonSize}</td>
              <td className="py-3 px-4 font-mono text-xs">{row.ertro}</td>
              <td className="py-3 px-4">{row.casing}</td>
              <td className="py-3 px-4">{row.compound}</td>
              <td className="py-3 px-4">{row.sidewall}</td>
              <td className="py-3 px-4">{row.bead}</td>
              <td className="py-3 px-4 font-medium">{row.weight}g</td>
              <td className="py-3 px-4">{row.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile */}
      <div className="md:hidden space-y-4 p-4">
        {rows.map((row) => (
          <div
            key={row.sku}
            className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm space-y-2 text-sm"
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">{row.name}</h3>
              <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                {row.sku}
              </span>
            </div>
            <div className="flex justify-between"><span className="font-medium text-gray-500">System:</span><span className="text-gray-800">{row.airRetention}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-500">Size:</span><span className="text-gray-800">{row.commonSize}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-500">Casing:</span><span className="text-gray-800">{row.casing}</span></div>
            <div className="flex justify-between"><span className="font-medium text-gray-500">Color:</span><span className="text-gray-800">{row.sidewall}</span></div>
            <div className="flex justify-between pt-2 border-t border-dashed border-gray-100">
              <span className="font-medium text-gray-500">E-Rating:</span>
              <span className="text-gray-800 font-bold">{row.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------- MAIN (STATIC) ----------------

export default function ProductGravelPage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [openZoom, setOpenZoom] = useState(false);

  // default selected (match screenshot)
  const [system, setSystem] = useState<Variant["system"]>("tubeless-ready");
  const [color, setColor] = useState<Variant["color"]>("black");
  const [width, setWidth] = useState<Variant["width"]>("40mm");
  const [qty, setQty] = useState(1);

  const imageCount = HERO_IMAGES.length;

  useEffect(() => {
    if (heroIndex >= imageCount) setHeroIndex(0);
  }, [heroIndex, imageCount]);

  const next = () => setHeroIndex((i) => (i + 1) % imageCount);
  const prev = () => setHeroIndex((i) => (i === 0 ? imageCount - 1 : i - 1));

  const currentHero = HERO_IMAGES[heroIndex];

  const selectedVariant = useMemo(() => {
    return VARIANTS.find((v) => v.system === system && v.color === color && v.width === width) || null;
  }, [system, color, width]);

  const minPrice = 58;
  const maxPrice = 90;

  const priceDisplay = selectedVariant
    ? `$${selectedVariant.price.toFixed(2)}`
    : `$${minPrice.toFixed(2)} – $${maxPrice.toFixed(2)}`;

  const canAddToCart = Boolean(system && color && width);


  type SlimAccordionProps = {
  title: string;
  children: React.ReactNode;
};

function SlimAccordion({ title, children }: SlimAccordionProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/80">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <span className="text-[18px] font-semibold uppercase ">
          {title}
        </span>
        {open ? (
          <Minus className="h-4 w-4 text-neutral-600" />
        ) : (
          <Plus className="h-4 w-4 text-neutral-600" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 text-[13px] text-neutral-800">
          {children}
        </div>
      )}
    </div>
  );
}


  return (
    <>
    <div className="md:max-w-7xl w-[90%] mx-auto px-0 lg:px-0 pt-[180px] md:pt-40">
  
      <section className="bg-white relative mb-12 md:mb-20">
        <div className="lg:flex lg:items-start gap-12 relative">
      
          <div className="lg:w-[55%] w-full lg:sticky lg:top-32 lg:self-start z-10 mb-8 lg:mb-0">
            <div className="bg-gradient-to-b from-[#f9fafb] to-[#e5e7eb] border border-neutral-200 rounded-[12px] relative">
              <div className="flex h-full">
                
                <div className="hidden md:flex flex-col gap-3 pt-10 pb-10 pl-6 pr-2">
                  {HERO_IMAGES.map((url, idx) => (
                    <button
                      key={url}
                      onClick={() => setHeroIndex(idx)}
                      className={`relative h-16 w-16 rounded-xl overflow-hidden border transition-all ${
                        idx === heroIndex
                          ? "border-black shadow-md ring-1 ring-black"
                          : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
                      }`}
                    >
                      <img src={url} alt={`Thumb ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>

               
                <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-8 md:px-8 md:py-16 min-h-[400px] sm:min-h-[500px]">
                  <div className="relative w-full max-w-[420px] aspect-[3/4] flex items-center justify-center transition-all duration-500">
                    <img
                      src={currentHero}
                      alt="Product Hero"
                      className="h-full w-auto max-h-[480px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                    />
                  </div>

                
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all md:hidden"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:text-black hover:scale-105 transition-all md:hidden"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

              
                  <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                    <button
                      onClick={() => setOpenZoom(true)}
                      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:bg-white hover:text-black transition-colors shadow-sm"
                    >
                      <Maximize2 className="w-3 h-3" /> Zoom
                    </button>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="mt-4 flex md:hidden gap-3 overflow-x-auto pb-4 px-1 justify-center">
              {HERO_IMAGES.map((url, idx) => (
                <button
                  key={url}
                  onClick={() => setHeroIndex(idx)}
                  className={`flex-shrink-0 relative h-16 w-16 rounded-lg overflow-hidden border ${
                    idx === heroIndex
                      ? "border-black shadow-sm ring-1 ring-black/50"
                      : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} className="h-full w-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          </div>

         
          <div className="lg:w-[45%] flex flex-col pt-2 order-first lg:order-last">
          
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black text-white">
                  New
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-green-700">
                  {selectedVariant?.stockLabel ?? "IN STOCK"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-semibold">
              Roasted Peanuts: 14 Packs

              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <h5 className="text-2xl font-bold text-gray-900">$58.00</h5>
                {/* <p className="text-sm text-gray-500 font-medium">VAT included</p> */}
              </div>
            </div>

          
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 md:p-0 relative bottom-0 z-20 lg:static lg:pb-6 lg:shadow-none lg:border-none lg:bg-transparent">
             

               <h4 className="text-xl font-medium pb-2">14 Packs, 6 oz each</h4>
                   <ul className="list-disc pl-6 ">
                     <li>Plastic container/lid with a sealed film to ensure freshness.</li>
                     <li>Non-GMO Verified</li>
                     <li>All Natural Ingredients: Salt and Peanuts</li>
                     <li>Made in USA</li>
                  </ul>


              {/* Selects */}
           

             
              <div className="mt-7 pt-6 flex gap-4">
                <div className="w-24">
                  <label className="sr-only">Quantity</label>
                  <div className="relative flex items-center">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="absolute left-2 text-gray-400 hover:text-black text-lg font-bold px-1 select-none"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full text-center bg-gray-50 border border-gray-200 rounded-md py-3 font-bold text-gray-900 focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="absolute right-2 text-gray-400 hover:text-black text-lg font-bold px-1 select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  disabled={!canAddToCart}
                  className="flex-1 bg-[#eaba88] hover:bg-[#eaba88] text-black font-bold text-[12px] uppercase tracking-wider rounded-md shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>
              </div>

             
              {/* <div className="border-t border-neutral-200 mt-8">
                <PrettyAccordion title="Product Details" defaultOpen={false}>
                  <div className="space-y-4 pt-2">
                    <p>
                      A fast rolling tire for the XC competitor, and anyone who wonders what’s
                      beyond the next forest and over the next Peak.
                    </p>
                    <p>
                      The Peak excels in every department: weight, rolling efficiency, durability,
                      traction and ease of use.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-2">
                      <p className="font-semibold text-gray-900 mb-1">Best For:</p>
                      <p>Cross-Country, Marathon, Light Trail</p>
                    </div>
                  </div>
                </PrettyAccordion>

                <PrettyAccordion title="How To Buy">
                  <HowToBuyPanel />
                </PrettyAccordion>

                <PrettyAccordion title="Technical Specs">
                  <ul className="list-disc pl-4 space-y-1 pt-2">
                    <li>Dynamic A/T Compound</li>
                    <li>Tubeless Complete or Ready</li>
                    <li>Folding Bead</li>
                    <li>Optimized tread spacing</li>
                    <li>120tpi options with Sidewall Protection</li>
                  </ul>
                </PrettyAccordion>
              </div> */}

              <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-center hidden lg:block">
                <p className="text-sm text-gray-500 mb-2">Need help choosing?</p>
                <a href="#" className="text-sm font-bold text-black underline">
                  View our Foods Buying Guide
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* <section className="bg-white border border-gray-200 rounded-[18px] shadow-sm mb-24 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-md md:text-xl font-bold uppercase tracking-wider text-gray-900">
            Range Overview 1
          </h2>
        </div>

        <ResponsiveRangeTable rows={RANGE_ROWS} />

        <div className="max-w-3xl text-center mx-auto py-6 px-6">
          <p className="font-medium text-center text-sm text-gray-600">
            All published weights are +/- 7%. Specifications subject to change without notice.
            Tire sizing is based upon measurement of the widest point of the inflated tire at max psi after 24hrs.
          </p>
        </div>
      </section> */}

      <section className="grid lg:grid-cols-[1.05fr_1.1fr] gap-6 lg:gap-10 items-stretch">
          {/* text block */}
          <div className="bg-white border border-neutral-200 rounded-[26px] shadow-sm px-6 md:px-10 py-8 md:py-10">
            <div className="max-w-xl space-y-6 text-[16px] leading-relaxed text-neutral-800">
              <div className="space-y-3">
                <h2 className="text-[24px] font-semibold uppercase text-black">
                  Description
                </h2>
                <div>
                  <h4 className="text-lg font-medium">14 Packs, 6 oz each</h4>
                   <ul className="list-disc pl-6 ">
                     <li>Plastic container/lid with a sealed film to ensure freshness.</li>
                     <li>Non-GMO Verified</li>
                     <li>All Natural Ingredients: Salt and Peanuts</li>
                     <li>Made in USA</li>
                  </ul>
                  </div>
              </div>

              {/* <div className="pt-4 border-t border-neutral-200 space-y-4">
                <h3 className="text-[20px] md:text-[28px] font-medium uppercase text-black">
                  For Peak Performance
                </h3>
                <p>
                  A round profile, closely–spaced tread, and supple casing
                  contribute to Peak&apos;s low rolling resistance, while ample
                  traction and braking performance are delivered thanks to
                  siping on every knob and its multi–dimensional Dynamic:A/T
                  compound.
                </p>
                <p>Optimized for hard hitting gravel terrain.</p>
              </div> */}
            </div>
          </div>

          {/* lifestyle image */}
          <div className="rounded-[26px] overflow-hidden border border-neutral-200 shadow-sm bg-[#020617]">
            <img
              src="https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg"
              alt="Gravel bike with Peak tyres"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

     
      {openZoom && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setOpenZoom(false)}
            className="absolute top-4 right-4 text-white text-3xl font-light p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            &times;
          </button>
          <div className="w-full max-w-4xl h-full max-h-[90vh] flex items-center justify-center">
            <img
              src={currentHero}
              alt="Zoomed Product View"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
      

        

        <SimilarProducts/>

    </>
  );
}
