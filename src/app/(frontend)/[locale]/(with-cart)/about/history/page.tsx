"use client";

import {
  BadgeCheck,
  Heart,
  HeartPulse,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";
import { MdLockOutline } from "react-icons/md";

// ✅ FIXED: '/src' hata diya.
// Make sure karein ki aapki file ka naam 'Newpart.tsx' hi ho folder mein.
import Newpart from "./Newpart";
import NewOneSection from "@/frontendComponents/Home/NewOneSection";


/* ================= IMAGE ================= */
const VECTOR_BG = "/assets/Image/khfoodImage/Image-4.jpg";

// ✅ FIXED: Component name Capital 'P' se start kiya (Zaroori hai)
const Page = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: "Free Shipping",
      subtitle: "Fast delivery for all domestic orders",
    },
    {
      icon: <MdLockOutline size={32} />,
      title: "Secure Payments",
      subtitle: "Safe & encrypted checkout",
    },
    {
      icon: <Users size={32} />,
      title: "Customer Priority",
      subtitle: "Dedicated support & quick responses",
    },
    {
      icon: <Heart size={32} />,
      title: "Made with Love",
      subtitle: "Premium quality & trusted service",
    },
  ];

  const services = [
    {
      id: 1,
      icon: <HeartPulse className="w-12 h-12 text-[#8C2C1A]" />,
      title: "Natural & Healthy",
      description:
        "Our products are made with 100% natural ingredients, free from preservatives and artificial additives. Enjoy a healthier snacking experience with every bite.",
      number: "01",
    },
    {
      id: 2,
      icon: <BadgeCheck className="w-12 h-12 text-[#8C2C1A]" />,
      title: "Premium Quality",
      description:
        "We follow strict quality standards to deliver fresh, premium, and perfectly roasted peanuts every time. Trusted since 1991 for exceptional craftsmanship.",
      number: "02",
    },
    {
      id: 3,
      icon: <UtensilsCrossed className="w-12 h-12 text-[#8C2C1A]" />,
      title: "Delicious Taste",
      description:
        "Crafted for rich flavor and a satisfying crunch, our peanuts deliver a taste you’ll love. Made to please every palate with authentic, delicious goodness.",
      number: "03",
    },
  ];

  return (
    <div className="bg-[#fff9f3] text-slate-900">
      {/* ================= HERO ================= */}
      <section
        className="relative w-full overflow-hidden pt-[120px]"
        style={{
          backgroundImage: "url('/assets/Image/bg-banner.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex min-h-[260px] max-w-7xl items-center justify-center px-5 py-14 md:min-h-[320px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold uppercase md:text-5xl">
              History
            </h1>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-neutral-500">
                About KH Food
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                A Little Story About Us
              </h2>

              <p className="mt-6 text-neutral-700 leading-relaxed">
                K H Food began in Orange County, California in 1991, when a
                young married couple who immigrated from Taiwan decided to build
                a peanut brand dedicated to quality and care. Their vision was
                to roast peanuts with only natural ingredients and no
                preservatives, focusing on real flavor and everyday health for
                families who love to snack. Over the years that small idea
                became a steady promise: to process and manufacture some of the
                best peanuts in the world while staying true to careful sourcing
                and gentle roasting.
              </p>
            </div>

            <div className="relative h-[360px] rounded-[28px] overflow-hidden shadow-lg">
              <img
                src="https://khfood.com/wp-content/uploads/2020/11/About-Us-Photo-1-2.png"
                alt="Vector International"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Newpart />

      {/* ================= TIMELINE ================= */}
      {/* <section className="bg-light-dark py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-auto text-3xl font-semibold text-[#8b4f1a] md:text-4xl">
              Our Journey
            </h2>
            <p className="mt-2 text-sm text-slate-700 md:text-base">
              A few key moments that shaped K H Food into the peanut company it
              is today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative p-10 rounded-xl border bg-white border-[#E5E5E5] shadow-md"
              >
                <h1 className="absolute bottom-4 right-6 text-8xl font-bold text-[#8C2C1A] opacity-10">
                  {service.number}
                </h1>
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-lg font-bold text-[#8C2C1A] uppercase mb-3">
                  {service.title}
                </h3>
                <p className="text-[#5A3A18] leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ================= FEATURES ================= */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md bg-white border border-gray-200"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F4E5D2] mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-500 mt-1 text-sm">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      <NewOneSection />
    </div>
  );
};

export default Page;