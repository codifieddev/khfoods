"use client";

import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Send, Twitter } from "lucide-react";

export function Footer() {
  const socialIcons = [
    { Icon: Facebook, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Send, href: "#" },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-[#1B1B1B] text-white">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FFD100] via-[#FFD100] to-transparent opacity-80" />

      <div className="mx-auto max-w-7xl space-y-12 px-6 pb-10 pt-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-center">
          <div className="md:flex md:items-start gap-4">
            <div className="mb-4 flex items-center justify-start rounded-md md:mb-0">
               <img src="/assets/khfood_logo.png" alt="KHFOOD" className="h-10 w-auto object-contain" />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              K H Food became a company in Orange County, California in 1991. They had the vision to become the highest quality peanut company in California.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-[14px] uppercase lg:gap-6">
            <div className="mt-0 flex gap-3">
              {socialIcons.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:border-[#FFD100] hover:bg-[#FFD100] hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </nav>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div>
            <h3 className="mb-4 text-[16px] font-medium uppercase text-white/80">QUICK LINKS</h3>
            <ul className="space-y-2.5 text-[14px] text-white/70">
              <li><Link className="hover:text-[#FFD100]" href="/">Home</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/faq">FAQs</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/services">Wholesale</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/contact">Contact Us</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/shop">Store Locator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[16px] font-medium uppercase text-white/80">ABOUT US</h3>
            <ul className="space-y-2.5 text-[14px] text-white/70">
              <li><Link className="hover:text-[#FFD100]" href="/about">History</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/about">Nutrition</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/about">Process</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[16px] font-medium uppercase text-white/80">PRODUCTS</h3>
            <ul className="space-y-2.5 text-[14px] text-white/70">
              <li><Link className="hover:text-[#FFD100]" href="/shop">Domestic</Link></li>
              <li><Link className="hover:text-[#FFD100]" href="/shop">International</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[16px] font-medium uppercase text-white/80">CONTACT US</h3>
            <ul className="space-y-2.5 text-[14px] text-white/70">
              <li><a className="hover:text-[#FFD100]" href="tel:+17146391201">(714)639-1201</a></li>
              <li><a className="hover:text-[#FFD100]" href="mailto:contact@khfood.com">contact@khfood.com</a></li>
              <li><a className="hover:text-[#FFD100]" href="#">585 Yorbita Rd. La Puente, CA 91744</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 border-t border-white/10 pt-8 md:flex-row">
          <div className="w-full md:w-1/2">
            <h3 className="mb-4 text-[16px] font-medium uppercase text-white/80">SIGN UP TO NEWSLETTER</h3>
            <p className="mb-4 text-[14px] leading-relaxed text-white/70">
              SUBSCRIBE TO THE KHFOOD MAILING LIST TO RECEIVE UPDATES ON NEW ARRIVALS, SPECIAL OFFERS AND OTHER DISCOUNT INFORMATION.
            </p>
          </div>

          <div className="flex w-full items-center overflow-hidden rounded-md border border-white/15 bg-white/5 backdrop-blur-sm md:w-1/2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/40"
            />
            <button className="bg-[#FFD100] px-6 py-3 text-[14px] font-semibold uppercase text-black transition-colors hover:bg-[#ffe14a]">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center lg:px-8">
          <p className="mb-1 text-[11px] text-white/40">
            © 1991-2026 K H Food Corp. All rights reserved. KH logo is a trademark of KH Food Corp.
          </p>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/30">
            Built for a cleaner storefront UI
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </footer>
  );
}
