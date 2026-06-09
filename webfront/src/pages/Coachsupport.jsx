import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FiHeadphones, FiPlus, FiSend, FiChevronLeft, FiClock,
  FiMessageSquare, FiAlertCircle, FiCheckCircle, FiX,
  FiTrendingUp, FiShield, FiBookOpen, FiStar,
  FiInfo, FiHelpCircle, FiPhone, FiMail, FiUser, FiAtSign,
  FiChevronDown, FiChevronUp, FiSearch, FiZap, FiArrowRight,
  FiAward, FiUsers, FiThumbsUp, FiActivity,
} from "react-icons/fi";
import lottie from "lottie-web";
import supportSvg from "../assets/animations/support.json";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const AB = { fontFamily: "'Aileron Black', 'Arial Black', sans-serif" };
const HS = { fontFamily: "'Hind Siliguri', 'Hind', sans-serif" };
const AL = { fontFamily: "'Aileron', 'Arial', sans-serif" };

const CATEGORIES = [
  { value: "general", label: "General Query", icon: FiHelpCircle, desc: "General platform questions", color: "bg-gray-50 border-gray-300 text-gray-800" },
  { value: "signal", label: "Signal Help", icon: FiTrendingUp, desc: "Questions about trading signals", color: "bg-gray-50 border-gray-300 text-gray-800" },
  { value: "plan", label: "Plan / Subscription", icon: FiStar, desc: "Subscription & plan queries", color: "bg-gray-50 border-gray-300 text-gray-800" },
  { value: "market", label: "Market Advisory", icon: FiBookOpen, desc: "Market analysis & advisory", color: "bg-gray-50 border-gray-300 text-gray-800" },
];

const PRIORITIES = [
  { value: "low", label: "Low", desc: "No urgency", dot: "bg-gray-400", ring: "border-gray-200 bg-white", active: "border-gray-900 bg-gray-50" },
  { value: "normal", label: "Normal", desc: "Within 24h", dot: "bg-blue-500", ring: "border-gray-200 bg-white", active: "border-gray-900 bg-gray-50" },
  { value: "high", label: "High", desc: "Urgent advice needed", dot: "bg-yellow-500", ring: "border-gray-200 bg-white", active: "border-gray-900 bg-gray-50" },
  { value: "urgent", label: "Critical", desc: "Active trade help", dot: "bg-red-500", ring: "border-gray-200 bg-white", active: "border-gray-900 bg-gray-50" },
];

const STATUS_CONFIG = {
  open: { label: "Open", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  in_progress: { label: "In Progress", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  resolved: { label: "Resolved", bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  closed: { label: "Closed", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200", dot: "bg-gray-400" },
};

const fmtTime = (d) => new Date(d).toLocaleString("en-IN", {
  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
});

const FAQS = [
  { q: "How quickly will I get a response?", a: "Our coaches typically respond within 2–4 hours during market hours (9 AM – 5 PM IST). Priority & Critical queries are handled faster." },
  { q: "Can I ask about specific stocks or signals?", a: "Absolutely! Ask about any stock, signal, or market condition. Include as much context — entry, exit, qty — for the best guidance." },
  { q: "Is coach support free?", a: "Basic support is available to all users. Premium plan holders get priority queue access and faster response times." },
  { q: "How do I share portfolio details?", a: "Describe your holdings in the message body — stock name, qty, avg price — or mention your portfolio value for context." },
  { q: "Can I reopen a closed ticket?", a: "Closed tickets cannot be reopened. Simply create a new query and reference your previous ticket number for continuity." },
  { q: "What happens during market holidays?", a: "Support is available 24/7 via email and tickets. Live coach responses may be slower on holidays, but we'll get back to you within 12 hours." },
  { q: "Can I request a specific coach?", a: "Tickets are assigned to available coaches based on expertise. For premium subscribers, we try to match with your preferred coach." },
  { q: "How do I share screenshots?", a: "You can attach images in the chat by clicking the attachment icon. For now, describe your chart observations in detail." },
];

// ── TESTIMONIALS DATA ────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Mehta",
    role: "Active Trader, 3+ years",
    avatar: "RM",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-700",
    rating: 5,
    category: "Signal Help",
    quote: "The coach helped me understand a complex options signal within 30 minutes. Saved me from a potential ₹50,000 loss! Absolutely worth it.",
    question: "Can I get real-time help with options signals?",
    date: "2 weeks ago",
    resolved: true,
    responseTime: "24 minutes"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "First-time Investor",
    avatar: "PS",
    avatarBg: "bg-blue-100",
    avatarText: "text-blue-700",
    rating: 5,
    category: "Plan / Subscription",
    quote: "I was confused about which plan to choose. The support team explained everything patiently and helped me pick the right subscription for my budget.",
    question: "Which plan is best for a beginner with ₹10,000 capital?",
    date: "1 month ago",
    resolved: true,
    responseTime: "1.5 hours"
  },
  {
    id: 3,
    name: "Amit Kumar",
    role: "Swing Trader",
    avatar: "AK",
    avatarBg: "bg-purple-100",
    avatarText: "text-purple-700",
    rating: 5,
    category: "Market Advisory",
    quote: "The market analysis provided by my coach helped me identify a breakout stock. Made 22% returns in 3 weeks. Highly recommended!",
    question: "How do I identify breakout stocks early?",
    date: "3 weeks ago",
    resolved: true,
    responseTime: "45 minutes"
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Long-term Investor",
    avatar: "NG",
    avatarBg: "bg-amber-100",
    avatarText: "text-amber-700",
    rating: 4,
    category: "General Query",
    quote: "Quick response and very helpful guidance on portfolio rebalancing. The coach gave me actionable insights that improved my returns.",
    question: "How often should I rebalance my portfolio?",
    date: "1 week ago",
    resolved: true,
    responseTime: "2 hours"
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Full-time Trader",
    avatar: "VS",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
    rating: 5,
    category: "Signal Help",
    quote: "The signal clarification saved me from entering a fake breakout. Coach explained the divergence in detail. Lifetime value!",
    question: "Is this a genuine breakout or a fakeout?",
    date: "5 days ago",
    resolved: true,
    responseTime: "18 minutes"
  },
  {
    id: 6,
    name: "Anjali Nair",
    role: "Salaried Professional",
    avatar: "AN",
    avatarBg: "bg-teal-100",
    avatarText: "text-teal-700",
    rating: 5,
    category: "Plan / Subscription",
    quote: "I had billing issues and the team resolved it in under an hour. Great support experience!",
    question: "My payment failed but money is deducted?",
    date: "2 days ago",
    resolved: true,
    responseTime: "52 minutes"
  }
];

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function CoachSupport() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isRA = user?.role === "ra" || user?.isRA;

  const [view, setView] = useState("list");
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [fetching, setFetching] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const bottomRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialsRef = useRef(null);

  const [form, setForm] = useState({ subject: "", message: "", category: "general", priority: "normal" });
  const [contactForm, setContactForm] = useState({
    name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "",
  });

  const animationContainer = useRef(null);

  useEffect(() => {
    if (animationContainer.current) {
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: supportSvg,
      });
      return () => animation.destroy();
    }
  }, []);

  useEffect(() => { fetchTickets(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchTickets = async () => {
    setFetching(true);
    try {
      const url = isRA ? `${API}/coach-support/ra-tickets` : `${API}/coach-support`;
      const res = await axios.get(url, { headers: authHeader() });
      setTickets(res.data?.data || []);
    } catch { setTickets([]); }
    finally { setFetching(false); }
  };

  const openTicket = async (ticket) => {
    setActiveTicket(ticket); setView("chat");
    try {
      const res = await axios.get(`${API}/coach-support/${ticket.id}/messages`, { headers: authHeader() });
      setMessages(res.data?.data || []);
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unread_count: 0 } : t));
    } catch { setMessages([]); }
  };

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.message.trim()) { setError("Subject and message are required"); return; }
    setSending(true); setError("");
    try {
      await axios.post(`${API}/coach-support`, form, { headers: authHeader() });
      setSuccess("Query submitted! Our coach will respond shortly.");
      setForm({ subject: "", message: "", category: "general", priority: "normal" });
      setTimeout(async () => { setSuccess(""); setView("list"); await fetchTickets(); }, 1600);
    } catch (e) { setError(e.response?.data?.message || "Failed to create ticket"); }
    finally { setSending(false); }
  };

  const handleContactSubmit = async () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setError("Name, email and message are required"); return;
    }
    setSending(true); setError("");
    try {
      await axios.post(`${API}/coach-support/contact`, contactForm, { headers: authHeader() });
      setSuccess("Message sent! We'll get back to you within 24 hours.");
      setContactForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "" });
      setShowContact(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) { setError(e.response?.data?.message || "Failed to send message"); }
    finally { setSending(false); }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `${API}/coach-support/${activeTicket.id}/reply`,
        { message: reply.trim() },
        { headers: authHeader() }
      );
      setMessages(prev => [...prev, res.data.data]);
      setReply("");
      setTickets(prev => prev.map(t =>
        t.id === activeTicket.id ? { ...t, last_message: reply.trim(), updated_at: new Date().toISOString() } : t
      ));
    } catch { setError("Failed to send message"); }
    finally { setSending(false); }
  };

  const handleClose = async () => {
    if (!window.confirm("Close this ticket?")) return;
    try {
      await axios.post(`${API}/coach-support/${activeTicket.id}/close`, {}, { headers: authHeader() });
      setActiveTicket(prev => ({ ...prev, status: "closed" }));
      setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, status: "closed" } : t));
    } catch { setError("Failed to close ticket"); }
  };

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Alert bar ──────────────────────────────────────────────────────────
  const AlertBar = () => (
    <>
      {error && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <FiAlertCircle className="shrink-0 text-red-500" />
          <span style={HS}>{error}</span>
          <button className="ml-auto text-red-400 hover:text-red-600" onClick={() => setError("")}><FiX size={15} /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <FiCheckCircle className="shrink-0 text-green-500" />
          <span style={HS}>{success}</span>
        </div>
      )}
    </>
  );

  // ── Testimonials Component ─────────────────────────────────────────────
  const TestimonialsSection = () => (
    <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
      <div className="text-center mb-12">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 mb-4">
          <FiThumbsUp className="w-3.5 h-3.5 text-green-600" />
          <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider" style={AL}>Real Stories</span>
        </div> */}
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4" style={AL}>Real Stories</p>
        <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3" style={AB}>
          What our users say
          <span className="text-green-600">.</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto" style={HS}>
          Join 10,000+ traders who've transformed their experience with expert coaching
        </p>
      </div>

      {/* Featured Testimonial Card */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Quote Section */}
            <div className="lg:col-span-2 p-8 lg:p-10">
              <FiActivity className="w-10 h-10 text-green-200 mb-6" />
              <p className="text-xl lg:text-2xl font-medium text-gray-800 leading-relaxed mb-6" style={HS}>
                "{TESTIMONIALS[activeTestimonial].quote}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${TESTIMONIALS[activeTestimonial].avatarBg} flex items-center justify-center font-black text-lg ${TESTIMONIALS[activeTestimonial].avatarText}`}>
                    {TESTIMONIALS[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900" style={AB}>{TESTIMONIALS[activeTestimonial].name}</h4>
                    <p className="text-xs text-gray-500" style={HS}>{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </div>
                <StarRating rating={TESTIMONIALS[activeTestimonial].rating} />
              </div>
            </div>

            {/* Question/Answer Side */}
            <div className="bg-gray-50 p-8 lg:p-10 border-t lg:border-t-0 lg:border-l border-gray-100">
              <div className="mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600`} style={AL}>
                  {TESTIMONIALS[activeTestimonial].category}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-3" style={AB}>
                Question asked:
              </p>
              <p className="text-sm text-gray-600 mb-4 italic" style={HS}>
                "{TESTIMONIALS[activeTestimonial].question}"
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200">
                <span className="flex items-center gap-1">
                  <FiClock size={12} /> Resolved in {TESTIMONIALS[activeTestimonial].responseTime}
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <FiCheckCircle size={12} /> Resolved
                </span>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 py-4 bg-white border-t border-gray-100">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === idx ? 'w-8 bg-green-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Grid - Small Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.slice(0, 3).map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${testimonial.avatarBg} flex items-center justify-center font-black ${testimonial.avatarText}`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900" style={AB}>{testimonial.name}</h4>
                  <p className="text-xs text-gray-400" style={HS}>{testimonial.role}</p>
                </div>
              </div>
              <StarRating rating={testimonial.rating} />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3" style={HS}>
              "{testimonial.quote}"
            </p>
            <div className="pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <FiHelpCircle size={10} /> {testimonial.question}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );

  // ── Contact Modal ──────────────────────────────────────────────────────
  const ContactModal = () => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl border border-gray-100 relative">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900" style={AB}>Send us a Message</h2>
            <p className="text-xs text-gray-400 mt-0.5" style={HS}>We'll get back to you within 24 hours.</p>
          </div>
          <button onClick={() => setShowContact(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors flex-shrink-0">
            <FiX size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={AL}>Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input type="text" value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" style={HS} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={AL}>Email Address</label>
              <div className="relative">
                <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <input type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" style={HS} />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={AL}>Phone (Optional)</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input type="tel" value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200" style={HS} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5" style={AL}>Your Message</label>
            <textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help…" rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 resize-none" style={HS} />
          </div>
          <button onClick={handleContactSubmit} disabled={sending} className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2" style={AB}>
            {sending ? "Sending…" : <><FiSend size={13} /> Send Message</>}
          </button>
        </div>
      </div>
    </div>
  );

  // ── LIST VIEW ──────────────────────────────────────────────────────────
  if (view === "list") return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 mb-4" style={AL}>Expert Coaching</p>
              <h1 className="text-[clamp(32px,4.5vw,52px)] font-black text-black leading-[1.1] tracking-tight mb-5" style={AB}>
                How can we
                <br />
                help you today?
                {/* <span className="text-green-600">help you today?</span> */}
              </h1>
              <p className="text-[15px] text-gray-500 max-w-md mx-auto lg:mx-0 leading-relaxed mb-8" style={HS}>
                Our expert coaches are here to guide you through your trading journey. Get personalized advice, signal clarifications, and fast resolutions — all in one place.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {!isRA && (
                  <button onClick={() => setView("new")} className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-sm font-black rounded-xl transition-all duration-200 hover:-translate-y-0.5" style={AB}>
                    <FiPlus size={14} /> New Query
                  </button>
                )}
                <button onClick={() => setShowContact(true)} className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-900 hover:text-black transition-all duration-200 cursor-pointer" style={AL}>
                  <FiMail size={14} /> Quick Message
                </button>
                <a href="mailto:support@investbay.in" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:border-gray-900 hover:text-black transition-all duration-200 cursor-pointer" style={AL}>
                  <FiPhone size={14} /> Email Us
                </a>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div ref={animationContainer} className="w-full max-w-[500px] mx-auto" style={{ minHeight: "400px" }} />
            </div>
          </div>
        </div>
      </div>



      {/* ── TESTIMONIALS SECTION (ADDED) ── */}
      <TestimonialsSection />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AlertBar />
        {showContact && <ContactModal />}

        {/* ── TICKETS ── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] font-black text-gray-900 flex items-center gap-2" style={AB}>
              <div className="w-1 h-5 bg-black rounded-full" />
              {isRA ? "Support Requests" : "Your Queries"}
              {tickets.length > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-semibold ml-1" style={AL}>
                  {tickets.length}
                </span>
              )}
            </h2>
            {!isRA && (
              <button onClick={() => setView("new")} className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-black rounded-xl hover:bg-gray-800 transition-colors" style={AB}>
                <FiPlus size={12} /> New Query
              </button>
            )}
          </div>

          {fetching ? (
            <div className="flex justify-center py-16">
              <div className="relative w-9 h-9">
                <div className="w-9 h-9 rounded-full border-2 border-gray-100" />
                <div className="absolute top-0 left-0 w-9 h-9 rounded-full border-2 border-black border-t-transparent animate-spin" />
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <FiHeadphones className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-1" style={AB}>No queries yet</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mb-5" style={HS}>
                {isRA ? "No tickets assigned to you yet." : "Ask your coach anything — markets, signals, or your plan."}
              </p>
              {!isRA && (
                <button onClick={() => setView("new")} className="px-5 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-gray-800 transition-colors" style={AB}>
                  Start a conversation
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tickets.map(t => {
                const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;
                const cat = CATEGORIES.find(c => c.value === t.category);
                return (
                  <button key={t.id} onClick={() => openTicket(t)} className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors group flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-gray-200 transition-colors">
                      {cat ? <cat.icon className="w-4 h-4 text-gray-600" /> : <FiHelpCircle className="w-4 h-4 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`} style={AL}>
                          {sc.label}
                        </span>
                        {cat && <span className="text-[11px] text-gray-400 font-medium" style={AL}>{cat.label}</span>}
                        {Number(t.unread_count) > 0 && (
                          <span className="text-[10px] font-bold text-black bg-gray-100 px-2 py-0.5 rounded-full" style={AL}>
                            {t.unread_count} new
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-black text-gray-900 group-hover:text-green-700 transition-colors truncate" style={AB}>
                        {t.subject}
                      </p>
                      {t.last_message && <p className="text-xs text-gray-400 mt-1 truncate" style={HS}>{t.last_message}</p>}
                      {isRA && t.user_name && <p className="text-xs text-gray-400 mt-1" style={HS}>From: {t.user_name}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400 whitespace-nowrap" style={HS}>{fmtTime(t.updated_at)}</p>
                      <div className={`w-2 h-2 rounded-full ${sc.dot} mt-2 ml-auto`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── FAQ Section ── */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-[15px] font-black text-gray-900" style={AB}>Frequently Asked Questions</h2>
                <p className="text-[11px] text-gray-400 mt-0.5" style={HS}>Find quick answers to common queries</p>
              </div>
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 hidden sm:block" style={AL}>FAQ</span>
            </div>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <input type="text" placeholder="Search questions…" value={faqSearch} onChange={e => setFaqSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100" style={HS} />
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredFaqs.length === 0 ? (
              <div className="py-12 text-center">
                <FiHelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400" style={HS}>No matching questions found.</p>
                <button onClick={() => setFaqSearch("")} className="mt-3 text-xs text-black underline underline-offset-2" style={HS}>Clear search</button>
              </div>
            ) : filteredFaqs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors group">
                  <span className="text-sm font-black text-gray-800 pr-6 group-hover:text-green-700 transition-colors" style={AB}>{faq.q}</span>
                  <span className="text-gray-400 text-lg flex-shrink-0 transition-all duration-200 group-hover:text-gray-600" style={{ display: "inline-block", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4" style={HS}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                  <FiHeadphones className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900" style={AB}>Still have questions?</p>
                  <p className="text-xs text-gray-400 mt-0.5" style={HS}>Our team is here to help you 24/7.</p>
                </div>
              </div>
              <button onClick={() => setShowContact(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-black rounded-xl hover:bg-gray-800 transition-all duration-200 hover:gap-3 flex-shrink-0 cursor-pointer" style={AB}>
                Contact Support <FiArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ── ENHANCED STAT STRIP ── */}
      <div className="w-full bg-black py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { icon: FiZap, val: "2–4 hr", label: "Avg response time", trend: "+28% faster", trendUp: true, desc: "During market hours" },
              { icon: FiShield, val: "15+", label: "Expert coaches", trend: "SEBI registered", trendUp: false, desc: "Verified professionals" },
              { icon: FiMessageSquare, val: "98%", label: "Resolution rate", trend: "within 3 replies", trendUp: true, desc: "First contact resolution" },
              { icon: FiHeadphones, val: "24/7", label: "Support availability", trend: "365 days", trendUp: false, desc: "Always online" },
            ].map((s, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-green-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <s.icon className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-2xl font-black text-white mb-1" style={AB}>{s.val}</div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2" style={AL}>{s.label}</div>
                  <div className="flex items-center gap-1.5">
                    {s.trendUp ? <FiTrendingUp className="w-3 h-3 text-green-400" /> : <FiActivity className="w-3 h-3 text-gray-500" />}
                    <span className={`text-[11px] ${s.trendUp ? 'text-green-400' : 'text-gray-500'} font-medium`} style={HS}>{s.trend}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2" style={HS}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-white/10">
            {[
              { icon: FiUsers, val: "10,000+", label: "Active traders" },
              { icon: FiThumbsUp, val: "4.95", label: "Rating (2.3k reviews)" },
              { icon: FiAward, val: "Top 1%", label: "Support quality" },
              { icon: FiClock, val: "3 min", label: "Median first reply" },
              { icon: FiStar, val: "100%", label: "Money-back guarantee" },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                <s.icon className="w-4 h-4 text-green-400 mx-auto mb-2" />
                <div className="text-sm font-black text-white" style={AB}>{s.val}</div>
                <div className="text-[10px] text-gray-500 mt-0.5" style={HS}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );




  // ── NEW TICKET VIEW ────────────────────────────────────────────────────
  if (view === "new") return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors font-semibold" style={AL}>
          <FiChevronLeft size={16} /> Back to queries
        </button>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
            <FiMessageSquare className="text-gray-700" size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900" style={AB}>Create New Query</h1>
            <p className="text-sm text-gray-400" style={HS}>Describe your question in detail for the best guidance.</p>
          </div>
        </div>
        <AlertBar />
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-3" style={AL}>Category</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setForm(f => ({ ...f, category: c.value }))} className={`p-4 rounded-xl border text-left transition-all ${form.category === c.value ? "bg-gray-50 border-gray-900 border-2" : "bg-white border-gray-200 hover:border-gray-300"}`}>
                  <c.icon className="w-4 h-4 mb-2 text-gray-600" />
                  <p className="text-sm font-black text-gray-900" style={AB}>{c.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5" style={HS}>{c.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2" style={AL}>Subject</label>
            <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g., Help with NIFTY signal interpretation" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100" style={HS} />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-3" style={AL}>Priority Level</label>
            <div className="grid grid-cols-2 gap-3">
              {PRIORITIES.map(p => (
                <button key={p.value} onClick={() => setForm(f => ({ ...f, priority: p.value }))} className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${form.priority === p.value ? `${p.active} border-2` : `bg-white ${p.ring} border hover:border-gray-300`}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${p.dot} mt-1.5 shrink-0`} />
                  <div>
                    <p className="text-sm font-black text-gray-900" style={AB}>{p.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5" style={HS}>{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2" style={AL}>Message</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your query in detail — stock names, signal details, entry/exit prices, or any relevant context…" rows={6} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100 resize-none" style={HS} />
            <p className="text-xs text-gray-400 mt-1.5" style={HS}>Be specific for faster resolution.</p>
          </div>
          <button onClick={handleCreate} disabled={sending} className="w-full py-3.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2" style={AB}>
            {sending ? "Submitting…" : <><FiSend size={14} /> Submit Query</>}
          </button>
        </div>
      </div>
    </div>
  );

  // ── CHAT VIEW ──
  const sc = STATUS_CONFIG[activeTicket?.status] || STATUS_CONFIG.open;
  const isClosed = activeTicket?.status === "closed";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3.5 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => { setView("list"); setMessages([]); }} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <FiChevronLeft size={18} />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            {(() => { const cat = CATEGORIES.find(c => c.value === activeTicket?.category); return cat ? <cat.icon className="w-4 h-4 text-gray-600" /> : <FiHelpCircle className="w-4 h-4 text-gray-600" />; })()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate" style={AB}>{activeTicket?.subject}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`} style={AL}>{sc.label}</span>
              <span className="text-[11px] text-gray-400" style={AL}>{CATEGORIES.find(c => c.value === activeTicket?.category)?.label}</span>
            </div>
          </div>
          {!isClosed && !isRA && (
            <button onClick={handleClose} className="text-xs text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors font-semibold flex-shrink-0" style={AL}>Close</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400" style={HS}>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = (isRA && msg.sender_role === "ra") || (!isRA && msg.sender_role === "user");
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                  {!isMe && (
                    <span className="text-[11px] text-gray-400 ml-1 flex items-center gap-1.5" style={HS}>
                      <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <FiShield className="w-2.5 h-2.5 text-gray-600" />
                      </div>
                      {msg.sender_name || "Coach"}
                    </span>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-black text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"}`} style={HS}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-gray-400 mx-1" style={HS}>{fmtTime(msg.created_at)}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {!isClosed ? (
        <div className="bg-white border-t border-gray-100 px-4 py-4 sticky bottom-0 shadow-sm">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input type="text" value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleReply()} placeholder="Type your message…" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-100" style={HS} />
            <button onClick={handleReply} disabled={sending || !reply.trim()} className="w-11 h-11 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors shrink-0">
              <FiSend size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border-t border-gray-100 px-4 py-5 text-center">
          <p className="text-sm text-gray-500" style={HS}>This ticket is closed. <button onClick={() => setView("new")} className="text-black font-black hover:underline" style={AB}>Create a new query</button> if you need further assistance.</p>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}