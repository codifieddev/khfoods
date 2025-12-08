"use client";
import React from "react";
// import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Arrow icon ke liye

// 🆕 Swiper React components import karein
import { Swiper, SwiperSlide } from "swiper/react";

// 🆕 Swiper modules import karein (Pagination aur Autoplay ke liye)
import { Pagination, Autoplay } from "swiper/modules";

// 🆕 Swiper ki default styles import karein
import "swiper/css";
import "swiper/css/pagination";

// 🌟 Example projects - Yahaan apna data daalein
const featuredProjects = [
  {
    id: 1,
    title: "SHANTIGRAM MEADOWS, AHMEDABAD",
    image: "/assets/Image/project-image.jpg", // ⚠️ Yahaan apni image ka path daalein
    slug: "/projects/shantigram-meadows",
  },
  {
    id: 2,
    title: "EMERALD GULISTAN MANDIR, KANPUR",
    image: "/assets/Image/project-image1.png", // ⚠️ Yahaan apni image ka path daalein
    slug: "/projects/emerald-mandir",
  },
  {
    id: 3,
    title: "EMERALD GULISTAN MANDIR, KANPUR",
    image: "/assets/Image/project-image2.png", // ⚠️ Yahaan apni image ka path daalein
    slug: "/projects/emerald-mandir",
  },
  {
    id: 4,
    title: "EMERALD GULISTAN MANDIR, KANPUR",
    image: "/assets/Image/project-image1.png", // ⚠️ Yahaan apni image ka path daalein
    slug: "/projects/emerald-mandir",
  },
  // Aap yahaan aur projects add kar sakte hain...
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
// ----------------------------

export default function OurProjects() {
  return (
    <section className="bg-[#f6efe1] text-gray-300 py-20 md:py-28">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Main Heading (Gold color) */}
        <motion.h2
          className="text-4xl sm:text-5xl font-semibold text-black mb-16 tracking-widest"
          variants={cardVariants}
        >
          OUR PROJECTS
        </motion.h2>

        {/* 🆕 Swiper Carousel Yahaan Shuru Hota Hai */}
        <motion.div variants={cardVariants}>
          <Swiper
            // 🆕 Modules add kiye
            modules={[Pagination, Autoplay]}
            // 🆕 Slides ke beech ka gap
            spaceBetween={30}
            // 🆕 Responsive breakpoints
            slidesPerView={1} // Mobile par 1 slide
            breakpoints={{
              640: {
                // Tablet par
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                // Desktop par (aapki requirement)
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            // 🆕 Neeche dots ke liye
            pagination={{ clickable: true }}
            // 🆕 Auto-play ke liye
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true} // 🆕 Taaki end ke baad firse start ho
            className="pb-16" // Pagination dots ke liye neeche space
          >
            {featuredProjects.map((project) => (
              // 🆕 Har project ek SwiperSlide ban gaya
              <SwiperSlide key={project.id}>
                <div className="relative overflow-hidden rounded-lg group">
                  <a href={project.slug}>
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-[400px] md:h-[500px] object-cover 
                                 transition-transform duration-500 group-hover:scale-105" // Hover effect
                    />

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

                    {/* Project Title & Arrow */}
                    <div className="absolute bottom-8 left-8">
                      <h3 className="text-2xl sm:text-xl font-semibold text-white">
                        {project.title}
                      </h3>

                      {/* 🌟 Arrow jo hover par dikhega */}
                      <div
                        className="flex items-center text-white mt-2 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <span className="text-sm font-medium">View Project</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
        {/* 🗑️ Purane static dots hata diye gaye, Swiper ab inhe handle karega */}
      </motion.div>
    </section>
  );
}