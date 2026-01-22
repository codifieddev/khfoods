"use client";

import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import ProductTires from "./ProductTires";
import Modelmap from "@/frontendComponents/Home/Modelmap";
// Ensure this path matches your folder structure
import SliderBrand from "@/frontendComponents/Home/SliderBrand"; 
import Internationallogo from "@/frontendComponents/Home/Internationallogo";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

type SeriesKey = "UHP" | "FS" | "HP" | "P";

type Product = {
  name: string;
  series: SeriesKey;
  tag: string;
  price: string;
  href: string;
  img: string;
  specs: { label: string; value: string }[];
};

type FAQItem = {
  question: string;
  answer: string;
};

/* -------------------------------------------------------------------------- */
/* CONSTANTS (FAQ DATA) */
/* -------------------------------------------------------------------------- */

// const DOMESTIC_FAQS: FAQItem[] = [
//   {
//     question: "How long does domestic shipping take?",
//     answer: "For domestic orders, we usually deliver within 3-5 business days. We ship out your product on the same day if ordered before 12 PM.",
//   },
//   {
//     question: "Is shipping free within the country?",
//     answer: "Yes! We offer FREE shipping on all domestic orders above a minimum value. For smaller orders, a standard shipping fee applies.",
//   },
//   {
//     question: "Do you offer Cash on Delivery (COD)?",
//     answer: "Yes, COD is available for select pin codes. You can check availability at checkout by entering your zip code.",
//   },
//   {
//     question: "How do you ensure product freshness?",
//     answer: "Our products are packed directly from the factory line using premium nitrogen-flushed packaging to ensure they stay crispy and fresh for up to 6 months.",
//   },
//   {
//     question: "Can I return the products if I don't like them?",
//     answer: "Due to the perishable nature of food products, we do not accept returns. However, if you receive a damaged package, please contact us within 24 hours for a replacement.",
//   },
// ];

const INTERNATIONAL_FAQS: FAQItem[] = [
  {
    question: "Do you ship KH Food products internationally?",
    answer: "Yes, we ship our premium namkeen and peanuts globally. We handle all export documentation to ensure smooth customs clearance.",
  },
  {
    question: "What is the Minimum Order Quantity (MOQ) for exports?",
    answer: "For air cargo, the MOQ is 100kg. For sea freight (LCL/FCL), the minimum order starts from 1 pallet. Contact our export team for bulk rates.",
  },
  {
    question: "How is freshness maintained for long-distance shipping?",
    answer: "We use industrial-grade 3-layer nitrogen-flushed packaging that guarantees freshness for up to 12 months, even during long transit times.",
  },
  {
    question: "Do you offer Private Labeling (White Labeling)?",
    answer: "Yes, we offer private labeling services for international distributors. We can customize the packaging design and weight according to your market needs.",
  },
  {
    question: "Who handles the customs duties for international orders?",
    answer: "For standard international shipments, customs duties and taxes are the responsibility of the buyer as per their country's regulations. We provide all necessary certificates (FDA, FSSAI, Phytosanitary).",
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT */
/* -------------------------------------------------------------------------- */

export default function InternationalPage() {
  return (
    <main className="w-full bg-white text-neutral-900">
      {/* ========================== HERO ========================== */}
      <section
        className="relative w-full pt-[105px]"
        style={{
          backgroundImage: "url('/all-flag.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "460px",
        }}
      >
        {/* <div className="mx-auto min-h-[260px] max-w-7xl flex items-center justify-center">
         
               <h1 className="text-3xl font-bold uppercase tracking-tight text-black md:text-5xl">
            
            </h1>
        </div> */}

           <div className="mx-auto flex min-h-[260px] max-w-7xl items-center justify-center px-5 py-14 sm:px-6 md:min-h-[320px] md:py-20">
          <div className="text-center grid justify-center ">

            <h1 className="text-3xl font-bold uppercase tracking-tight text-black md:text-5xl">
              International Products (TAIWAN)
            </h1>
          </div>
        </div>

      </section>

      {/* ========================== PRODUCT GRID ========================== */}
      <ProductTires />

      {/* ========================== NUTRITION SECTION ========================== */}
      {/* <section className="py-24 flex justify-center">
        <section className="nf" aria-label="Nutrition Facts">
          <header className="nf__left">
            <h2 className="nf__title">Nutrition Facts</h2>

            <div className="nf__meta">
              <div>Serving Size <strong>1 oz (28g)</strong></div>
              <div>Servings Per Container <strong>6</strong></div>
            </div>

            <div className="nf__divider nf__divider--thick" />

            <div className="nf__calories">
              <div className="nf__caloriesTop">
                <span className="nf__caloriesLabel">Calories</span>
                <span className="nf__caloriesValue">170</span>
              </div>
              <div className="nf__caloriesSub">Calories from Fat 110</div>
            </div>

            <div className="nf__divider" />

            <p className="nf__footnote">
              *Percent Daily Value (DV) are based on a 2,000 calorie diet.
            </p>
          </header>

          <div className="nf__right">
            <div className="nf__cols">
              <div className="nf__col">
                <div className="nf__colHead">
                  <span>Amount Per Serving</span>
                  <span className="nf__dvHead">%DV*</span>
                </div>

                <div className="nf__row nf__row--major">
                  <span>Total Fat <span className="nf__amt">13g</span></span>
                  <span className="nf__dv">21%</span>
                </div>

                <div className="nf__row nf__row--sub">
                  <span>Saturated Fat <span className="nf__amt">2g</span></span>
                  <span className="nf__dv">9%</span>
                </div>

                <div className="nf__row nf__row--major">
                  <span>Sodium <span className="nf__amt">120mg</span></span>
                  <span className="nf__dv">5%</span>
                </div>
              </div>

              <div className="nf__col">
                <div className="nf__colHead">
                  <span>Amount Per Serving</span>
                  <span className="nf__dvHead">%DV*</span>
                </div>

                <div className="nf__row nf__row--major">
                  <span>Total Carb <span className="nf__amt">6g</span></span>
                  <span className="nf__dv">2%</span>
                </div>

                <div className="nf__row nf__row--sub">
                  <span>Fiber <span className="nf__amt">3g</span></span>
                  <span className="nf__dv">11%</span>
                </div>

                <div className="nf__row nf__row--major">
                  <span>Protein <span className="nf__amt">7g</span></span>
                  <span className="nf__dv"></span>
                </div>
              </div>
            </div>

            <div className="nf__divider nf__divider--thick" />

            <div className="nf__vitamins">
              <span>Vitamin A 4%</span> • <span>Vitamin C 0%</span> •
              <span>Calcium 0%</span> • <span>Iron 0%</span>
            </div>
          </div>
        </section>
      </section> */}

      {/* ========================== MODEL MAP ========================== */}
      <Modelmap />

      {/* ========================== SLIDER BRAND ========================== */}
      {/* <SliderBrand /> */}

      {/* ========================== FAQ ========================== */}
      <FAQSection />

      <Internationallogo />

      <SliderBrand />

      {/* ========================== STYLES ========================== */}
      <style jsx global>{`
        .nf {
          display: grid;
          grid-template-columns: 320px 1fr;
          max-width: 980px;
          border: 3px solid #000;
          font-family: Arial, Helvetica, sans-serif;
        }
        .nf__left {
          padding: 14px;
          border-right: 3px solid #000;
        }
        .nf__title {
          font-size: 44px;
          font-weight: 900;
        }
        .nf__right {
          padding: 14px;
        }
        .nf__row {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #000;
          padding: 6px 0;
        }
        @media (max-width: 760px) {
          .nf {
            grid-template-columns: 1fr;
          }
          .nf__left {
            border-right: 0;
            border-bottom: 3px solid #000;
          }
        }
      `}</style>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ COMPONENTS */
/* -------------------------------------------------------------------------- */

function FAQSection() {
  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          {/* <p className="text-neutral-600">Everything you need to know about our products and shipping.</p> */}
        </div>

        {/* --- Domestic Section --- */}
        <div className="mb-12">
          {/* <h3 className="text-xl font-bold text-orange-600 mb-6 flex items-center gap-2">
             🏠 Domestic Queries
          </h3> */}
          {/* {DOMESTIC_FAQS.map((faq, i) => (
            <Accordion key={`dom-${i}`} {...faq} />
          ))} */}
        </div>

        {/* --- International Section --- */}
        <div>
          {/* <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
             🌍 International & Export Queries
          </h3> */}
          {INTERNATIONAL_FAQS.map((faq, i) => (
            <Accordion key={`int-${i}`} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-white mb-4 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-neutral-50 transition-colors"
      >
        <span className="font-medium text-lg">{question}</span>
        <div className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
           {open ? <FaMinus className="text-orange-500" /> : <FaPlus className="text-neutral-400" />}
        </div>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="p-5 pt-0 text-neutral-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}