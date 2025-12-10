import {
  BadgeCheck,
  Building2,
  Heart,
  HeartPulse,
  Home,
  LayoutGrid,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import React from "react";
import { MdLockOutline } from "react-icons/md";
 
const page = () => {
 
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
      button: "SHOP NOW",
    },
    {
      id: 2,
      icon: <BadgeCheck className="w-12 h-12 text-[#8C2C1A]" />,
      title: "Premium Quality",
      description:
        "We follow strict quality standards to deliver fresh, premium, and perfectly roasted peanuts every time. Trusted since 1991 for exceptional craftsmanship.",
      number: "02",
      button: "SIGN UP",
    },
    {
      id: 3,
      icon: <UtensilsCrossed className="w-12 h-12 text-[#8C2C1A]" />,
      title: "Delicious Taste",
      description:
        "Crafted for rich flavor and a satisfying crunch, our peanuts deliver a taste you’ll love. Made to please every palate with authentic, delicious goodness.",
      number: "03",
      button: "SHOP NOW",
    },
  ];
  return (
    <div className="bg-[#fff9f3] text-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#fff4e5] via-[#ffe8cf] to-[#fff9f3]">
        <div className="mx-auto max-w-6xl px-4 py-16 lg:flex lg:items-center lg:gap-12">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Home / About / History
            </p>
            <h1 className="mt-2 font-auto text-4xl font-semibold text-[#8b4f1a] md:text-5xl">
              Our History
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-700 md:text-base">
              From a small family dream in Orange County, California, to “The
              Best Peanuts on Earth”, this is the journey of K H Food, built on
              natural ingredients and honest roasting.
            </p>
          </div>
 
          <div className="mt-10 flex-1 lg:mt-0 lg:flex lg:justify-end">
            <div className="relative w-full max-w-xs">
              <div className="aspect-[4/5] w-full rounded-[40%_60%_55%_45%] border-[6px] border-white/90 bg-[url('/assets/Image/khfoodImage/Image-2.jpg')] bg-cover bg-center shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
 
      {/* Brand story */}
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="mt-10 lg:mt-0 lg:flex lg:justify-end">
            <div className="w-full  max-w-xl">
              <img
                src="/assets/Image/khfoodImage/Image-4.jpg"
                className="h-[400px] rounded-2xl"></img>
            </div>
          </div>
 
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b86823]">
              About KH Food
            </p>
            <h2 className="mt-2 font-auto text-2xl font-semibold text-[#8b4f1a] md:text-3xl">
              A Little Story About Us
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700 md:text-base">
              <p>
                K H Food began in Orange County, California in 1991, when a
                young married couple who immigrated from Taiwan decided to build
                a peanut brand dedicated to quality and care.
              </p>
              <p>
                Their vision was to roast peanuts with only natural ingredients
                and no preservatives, focusing on real flavor and everyday
                health for families who love to snack.
              </p>
              <p>
                Over the years that small idea became a steady promise: to
                process and manufacture some of the best peanuts in the world
                while staying true to careful sourcing and gentle roasting.
              </p>
            </div>
          </div>
        </div>
      </section>
 
      {/* Timeline */}
      <section className="bg-light-dark py-20">
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
                className="relative p-10 rounded-xl border bg-white border-[#E5E5E5] shadow-md transition-all hover:shadow-xl overflow-hidden">
                {/* Card Number (Faint background text) */}
                <h1 className="absolute bottom-4 right-6 text-8xl font-bold text-[#8C2C1A] opacity-10 select-none">
                  {service.number}
                </h1>
 
                {/* Icon */}
                <div className="mb-6 ">{service.icon}</div>
 
                {/* Title */}
                <h3 className="text-lg font-bold text-[#8C2C1A] tracking-wider mb-3 uppercase">
                  {service.title}
                </h3>
 
                {/* Divider */}
                <div className="h-1 w-20 bg-[#8C2C1A] mb-6"></div>
 
                {/* Description */}
                <p className="text-[#5A3A18] leading-relaxed mb-8">
                  {service.description}
                </p>
 
                {/* Button */}
                {/* <button className="px-6 py-2  text-dark rounded-md font-normal border border-[#8C2C1A] tracking-wide hover:bg-dark transition">
                {service.button}
              </button> */}
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Values */}
      <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
 
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.12)] transition-all duration-300 bg-white"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#F4E5D2] text-[#8C2C1A] mb-4 shadow">
              {item.icon}
            </div>
 
            <h3 className="text-xl font-semibold text-gray-800">
              {item.title}
            </h3>
 
            <p className="text-gray-500 mt-1 text-sm">{item.subtitle}</p>
          </div>
        ))}
 
      </div>
    </div>
 
 
      {/* CTA */}
      <section className="bg-[#f6efe1] py-20 text-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-auto text-2xl font-semibold md:text-4xl">
              Let&apos;s Taste All Natural
            </h2>
            <p className="mt-4 text-sm text-gray-700 md:text-base">
              Discover why our journey has always been about roasting peanuts
              the honest way.
            </p>
          </div>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-[#ffb057] px-5 py-2 text-base font-semibold text-[#2c1607] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#ffc275] hover:shadow-2xl">
            Shop Peanuts
          </a>
        </div>
      </section>
    </div>
  );
};
 
export default page;