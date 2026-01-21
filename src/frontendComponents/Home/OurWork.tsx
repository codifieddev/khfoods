"use client";
import React from "react";
import { Building2, LayoutGrid, Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OurWork() {
  const t = useTranslations("Home.special-offers");

  const services = [
    {
      id: 1,
      icon: <Building2 className="w-6 h-6 text-black" />, // Icon size chota kiya circle ke liye
      title: t("gift-box.title"),
      description: t("gift-box.description"),
    },
    {
      id: 2,
      icon: <LayoutGrid className="w-6 h-6 text-black" />,
      title: t("wholesale.title"),
      description: t("wholesale.description"),
    },
    {
      id: 3,
      icon: <Home className="w-6 h-6 text-black" />,
      title: t("international.title"),
      description: t("international.description"),
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- MAIN HEADING (Added back) --- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-wide">
            {t("title")}
          </h2>
          {/* Optional: Divider line under title if needed */}
          {/* <div className="w-16 h-1 bg-black mx-auto mt-4"></div> */}
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 md:px-0 px-4">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col items-start text-left">
              
              {/* Icon Circle */}
              <div className="mb-6 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                {service.icon}
              </div>

              {/* Title: Bold & Uppercase (Like Image) */}
              <h3 className="text-lg font-bold text-black uppercase tracking-tight mb-3">
                {service.title}
              </h3>

              {/* Description: Clean Gray Text */}
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {service.description}
              </p>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}