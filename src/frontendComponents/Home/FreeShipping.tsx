"use client";

import Image from "next/image";
import Link from "next/link";

export default function FreeShipping() {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start">
          <div className="relative h-[440px] w-full max-w-[420px] overflow-hidden rounded-[22px] bg-black text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
            <Image
              src="/assets/uploads/Peanut-scaled.jpeg"
              alt="Free shipping peanuts"
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
              <div className="max-w-[20rem]">
                <h3 className="font-heading text-[38px] font-bold leading-none tracking-tight text-white m-0">
                  FREE SHIPPING
                  <br />
                  <span className="italic font-medium text-[34px] normal-case opacity-95">Within</span>
                  <br />
                  US
                </h3>
                <p className="mt-5 text-[15px] font-medium leading-[1.6] text-white/90 max-w-[280px]">
                  We ship orders to all states in US including AK, HI, PR at no cost.
                </p>
              </div>

              <div className="mt-auto">
                <Link
                  href="#shop"
                  className="inline-flex h-[54px] items-center justify-center rounded-full bg-white px-10 text-[14px] font-black uppercase tracking-widest !text-black transition-all hover:bg-neutral-100 active:scale-95 shadow-lg"
                >
                  SHOP NOW →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
