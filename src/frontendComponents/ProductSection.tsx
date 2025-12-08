"use client";
import React from "react";
import { motion } from "framer-motion";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    title: "Suscipit Laboriosam Nisi",
    price: "241.99",
    img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    rating: 4,
  },
  {
    id: 2,
    title: "Aliquam Quat Voluptatem",
    price: "122.00",
     img: "/assets/Image/khfoodImage/2Q6A4963.jpg",

    
    rating: 4,
  },
  {
    id: 3,
    title: "Quis Autem Veleuminium",
    price: "122.00",
      img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    rating: 4,
  },
  {
    id: 4,
    title: "Perspicitatis Unde Omnis",
    price: "14.00",
       img: "/assets/Image/khfoodImage/2Q6A4963.jpg",
    rating: 4,
  },
];

export default function ProductSection() {
  return (
    <section className="bg-white py-16">
      <motion.div
        className="max-w-7xl mx-auto px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
  <div className="flex flex-col items-center text-center pb-16 pt-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A2C0A] mb-2 tracking-wide">
         FREE SHIPPING  
         WITHIN US
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>

   <p className="pt-10">We ship orders to all states in US including AK, HI, PR at no cost.

</p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2500 }}
          loop={true}
          className="pb-12"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="w-full bg-white rounded-xl">
                {/* Image Section */}
                <div className="w-full h-64 flex items-center justify-center">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full object-contain"
                  />
                </div>

                {/* Rating */}
                <div className="flex justify-center mt-4 text-yellow-500">
                  ⭐⭐⭐⭐☆
                </div>

                {/* Title */}
                <p className="text-center text-gray-700 mt-4 text-lg">
                  {item.title}
                </p>

                {/* Price */}
                <p className="text-center text-black font-semibold text-lg mt-2">
                  ${item.price}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="mt-20 mx-auto block bg-dark text-white px-6 py-2 rounded-md hover:bg-dark transition-colors duration-300">
          View All Products
        </button>
      </motion.div>
    </section>
  );
}
