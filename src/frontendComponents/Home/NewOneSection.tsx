"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { IoMdQuote } from "react-icons/io";
import { FaQuoteLeft } from "react-icons/fa";

export default function NewsLatter() {
  // ✅ Updated Content for KH Food
  const slides = [
   
    {
      title: "Janice S.",
      description:
        "OMG, delicious roasted peanuts. Me and my dad went to the Oriental Food Market in Lauderdale Lakes yesterday. My father is 93 years old. He loves your peanuts. Thanks for pursuing your dream",
      button: "VIEW PRODUCTS",
    },
    {
      title: "Sophia C.",
      description:
        "Hi, I’m a big fan of your product! I always share them with my friends in Hong Kong. Hope your product can sell in China and Hong Kong soon",
      button: "EXPLORE OFFERS",
    },

        {
      title: "Gitfon C.",
      description:
        "I have been a loyal fan for years. They ARE the best peanuts I’ve ever had.  ",
      button: "EXPLORE OFFERS",
    },

        {
      title: "Claudia W.",
      description:
        "Bought these peanuts for my dad and he absolutely loved them! Super fresh and very crunchy. Love that they are available unsalted. Totally worth the price and taste great. Can’t stop eating one after another.",
      button: "EXPLORE OFFERS",
    },
     {
      title: "Phillip T.",
      description:
        "My doctor put me on a low salt diet, so I went looking for no salt snack alternatives. After I found these peanuts, I am on my second bag already. These peanuts taste so fresh and I am glad that it has very little salt. I am very impressed how fresh they are and not oily like others. When you bite into them, there is a crisp snap to them.",
      button: "OUR STORY",
    },


    
  ];

  return (
    <section className="w-full  flex flex-col h-[70vh] lg:flex-row overflow-hidden">
      {/* IMAGE (Mobile / Right Desktop) */}
      {/* <div className="w-full lg:w-1/2 h-[60vh]  lg:sticky lg:top-0 order-1 lg:order-2">
        <img
  
          src="https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg"
          className="w-full h-full object-cover"
          alt="k h food highlights"
        />
      </div> */}


        <div className="w-full lg:w-1/2   lg:sticky lg:top-0 order-1 lg:order-2">
            <div className="absolute inset-0">
              <img
                src="https://khfood.com/wp-content/uploads/2019/12/Image-1.jpg"
                alt="Promo"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0" />
            </div>

            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" /> */}

            <div className="relative flex flex-col justify-between h-full p-8 md:p-10">
              <div className="mt-4">
                <button className="uppercase bg-[#eaba88] font-semibold text-white px-4 tracking-widest py-2 rounded-full text-sm mb-5">Testimonials </button>
                <h2 className="text-3xl md:text-4xl font-semibold leading-tight max-w-xl text-white">
                  What Customers Say 
                </h2>

                <p className="text-[16px] text-white mb-3 font-medium pt-4">
                  We ship orders to all states in US including AK, HI, PR at no
                  cost.
                </p>
              </div>

              <button className="mt-8 self-start inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 text-[13px] font-bold tracking-[0.16em] uppercase hover:bg-neutral-100 transition">
                Shop now <span className="ml-2 text-lg">↗</span>
              </button>
            </div>
          </div>


      {/* CONTENT SLIDER */}
      <div className="w-full lg:w-1/2  flex items-center px-6 sm:px-10 lg:px-16 text-white bg-black relative z-20 order-2 lg:order-1">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          // pagination={{ clickable: true }}
          className="newsletter-swiper"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="max-w-xl md:py-0 py-10">
                
               <div className=" text-gray-200 leading-none select-none">
                    <FaQuoteLeft className="text-5xl md:text-7xl"/>
                  </div>
                  <div className="ps-14 pt-6">
                <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-7">
                  {item.description}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-[48px] font-regular leading-tight mb-5 uppercase">
                  {item.title}
                </h1>
                </div>

                {/* <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition uppercase tracking-wider">
                  {item.button}
                </button> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
