"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function NewsLatter() {
  // ✅ Updated Content for KH Food
  const slides = [
    {
      title: "PREMIUM ROASTED PEANUTS; CRAFTED FOR PERFECT CRUNCH & FLAVOR.",
      description:
        "Experience the legacy of KH Food. For over 30 years, we have been processing and manufacturing the finest peanuts, delivering unmatched quality and taste.",
      button: "OUR STORY",
    },
    {
      title: "HEALTHY SNACKING, ELEVATED FOR YOUR LIFESTYLE.",
      description:
        "Rich in protein and packed with natural nutrients. Our unique roasting process preserves the goodness while enhancing the flavor for a guilt-free treat.",
      button: "VIEW PRODUCTS",
    },
    {
      title: "EXCLUSIVE GIFT BOXES & WHOLESALE OPPORTUNITIES.",
      description:
        "Partner with us. Get complimentary gift boxes with select orders or explore our competitive wholesale pricing designed for your business growth.",
      button: "EXPLORE OFFERS",
    },
  ];

  return (
    <section className="w-full min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* IMAGE (Mobile / Right Desktop) */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0 order-1 lg:order-2">
        <img
          // Make sure this image exists in your public folder
          src="https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg"
          className="w-full h-full object-cover"
          alt="k h food highlights"
        />
      </div>

      {/* CONTENT SLIDER */}
      <div className="w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex items-center px-6 sm:px-10 lg:px-16 text-white bg-black relative z-20 order-2 lg:order-1">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          // pagination={{ clickable: true }}
          className="newsletter-swiper"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="max-w-xl md:py-0 py-10">
                <h1 className="text-2xl sm:text-3xl md:text-[48px] font-regular leading-tight mb-5 uppercase">
                  {item.title}
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-7">
                  {item.description}
                </p>

                <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition uppercase tracking-wider">
                  {item.button}
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}