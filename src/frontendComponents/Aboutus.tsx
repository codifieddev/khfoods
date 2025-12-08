"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      className="w-full bg-white text-black py-20 md:py-28"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GRID FIXED — EXACT 2 COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT TEXT COLUMN */}
          <motion.div variants={textVariants}>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
              A LITTLE STORY <span className="text-primary">ABOUT US</span>
            </h2>

            <div className="space-y-5 text-lg text-gray-700">
              <p>
                For nearly three decades, our vision for our peanuts stands the same: 
                To process and manufacture the best peanuts in the world.
              </p>

              <p>
                With only natural ingredients and absolutely no preservatives, 
                we guarantee that our peanuts do not go through any unnatural processing 
                before they reach your home! We not only highly value the quality and 
                health of our products, but we also strive to bring out the natural 
                deliciousness of peanuts that leave you both satiated and satisfied.
              </p>

              <button className="mt-4 bg-dark text-white py-2 px-6 rounded hover:bg-opacity-80 transition">
                KNOW MORE
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE COLUMN */}
          <motion.div variants={imageVariants} className="relative w-full">
            <div className="relative">
              
              {/* Image */}
              <img
                src="/assets/Image/khfoodImage/peanuts_newproduct_left_sec.jpg"
                alt="MQA Team"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />

              {/* Overlay Box */}
              <div className="absolute bottom-4 right-4 bg-white p-5 shadow-xl rounded">
                <h3 className="text-gray-900 text-lg sm:text-xl font-semibold uppercase tracking-wider">
                  Over 30 Years
                </h3>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
