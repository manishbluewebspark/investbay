import React from "react";
import { Linkedin, Twitter, Facebook, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0E0E10] text-gray-400 py-12 px-6">
      
      {/* TOP GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-md">

        {/* Quick Links */}
        <div>
          <h3 className="text-white mb-4">Quick Links</h3>
<ul className="space-y-2">
  <li>
    <Link to="/feed" className="hover:text-blue-600">
      Feed
    </Link>
  </li>

  <li>
    <Link to="/signals" className="hover:text-blue-600">
      Signals
    </Link>
  </li>

  <li>
    <Link to="/mentors" className="hover:text-blue-600">
      Mentors
    </Link>
  </li>

  <li>
    <Link to="/subscriptions" className="hover:text-blue-600">
      Subscriptions
    </Link>
  </li>

  <li>
    <Link to="/news" className="hover:text-blue-600">
      News
    </Link>
  </li>
</ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white mb-4">Explore</h3>
          <ul className="space-y-2">
            <li>Featured Analysts</li>
            <li>Free Calls</li>
            <li>Courses</li>
            <li>Pricing Plans</li>
            <li>How It Works</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Report Issue</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white mb-4">Legal & Compliance</h3>
          <ul className="space-y-2">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>Disclaimer</li>
          </ul>
        </div>
      </div>

      {/* FOLLOW + DISCLAIMER ROW */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-t border-gray-800 pt-6">
        
        {/* Social */}
        <div className="flex items-center gap-4">
          <span className="text-md">Follow us</span>
          <div className="flex gap-3">
            <Linkedin size={16} />
            <Twitter size={16} />
            <X size={16} />
            <Facebook size={16} />
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 max-w-xl text-left md:text-right">
          Disclaimer: Investments in securities market are subject to market risks.
          Please read all related documents carefully before investing.
        </p>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 border-t border-gray-800 pt-4">
        
        <p>© {currentYear} InvestBay. All rights reserved.</p>

        <p className="text-center md:text-right">
          Only SEBI-registered research analysts are listed on the platform
        </p>
      </div>
    </footer>
  );
}