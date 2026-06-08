import Hero from "./home/Hero";
import InvestHelp from "./home/InvestHelp";
import FeaturedCalls from "./home/FeaturedCalls";
import Mentors from "./home/Mentors";
import ServiceSector from "./home/ServiceSector";
import FeaturedSubscriptions from "./home/FeaturedSubscriptions";
import FeaturedCourses from "./home/FeaturedCourses";
import Testimonials from "./home/Testimonials";
import Newsletter from "./Newsletter";
import CommunityStats from "./home/CommunityStats";
import ProductsForInvestors from "./home/Productsforinvestors";
import FAQ from "./home/FAQ";

export default function Home() {
  return (
    <>
      <Hero />
      <ServiceSector />
      <ProductsForInvestors />
      <Mentors />
      <FeaturedCalls />
      <FeaturedCourses />
      <InvestHelp />
      <FeaturedSubscriptions/>
      <CommunityStats />
      <FAQ />
      <Testimonials />
      {/* <Newsletter/> */}
    </>
  )
}