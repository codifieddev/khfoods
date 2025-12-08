"use client";
import React from "react";

const Hero = () => {
  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute w-full h-full object-cover"
        src="/assets/Image/khfoodImage/IMG_5385.mov" // <-- replace with your video path
        autoPlay
        muted
        loop
      />

      {/* Overlay */}
      <div className="absolute w-full h-full bg-black/50"></div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <p className="text-white text-lg mb-10 tracking-[8px] border-b">KHFOOD PRESENTS</p>
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-6">
          BEST PEANUTS ON EARTH
        </h1>
        <div className="flex gap-4 pt-10">
          <button className="bg-[#d4a762] text-white py-2 px-6 rounded hover:opacity-90 transition">
            SHOP NOW
          </button>
          <button className="border border-white text-white py-2 px-6 rounded hover:bg-white hover:text-black transition">
            CONTACT US
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
