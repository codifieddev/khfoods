"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export default function NewsSection() {
  // 🎨 YAHAA BADLA HAI: Architect website ke liye naya content
  const news = [
    {
      id: 1,
      title: "Where we Get Our Peanuts",
      description:
        "Our peanuts are a product of the USA, received from states like Texas and Virginia, to ensure that they are gathered and farmed without unnatural methods. …",
      button: "READ MORE",
      image: "/assets/Image/khfoodImage/Mobile-version-image-1.jpg", // ⚠️ Apni image ka path yahaan daalein
    },
    {
      id: 2,
      title: "Health Benefits of Peanuts",
      description:
        "Our peanuts are not only delicious and the perfect go-to snack, but they are also extremely healthy and beneficial to our diet. Unlike most snacks …",
      button: "READ MORE",
      image: "/assets/Image/khfoodImage/Mobile-version-image-2.jpg", // ⚠️ Apni image ka path yahaan daalein
    },
    {
      id: 3,
      title: "Health Benefits of Peanuts",
      description:
        "Our peanuts are not only delicious and the perfect go-to snack, but they are also extremely healthy and beneficial to our diet. Unlike most snacks …",
      button: "READ MORE",
      image: "/assets/Image/khfoodImage/Mobile-version-image-1.jpg", // ⚠️ Apni image ka path yahaan daalein
    },
 
  ];

  return (
    // Section BG ko dark gray kiya
    <section className="relative bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-dark mb-12">
          {/* 🎨 Title text ko white kiya */}
        WHAT MAKES OUR PEANUTS THE BEST
        </h2>

        <div className="grid md:grid-cols-3 gap-8 py-4">
          {news.map((item) => (
            <div
              key={item.id}
              // Card BG ko thoda lighter gray, shadow ki jagah border diya
              className="bg-light-dark rounded-none overflow-hidden flex flex-col shadow border-none border-light-dark hover:border-[#debb70] transition-colors duration-300">
              <img
                src={item.image}
                alt={item.title}
                className="h-72 w-full object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-dark mb-2 leading-snug">
                  {/* Card title ko light gray kiya */}
                  {item.title}
                </h3>
                <p className="text-700 flex-grow">
                  {/* Description text ko light gray kiya */}
                  {item.description}
                </p>
                <div className="mt-4 text-sm text-gray-600 font-semibold"><a href="#" className="hover:text-black decoration">{item.button}</a></div>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-12 ">
          <button
            className="inline-flex items-center gap-2 bg-[#debb70] hover:bg-[#debb70] text-white px-6 py-3 font-semibold transition-colors duration-300"
            style={{ borderRadius: "6px" }}
          >
            See All News
            <ArrowRight size={18} />
          </button>
        </div> */}
      </div>
    </section>
  );
}