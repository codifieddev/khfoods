"use client";
import React from "react";
import {
  Truck,
  Star,
  RotateCcw,
  MessageCircle,
  CreditCard
} from "lucide-react";

const brands = [
  { img: "/assets/uploads/logo1.jpg", alt: "CDPH" },
  { img: "/assets/uploads/logo2.jpg", alt: "Made in USA" },
  { img: "/assets/uploads/logo3.jpg", alt: "FDA" },
  { img: "/assets/uploads/logo4.jpg", alt: "Non-GMO" },
  { img: "/assets/uploads/logo5.jpg", alt: "Public Health" },
];

const features = [
  {
    icon: <Truck className="w-10 h-10 text-orange-500" />,
    title: "Free Delivery",
    desc: "Across the US on qualifying orders.",
  },
  {
    icon: <Star className="w-10 h-10 text-orange-500" />,
    title: "Best Quality",
    desc: "Carefully selected ingredients, always.",
  },
  {
    icon: <RotateCcw className="w-10 h-10 text-orange-500" />,
    title: "Easy Returns",
    desc: "A friendly process when plans change.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-orange-500" />,
    title: "Feedback",
    desc: "Quick support when you need it.",
  },
  {
    icon: <CreditCard className="w-10 h-10 text-orange-500" />,
    title: "Payments",
    desc: "A simple checkout flow from start to finish.",
  },
];

const SliderBrand = () => {
  return (
    <div className="bg-white py-8 md:py-20">
      <div className="container mx-auto">
        <div className="pt-5">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {brands.map((brand) => (
              <div key={brand.alt} className="flex items-center justify-center transition-all hover:opacity-100">
                <img src={brand.img} alt={brand.alt} className="h-24 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderBrand;
