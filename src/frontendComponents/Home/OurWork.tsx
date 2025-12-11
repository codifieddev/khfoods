"use client";
import React from "react";
import { Building2, LayoutGrid, Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OurWork() {
  const t = useTranslations("Home.special-offers");

  // Updated CONTENT — Based on your provided images
  const services = [
    {
      id: 1,
      icon: <Building2 className="w-12 h-12 text-[#8C2C1A]" />, // Dark Brown
      title: t("gift-box.title"),
      description: t("gift-box.description"),
      number: "01",
      button: t("gift-box.button")
    },
    {
      id: 2,
      icon: <LayoutGrid className="w-12 h-12 text-[#8C2C1A]" />,
      title: t("wholesale.title"),
      description: t("wholesale.description"),
      number: "02",
      button: t("wholesale.button")
    },
    {
      id: 3,
      icon: <Home className="w-12 h-12 text-[#8C2C1A]" />,
      title: t("international.title"),
      description: t("international.description"),
      number: "03",
      button: t("international.button")
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-light-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading (Color matched to roasted peanut label) */}
        <h2 className="text-4xl sm:text-4xl font-bold mb-16 tracking-normal text-black text-center">
          {t("title")}
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
