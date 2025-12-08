"use client";

import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Janice S.",
    role: "Janice S.",
    image: "/assets/users/user1.jpg",
    message:
      "OMG, delicious roasted peanuts. Me and my dad went to the Oriental Food Market in Lauderdale Lakes yesterday. My father is 93 years old. He loves your peanuts.",
    rating: 5,
  },
  {
    id: 2,
    name: "Sophia C.",
    role: "Sophia C.",
    image: "/assets/users/user2.jpg",
    message:
      "I’m a big fan of your product! I always share them with my friends in Hong Kong. Hope your product can sell in China and Hong Kong soon.",
    rating: 4,
  },
  {
    id: 3,
    name: "Gitfon C.",
    role: "Gitfon C.",
    image: "/assets/users/user3.jpg",
    message: "I have been a loyal fan for years. They are the best peanuts I’ve ever had.",
    rating: 5,
  },
  {
    id: 4,
    name: "Claudia W.",
    role: "Claudia W.",
    image: "/assets/users/user4.jpg",
    message:
      "Bought these peanuts for my dad and he absolutely loved them! Super fresh and very crunchy.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-[#f6f3ec]">
      <div className="px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-14 text-dark">
         Testimonials 
        </h2>
{/* <span className="text-primary">About Us</span>  */}
        <div className="relative">

          {/* LEFT ARROW */}
          <button className="custom-prev absolute -left-6 top-1/2 -translate-y-1/2 bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* RIGHT ARROW */}
          <button className="custom-next absolute -right-6 top-1/2 -translate-y-1/2 bg-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
            pagination={{ clickable: true, el: ".custom-dots" }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={35}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  className="bg-white rounded-2xl my-6 p-8 shadow-none border border-transparent hover:border-brown
                    h-[420px] transition-all hover:shadow-none flex flex-col"
                >
                  {/* IMAGE */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                    />
                  </div>

                  {/* NAME */}
                  <h3 className="text-xl font-bold text-center text-black">
                    {item.name}
                  </h3>

                  {/* RATING */}
                  <div className="flex justify-center gap-1 my-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-primary fill-priamry"
                      />
                    ))}
                  </div>

                  {/* MESSAGE */}
                  <p className="text-gray-700 text-center mt-4 leading-relaxed">
                    "{item.message}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* DOTS */}
          <div className="custom-dots flex justify-center mt-10 gap-3"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

// CUSTOM DOT STYLES
<style >{`
  .custom-dots .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: #c9b48a;
    opacity: 0.5;
    border-radius: 50%;
    transition: all 0.3s ease;
  }

  .custom-dots .swiper-pagination-bullet-active {
    width: 16px;
    height: 16px;
    background: #DEBB70;
    opacity: 1;
  }
`}</style>
