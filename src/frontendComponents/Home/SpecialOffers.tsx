"use client";

import { Gift, Grid2x2, Home } from "lucide-react";

const offers = [
  {
    Icon: Gift,
    title: "GIFT BOX",
    description:
      "With ANY order of our 6 oz. products, you will receive FREE complimentary gift boxes! 100% natural, no preservatives.",
  },
  {
    Icon: Grid2x2,
    title: "WHOLESALE",
    description:
      "Click the link below to checkout our amazing deals for wholesale! Premium roasted peanuts since 1991.",
  },
  {
    Icon: Home,
    title: "INTERNATIONAL SHIPPING",
    description:
      "Available now! Shipping to Taiwan. With ANY 6 oz. order, you will receive FREE complimentary gift boxes!",
  },
];

export default function SpecialOffers() {
  return (
    <section className="w-full bg-white py-20">
      <div className="mx-auto max-w-[1300px] px-6">
        <h2 className="text-center text-3xl font-bold uppercase tracking-wide text-black md:text-4xl">
          OUR SPECIAL OFFERS
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {offers.map(({ Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-black">
                <Icon className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold uppercase tracking-wide text-black">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-7 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
