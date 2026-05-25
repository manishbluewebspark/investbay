import React from "react";
import { Linkedin, Twitter, Facebook, Instagram, Youtube, ArrowUpRight, Shield, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Feed", to: "/feed" },
    { label: "Signals", to: "/signals" },
    { label: "Mentors", to: "/mentors" },
    { label: "Subscriptions", to: "/subscriptions" },
    { label: "News", to: "/news" },
  ];

  const exploreLinks = [
    { label: "Featured Analysts", to: "/mentors" },
    { label: "Free Calls", to: "/signals" },
    { label: "Courses", to: "/courses" },
    { label: "Pricing Plans", to: "/pricing" },
    { label: "How It Works", to: "/how-it-works" },
  ];

  const supportLinks = [
    { label: "Help Center", to: "/help" },
    { label: "Contact Us", to: "/contact" },
    { label: "FAQs", to: "/faqs" },
    { label: "Report Issue", to: "/report" },
  ];

  const legalLinks = [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Refund Policy", to: "/refund" },
    { label: "Disclaimer", to: "/disclaimer" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="relative bg-[#060b10] border-t border-white/[0.05]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#f0f4f8] mb-2">
                Invest<span className="text-emerald-400">Bay</span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Your trusted platform for SEBI-registered research analysts and expert trading insights.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a href="mailto:support@investbay.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 group">
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                support@investbay.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 group">
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                +91 12345 67890
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 group hover:-translate-y-1"
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-emerald-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="py-6 border-t border-white/[0.05]">
          <div className="flex items-start gap-4 p-4 bg-red-500/[0.03] border border-red-500/10 rounded-2xl">
            <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-400">Disclaimer:</span>{" "}
              This is a technology-driven platform for educational and informational purposes only. We do not provide any buy/sell recommendations, investment advice, or stock market tips. Please consult your financial advisor before making any investment decisions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-slate-600">
            © {currentYear} InvestBay. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-300">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-300">
              Privacy
            </Link>
            <Link to="/cookies" className="text-xs text-slate-600 hover:text-slate-400 transition-colors duration-300">
              Cookies
            </Link>
          </div>

          <p className="text-sm text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            Only SEBI-registered analysts listed
          </p>
        </div>
      </div>
    </footer>
  );
}