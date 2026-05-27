import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  FiHeadphones, FiPlus, FiSend, FiChevronLeft, FiClock,
  FiMessageSquare, FiAlertCircle, FiCheckCircle, FiX,
  FiTrendingUp, FiShield, FiBookOpen, FiUsers, FiStar,
  FiInfo, FiHelpCircle, FiPhone, FiMail, FiUser, FiAtSign
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

const CATEGORIES = [
  { value: "general", label: "General Query", icon: FiHelpCircle, desc: "General questions about the platform" },
  { value: "signal", label: "Signal Help", icon: FiTrendingUp, desc: "Questions about trading signals" },
  { value: "plan", label: "Plan / Subscription", icon: FiStar, desc: "Subscription & plan related queries" },
  { value: "market", label: "Market Advisory", icon: FiBookOpen, desc: "Market analysis & advisory" },
];

const PRIORITIES = [
  { value: "low", label: "Low Priority", desc: "General question, no urgency", color: "text-slate-400" },
  { value: "normal", label: "Normal", desc: "Need guidance within 24h", color: "text-blue-400" },
  { value: "high", label: "High Priority", desc: "Urgent advice needed", color: "text-amber-400" },
  { value: "urgent", label: "Critical", desc: "Active trade help required", color: "text-red-400" },
];

const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
  in_progress: { label: "In Progress", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  resolved: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
  closed: { label: "Closed", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", dot: "bg-slate-400" },
};

const fmtTime = (d) => new Date(d).toLocaleString("en-IN", {
  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
});

const FAQS = [
  { q: "How quickly will I get a response?", a: "Our coaches typically respond within 2-4 hours during market hours. Priority queries get faster responses." },
  { q: "Can I ask about specific stocks?", a: "Yes! You can ask about any stock, signal, or market condition. Include as much detail as possible for better guidance." },
  { q: "Is this service free?", a: "Basic support is available to all users. Premium users get priority access and faster response times." },
  { q: "How do I share my portfolio?", a: "You can describe your holdings in the message or attach screenshots when creating a ticket." },
];

export default function CoachSupport() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
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
  const [showFAQs, setShowFAQs] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const bottomRef = useRef(null);

  const [form, setForm] = useState({ subject: "", message: "", category: "general", priority: "normal" });
  
  // Quick Contact Form State
  const [contactForm, setContactForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    message: "",
  });

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
    setActiveTicket(ticket);
    setView("chat");
    try {
      const res = await axios.get(`${API}/coach-support/${ticket.id}/messages`, { headers: authHeader() });
      setMessages(res.data?.data || []);
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, unread_count: 0 } : t));
    } catch { setMessages([]); }
  };

  const handleCreate = async () => {
    if (!form.subject.trim() || !form.message.trim()) {
      setError("Subject and message are required"); return;
    }
    setSending(true); setError("");
    try {
      await axios.post(`${API}/coach-support`, form, { headers: authHeader() });
      setSuccess("Ticket created! Our coach will respond shortly.");
      setForm({ subject: "", message: "", category: "general", priority: "normal" });
      setTimeout(async () => { setSuccess(""); setView("list"); await fetchTickets(); }, 1500);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to create ticket");
    } finally { setSending(false); }
  };

  // Handle Quick Contact Form Submission
  const handleContactSubmit = async () => {
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setError("Name, email and message are required");
      return;
    }
    setSending(true); setError("");
    try {
      await axios.post(`${API}/coach-support/contact`, contactForm, { headers: authHeader() });
      setSuccess("Message sent! We'll get back to you within 24 hours.");
      setContactForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "", message: "" });
      setShowContactForm(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e.response?.data?.message || "Failed to send message");
    } finally { setSending(false); }
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

  // ─── LIST VIEW ──────────────────────────────────────────────────────────
  if (view === "list") return (
    <section className="min-h-screen bg-[#060b10] py-10 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(rgba(0,230,118,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,118,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 40%, transparent 70%)',
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="text-sm font-semibold text-emerald-300 tracking-wider uppercase">24/7 Support</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#f0f4f8] mb-4">
            How can we{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              help you?
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Our expert coaches are here to guide you through your trading journey. Get personalized advice and quick resolutions.
          </p>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FiMessageSquare, label: "Ask a Question", desc: "Get expert guidance", action: () => !isRA && setView("new"), color: "from-emerald-500/20 to-emerald-600/10", iconColor: "text-emerald-400" },
            { icon: FiSend, label: "Quick Message", desc: "Send us a message", action: () => setShowContactForm(true), color: "from-blue-500/20 to-blue-600/10", iconColor: "text-blue-400" },
            { icon: FiMail, label: "Email Support", desc: "support@investbay.in", action: () => window.location.href = "mailto:support@investbay.in", color: "from-purple-500/20 to-purple-600/10", iconColor: "text-purple-400" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className={`group relative bg-gradient-to-br ${item.color} backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 text-left hover:border-white/[0.15] hover:-translate-y-1 transition-all duration-300`}
            >
              <item.icon className={`w-8 h-8 ${item.iconColor} mb-3`} />
              <h3 className="text-sm font-bold text-[#f0f4f8] mb-1">{item.label}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiPlus className="w-3 h-3 text-emerald-400" />
              </div>
            </button>
          ))}
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
            <FiAlertCircle className="shrink-0" />
            {error}
            <button className="ml-auto hover:text-red-300" onClick={() => setError("")}><FiX size={16} /></button>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
            <FiCheckCircle className="shrink-0" />
            {success}
          </div>
        )}

        {/* Quick Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0a0f16] border border-white/[0.1] rounded-2xl max-w-lg w-full p-6 relative animate-fadeIn">
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#f0f4f8] mb-2">Send us a Message</h2>
                <p className="text-sm text-slate-400">Fill in your details and we'll get back to you shortly.</p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number <span className="text-slate-600">(Optional)</span></label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">Your Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleContactSubmit}
                disabled={sending}
                className="w-full mt-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <FiSend size={14} /> Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tickets Section */}
        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#f0f4f8] flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-emerald-400" />
              {isRA ? "Support Requests" : "Your Queries"}
              {tickets.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-400">{tickets.length}</span>
              )}
            </h2>
            {!isRA && (
              <button
                onClick={() => setView("new")}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-sm font-semibold rounded-xl hover:bg-emerald-400 transition-all duration-300"
              >
                <FiPlus size={14} /> New Query
              </button>
            )}
          </div>

          {fetching ? (
            <div className="flex justify-center py-16">
              <div className="relative">
                <div className="w-8 h-8 rounded-full border-2 border-white/[0.06]" />
                <div className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                <FiHeadphones className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-[#f0f4f8] font-bold text-lg mb-2">No queries yet</p>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
                {isRA ? "No tickets assigned to you." : "Ask your coach anything about markets, signals or your plan."}
              </p>
              {!isRA && (
                <button
                  onClick={() => setView("new")}
                  className="px-6 py-2.5 bg-emerald-500 text-black font-semibold rounded-xl hover:bg-emerald-400 transition-colors"
                >
                  Start a conversation
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {tickets.map(t => {
                const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;
                const category = CATEGORIES.find(c => c.value === t.category);
                return (
                  <button
                    key={t.id}
                    onClick={() => openTicket(t)}
                    className="w-full p-5 text-left hover:bg-white/[0.02] transition-all group flex items-start gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      {category ? <category.icon className="w-5 h-5 text-emerald-400" /> : <FiHelpCircle className="w-5 h-5 text-emerald-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.color}`}>
                          {sc.label}
                        </span>
                        <span className="text-xs text-slate-500">{category?.label}</span>
                        {Number(t.unread_count) > 0 && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {t.unread_count} new
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[#f0f4f8] text-sm group-hover:text-emerald-300 transition-colors truncate">
                        {t.subject}
                      </p>
                      {t.last_message && (
                        <p className="text-xs text-slate-500 mt-1 truncate">{t.last_message}</p>
                      )}
                      {isRA && t.user_name && (
                        <p className="text-xs text-slate-500 mt-1">From: {t.user_name}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500 whitespace-nowrap">{fmtTime(t.updated_at)}</p>
                      {Number(t.unread_count) > 0 && (
                        <span className={`inline-block w-2 h-2 rounded-full ${sc.dot} mt-1`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowFAQs(!showFAQs)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <h3 className="text-lg font-bold text-[#f0f4f8] flex items-center gap-2">
              <FiInfo className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions
            </h3>
            <FiPlus className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showFAQs ? 'rotate-45' : ''}`} />
          </button>
          
          {showFAQs && (
            <div className="px-5 pb-5 space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <h4 className="text-sm font-semibold text-[#f0f4f8] mb-1">{faq.q}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        .animate-gradient {
          animation: gradient 4s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </section>
  );

  // ─── NEW TICKET VIEW ────────────────────────────────────────────────────
  if (view === "new") return (
    <section className="min-h-screen bg-[#060b10] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <FiChevronLeft size={14} /> Back to tickets
        </button>

        <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#f0f4f8] mb-2">Create New Query</h2>
            <p className="text-sm text-slate-400">Describe your question in detail for the best possible guidance.</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              <FiAlertCircle className="shrink-0" />{error}
              <button className="ml-auto" onClick={() => setError("")}><FiX size={16} /></button>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400">
              <FiCheckCircle className="shrink-0" />{success}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-[#f0f4f8] block mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setForm(f => ({ ...f, category: c.value }))}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      form.category === c.value
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                    }`}
                  >
                    <c.icon className={`w-5 h-5 mb-1 ${form.category === c.value ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <p className={`text-sm font-semibold ${form.category === c.value ? 'text-emerald-300' : 'text-slate-300'}`}>{c.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#f0f4f8] block mb-2">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="e.g., Help with NIFTY signal interpretation"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#f0f4f8] block mb-2">Priority Level</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    onClick={() => setForm(f => ({ ...f, priority: p.value }))}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      form.priority === p.value
                        ? "bg-white/[0.04] border-emerald-500/30"
                        : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1]"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${p.color}`}>{p.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#f0f4f8] block mb-2">Message</label>
              <textarea
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Describe your query in detail — include stock names, signal details, or any relevant context..."
                rows={6}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20 resize-none"
              />
              <p className="text-xs text-slate-600 mt-1.5">Be as specific as possible for faster resolution</p>
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={sending}
            className="w-full mt-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>Processing...</>
            ) : (
              <>
                <FiSend size={14} /> Submit Query
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );

  // ─── CHAT VIEW ──────────────────────────────────────────────────────────
  const sc = STATUS_CONFIG[activeTicket?.status] || STATUS_CONFIG.open;
  const isClosed = activeTicket?.status === "closed";

  return (
    <div className="min-h-screen bg-[#060b10] flex flex-col">
      <div className="bg-[#060b10]/80 backdrop-blur-xl border-b border-white/[0.05] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => { setView("list"); setMessages([]); }} className="text-slate-400 hover:text-slate-200 p-1 transition-colors">
            <FiChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#f0f4f8] text-sm truncate">{activeTicket?.subject}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${sc.color}`}>
                {sc.label}
              </span>
              <span className="text-xs text-slate-500">
                {CATEGORIES.find(c => c.value === activeTicket?.category)?.label}
              </span>
            </div>
          </div>
          {!isClosed && !isRA && (
            <button onClick={handleClose} className="text-xs text-slate-500 hover:text-red-400 border border-white/[0.08] px-3 py-1.5 rounded-lg transition-colors">
              Close Ticket
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <FiMessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = (isRA && msg.sender_role === "ra") || (!isRA && msg.sender_role === "user");
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isMe && (
                    <span className="text-xs text-slate-500 ml-2 flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <FiShield className="w-3 h-3 text-emerald-400" />
                      </div>
                      {msg.sender_name || "Coach"}
                    </span>
                  )}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-emerald-500 text-black rounded-br-sm"
                      : "bg-white/[0.04] border border-white/[0.06] text-slate-200 rounded-bl-sm"
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-xs text-slate-600 mx-2">{fmtTime(msg.created_at)}</span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {!isClosed ? (
        <div className="bg-[#060b10]/80 backdrop-blur-xl border-t border-white/[0.05] px-4 py-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleReply()}
              placeholder="Type your message..."
              className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30"
            />
            <button
              onClick={handleReply}
              disabled={sending || !reply.trim()}
              className="w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl flex items-center justify-center disabled:opacity-50 transition-all duration-300 shrink-0"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#060b10]/80 backdrop-blur-xl border-t border-white/[0.05] px-4 py-4 text-center">
          <p className="text-sm text-slate-500">This ticket is closed. Create a new query if you need further assistance.</p>
        </div>
      )}
    </div>
  );
}