"use client";

import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { IoMdQuote } from "react-icons/io";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Janice S.",
    title: "",
    message:
      "OMG, delicious roasted peanuts. Me and my dad went to the Oriental Food Market in Lauderdale Lakes yesterday. My father is 93 years old. He loves your peanuts. Thanks for pursuing your dream",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophia C.",
    title: "",
    message:
      "Hi, I’m a big fan of your product! I always share them with my friends in Hong Kong. Hope your product can sell in China and Hong Kong soon.",
    rating: 5,
  },
  {
    id: 3,
    name: "Gitfon C.",
    title: "",
    message:
      "I have been a loyal fan for years. They ARE the best peanuts I’ve ever had.",
    rating: 5,
  },
  {
    id: 4,
    name: "Claudia W.",
    title: "",
    message:
      "Bought these peanuts for my dad and he absolutely loved them! Super fresh and very crunchy. Love that they are available unsalted. Totally worth the price and taste great. Can’t stop eating one after another.",
    rating: 5,
  },
  {
    id: 5,
    name: "Phillip T.",
    title: "",
    message:
      "My doctor put me on a low salt diet, so I went looking for no salt snack alternatives. After I found these peanuts, I am on my second bag already. These peanuts taste so fresh and I am glad that it has very little salt. I am very impressed how fresh they are and not oily like others. When you bite into them, there is a crisp snap to them.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#f5f5f7] py-20">
      <div className="md:w-[90%] w-full md:ms-auto px-6">
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-2">
              5.00 from 1230+ reviews
            </p>
            <h2 className="text-3xl md:text-[48px] font-semibold uppercase text-[#111111]">
              What Customers Say
            </h2>
          </div>

          <div className="flex items-center gap-5 mt-2">
            <button
              className="test-prev flex items-center justify-center text-gray-700 hover:text-black transition"
              aria-label="Previous testimonial"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="test-next flex items-center justify-center text-gray-700 hover:text-black transition"
              aria-label="Next testimonial"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{ prevEl: ".test-prev", nextEl: ".test-next" }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          spaceBetween={32}
          className="testimonials-swiper"
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 1.6, spaceBetween: 24 },
            1024: { slidesPerView: 2.2, spaceBetween: 32 },
          }}
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-3xl shadow-sm flex flex-col h-[350px] px-10 py-10 md:px-12 md:py-10">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-sm font-semibold text-[#222222]">
                    {item.name}
                  </p>

                  <div className="text-gray-200 leading-none select-none">
                    <IoMdQuote className="text-5xl md:text-7xl" />
                  </div>
                </div>

                <div className="border-t border-gray-200 mb-7" />

                <div className="flex items-center gap-1 mb-4 text-[#f6b500]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f6b500]" />
                  ))}
                </div>

                {item.title ? (
                  <h3 className="text-sm md:text-[18px] font-medium text-[#111111] mb-3">
                    {item.title}
                  </h3>
                ) : null}

                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
