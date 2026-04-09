"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function extractTexts(node: any, result: string[] = []): string[] {
  if (!node) return result;

  if (node.type === "text" && node.text) {
    result.push(String(node.text));
  }

  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child: any) => extractTexts(child, result));
  }

  return result;
}

export default function Hero() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/pages?where[slug][equals]=home&depth=2");
        if (!response.ok) throw new Error("Fetch failed");
        const res = await response.json();
        if (res?.docs?.length && res.docs[0]?.hero) {
          setData(res.docs[0].hero);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  let text: string[] = [];
  if (data?.richText?.root) text = extractTexts(data.richText.root);

  const subtitle = text?.[0] || "KHFOOD PRESENTS";
  const title = text?.[1] || "BEST PEANUTS ON EARTH";

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center">
      {/* Background Video */}
      <video
        key="hero-video"
        src="/assets/IMG_5385.mov"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Fallback Image with the exact reference look */}
      <div className="absolute inset-0 z-[-1] bg-[#1a1a1a]">
         <img
          className="w-full h-full object-cover opacity-60"
          src="https://images.unsplash.com/photo-1590779033100-9f60705a2f3e?auto=format&fit=crop&q=80&w=2600"
          alt="Peanuts fallback"
        />
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-[1] bg-black/35" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 text-center">
        {/* Subtitle with centered lines */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center gap-6 sm:gap-14 mb-6"
        >
          <div className="h-[1px] w-12 sm:w-40 bg-white/40" />
          <p className="text-white uppercase tracking-[0.45em] text-[10px] sm:text-[14px] font-bold">
            {subtitle}
          </p>
          <div className="h-[1px] w-12 sm:w-40 bg-white/40" />
        </motion.div>

        {/* Hero Title - Elegant Serif Font to match the NEW image */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="
            font-heading font-bold uppercase
            text-white leading-[0.95]
            text-[48px] sm:text-[80px] md:text-[110px] lg:text-[140px] xl:text-[155px]
            tracking-tight
          "
          style={{ 
            textShadow: "0 10px 40px rgba(0,0,0,0.4)",
            fontFamily: "var(--font-heading), serif"
          }}
        >
          {title}
        </motion.h1>
      </div>

      {/* Bottom Right CTA */}
      <div className="absolute bottom-10 right-10 z-20">
        <motion.a
          href="/shop"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="
            bg-white text-black 
            px-8 sm:px-12 py-4 sm:py-5
            flex items-center justify-center gap-3
            font-bold text-[14px] uppercase tracking-[0.15em]
            hover:bg-gray-100 transition-all active:scale-95
            shadow-2xl group
          "
        >
          SHOP NOW
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 transition-transform group-hover:translate-x-1.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
