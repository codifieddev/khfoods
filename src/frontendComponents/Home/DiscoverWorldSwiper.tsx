"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const featuredProjects = [
  {
    id: 1,
    title: "GIFT BOXES",
    category: "Hot Deal",
    image: "https://khfood.com/wp-content/uploads/2019/12/Box-image.jpg",
    slug: "/projects/gift-box",
  },
  {
    id: 2,
    title: "WHOLESALE DEALS",
    category: "Interested In",
    image: "https://khfood.com/wp-content/uploads/2019/12/Image-3.jpg",
    slug: "/wholesale",
  },
  {
    id: 3,
    title: "GLOBAL SHIPPING",
    category: "Available Now",
    image: "https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg",
    slug: "/projects/shipping",
  },
  {
    id: 4,
    title: "OUR STORY",
    category: "Since 1990",
    image:
      "https://khfood.com/wp-content/uploads/2019/11/Screen-Shot-2019-07-16-at-1.11.14-PM@1X.png",
    slug: "/about-us",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DiscoverWorldSwiper() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden bg-black py-20 md:py-28">
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgb(255 255 255 / 10%) 1px, #000000 1px)",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/60" />
      <div
        className="absolute inset-0 z-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 text-white sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2
          className="mb-10 text-center text-3xl font-bold uppercase tracking-wide md:text-left md:text-[48px]"
          variants={cardVariants}
        >
          Discover Our World
        </motion.h2>

        <motion.div variants={cardVariants}>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project, index) => {
              const key = `${project.id}-${index}`;
              const isActive = activeKey === key;
              const isLast = index === featuredProjects.length - 1;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveKey(key)}
                  className={[
                    "relative block overflow-hidden rounded-2xl text-left appearance-none border-0 bg-transparent p-0 shadow-none outline-none focus:outline-none focus:ring-0 active:scale-100",
                    isLast ? "md:col-start-1" : "",
                  ].join(" ")}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-[400px] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <span className="mb-3 inline-block rounded-full bg-[#EAB159] px-3 py-1 text-[10px] font-bold uppercase text-black">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold uppercase text-white">
                      {project.title}
                    </h3>
                    {isActive ? (
                      <div className="mt-4 flex items-center text-[#EAB159]">
                        <span className="text-sm font-bold uppercase tracking-widest">
                          Explore
                        </span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
