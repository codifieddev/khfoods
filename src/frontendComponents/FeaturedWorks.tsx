"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// 🌟 Example projects
const projects = [
  {
    id: 1,
    title: "MAKRA TOWER",
    location: "JALGAON",
    categories: ["HOUSES", "DESIGN", "SKYSCRAPPER"],
    image: "/assets/Image/jalgoan.jpg",
    slug: "/projects/makra-tower",
  },
  {
    id: 2,
    title: "ZOPE'S RESIDENCE",
    location: "LOWER PAREL, MUMBAI",
    categories: ["INTERIOR", "MINIMALISM", "ELEGANCE"],
    image: "/assets/Image/home-slider.jpg",
    slug: "/projects/zope-residence",
  },
];

// Animations
const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const textVariantsRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

export default function FeaturedWorks() {
  return (
    <section className="bg-white text-primary py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#4A2C0A] mb-2 tracking-wide">
            OUR FEATURED <span className="text-dark">WORKS</span>
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full"></div>
        </div>

        {/* Projects */}
        <div className="mt-20 space-y-24">
          {projects.map((project, index) => {
            const isOdd = index % 2 === 0;

            return (
              <motion.div
                key={project.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center rounded-2xl "
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                
                {/* Text Block */}
                <motion.div
                  className={`flex flex-col ${isOdd ? "md:order-1" : "md:order-2"}`}
                  variants={isOdd ? textVariants : textVariantsRight}
                >
                  {/* Tags */}
                  <div className="flex space-x-4 mb-4">
                    {project.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-xs font-semibold text-[#8A6A3D] tracking-widest uppercase"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4A2C0A] leading-tight">
                    {project.title}
                  </h3>

                  {/* Location */}
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-light text-[#7A5B2E]">
                    {project.location}
                  </h4>

                  {/* View Project Button */}
                  <a
                    href={project.slug}
                    className="
                      inline-flex items-center 
                      text-[#4A2C0A] border border-[#C48A30]
                      px-6 py-2 mt-8 max-w-max rounded-md
                      btn hover:text-white 
                      transition-colors duration-300
                    "
                  >
                    View Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </motion.div>

                {/* Image Block */}
                <motion.div
                  className={`w-full ${isOdd ? "md:order-2" : "md:order-1"}`}
                  variants={imageVariants}
                >
                  <a href={project.slug} className="block group overflow-hidden rounded-xl">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="
                        w-full h-auto object-cover rounded-xl
                        transition-transform duration-500 
                        group-hover:scale-105
                      "
                    />
                  </a>
                </motion.div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
