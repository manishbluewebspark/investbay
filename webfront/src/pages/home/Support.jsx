import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowRight } from "lucide-react";

// ── Category icons (SVG inline) ──────────────────────────────────────────────
const icons = {
  account: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <circle cx="24" cy="18" r="9" stroke="#111" strokeWidth="2.5" fill="white" />
      <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="24" cy="18" r="4" fill="#22c55e" />
    </svg>
  ),
  subscription: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <rect x="6" y="10" width="36" height="28" rx="5" stroke="#111" strokeWidth="2.5" fill="white" />
      <path d="M6 18h36" stroke="#111" strokeWidth="2.5" />
      <rect x="12" y="24" width="10" height="8" rx="2" fill="#22c55e" />
      <line x1="26" y1="26" x2="36" y2="26" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <line x1="26" y1="30" x2="32" y2="30" stroke="#111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  payments: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <rect x="4" y="12" width="40" height="26" rx="5" stroke="#111" strokeWidth="2.5" fill="white" />
      <rect x="4" y="20" width="40" height="7" fill="#22c55e" opacity="0.25" />
      <path d="M4 20h40" stroke="#111" strokeWidth="2" />
      <circle cx="14" cy="30" r="4" fill="#22c55e" />
      <circle cx="22" cy="30" r="4" fill="#22c55e" opacity="0.4" />
    </svg>
  ),
  signals: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <rect x="6" y="28" width="8" height="14" rx="2" fill="#22c55e" opacity="0.4" stroke="#111" strokeWidth="2" />
      <rect x="18" y="20" width="8" height="22" rx="2" fill="#22c55e" opacity="0.65" stroke="#111" strokeWidth="2" />
      <rect x="30" y="10" width="8" height="32" rx="2" fill="#22c55e" stroke="#111" strokeWidth="2" />
      <polyline points="10,24 22,16 34,8" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" fill="none" />
    </svg>
  ),
  mentors: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <circle cx="18" cy="16" r="7" stroke="#111" strokeWidth="2.5" fill="white" />
      <circle cx="18" cy="16" r="3" fill="#22c55e" />
      <path d="M6 38c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M30 20 L30 32 M30 32 L38 32 M30 26 L36 20" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  courses: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <rect x="8" y="6" width="26" height="34" rx="4" stroke="#111" strokeWidth="2.5" fill="white" />
      <rect x="4" y="10" width="26" height="34" rx="4" stroke="#111" strokeWidth="2.5" fill="white" />
      <line x1="10" y1="20" x2="26" y2="20" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="26" x2="26" y2="26" stroke="#111" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="32" width="10" height="6" rx="2" fill="#22c55e" />
    </svg>
  ),
  lossprotection: (
    <svg viewBox="0 0 48 48" fill="none" width="36" height="36">
      <path d="M24 4 L40 10 V24 C40 34 33 40 24 44 C15 40 8 34 8 24 V10 Z"
        fill="#dcfce7" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 24l5 5 11-11" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── FAQ Data ──────────────────────────────────────────────────────────────────
const categories = [
  {
    id: "account",
    label: "Account",
    faqs: [
      { q: "How do I create an InvestBay account?", a: "Visit the Login page, enter your Name, Email, and Mobile Number, verify via OTP, set your password, and you're in!" },
      { q: "How can I delete my InvestBay account?", a: "Mail us at support@investbay.in or WhatsApp us and we'll delete your account from our database." },
      { q: "What to do if I'm not receiving OTP?", a: "We send OTPs to your registered mobile and email. Check your spam folder and ensure you have a stable network connection." },
      { q: "Can I use InvestBay on mobile?", a: "Yes! InvestBay is fully responsive and works on any device — mobile, tablet, or desktop." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. Enter your registered email or mobile to receive a reset link." },
    ],
  },
  {
    id: "subscription",
    label: "Subscription",
    faqs: [
      { q: "What plans does InvestBay offer?", a: "InvestBay offers free and premium subscription plans. Premium gives access to live signals, mentor calls, advanced courses, and loss protection." },
      { q: "Is there any age limit for InvestBay?", a: "No, there is absolutely no age restriction. Anyone interested in investing can join InvestBay." },
      { q: "Can I switch plans anytime?", a: "Yes. You can upgrade or downgrade your plan at any time from your account dashboard." },
      { q: "Do you offer refunds?", a: "Yes, we offer a 14-day hassle-free refund policy. Write to support@investbay.in within 14 days of activation." },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    faqs: [
      { q: "What payment modes are accepted?", a: "We accept UPI, NEFT, RTGS, IMPS, and all major debit/credit cards. No cash payments are accepted." },
      { q: "How will I be charged for my subscription?", a: "Subscription charges are auto-debited at the start of each billing cycle. Check your billing details in the dashboard." },
      { q: "I'm unable to make a payment. What should I do?", a: "Try a different payment method or wait a few minutes. If the issue persists, contact support@investbay.in." },
      { q: "How do I change my payment method?", a: "Cancel your existing subscription and resubscribe using the new payment method." },
    ],
  },
  {
    id: "signals",
    label: "Signals",
    faqs: [
      { q: "What are Trading Signals?", a: "Trading Signals are real-time buy/hold/sell recommendations by SEBI-registered research analysts, verified and backtested on InvestBay." },
      { q: "How frequently are signals updated?", a: "Signals are updated in real-time as analysts post them. You'll receive instant notifications on each new signal." },
      { q: "Are signals guaranteed to be profitable?", a: "No. Signals are research-based insights, not guaranteed returns. Always consult your financial advisor before investing." },
      { q: "How do I follow a specific analyst?", a: "Visit the Mentors page, browse analysts, and click 'Follow' on any mentor's profile to receive their signals." },
    ],
  },
  {
    id: "mentors",
    label: "Mentors",
    faqs: [
      { q: "Who are InvestBay Mentors?", a: "InvestBay Mentors are SEBI-registered research analysts with verified track records, listed on our platform for investors to follow." },
      { q: "How do I connect with a mentor?", a: "Browse the Mentors section, check their accuracy, track record, and follower count, then subscribe to their plan." },
      { q: "Can I get 1-on-1 coaching?", a: "Yes. Premium mentor subscriptions include 1-on-1 portfolio reviews and doubt-clearing sessions." },
      { q: "How are mentor returns calculated?", a: "Returns are calculated based on the difference between the signal entry price and exit price across all their published calls." },
    ],
  },
  {
    id: "courses",
    label: "Courses",
    faqs: [
      { q: "What courses are available on InvestBay?", a: "InvestBay offers courses from Stock Market Basics to Advanced F&O Strategies — beginner to expert, all in one place." },
      { q: "Are there any free courses?", a: "Yes! InvestBay offers free introductory modules on Stock Market Basics and Fundamental Analysis." },
      { q: "Will I get a certificate?", a: "Yes. On completing a course, you'll receive a verified certificate of completion." },
      { q: "Are courses in English or Hindi?", a: "Both! InvestBay courses are available in English and Hindi for your convenience." },
    ],
  },
  {
    id: "lossprotection",
    label: "Loss Protection",
    faqs: [
      { q: "What is Loss Protection?", a: "Loss Protection is an automated safety mechanism. When your daily losses hit your preset limit, all new trade orders are blocked for the day — resets at midnight." },
      { q: "Is my broker password safe?", a: "Yes. Credentials are encrypted with AES-256. No InvestBay employee can access them, and no trades are ever placed on your behalf." },
      { q: "Which brokers are supported?", a: "Currently Zerodha, Upstox, Angel One, and Fyers are supported. More brokers coming soon." },
      { q: "Does it affect my existing positions?", a: "No. Loss Protection only blocks new entries. Existing open positions remain active and can be squared off anytime." },
    ],
  },
];

// ── Accordion item ────────────────────────────────────────────────────────────
function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-4 text-left gap-4 group"
      >
        <span className="text-[14px] font-semibold text-gray-900 leading-snug group-hover:text-green-600 transition-colors"
          style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
          {q}
        </span>
        <ChevronDown
          className="flex-shrink-0 text-gray-400 mt-0.5 transition-transform duration-300"
          style={{ width: 16, height: 16, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-4" : "max-h-0"}`}>
        <p className="text-[13.5px] text-gray-500 leading-relaxed"
          style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
          {a}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Support() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("account");
  const [openFaq, setOpenFaq] = useState(null);
  const [expanded, setExpanded] = useState({});
  const sectionRefs = useRef({});

  const scrollTo = (id) => {
    setActiveCategory(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Filter FAQs by search
  const filtered = search.trim()
    ? categories.map(c => ({
        ...c,
        faqs: c.faqs.filter(f =>
          f.q.toLowerCase().includes(search.toLowerCase()) ||
          f.a.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter(c => c.faqs.length > 0)
    : categories;

  const SHOW_LIMIT = 4;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Hind Siliguri',sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <h1 style={{
            fontFamily: "'Aileron','Arial Black',sans-serif",
            fontSize: "clamp(28px,5vw,44px)", fontWeight: 900,
            color: "#111827", letterSpacing: "-0.025em", lineHeight: 1.15,
          }} className="mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 mb-8" style={{ fontSize: 16 }}>
            We might have your fixes already. Just type &amp; hit search!
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenFaq(null); }}
              placeholder="Search your question…"
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-200 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>

        {/* ── Category icon pills ── */}
        {!search && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollTo(cat.id)}
                className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 min-w-[88px] ${
                  activeCategory === cat.id
                    ? "bg-white border-green-300 shadow-[0_4px_16px_rgba(22,163,74,0.12)]"
                    : "bg-white border-gray-100 hover:border-green-200 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
                }`}
              >
                {icons[cat.id]}
                <span className="text-[11px] font-semibold text-gray-600" style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}>
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── FAQ Sections ── */}
        <div className="space-y-10">
          {filtered.map(cat => {
            const isExpanded = expanded[cat.id];
            const visibleFaqs = isExpanded ? cat.faqs : cat.faqs.slice(0, SHOW_LIMIT);

            return (
              <div
                key={cat.id}
                ref={el => sectionRefs.current[cat.id] = el}
                className="scroll-mt-24"
              >
                <h2 style={{
                  fontFamily: "'Aileron','Arial Black',sans-serif",
                  fontWeight: 900, fontSize: "clamp(18px,2.5vw,24px)",
                  color: "#111827", letterSpacing: "-0.015em",
                }} className="mb-4">
                  {cat.label}
                </h2>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-6 divide-y divide-gray-100">
                  {visibleFaqs.map((faq, i) => {
                    const key = `${cat.id}-${i}`;
                    return (
                      <FaqItem
                        key={key}
                        q={faq.q}
                        a={faq.a}
                        isOpen={openFaq === key}
                        onToggle={() => setOpenFaq(openFaq === key ? null : key)}
                      />
                    );
                  })}
                </div>

                {/* View More */}
                {cat.faqs.length > SHOW_LIMIT && (
                  <button
                    onClick={() => setExpanded(e => ({ ...e, [cat.id]: !isExpanded }))}
                    className="mt-3 flex items-center gap-1.5 text-[13px] font-bold text-green-600 hover:text-green-700 transition-colors"
                    style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
                  >
                    {isExpanded ? "Show Less" : `View More (${cat.faqs.length - SHOW_LIMIT} more)`}
                    <ChevronDown className="w-4 h-4 transition-transform duration-200"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                )}
              </div>
            );
          })}

          {/* No results */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-[15px]">No results found for "<strong className="text-gray-600">{search}</strong>"</p>
              <button onClick={() => setSearch("")} className="mt-4 text-green-600 text-[13px] font-semibold hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-8 py-10 text-center">
          <h3 style={{
            fontFamily: "'Aileron','Arial Black',sans-serif",
            fontWeight: 900, fontSize: "clamp(18px,2.5vw,26px)",
            color: "#111827", letterSpacing: "-0.02em",
          }} className="mb-2">
            Got to this point because you didn't find your fix?
          </h3>
          <p className="text-gray-500 mb-6 text-[15px]">
            No worries! Contact us and we'll resolve it right away!
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="group inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3 rounded-xl text-[14px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.3)]"
            style={{ fontFamily: "'Aileron','Arial Black',sans-serif" }}
          >
            Contact Us
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

      </div>
    </div>
  );
}