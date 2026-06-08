import React from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    products: [
      { label: "Loss Protection", to: "/loss-protection" },
      { label: "Capital Lock", to: "/capital-lock" },
      { label: "Coach Support", to: "/coach-support" },
      { label: "Signals", to: "/signals" },
      { label: "User KYC", to: "/user-kyc" },
      { label: "InvestBay30", to: "/investbay30" }
    ],
    tools: [
      { label: "Free Calculators", to: "/calculators" },
      { label: "Screener", to: "/screener" },
      { label: "IPO", to: "/ipo" },
      { label: "My Goals", to: "/my-goals" },
      { label: "Sectors", to: "/sectors" },
      { label: "Compare Top Brokers", to: "/compare-brokers" },
      { label: "Compare Credit Cards", to: "/compare-cards" },
      { label: "Check CIBIL Score", to: "/cibil-score" }
    ],
    courses: [
      { label: "Stock Market Course", to: "/courses" },
      { label: "Personal Finance Course", to: "/finance-course" },
      { label: "Super Investor", to: "/mentors" }
    ],
    calculators: [
      { label: "All Calculators", to: "/calculators" },
      { label: "Financial Checkup", to: "/financial-checkup" },
      { label: "Brokerage Calculator", to: "/brokerage-calculator" },
      { label: "Lumpsum Calculator", to: "/lumpsum-calculator" },
      { label: "SIP Calculator", to: "/sip-calculator" },
      { label: "Reserve", to: "/reserve" },
      { label: "Step-Up Calculator", to: "/step-up-calculator" }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main Grid - 5 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

          {/* Column 1: Products */}
          <div>
            <h3 className="text-[16px] font-bold text-black mb-4" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
              Products
            </h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Tools */}
          <div>
            <h3 className="text-[16px] font-bold text-black mb-4" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
              Tools
            </h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Courses */}
          <div>
            <h3 className="text-[16px] font-bold text-black mb-4" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
              Courses
            </h3>
            <ul className="space-y-2">
              {footerLinks.courses.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Calculators */}
          <div>
            <h3 className="text-[16px] font-bold text-black mb-4" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
              Calculators
            </h3>
            <ul className="space-y-2">
              {footerLinks.calculators.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-[14px] text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Company Info - InvestBay */}
          <div>
            <h3 className="text-[20px] font-bold text-black mb-3" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
              INVESTBAY
            </h3>
            <div className="mb-4">
              <div className="text-[20px] font-bold text-black mb-2" style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
                30
              </div>
              <p className="text-[14px] text-gray-500 leading-relaxed">
                Subscription for Investors
              </p>
              <p className="text-[13px] text-gray-400 mt-2 leading-relaxed">
                30 stocks for the long term, investing concepts, premium valuation tools and much more await you with InvestBay Subscription!
              </p>
              <button className="mt-3 px-4 py-1.5 bg-black text-white text-[13px] font-medium rounded hover:bg-gray-800 transition-colors duration-200"
                onClick={() => navigate("/subscriptions")}>
                View Plans →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-start gap-6">
            {/* Copyright */}
            <div className="text-[12px] text-gray-400">
              Copyright {currentYear} All rights reserved with InvestBay Ventures Pvt Ltd | All logos and Trademarks registered with their respective owners.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy-policy" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-use" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                Terms of use
              </Link>
              <Link to="/refunds-policy" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                Refunds Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}