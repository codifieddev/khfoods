import AboutSection from "@/frontendComponents/Home/Aboutus";
import FeaturedWorks from "@/frontendComponents/Home/FeaturedWorks";
import Hero from "@/frontendComponents/Home/Hero";
// import NewsLatter from "@/frontendComponents/Home/NewsLatter";
import NewsSection from "@/frontendComponents/Home/NewsSection";
import NewsSectionCopy from "@/frontendComponents/Home/NewsSectionCopy";
import OurWork from "@/frontendComponents/Home/OurWork";
import ProductSection from "@/frontendComponents/Home/ProductSection";
import ProductSectionCopy from "@/frontendComponents/Home/ProductSectionCopy";
// import SliderBrand from "@/frontendComponents/Home/SliderBrand";
import NewOneSection from "@/frontendComponents/Home/NewOneSection"
import TestimonialsSection from "@/frontendComponents/Home/TestimonialsSection";
import BlogSection from "@/frontendComponents/sections/BlogSection";
import OurStorySection from "@/frontendComponents/sections/OurStorySection";



import { getCachedGlobal } from "@/utilities/getGlobals";

export const dynamic = "force-dynamic";

const HomePage = async () => {
 

  return (
    <main>
      {/* <HeroSection/> */}
      <Hero />

      <AboutSection />
      <OurWork />
      {/* <FeaturedWorks /> */}

      {/* <FeaturedProjects /> */}
      <ProductSection />
      <ProductSectionCopy>
      </ProductSectionCopy>
      {/* <NewsSection /> */}
      
      <NewsSectionCopy />
      <TestimonialsSection />
      <BlogSection />
      <OurStorySection/>
      {/* <SliderBrand /> */}
      <NewOneSection />
      {/* <NewsLatter /> */}
    </main>
  );
};
export default HomePage;
