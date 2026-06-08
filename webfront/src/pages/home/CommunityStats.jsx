import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// These are confirmed-stable public LottieFiles CDN JSON URLs
const statData = [
    {
        id: 1,
        value: "50 Lakh+",
        label: "Youtube Subscribers",
        delay: 100,
        lottie: "https://lottie.host/c1560216-e6cd-4199-b66c-23e32487b0d3/MKeEeV3tjy.lottie", // YouTube play icon
    },
    {
        id: 2,
        value: "15 Lakh+",
        label: "Monthly Visitors",
        delay: 200,
        lottie: "https://assets7.lottiefiles.com/packages/lf20_kuhijlvx.json", // Globe/web
    },
    {
        id: 3,
        value: "20 Lakh+",
        label: "Platform Users",
        delay: 300,
        lottie: "https://assets7.lottiefiles.com/packages/lf20_xyadoh9h.json", // People/users
    },
    {
        id: 4,
        value: "20k+",
        label: "Users Subscribed",
        delay: 400,
        lottie: "https://lottie.host/742626d3-cef4-4ef1-bf65-b8367a4158b7/rzN4l8k4TF.lottie", // Subscribe/bell
    },
    {
        id: 5,
        value: "9 Lakh+",
        label: "Social Media Followers",
        delay: 500,
        lottie: "https://lottie.host/7db47137-31fe-43c1-97ff-09553be91efe/RNsoNgKvvU.lottie", // Social share
    },
];

/**
 * HOW TO UPDATE LOTTIE URLs:
 * 1. Go to lottiefiles.com and find an animation you like
 * 2. Open it → click "..." → Copy JSON URL  (looks like assets7.lottiefiles.com/packages/lf20_xxxxx.json)
 *    OR save to your workspace → Handoff & Embed → Enable Asset CDN → copy the lottie.host URL
 * 3. Replace the `lottie` field above with your URL
 */

function StatCard({ stat, visible }) {
    const [hovered, setHovered] = useState(false);
    const [dotLottie, setDotLottie] = useState(null);

    const dotLottieRefCallback = (instance) => {
        setDotLottie(instance);
    };

    useEffect(() => {
        if (!dotLottie) return;
        if (hovered) {
            dotLottie.play();
        } else {
            dotLottie.stop();
        }
    }, [hovered, dotLottie]);

    return (
        <div
            className={`flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border transition-all duration-500 cursor-default ${hovered
                ? "border-green-200 bg-green-50 -translate-y-1 shadow-[0_4px_20px_rgba(22,163,74,0.1)]"
                : "border-gray-100 bg-white"
                } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: `${stat.delay}ms` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Lottie Icon */}
            <div className="w-16 h-16 flex items-center justify-center mb-3">
                <DotLottieReact
                    src={stat.lottie}
                    dotLottieRefCallback={dotLottieRefCallback}
                    style={{ width: 56, height: 56 }}
                    loop
                />
            </div>

            {/* Value */}
            <div
                className="text-gray-900 mb-1 leading-none"
                style={{
                    fontFamily: "'Aileron', 'Arial Black', sans-serif",
                    fontSize: 22,
                    fontWeight: 800,
                }}
            >
                {stat.value}
            </div>

            {/* Label */}
            <div
                className="text-gray-400 leading-tight"
                style={{
                    fontFamily: "'Hind Siliguri', sans-serif",
                    fontSize: 13,
                    fontWeight: 400,
                }}
            >
                {stat.label}
            </div>

            {/* Hover accent line */}
            <div
                className={`h-0.5 bg-green-400 mt-3 rounded-full transition-all duration-300 ${hovered ? "w-10" : "w-0"
                    }`}
            />
        </div>
    );
}

export default function CommunityStats() {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Inject Google Fonts for Hind Siliguri
        if (!document.getElementById("hind-siliguri-font")) {
            const link = document.createElement("link");
            link.id = "hind-siliguri-font";
            link.href =
                "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    {/* Badge */}
                    {/* <div
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 mb-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span
                            className="text-[13px] font-semibold text-green-700 tracking-wide"
                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                        >
                            Our Community
                        </span>
                    </div> */}

                    {/* Heading — Aileron 40px */}
                    <h2
                        className={`text-gray-900 mb-3 leading-tight transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                        style={{
                            fontFamily: "'Aileron', 'Arial Black', sans-serif",
                            fontSize: "clamp(28px, 4vw, 40px)",
                            fontWeight: 900,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Building InvestBay{" "}
                        <span style={{ color: "#16a34a" }}>with You.</span>
                    </h2>

                    {/* Subtitle — Hind Siliguri Regular */}
                    <p
                        className={`text-gray-500 max-w-xl mx-auto transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                            }`}
                        style={{
                            fontFamily: "'Hind Siliguri', sans-serif",
                            fontSize: 18,
                            fontWeight: 400,
                            lineHeight: 1.6,
                        }}
                    >
                        Your support matters. Join our community of investors.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                    {statData.map((stat) => (
                        <StatCard key={stat.id} stat={stat} visible={visible} />
                    ))}
                </div>

                {/* Bottom CTA bar */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                            {["Growing 50K+ monthly", "Trusted by investors", "24/7 Community support"].map(
                                (text, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span
                                            className="text-xs text-gray-500"
                                            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                                        >
                                            {text}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                        <button
                            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(22,163,74,0.35)] active:translate-y-0 whitespace-nowrap"
                            style={{ fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600 }}
                        >
                            Join Community →
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}