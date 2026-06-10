import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiShield, FiUser, FiMapPin, FiCreditCard, FiFileText,
    FiCheckCircle, FiArrowRight, FiLock, FiClock, FiAlertCircle,
} from "react-icons/fi";
import { Check } from "lucide-react";
import lottie from "lottie-web";
import Security from "../assets/animations/security.json";

const AB = { fontFamily: "'Aileron Black', 'Arial Black', sans-serif" };
const HS = { fontFamily: "'Hind Siliguri', 'Hind', sans-serif" };
const AL = { fontFamily: "'Aileron', 'Arial', sans-serif" };

function useInView(threshold = 0.1) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

// ── Lottie via lottie-web (for local JSON imports) ─────────────────────────
function LottieLocal({ animationData, className, style }) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current || !animationData) return;
        const anim = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
        });
        return () => anim.destroy();
    }, [animationData]);
    return <div ref={containerRef} className={className} style={style} />;
}

// ── Lottie via web component (for CDN URL strings) ─────────────────────────
function LottiePlayer({ src, className, style }) {
    useEffect(() => {
        if (!customElements.get("lottie-player")) {
            const s = document.createElement("script");
            s.src = "https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js";
            s.async = true;
            document.head.appendChild(s);
        }
    }, []);
    return (
        // @ts-ignore
        <lottie-player
            src={src}
            background="transparent"
            speed="1"
            loop
            autoplay
            class={className}
            style={style}
        />
    );
}

const steps = [
    { num: "01", icon: FiUser, title: "Personal Details", desc: "Your full name, date of birth, PAN, Aadhar, and contact information.", time: "~2 min" },
    { num: "02", icon: FiMapPin, title: "Address Details", desc: "Permanent and correspondence address with city, state, and PIN code.", time: "~1 min" },
    { num: "03", icon: FiCreditCard, title: "Bank Details", desc: "Bank account number, IFSC code, account type, and nominee information.", time: "~2 min" },
    { num: "04", icon: FiFileText, title: "Document Upload", desc: "PAN card, Aadhar card, passport photo, and a live selfie for verification.", time: "~3 min" },
    { num: "05", icon: FiCheckCircle, title: "Review & Submit", desc: "Verify all your information and submit your KYC application.", time: "~1 min" },
];

const trustPoints = [
    { icon: FiLock, title: "AES-256 Encryption", desc: "All your data is encrypted end-to-end using bank-grade security standards." },
    { icon: FiShield, title: "SEBI Compliant", desc: "KYC process follows all SEBI and PMLA guidelines for Indian investors." },
    { icon: FiClock, title: "24–48 Hour Approval", desc: "Once submitted, your KYC is reviewed and approved within 24–48 hours." },
    { icon: FiAlertCircle, title: "No Third-Party Sharing", desc: "Your documents are used solely for KYC verification — never shared or sold." },
];

const faqs = [
    { q: "What is KYC and why is it required?", a: "KYC (Know Your Customer) is a mandatory verification process as per SEBI regulations. It ensures only genuine investors access trading platforms and prevents fraud." },
    { q: "Which documents do I need?", a: "You need your PAN card, Aadhar card, a passport-sized photograph, a live selfie, and your bank account details." },
    { q: "How long does the verification take?", a: "KYC verification typically takes 24–48 business hours after submission. You will be notified via email and SMS." },
    { q: "Is my data stored securely?", a: "Yes. All data is encrypted with AES-256 and stored on secure servers. We are fully SEBI and PMLA compliant." },
    { q: "Can I save my progress and continue later?", a: "Currently the form needs to be completed in one session. It takes only about 10 minutes to complete all 5 steps." },
    { q: "What happens after KYC is approved?", a: "Once approved, you get full access to all InvestBay features — signals, analyst subscriptions, courses, and more." },
];

export default function UserKYCLanding() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);
    const [heroRef, heroVisible] = useInView(0.1);
    const [stepsRef, stepsVisible] = useInView(0.1);
    const [whyRef, whyVisible] = useInView(0.1);
    const [faqRef, faqVisible] = useInView(0.1);

    return (
        <div className="bg-white min-h-screen">

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="w-full bg-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* Left text */}
                        <div
                            ref={heroRef}
                            className={`flex-1 text-center lg:text-left transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4" style={AL}>
                                Investor Verification
                            </p>
                            <h1 className="text-[clamp(32px,4.5vw,54px)] font-black text-black leading-[1.1] tracking-tight mb-5" style={AB}>
                                Complete Your KYC
                                <br />
                                <span className="text-green-600">in Under 10 Minutes</span>
                            </h1>
                            <p className="text-[15px] text-gray-500 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8" style={HS}>
                                SEBI requires all investors to complete a one-time KYC before accessing trading signals, mentor subscriptions, and courses. Your data is encrypted and secure.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                                {["SEBI Compliant", "AES-256 Secure", "24h Approval", "Free Process"].map((b, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[12px] font-semibold text-gray-600" style={AL}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                        {b}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                <button
                                    onClick={() => navigate("/kyc-setup")}
                                    className="group inline-flex items-center gap-2 px-7 py-3.5 bg-black hover:bg-gray-800 text-white text-sm font-black rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                                    style={AB}
                                >
                                    Start KYC Now
                                    <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                                <button
                                    onClick={() => document.getElementById("kyc-steps")?.scrollIntoView({ behavior: "smooth" })}
                                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:border-gray-900 hover:text-black transition-all duration-200 cursor-pointer"
                                    style={AL}
                                >
                                    How It Works
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-3 text-center lg:text-left" style={HS}>
                                Takes ~10 minutes · 100% free · SEBI compliant
                            </p>
                        </div>

                        {/* Right Lottie — CDN URL */}
                        <div className="flex-1 w-full max-w-[460px] mx-auto lg:mx-0">
                            <LottiePlayer
                                src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
                                className="w-full"
                                style={{ height: "380px" }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DARK STAT STRIP ──────────────────────────────────────────── */}
            <div className="w-full bg-black py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {[
                        { val: "5 Steps", label: "Simple process" },
                        { val: "~10 min", label: "Average completion time" },
                        { val: "24–48h", label: "Approval turnaround" },
                        { val: "100%", label: "SEBI compliant" },
                    ].map((s, i) => (
                        <div key={i} className="text-center sm:text-left">
                            <div className="text-xl font-black text-white mb-0.5" style={AB}>{s.val}</div>
                            <div className="text-[12px] text-gray-500" style={HS}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STEPS ────────────────────────────────────────────────────── */}
            <section id="kyc-steps" className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
                        <div
                            ref={stepsRef}
                            className={`max-w-xl transition-all duration-500 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>The Process</p>
                            <h2 className="text-[clamp(26px,3.5vw,42px)] font-black text-black leading-[1.1] tracking-tight mb-4" style={AB}>
                                5 Simple Steps
                                <br />to Get Verified
                            </h2>
                            <p className="text-[15px] text-gray-500 leading-relaxed" style={HS}>
                                Our streamlined KYC process is designed to be quick, secure, and hassle-free for every investor.
                            </p>
                        </div>

                        {/* Lottie — CDN URL */}
                        <div className="w-full max-w-[360px] mx-auto lg:mx-0 flex-shrink-0">
                            <LottiePlayer
                                src="https://assets9.lottiefiles.com/packages/lf20_qp1q7mct.json"
                                className="w-full"
                                style={{ height: "180px" }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {steps.map((step, idx) => {
                            const [ref, visible] = useInView(0.1);
                            return (
                                <div
                                    key={step.num} ref={ref}
                                    className={`bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                                    style={{ transitionDelay: visible ? `${idx * 60}ms` : "0s" }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-5xl font-black text-gray-100 leading-none" style={AB}>{step.num}</span>
                                        <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full" style={AL}>{step.time}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                                        <step.icon className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <h3 className="text-[14px] font-black text-black mb-2" style={AB}>{step.title}</h3>
                                    <p className="text-[13px] text-gray-400 leading-relaxed" style={HS}>{step.desc}</p>
                                </div>
                            );
                        })}

                        {/* CTA card */}
                        <div
                            className="bg-black rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                            onClick={() => navigate("/kyc-setup")}
                        >
                            <div>
                                <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-500 mb-3" style={AL}>Ready?</p>
                                <h3 className="text-xl font-black text-white leading-tight mb-3" style={AB}>Start Your<br />KYC Now</h3>
                                <p className="text-[13px] text-gray-400 leading-relaxed" style={HS}>Takes ~10 minutes. Free. SEBI compliant.</p>
                            </div>
                            <button className="mt-6 w-full py-2.5 bg-white text-black text-sm font-black rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer" style={AB}>
                                Begin KYC <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY TRUST US ─────────────────────────────────────────────── */}
            <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* Left — local JSON via lottie-web ✅ */}
                        <div className="flex-1 w-full max-w-[400px] mx-auto lg:mx-0 order-2 lg:order-1">
                            <LottieLocal
                                animationData={Security}
                                className="w-full"
                                style={{ height: "340px" }}
                            />
                        </div>

                        {/* Right text */}
                        <div
                            ref={whyRef}
                            className={`flex-1 order-1 lg:order-2 transition-all duration-500 ${whyVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                        >
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>Your Security</p>
                            <h2 className="text-[clamp(26px,3.5vw,42px)] font-black text-black leading-[1.1] tracking-tight mb-4" style={AB}>
                                Why Your Data
                                <br />is 100% Safe
                            </h2>
                            <p className="text-[15px] text-gray-500 leading-relaxed mb-8" style={HS}>
                                We take your privacy seriously. Every piece of information you provide is protected by the highest security standards in the industry.
                            </p>
                            <div className="space-y-3">
                                {trustPoints.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors duration-200">
                                        <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-black text-black mb-0.5" style={AB}>{item.title}</h4>
                                            <p className="text-[12px] text-gray-400 leading-relaxed" style={HS}>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div
                        ref={faqRef}
                        className={`text-center mb-12 transition-all duration-500 ${faqVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-3" style={AL}>FAQ</p>
                        <h2 className="text-[clamp(26px,3.5vw,42px)] font-black text-black leading-[1.1] tracking-tight mb-3" style={AB}>Common Questions</h2>
                        <p className="text-[15px] text-gray-500" style={HS}>Everything you need to know before starting your KYC.</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-gray-50 last:border-0">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[14px] font-black text-gray-900 pr-6" style={AB}>{faq.q}</span>
                                    <span
                                        className="text-gray-400 text-xl flex-shrink-0 transition-transform duration-200"
                                        style={{ display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                                    >+</span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-[14px] text-gray-500 leading-relaxed" style={HS}>{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl mx-auto text-center">
                    <div className="w-24 h-24 mx-auto mb-6">
                        <LottiePlayer
                            src="https://assets2.lottiefiles.com/packages/lf20_jbrw3hcz.json"
                            className="w-full h-full"
                            style={{}}
                        />
                    </div>
                    <h2 className="text-[clamp(24px,3.5vw,38px)] font-black text-black mb-4 leading-tight tracking-tight" style={AB}>
                        Ready to Get Verified?
                    </h2>
                    <p className="text-[15px] text-gray-500 mb-8 leading-relaxed" style={HS}>
                        Complete your KYC in ~10 minutes and unlock full access to InvestBay — signals, mentors, courses, and more.
                    </p>
                    <div className="flex flex-col items-start gap-2.5 max-w-xs mx-auto mb-8 text-left">
                        {[
                            "Access all trading signals",
                            "Subscribe to SEBI-registered mentors",
                            "Enroll in courses",
                            "Use Loss Protection & Capital Lock",
                        ].map((f, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-[13px] text-gray-600" style={HS}>
                                <div className="w-5 h-5 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-600" strokeWidth={2.5} />
                                </div>
                                {f}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("/kyc-setup")}
                        className="group inline-flex items-center gap-2 px-8 py-4 bg-black hover:bg-gray-800 text-white text-sm font-black rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                        style={AB}
                    >
                        Start KYC Now
                        <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                    <p className="text-xs text-gray-400 mt-4" style={HS}>Takes ~10 minutes · Free · SEBI compliant</p>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-6">
                        {[
                            { label: "SEBI Registered", sub: "Reg No. INA000012218" },
                            { label: "Research Analyst", sub: "Reg No. INH000024277" },
                        ].map((a, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                                </div>
                                <div className="text-left">
                                    <div className="font-black text-sm text-gray-700" style={AB}>{a.label}</div>
                                    <div className="text-[10px] text-gray-400" style={AL}>{a.sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}