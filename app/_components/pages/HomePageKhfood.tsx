"use client";

import Hero from "../../../src/frontendComponents/Home/Hero";
import AboutSection from "../../../src/frontendComponents/Home/Aboutus";
import SpecialOffers from "../../../src/frontendComponents/Home/SpecialOffers";
import FreeShipping from "../../../src/frontendComponents/Home/FreeShipping";
import ProductSection from "../../../src/frontendComponents/Home/ProductSectionCopy";
import DiscoverWorldSection from "../../../src/frontendComponents/Home/DiscoverWorldSwiper";
import TestimonialsSection from "../../../src/components/TestimonialsSection";
import NewsSection from "../../../src/components/NewsSection";
import ExploreStoreSection from "../../../src/frontendComponents/Home/ExploreStoreSection";
import SliderBrand from "../../../src/frontendComponents/Home/SliderBrand";
import NewsLatter from "../../../src/frontendComponents/Home/NewOneSection";

export default function HomePageKhfood() {
  return (
    <div className="bg-white text-[#4F4640]">
      <Hero />
      <AboutSection />
      <SpecialOffers />
      <FreeShipping />
      <ProductSection />
      <DiscoverWorldSection />
      <TestimonialsSection />
      <NewsSection />
      <ExploreStoreSection />
      <SliderBrand />
      <NewsLatter />
    </div>
  );
}
