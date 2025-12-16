import React from "react";
import { subscriptionsData } from "../../data/subscriptionsData";
import bgImage from "../../assets/profile-bg.jpg";
import Verify from "../../assets/Verify.svg";
import { useNavigate } from "react-router-dom";

export default function FeaturedSubscriptions() {
    const navigate = useNavigate();
    return (
        <section className="py-14 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 text-center md:text-left">
                    <div>
                        <h2 className="text-4xl ">
                            Featured{" "}
                            <span
                            className="active-text"
                                // className="text-transparent bg-clip-text font-semibold"
                                // style={{
                                //     background: "linear-gradient(90deg, #00BFA6 50%, #BEFFF6 100%)",
                                //     WebkitBackgroundClip: "text",
                                // }}
                            >
                                Subscriptions
                            </span>
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm">
                            Get exclusive market insights and expert recommendations from SEBI-registered advisors.
                        </p>
                    </div>
                    <button onClick={() => navigate('/subscriptions')} className="mt-4 md:mt-0 bg-black text-white px-5 py-2 rounded-full text-sm">
                        View All Subscriptions
                    </button>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subscriptionsData.slice(0, 3).map((sub, index) => (
                        <div
                            key={sub.id}
                            className="rounded-2xl shadow-sm border p-1 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
                            style={{
                                background: "linear-gradient(144.29deg, #E3F4CB 35%, #FFFFFF 70%)",
                            }}
                        >

                            {/* Background Image Section */}
                            <div
                                className="relative h-28 bg-cover bg-center rounded-2xl"
                                style={{ backgroundImage: `url(${bgImage})` }}
                            >
                                <div className="absolute left-5 -bottom-8">
                                    <img
                                        src={sub.img}
                                        alt={sub.name}
                                        className="w-16 h-16 rounded-full border-4 border-white shadow-md"
                                    />
                                </div>
                                <p className="absolute top-20 right-4 text-white text-sm font-medium bg-black/40 px-2 py-1 rounded-md">
                                    {sub.segment}
                                </p>
                            </div>

                            {/* Card Content */}
                            <div className="pt-12 pb-6 px-5 text-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">{sub.name}</h3>
                                        <p className="text-sm text-gray-500">{sub.role}</p>
                                    </div>
                                    <img
                                        src={Verify}
                                        alt="verified"
                                        className="w-5 h-5"
                                    />
                                </div>

                                <div className="mt-4 text-sm space-y-4 grid grid-cols-2">
                                    <p>
                                        <h1><span className="font-medium text-gray-600">Calls: </span></h1>
                                        <p className="font-semibold">{sub.calls}</p>
                                    </p>
                                    <p>
                                        <h1><span className="font-medium text-gray-600">Ideal Capital: </span></h1>
                                        <p className="font-semibold">{sub.capital}</p>
                                    </p>
                                    <p>
                                        <h1><span className="font-medium text-gray-600">Stoploss: </span></h1>
                                        <p className="font-semibold">{sub.stoploss}</p>
                                    </p>
                                    <p>
                                        <h1><span className="font-medium text-gray-600">Segment: </span></h1>
                                        <p className="font-semibold">{sub.segment}</p>
                                    </p>
                                </div>

                                <div className="mt-5 flex items-center gap-3 ">
                                    <div className="text-sm">
                                        <span className="text-[#00BFA6] font-semibold text-base">
                                            Starting {sub.price}
                                        </span>{" "}
                                        <span className="line-through text-gray-400">{sub.oldPrice}</span>
                                    </div>
                                    <button className="bg-black text-white text-sm px-15 py-2 rounded-lg hover:bg-gray-800">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
