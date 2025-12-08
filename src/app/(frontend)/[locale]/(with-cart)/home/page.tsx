import AboutSection from "@/frontendComponents/Aboutus";
import FeaturedWorks from "@/frontendComponents/FeaturedWorks";
import Hero from "@/frontendComponents/Hero";
import NewsLatter from "@/frontendComponents/NewsLatter";
import NewsSection from "@/frontendComponents/NewsSection";
import OurWork from "@/frontendComponents/OurWork";
import ProductSection from "@/frontendComponents/ProductSection";
import SliderBrand from "@/frontendComponents/SliderBrand";
import TestimonialsSection from "@/frontendComponents/TestimonialsSection";


export const dynamic = "force-dynamic";

const OrdersPage = () => {
  return (
    <main>
      {/* <HeroSection/> */}
      <Hero />

      <AboutSection />
      <OurWork />
      <FeaturedWorks />

      {/* <FeaturedProjects /> */}
      <ProductSection />
      <NewsSection />

      <TestimonialsSection />
      <SliderBrand />
      <NewsLatter />
    </main>
  );
};
export default OrdersPage;
