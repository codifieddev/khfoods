"use client";

import type { ReactNode } from "react";
import Header from "../src/frontendComponents/sections/Header";
import { Footer } from "../src/frontendComponents/sections/Footer";

export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#4F4640] flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
