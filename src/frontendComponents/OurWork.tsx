"use client";
import React from "react";
import { Building2, LayoutGrid, Home } from "lucide-react";

// Updated CONTENT — Based on your provided images
const services = [
  {
    id: 1,
    icon: <Building2 className="w-12 h-12 text-[#8C2C1A]" />, // Dark Brown
    title: "GIFT BOX",
    description:
      "With ANY order of our 6 oz. products, you will receive FREE complimentary gift boxes! 100% natural, no preservatives.",
    number: "01",
    button: "SHOP NOW",
  },
  {
    id: 2,
    icon: <LayoutGrid className="w-12 h-12 text-[#8C2C1A]" />,
    title: "WHOLESALE",
    description:
      "Click the link below to checkout our amazing deals for wholesale! Premium roasted peanuts since 1991.",
    number: "02",
    button: "SIGN UP",
  },
  {
    id: 3,
    icon: <Home className="w-12 h-12 text-[#8C2C1A]" />,
    title: "INTERNATIONAL SHIPPING",
    description:
      "Available now! Shipping to Taiwan. With ANY 6 oz. order, you will receive FREE complimentary gift boxes!",
    number: "03",
    button: "SHOP NOW",
  },
];

export default function OurWork() {
  return (
    <section className="py-20 md:py-28 bg-light-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading (Color matched to roasted peanut label) */}
        <h2 className="text-4xl sm:text-4xl font-bold mb-16 tracking-normal text-black text-center">
          OUR SPECIAL OFFERS
        </h2>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service) => (
          <div
  key={service.id}
  className="relative p-10 rounded-xl border bg-white border-[#E5E5E5] shadow-md transition-all hover:shadow-xl overflow-hidden"
>

              {/* Card Number (Faint background text) */}
              <h1 className="absolute bottom-4 right-6 text-8xl font-bold text-[#8C2C1A] opacity-10 select-none">
                {service.number}
              </h1>

              {/* Icon */}
              <div className="mb-6 ">{service.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-bold text-[#8C2C1A] tracking-wider mb-3 uppercase">
                {service.title}
              </h3>

              {/* Divider */}
              <div className="h-1 w-20 bg-[#8C2C1A] mb-6"></div>

              {/* Description */}
              <p className="text-[#5A3A18] leading-relaxed mb-8">
                {service.description}
              </p>

              {/* Button */}
              <button className="px-6 py-2  text-dark rounded-md font-normal border border-[#8C2C1A] tracking-wide hover:bg-dark transition">
                {service.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
