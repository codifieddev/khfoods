// "use client";

// import { Star, ChevronLeft, ChevronRight } from "lucide-react";
// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay, Navigation } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// const testimonials = [
//   {
//     id: 1,
//     name: "Janice S.",
//     role: "Janice S.",
//     image: "/assets/users/user1.jpg",
//     message:
//       "OMG, delicious roasted peanuts. Me and my dad went to the Oriental Food Market in Lauderdale Lakes yesterday. My father is 93 years old. He loves your peanuts.",
//     rating: 5
//   },
//   {
//     id: 2,
//     name: "Sophia C.",
//     role: "Sophia C.",
//     image: "/assets/users/user2.jpg",
//     message:
//       "I’m a big fan of your product! I always share them with my friends in Hong Kong. Hope your product can sell in China and Hong Kong soon.",
//     rating: 4
//   },
//   {
//     id: 3,
//     name: "Gitfon C.",
//     role: "Gitfon C.",
//     image: "/assets/users/user3.jpg",
//     message:
//       "I have been a loyal fan for years. They are the best peanuts I’ve ever had.",
//     rating: 5,
//   },
//   {
//     id: 4,
//     name: "Claudia W.",
//     role: "Claudia W.",
//     image: "/assets/users/user4.jpg",
//     message:
//       "Bought these peanuts for my dad and he absolutely loved them! Super fresh and very crunchy.",
//     rating: 5
//   },
// ];

// const TestimonialsSection = () => {
//   return (
//     <section className="py-20 bg-[#f6f3ec]">
//       <div className="px-6 max-w-7xl mx-auto">
//         <h5 className="text-2xl font-semibold text-[#7d1a03] text-center pb-2">
//           Testimonials
//         </h5>
//         <h2 className="text-4xl sm:text-4xl font-bold mb-16 tracking-normal text-black text-center">
//           We love our clients
//         </h2>
//         {/* <span className="text-primary">About Us</span>  */}
//         <div className="relative">
//           {/* LEFT ARROW */}
//           <button className="custom-prev absolute -left-6 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all z-10">
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           {/* RIGHT ARROW */}
//           <button className="custom-next absolute -right-6 top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all z-10">
//             <ChevronRight className="w-6 h-6" />
//           </button>

//           <Swiper
//             modules={[Pagination, Autoplay, Navigation]}
//             navigation={{ nextEl: ".custom-next", prevEl: ".custom-prev" }}
//             pagination={{ clickable: true, el: ".custom-dots" }}
//             autoplay={{ delay: 3000, disableOnInteraction: false }}
//             loop={true}
//             spaceBetween={35}
//             breakpoints={{
//               0: { slidesPerView: 1 },
//               768: { slidesPerView: 1 },
//               1024: { slidesPerView: 1 },
//             }}
//           >
//             {testimonials.map((item) => (
//               <SwiperSlide key={item.id}>
//                 <div
//                   className="bg-[#eaba88] rounded-2xl my-6 p-8 shadow-none border border-transparent hover:border-brown
//                     h-[420px] transition-all hover:shadow-none flex flex-col items-center justify-center"
//                 >
//                   {/* IMAGE */}
//                   {/* <div className="flex justify-center mb-4">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-20 h-20 rounded-full object-cover border-2 border-primary"
//                     />
//                   </div> */}

//                   {/* NAME */}

//                   {/* RATING */}
//                   {/* <div className="flex justify-center gap-1 my-3">
//                     {[...Array(item.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         className="w-5 h-5 text-primary fill-priamry"
//                       />
//                     ))}
//                   </div> */}

//                   {/* MESSAGE */}
//                   <p className="text-[#8d5c29]  text-center mt-4 leading-relaxed">
//                     "{item.message}"
//                   </p>

//                   <h3 className="text-xl  text-[#8d5c29]  font-bold text-center text-black">
//                     {item.name}
//                   </h3>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>

//           {/* DOTS */}
//           <div className="custom-dots flex justify-center mt-10 gap-3"></div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;

// // CUSTOM DOT STYLES
// <style>{`
//   .custom-dots .swiper-pagination-bullet {
//     width: 10px;
//     height: 10px;
//     background: #c9b48a;
//     opacity: 0.5;
//     border-radius: 50%;
//     transition: all 0.3s ease;
//   }

//   .custom-dots .swiper-pagination-bullet-active {
//     width: 16px;
//     height: 16px;
//     background: #DEBB70;
//     opacity: 1;
//   }
// `}</style>;



"use client";

import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { IoMdQuote } from "react-icons/io";

const testimonials = [
  {
    id: 1,
    name: "Jennifer",
    location: "From California",
    title: "Perfect Quality and Customer Service!",
    // image: "https://goodyear.creativeconsult.co.in/wp-content/uploads/2022/10/testimonial-1-1.jpg",
    message:
      "The sofa and armchairs I bought are not only beautiful but also incredibly comfortable. The colors are exactly as shown on the website, and the overall experience with Minicom has been flawless.",
    rating: 5,
  },
  {
    id: 2,
    name: "Jessica",
    location: "From Chicago",
    title: "Great Price & Services",
    // image: "https://goodyear.creativeconsult.co.in/wp-content/uploads/2022/10/testimonial-1-1.jpg",
    message:
      "The sofa and armchairs I bought are not only beautiful but also incredibly comfortable. The colors are exactly as shown on the website, and the overall experience with Minicom has been flawless.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elizabeth",
    location: "From New York",
    title: "Amazing Quality & Details",
    // image: "https://goodyear.creativeconsult.co.in/wp-content/uploads/2022/10/testimonial-1-1.jpg",
    message:
      "The sofa and armchairs I bought are not only beautiful but also incredibly comfortable. The colors are exactly as shown on the website, and the overall experience with Minicom has been flawless.",
    rating: 5,
  },
  {
    id: 4,
    name: "Claudia",
    location: "From Seattle",
    title: "Beautiful & Comfortable Pieces",
    // image: "https://goodyear.creativeconsult.co.in/wp-content/uploads/2022/10/testimonial-1-1.jpg",
    message:
      "The sofa and armchairs I bought are not only beautiful but also incredibly comfortable. The colors are exactly as shown on the website, and the overall experience with Minicom has been flawless.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-[#f5f5f7] py-20">
      <div className="md:w-[90%] w-[100%] md:ms-auto px-6">
        {/* Top heading + arrows */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-gray-400 mb-2">
              5.00 from 1230+ reviews
            </p>
            <h2 className="text-3xl md:text-[48px] font-semibold uppercase text-[#111111]">
              What Customers Say 
            </h2>
          </div>

          {/* Arrows (right top) */}
          <div className="flex items-center gap-5 mt-2">
            <button
              className="test-prev flex items-center justify-center text-gray-700 hover:text-black transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="test-next flex items-center justify-center text-gray-700 hover:text-black transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slider */}
       {/* Slider */}
        <Swiper
  modules={[Navigation, Autoplay]}
  navigation={{ prevEl: ".test-prev", nextEl: ".test-next" }}
  autoplay={{ delay: 6000, disableOnInteraction: false }}
  loop
  spaceBetween={32}
  className="testimonials-swiper"
  breakpoints={{
    // ✅ Mobile: ONLY ONE CARD
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },

    // Tablet: 1.5 cards
    768: {
      slidesPerView: 1.6,
      spaceBetween: 24,
    },

    // Desktop: 2+ cards
    1024: {
      slidesPerView: 2.2,
      spaceBetween: 32,
    },
  }}
>

          {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-3xl shadow-sm flex flex-col h-full px-10 py-10 md:px-12 md:py-10 ">

                {/* Top row: avatar + name + quote mark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {/* <img
                      // src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-full object-cover"
                    /> */}
                    <div>
                      <p className="text-sm font-semibold text-[#222222]">
                        {item.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* big quote mark */}
                  <div className=" text-gray-200 leading-none select-none">
             <IoMdQuote className="text-5xl md:text-7xl"/>

                  </div>
                </div>

                {/* Divider line */}
                <div className="border-t border-gray-200 mb-7" />

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#f6b500]">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f6b500]" />
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-sm md:text-[18px] font-medium text-[#111111] mb-3">
                  {item.title}
                </h3>

                {/* Message */}
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
};

export default TestimonialsSection;
