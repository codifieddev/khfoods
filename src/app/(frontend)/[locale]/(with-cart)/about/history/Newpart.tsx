"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Swiper components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// 🌟 Updated Data: Content from your Screenshots, Images from your Code
const sliderData = [
  {
    id: 1,
    // preTitle: "Hot Deal",
    title: "Natural & Healthy",
    // subTitle: "COMPLIMENTARY",
    desc: "Our products are made with 100% natural ingredients, free from preservatives and artificial additives. Enjoy a healthier snacking experience with every bite.",
    btnText: "SHOP NOW",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSui-3aCG3S5blLtlyLS5GStrXY-1gGgimLLA&s", // Same image as before
    link: "/shop",
  },
  {
    id: 2,
    // preTitle: "INTERESTED IN",
    title: "Premium Quality",
    // subTitle: "",
    desc: "We follow strict quality standards to deliver fresh, premium, and perfectly roasted peanuts every time. Trusted since 1991 for exceptional craftsmanship.",
    btnText: "SIGN UP",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2-FxuzmnUidWFewWfJ6h4boYpDAPI1y0Qjw&s", // Same image as before
    link: "/wholesale",
  },
  {
    id: 3,
    // preTitle: "Available Now",
    title: "Delicious Taste",
    // subTitle: "TO TAIWAN",
    desc: "Crafted for rich flavor and a satisfying crunch, our peanuts deliver a taste you’ll love. Made to please every palate with authentic, delicious goodness.",
    btnText: "SHOP NOW",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8OwlWSMZ95ozctI_6eoiRITRV9TZHrO6GGQ&s", // Same image as before
    link: "/shipping",
  },
];
// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function OurProjects() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#f7f7f7]">
      
      {/* === BACKGROUND PATTERNS === */}
      {/* <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / 10%) 1px, #000000 1px)" }}
      ></div> */}
      {/* <div className="absolute inset-0 z-0 bg-black/60"></div> */}

      {/* === CONTENT === */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-[48px] font-bold uppercase mb-10 tracking-wide text-center md:text-left"
          variants={cardVariants}
        >
          Our Journey 
        </motion.h2>

        <motion.div variants={cardVariants}>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="pb-16 !px-2"
          >
            {sliderData.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative overflow-hidden group rounded-2xl h-[500px] border border-white/10">
                  
                  {/* Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300" />

                  {/* Text Content Overlay (Matching your Screenshots) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    
                    {/* Pre-Title (e.g., Hot Deal) */}
                    {/* <span className="text-[#EAB159] text-sm font-bold tracking-widest uppercase mb-3">
                      {item.preTitle}
                    </span> */}

                    {/* Main Title (e.g., GIFT BOX) */}
                    <h3 className="text-3xl font-extrabold text-white uppercase leading-tight mb-2">
                      {item.title}
                    </h3>

                    {/* Sub-Title (e.g., COMPLIMENTARY) */}
                    {/* {item.subTitle && (
                      <h4 className="text-white/90 text-lg font-light uppercase tracking-widest mb-4">
                        {item.subTitle}
                      </h4>
                    )} */}

                    {/* Divider */}
                    <div className="w-12 h-[2px] bg-[#EAB159] my-4"></div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-[280px]">
                      {item.desc}
                    </p>

                    {/* Button */}
                    {/* <button className="bg-[#EAB159] text-black text-xs font-bold py-3 px-8 rounded-full uppercase tracking-widest hover:bg-white transition-colors duration-300">
                      {item.btnText}
                    </button> */}

                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.div>
    </section>
  );
}