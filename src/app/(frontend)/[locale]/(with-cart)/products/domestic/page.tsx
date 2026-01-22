"use client";

import React, { useMemo, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa"; 
import ProductTires from "./ProductTires";
import Modelmap from "@/frontendComponents/Home/Modelmap";
import SliderBrand from "@/frontendComponents/Home/SliderBrand";
import Uslogo from "@/frontendComponents/Home/Uslogo";


// -------------------------------------------------------------------------- 
// TYPES
// -------------------------------------------------------------------------- 

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

// -------------------------------------------------------------------------- 
// CONSTANTS
// -------------------------------------------------------------------------- 

const TIRE_IMG =
  "https://goodyear.creativeconsult.co.in/wp-content/uploads/2025/11/Render-Cut-Vector-R-Z30SW-1024x1024.png";

// ======================= UPDATED FOOD FAQs ONLY ======================= 

// ERROR FIXED HERE: Type changed from FAQS[] to FAQItem[]
const DOMESTIC_FAQS: FAQItem[] = [
  {
    question: "How long does domestic shipping take?",
    answer: "For domestic orders, we usually deliver within 3-5 business days. We ship out your product on the same day if ordered before 12 PM.",
  },
  {
    question: "Is shipping free within the country?",
    answer: "Yes! We offer FREE shipping on all domestic orders above a minimum value. For smaller orders, a standard shipping fee applies.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Yes, COD is available for select pin codes. You can check availability at checkout by entering your zip code.",
  },
  {
    question: "How do you ensure product freshness?",
    answer: "Our products are packed directly from the factory line using premium nitrogen-flushed packaging to ensure they stay crispy and fresh for up to 6 months.",
  },
  {
    question: "Can I return the products if I don't like them?",
    answer: "Due to the perishable nature of food products, we do not accept returns. However, if you receive a damaged package, please contact us within 24 hours for a replacement.",
  },
];

// -------------------------------------------------------------------------- 
// MAIN COMPONENT
// -------------------------------------------------------------------------- 

export default function InternationalPage() {
  
  // Products Data
  const products: Product[] = useMemo(
    () => [
      {
        name: "Eagle F1 SuperSport R",
        series: "UHP",
        tag: "Race / Pure Speed",
        price: "$95.00 – $120.00",
        href: "/shop/eagle-f1-supersport-r",
        img: TIRE_IMG,
        specs: [
          { label: "Air", value: "Tubeless Ready" },
          { label: "Casing", value: "120tpi" },
          { label: "Compound", value: "Dynamic UHP" },
        ],
      },
      {
        name: "Eagle F1R",
        series: "UHP",
        tag: "Fast Road / Aero",
        price: "$90.00 – $110.00",
        href: "/shop/eagle-f1r",
        img: TIRE_IMG,
        specs: [
          { label: "Air", value: "Tubeless Ready" },
          { label: "Casing", value: "120tpi" },
          { label: "Bead", value: "Folding" },
        ],
      },
      {
        name: "Vector 4Seasons",
        series: "HP",
        tag: "All-Season / Endurance",
        price: "$70.00 – $95.00",
        href: "/shop/vector-4seasons",
        img: TIRE_IMG,
        specs: [
          { label: "Grip", value: "Wet Focus" },
          { label: "Protection", value: "Enhanced" },
          { label: "Use", value: "All-Season" },
        ],
      },
      {
        name: "Vector R",
        series: "FS",
        tag: "Fitment / OEM",
        price: "$65.00 – $85.00",
        href: "/shop/vector-r",
        img: TIRE_IMG,
        specs: [
          { label: "Fit", value: "Multiple Sizes" },
          { label: "Air", value: "Tubeless Ready" },
          { label: "Bead", value: "Folding" },
        ],
      },
      {
        name: "Vector Sport",
        series: "HP",
        tag: "Road / Sport",
        price: "$55.00 – $75.00",
        href: "/shop/vector-sport",
        img: TIRE_IMG,
        specs: [
          { label: "Air", value: "Tubeless Ready" },
          { label: "Casing", value: "60tpi" },
          { label: "Use", value: "Training" },
        ],
      },
      {
        name: "Eagle Sport",
        series: "P",
        tag: "Everyday Performance",
        price: "$45.00 – $60.00",
        href: "/shop/eagle-sport",
        img: TIRE_IMG,
        specs: [
          { label: "Air", value: "Tubeless Ready" },
          { label: "Durability", value: "High" },
          { label: "Use", value: "Daily" },
        ],
      },
    ],
    []
  );

  return (
    <main className="w-full bg-white text-neutral-900">
      {/* ========================== HERO ========================== */}
      <section
        className="relative w-full overflow-hidden pt-[105px]"
        style={{
          backgroundImage: "url('/usa-logo-flag.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "460px",
        }}
      >
        <div className="mx-auto flex min-h-[260px] max-w-7xl items-center justify-center px-5 py-14 sm:px-6 md:min-h-[320px] md:py-20">
          <div className="text-center grid justify-center ">

            <h1 className="text-3xl font-bold uppercase tracking-tight text-black md:text-5xl">
              Domestic Products (US) 
            </h1>
          </div>
        </div>
      </section>

      {/* <Uslogo /> */}

      <ProductTires />
      
      {/* ========================== ModelMap ========================== */}
      <Modelmap />
      
      {/* <SliderBrand/> */}
{/* <Uslogo /> */}


      {/* ========================== FAQ Section ========================== */}
      <FAQSection />

       <Uslogo />

       <SliderBrand/>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ COMPONENTS */
/* -------------------------------------------------------------------------- */

function FAQSection() {
  return (
    <section className="bg-neutral-50 py-24 border-t border-neutral-200">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {/* ERROR FIXED HERE: Changed FAQS.map to DOMESTIC_FAQS.map */}
          {DOMESTIC_FAQS.map((faq, idx) => (
            <Accordion key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold">{question}</span>
        {isOpen ? <FaMinus size={14} /> : <FaPlus size={14} />}
      </button>

      {isOpen && (
        <p className="p-5 pt-0 text-sm text-neutral-600">{answer}</p>
      )}
    </div>
  );
}