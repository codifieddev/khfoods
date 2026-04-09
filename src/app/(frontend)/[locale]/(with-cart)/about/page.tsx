import React from "react";
import { setRequestLocale } from "next-intl/server";

import { type Locale } from "@/i18n/config";
import AboutKarloBan from "@/frontendComponents/sections/AboutKarloBan";
import AboutStrip from "@/frontendComponents/sections/AboutStrip";
import OurStorySection from "@/frontendComponents/sections/OurStorySection";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export const dynamic = "force-dynamic";

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen pt-20">
      {/* Visual Components migrated from Payload to Next.js Components */}
      <AboutKarloBan />
      <AboutStrip />
      <OurStorySection />
    </main>
  );
}
