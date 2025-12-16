import React from "react";
import { Linkedin, Twitter, Facebook, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E0E10] text-gray-400 py-12 px-6 md:px-16 lg:px-24">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/footer.svg"
              alt="InvestBay Logo"
              className="w-50 h-10 object-contain"
            />
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            We connect smart investors with verified market experts. Get reliable
            stock insights, mentorship, and data-driven signals all in one secure
            platform.
          </p>
        </div>

        {/* Middle */}
        <div className="flex flex-col">
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Use</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Refund Policy</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">SEBI Scores</a></li>
            <li><a href="#" className="hover:text-teal-400 transition-colors">Investor Charter</a></li>
          </ul>
        </div>

        {/* Right */}
        <div className="flex flex-col">
          <h3 className="text-white font-semibold mb-4">We Offerings</h3>
          <ul className="space-y-2 text-sm">
            <li>Expert Guidance</li>
            <li>Real-Time Insights</li>
            <li>Personalized Investment Plans</li>
            <li>Recommendations and Signals</li>
            <li>Community and Learning</li>
            <li>Regulatory Compliance</li>
            <li>Model Portfolio</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 max-w-7xl"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl  mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-xs text-gray-500">
          © 2025 KatalX Technologies Pvt Ltd
        </p>

        <div className="flex items-center gap-3">
          <a href="#" className="p-2 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors">
            <Linkedin size={14} />
          </a>
          <a href="#" className="p-2 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors">
            <Twitter size={14} />
          </a>
          <a href="#" className="p-2 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors">
            <Facebook size={14} />
          </a>
          <a href="#" className="p-2 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors">
            <X size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
