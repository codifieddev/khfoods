"use client";
import React from "react";
import { useTranslations } from "next-intl";

const NewsLatter = () => {
  const t = useTranslations("Home.newsletter");

  return (
    <section className="w-full bg-[#f6efe1] py-16 px-4 relative overflow-hidden">

      {/* LEFT IMAGE */}
      {/* <img
        src="/assets/Image/khfoodImage/friendy_organic_store.jpg" // <-- replace with your left image path
        className="hidden md:block absolute left-0 top-0 h-full object-contain pointer-events-none"
        alt=""
      /> */}

      {/* RIGHT IMAGE */}
      <img
        src="/images/peanut-right.png" // <-- replace with your right image path
        className="hidden md:block absolute right-0 top-0 h-full object-contain pointer-events-none"
        alt=""
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3b2f2f] mb-4">
          {t("title")}
        </h2>

        <p className="text-[#3b2f2f] mb-6 px-4">
          {t("description")}
        </p>

        {/* INPUT + BUTTON */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="email"
            placeholder={t("email-placeholder")}
            className="w-full md:w-3/4 py-3 px-4 rounded border border-gray-300 outline-none"
          />

          <button className="w-full md:w-3/4 bg-[#3b2f2f] text-white py-3 rounded font-semibold hover:bg-[#2a2222] transition">
            {t("subscribe")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsLatter;
