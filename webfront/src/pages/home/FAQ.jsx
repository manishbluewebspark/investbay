import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    q: "What is InvestBay?",
    a: "InvestBay is a technology-driven platform that connects investors with SEBI-registered research analysts. We provide real-time trading signals, expert mentorship, and educational courses to help you make informed investment decisions.",
  },
  {
    q: "Are the analysts on InvestBay SEBI registered?",
    a: "Yes. Every research analyst listed on InvestBay is SEBI-registered and verified. We perform thorough background checks and validate SEBI registration numbers before onboarding any analyst.",
  },
  {
    q: "How do I access free trading signals?",
    a: "You get 5 free signal views after creating an account. Simply sign up, navigate to the Signals section, and start exploring live calls from verified analysts. For unlimited access, upgrade to a premium plan.",
  },
  {
    q: "What is the Loss Protection feature?",
    a: "Loss Protection lets you set a daily loss limit. Once your losses reach that threshold, trading alerts are triggered and your account is flagged — helping you avoid emotionally-driven over-trading.",
  },
  {
    q: "How do I subscribe to a mentor?",
    a: "Visit the Mentors section, browse analyst profiles, and review their track records, accuracy rates, and strategies. Once you find the right fit, click Subscribe to access their premium signals and content.",
  },
  {
    q: "What courses are available on InvestBay?",
    a: "We offer courses covering equity trading, F&O strategies, mutual fund investing, commodity markets, and technical analysis — for beginners to advanced traders.",
  },
  {
    q: "Is my investment data safe on InvestBay?",
    a: "Absolutely. We use industry-standard AES-256 encryption for all sensitive data. We never sell your personal information to third parties.",
  },
  {
    q: "How do I contact InvestBay support?",
    a: "You can reach our support team via the Contact Us page, or email us at support@investbay.in. Our team is available Monday–Saturday, 9 AM – 6 PM IST.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  const toggle = (idx) => setOpenIndex(openIndex === idx ? null : idx);

  return (
    <section className="relative min-h-screen bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-[clamp(32px,5vw,56px)] font-black leading-[1.1] tracking-tight text-black mb-4"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            Any Questions?
          </h1>
          <p
            className="text-[15px] text-gray-500 leading-relaxed"
            style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
          >
            Find answers to common questions that you may have in your mind.
          </p>
        </div>

        {/* FAQ List */}
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, idx) => (
            <div key={idx}>
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between py-5 text-left gap-6 group"
              >
                <span
                  className="text-[15px] font-bold text-black group-hover:text-gray-600 transition-colors duration-200 leading-snug"
                  style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                >
                  {idx + 1}. {faq.q}
                </span>
                <div
                  className={`relative flex-shrink-0 w-7 h-7 rounded-full border transition-all duration-300 flex items-center justify-center
                    ${openIndex === idx 
                      ? "bg-black border-black" 
                      : "border-gray-200 group-hover:border-gray-400"
                    }`}
                >
                  {/* Plus to X animation */}
                  <div className="relative w-3.5 h-3.5">
                    {/* Horizontal line */}
                    <div
                      className={`absolute inset-0 m-auto w-full h-[1.8px] bg-current transition-all duration-300
                        ${openIndex === idx ? "rotate-0 bg-white" : "bg-gray-500 group-hover:bg-black"}
                      `}
                    />
                    {/* Vertical line */}
                    <div
                      className={`absolute inset-0 m-auto w-[1.8px] h-full bg-current transition-all duration-300
                        ${openIndex === idx ? "rotate-0 bg-white" : "bg-gray-500 group-hover:bg-black"}
                      `}
                    />
                  </div>
                </div>
              </button>

              {/* Answer — animated expand */}
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: openIndex === idx ? "300px" : "0px", opacity: openIndex === idx ? 1 : 0 }}
              >
                <p
                  className="pb-5 text-[14px] text-gray-500 leading-relaxed pl-0 pr-10"
                  style={{ fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => navigate("/contact-us")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-[15px] transition-all duration-200 hover:-translate-y-0.5"
            style={{ fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
          >
            Got more questions?
          </button>
        </div>

      </div>
    </section>
  );
}