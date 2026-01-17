// "use client";
// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { useTranslations } from "next-intl";

// export default function NewsSection() {
//   const t = useTranslations("Home.news");

//   const news = [
//     {
//       id: 1,
//       title: t("article1.title"),
//       description: t("article1.description"),
//       button: t("read-more"),
//       image: "/assets/Image/khfoodImage/Mobile-version-image-1.jpg",
//     },
//     {
//       id: 2,
//       title: t("article2.title"),
//       description: t("article2.description"),
//       button: t("read-more"),
//       image: "/assets/Image/khfoodImage/Mobile-version-image-2.jpg",
//     },
//     {
//       id: 3,
//       title: t("article3.title"),
//       description: t("article3.description"),
//       button: t("read-more"),
//       image: "/assets/Image/khfoodImage/Mobile-version-image-1.jpg",
//     },
 
//   ];

//   return (
//     // Section BG ko dark gray kiya
//     <section className="relative bg-white py-24">
//       <div className="max-w-7xl mx-auto px-4 relative z-10">
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-12">
//           {t("title")}
//         </h2>

//         <div className="grid md:grid-cols-3 gap-8 py-4">
//           {news.map((item) => (
//             <div
//               key={item.id}
//               // Card BG ko thoda lighter gray, shadow ki jagah border diya
//               className="bg-light-dark rounded-none overflow-hidden flex flex-col shadow border-none border-light-dark hover:border-[#debb70] transition-colors duration-300">
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="h-72 w-full object-cover"
//               />
//               <div className="p-6 flex flex-col flex-grow">
//                 <h3 className="text-lg font-semibold text-dark mb-2 leading-snug">
//                   {/* Card title ko light gray kiya */}
//                   {item.title}
//                 </h3>
//                 <p className="text-700 flex-grow">
//                   {/* Description text ko light gray kiya */}
//                   {item.description}
//                 </p>
//                 <div className="mt-4 text-sm text-gray-600 font-semibold"><a href="#" className="hover:text-black decoration">{item.button}</a></div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* <div className="text-center mt-12 ">
//           <button
//             className="inline-flex items-center gap-2 bg-[#debb70] hover:bg-[#debb70] text-white px-6 py-3 font-semibold transition-colors duration-300"
//             style={{ borderRadius: "6px" }}
//           >
//             See All News
//             <ArrowRight size={18} />
//           </button>
//         </div> */}
//       </div>
//     </section>
//   );
// }









"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; 

// 🆕 Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// 🆕 Swiper modules
import { Pagination, Autoplay } from "swiper/modules";

// 🆕 Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// 🌟 Updated Data - Based on your "Gift Box", "Wholesale", & "Story" images
const featuredProjects = [
  {
    id: 1,
    title: "GIFT BOXES",
    category: "Hot Deal",
    image: "https://khfood.com/wp-content/uploads/2019/12/Box-image.jpg", // Replace with actual Gift Box image
    slug: "/projects/gift-box",
  },
  {
    id: 2,
    title: "WHOLESALE DEALS",
    category: "Interested In",
    image: "https://khfood.com/wp-content/uploads/2019/12/Image-3.jpg", // Replace with Peanuts Bulk image
    slug: "/projects/wholesale",
  },
  {
    id: 3,
    title: "GLOBAL SHIPPING",
    category: "Available Now",
    image: "https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg", // Replace with Shipping/Taiwan image
    slug: "/projects/shipping",
  },
  {
    id: 4,
    title: "OUR STORY",
    category: "Since 1990",
    image: "https://khfood.com/wp-content/uploads/2019/11/Screen-Shot-2019-07-16-at-1.11.14-PM@1X.png", // Replace with Story/Processing image
    slug: "/projects/story",
  },
];

// --- Animation Variants (Code same as provided) ---
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
    <section className="relative py-20 md:py-28 overflow-hidden bg-black">

      {/* === BACKGROUND IMAGE (Behind everything) === */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          // Optional: Add a subtle peanut texture or keep generic dark pattern
          backgroundImage:
            "radial-gradient(rgb(255 255 255 / 10%) 1px, #000000 1px)",
        }}
      ></div>

      {/* === DARK OVERLAY === */}
      <div className="absolute inset-0 z-0 bg-black/60"></div>

      {/* === PATTERN OVERLAY === */}
      <div
        className="absolute inset-0 z-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      ></div>

      {/* === ALL CONTENT === */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Updated Title to match Peanut Theme */}
        <motion.h2
          className="text-3xl md:text-[48px] font-bold uppercase mb-10 tracking-wide text-center md:text-left"
          variants={cardVariants}
        >
          Discover Our World
        </motion.h2>

        <motion.div variants={cardVariants}>
          {/* ⭐ SWIPER CODE — Unchanged Logic ⭐ */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            pagination={{
              clickable: true,
              el: ".custom-project-pagination", // Ensure you have styling for this or rely on default
              dynamicBullets: true,
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            className="pb-16 !px-2" // Added px-2 to prevent shadow clip
          >
            {featuredProjects.map((project) => (
              <SwiperSlide key={project.id}>
                <div className="relative overflow-hidden group rounded-2xl cursor-pointer">

                  <a href={project.slug} className="block relative">
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Content Positioned at Bottom */}
                    <div className="absolute bottom-0 left-0 w-full p-8">
                      
                      {/* Sub-Category (Added to match your image style like 'Hot Deal') */}
                      <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-[#EAB159] text-black rounded-full">
                        {project.category}
                      </span>

                      <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">
                        {project.title}
                      </h3>

                      <div className="flex items-center text-[#EAB159] mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-sm font-bold tracking-widest uppercase">Explore</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    </div>
                  </a>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </motion.div>
    </section>
  );
}