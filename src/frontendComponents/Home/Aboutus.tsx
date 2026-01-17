"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("Home.about");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      className="w-full bg-white text-black py-10 md:py-20 px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* MAIN GRID: Left (Text + Small Imgs) & Right (Tall Img) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* --- LEFT COLUMN --- */}
          <div className="flex flex-col gap-4 md:gap-6">
            
            {/* 1. Text Card (Top Left) - Styles like the gray box in your image */}
            <motion.div 
              variants={itemVariants}
              className="bg-[#F5F5F7] rounded-[2rem] p-8 md:p-12 flex flex-col justify-center h-full min-h-[300px]"
            >
              <span className="uppercase tracking-widest text-xs font-bold text-[#ecb984] mb-3">
                Since 1990
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                {t("title")} <span className="text-[#ecb984]">{t("title-highlight")}</span>
              </h2>

              <div className="space-y-4 text-gray-700 text-base sm:text-lg mb-6 max-w-md">
                <p>{t("para1")}</p>
                {/* <p>{t("para2")}</p> */} 
              </div>

              <div>
                <button className="bg-black text-white py-3 px-8 rounded-full font-medium hover:bg-gray-800 transition-all duration-300">
                  KNOW MORE
                </button>
              </div>
            </motion.div>

            {/* 2. Small Images Row (Bottom Left) */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 h-64 md:h-72">
              <motion.div variants={itemVariants} className="relative w-full h-full overflow-hidden rounded-[2rem]">
                 {/* Replace this src with a secondary image */}
                <img
                  src="https://khfood.com/wp-content/uploads/2020/11/About-Us-Photo-1-2.png" 
                  alt="Detail Shot 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="relative w-full h-full overflow-hidden rounded-[2rem]">
                 {/* Replace this src with another secondary image */}
                <img
                  src="/assets/Image/khfoodImage/peanuts_newproduct_left_sec.jpg" 
                  alt="Detail Shot 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          {/* 3. Tall Image (Right Side) */}
          <motion.div 
            variants={itemVariants}
            className="h-[500px] lg:h-auto w-full relative overflow-hidden rounded-[2rem]"
          >
            <img
              src="https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg" // Main vertical image
              alt="Main Feature"
              className="w-full h-full object-cover"
            />
            
            {/* Optional Overlay like the original code */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm py-3 px-6 rounded-xl shadow-sm">
               <p className="font-bold text-lg">OVER 30 YEARS</p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}