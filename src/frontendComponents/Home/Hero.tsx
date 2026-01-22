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
  const [aboutData, setAboutData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetch("/api/pages?where[slug][equals]=home&depth=2");
        const res = await data.json();
        if (res) setData(res.docs[0].hero);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pages?where[slug][equals]=about&depth=2");
        const json = await res.json();
        if (json?.docs?.length) setAboutData(json.docs[0]);
      } catch (error) {
        console.error("About fetch error", error);
      }
    })();
  }, []);

  let text: string[] = [];
  if (data) text = extractTexts(data.richText.root);

  const subtitle = text?.[0] || "KHFOOD PRESENTS";
  const title = text?.[1] || "BEST PEANUTS ON EARTH";

  let aboutText: string[] = [];
  if (aboutData?.richText?.root) aboutText = extractTexts(aboutData.richText.root);

  // Keeping these in case you use them later
  const since = aboutText?.[0] || "SINCE 1990";
  const aboutTitle1 = aboutText?.[1] || "A LITTLE STORY";
  const aboutTitle2 = aboutText?.[2] || "ABOUT US";
  const aboutDescription =
    aboutText?.[3] || "For nearly three decades, our vision for our peanuts stands the same.";
  const aboutButton = aboutText?.[4] || "KNOW MORE";

  if (loading) return <div>Loading...</div>;

  return (
    <section className="relative w-full h-[100svh] overflow-hidden font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="./assets/Image/khfoodImage/IMG_5385.mov"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Center Title Group */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
        <div className="flex flex-col items-center w-full">
          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 sm:gap-6 mb-2 sm:mb-4 opacity-90 px-4 sm:px-8"
          >
            <div className="h-px w-10 sm:w-24 bg-white" />
            <p className="text-white uppercase tracking-[0.2em] text-[10px] sm:text-sm md:text-base font-semibold text-center whitespace-nowrap">
              {subtitle}
            </p>
            <div className="h-px w-10 sm:w-24 bg-white" />
          </motion.div>

          {/* Title (desktop unchanged; mobile wraps + scales safely) */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={[
              // ✅ Desktop stays like your original intent
              "md:whitespace-nowrap md:leading-none md:text-center md:font-extrabold md:uppercase md:text-white",
              "md:text-[80px] lg:text-[100px]",

              // ✅ Mobile responsiveness (only affects < md)
              "max-md:text-center max-md:font-extrabold max-md:uppercase max-md:text-white",
              "max-md:text-[34px] sm:max-md:text-[48px]",
              "max-md:leading-tight",
              "max-md:whitespace-normal", // allow wrapping on small screens
              "max-md:break-words", // prevent overflow
              "max-md:max-w-[92vw]", // keep within viewport
            ].join(" ")}
          >
            {title}
          </motion.h1>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 w-full px-5 sm:px-10 flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-start md:items-end z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-white max-w-lg"
        />

        <motion.a
          href="#shop"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="
            bg-white text-black
            px-5 sm:px-6 py-2.5 sm:py-3
            rounded-md shadow font-semibold
            flex items-center gap-2
            hover:bg-gray-100 transition
            text-sm sm:text-base
          "
        >
          SHOP NOW
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
