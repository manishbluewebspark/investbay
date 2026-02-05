import Hero from "./home/Hero";
import InvestHelp from "./home/InvestHelp";
import FeaturedCalls from "./home/FeaturedCalls";
import Mentors from "./home/Mentors";
import FeaturedSubscriptions from "./home/FeaturedSubscriptions";
import FeaturedCourses from "./home/FeaturedCourses";
import Testimonials from "./home/Testimonials";
import Newsletter from "./Newsletter";

export default function Home() {
  return(
    <>
    <Hero/>
    <InvestHelp/>
    <FeaturedCalls/>
    <Mentors/>
    <FeaturedSubscriptions/>
    <FeaturedCourses/>
    <Testimonials/> 
    <Newsletter/>
    </>
  )
}