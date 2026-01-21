"use client";

export default function Uslogo() {
  const slides = [
    {
      title: "Free Shipping Within US",
      description:
        "We ship orders to all states in US including AK, HI, PR for free.",
      button: "SHOP NOW",
    },
  ];

  return (
    <section className="relative w-full h-[60vh] overflow-hidden">
      {/* PARALLAX BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage:
            "url('/assets/Image/khfoodImage/Peanut.jpg')",
          backgroundAttachment: "fixed",
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center justify-center px-4 md:px-16 text-white">
        {slides.map((item, index) => (
          <div
            key={index}
            className="text-center max-w-6xl mx-auto"
          >
            <h1 className="md:text-[70px] text-[90px] font-semibold leading-none mb-6">
              {item.title}
            </h1>

            <p className="md:text-lg text-md text-gray-200 mb-8">
              {item.description}
            </p>

            <button className="px-7 py-3 bg-[#FFD100] hover:bg-[#e6c200] transition text-black font-semibold">
              {item.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
