import PatternTop from "../../assets/PatternTop.jpg";
import TopHeroSection from "./TopHeroSection";
import DashboardSection from "./DashboardSection";

export default function Hero() {
  return (
    <section
      className="relative text-gray-900 overflow-hidden"
      style={{
        backgroundImage: `url(${PatternTop})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
    >

      <TopHeroSection />
      <DashboardSection />
    </section>
  );
}
