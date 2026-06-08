import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Verify from "../../assets/verify.png";
import { HiDownload } from "react-icons/hi";
import { FaFilePdf } from "react-icons/fa";

const glass = {
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1.5px solid rgba(255,255,255,0.38)",
  borderRadius: "20px",
};

const glassRow = {
  background: "rgba(255,255,255,0.22)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.4)",
  borderRadius: "12px",
};

export default function AnalystView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [analyst, setAnalyst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalystById = async () => {
      try {
        const res = await axios.get(`${apiUrl}/research-analyst/${id}`);
        if (res.data.success) setAnalyst(res.data.data);
        else setError("Failed to fetch analyst details");
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalystById();
  }, [apiUrl, id]);

  const StateScreen = ({ children, color = "#8a7e74" }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color, fontSize: 15 }}>{children}</p>
    </div>
  );

  if (loading) return <StateScreen>Loading...</StateScreen>;
  if (error) return <StateScreen color="#ef4444">{error}</StateScreen>;
  if (!analyst) return <StateScreen>Analyst not found</StateScreen>;

  const handleDownload = (fileName) => {
    if (!fileName) return alert("File not found!");
    const link = document.createElement("a");
    link.href = fileName;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatLanguages = (langs) => {
    if (!langs) return "N/A";
    if (Array.isArray(langs)) return langs.join(", ");
    if (typeof langs === "string") {
      return langs.replace(/[{}"]/g, "").split(",")
        .map((l) => { const t = l.trim(); return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(); })
        .filter(Boolean).join(", ");
    }
    return "N/A";
  };

  const formatDob = (dob) => {
    if (!dob) return "N/A";
    try {
      return new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return dob; }
  };

  const personalFields = [
    ["Email", analyst.email],
    ["Gender", analyst.gender ? analyst.gender.charAt(0).toUpperCase() + analyst.gender.slice(1) : null],
    ["Date of Birth", formatDob(analyst.dob)],
    ["City", analyst.city ? analyst.city.charAt(0).toUpperCase() + analyst.city.slice(1) : null],
    ["State", analyst.state ? analyst.state.charAt(0).toUpperCase() + analyst.state.slice(1) : null],
    ["Address", analyst.address],
  ];

  const professionalFields = [
    ["SEBI Registration No.", analyst.sebiNumber],
    ["Experience", analyst.experience ? `${analyst.experience} years` : null],
    ["Specialization", analyst.specialization],
    ["Company / Firm", analyst.companyName],
    ["Education / Certification", analyst.education],
    ["Languages", formatLanguages(analyst.languages)],
  ];

  const documents = [
    { label: "Pan Card", key: analyst.panFile },
    { label: "SEBI Certificate", key: analyst.sebiFile },
    { label: "Professional Document", key: analyst.professionalDocument },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        .analyst-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .analyst-grid { grid-template-columns: 1fr; }
        }
        .prof-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .doc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 600px) {
          .prof-grid { grid-template-columns: 1fr; }
          .doc-grid { grid-template-columns: 1fr; }
        }
        .dl-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .dl-btn { transition: all 0.2s; }
      `}</style>

      <div className="analyst-grid">

        {/* ── LEFT CARD ── */}
        <div style={{ ...glass, overflow: "hidden", display: "flex", flexDirection: "column", position: "sticky", top: 20 }}>

          {/* Profile image with gradient overlay */}
          <div style={{ position: "relative", width: "100%", height: 220, flexShrink: 0 }}>
            <img
              src={analyst.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Bottom fade */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
              background: "linear-gradient(to top, rgba(206,211,255,0.85), transparent)",
            }} />
          </div>

          {/* Name + verify */}
          <div style={{ padding: "14px 18px 8px", background: "linear-gradient(180deg, rgba(206,211,255,0.55) 0%, transparent 100%)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18, color: "#2a2118", margin: 0, lineHeight: 1.2 }}>
                  {analyst.name || "N/A"}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{
                    display: "inline-block", padding: "2px 10px", borderRadius: 20,
                    background: "rgba(110,124,248,0.15)", border: "1px solid rgba(110,124,248,0.3)",
                    fontSize: 11, fontWeight: 600, color: "#6e7cf8",
                  }}>
                    {analyst.experience || "0"} yrs exp
                  </span>
                </div>
              </div>
              <img src={Verify} alt="Verified" style={{ width: 20, height: 20, marginTop: 2 }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.35)", margin: "0 16px" }} />

          {/* Personal info rows */}
          <div style={{ padding: "12px 14px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
            {personalFields.map(([label, value], i) => (
              <div key={i} style={{ ...glassRow, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", gap: 8 }}>
                <p style={{ fontSize: 11, color: "#8a7e74", flexShrink: 0, margin: 0 }}>{label}</p>
                <p style={{
                  fontSize: 12, fontWeight: 600, color: "#2a2118", margin: 0,
                  textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  maxWidth: "55%",
                }}>
                  {value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Professional Details */}
          <div style={{ ...glass, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(110,124,248,0.85), rgba(79,195,247,0.8))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(110,124,248,0.3)",
              }}>
                <span style={{ fontSize: 16 }}>💼</span>
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#2a2118", margin: 0 }}>
                Professional Details
              </h3>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.4)", margin: "0 -22px 16px" }} />
            <div className="prof-grid">
              {professionalFields.map(([label, value], i) => (
                <div key={i} style={{ ...glassRow, padding: "12px 14px" }}>
                  <p style={{ fontSize: 11, color: "#8a7e74", marginBottom: 4, margin: "0 0 4px" }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#2a2118", margin: 0 }}>{value || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Document Details */}
          <div style={{ ...glass, padding: "22px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, rgba(74,197,130,0.85), rgba(79,195,247,0.8))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(74,197,130,0.3)",
              }}>
                <span style={{ fontSize: 16 }}>📄</span>
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: "#2a2118", margin: 0 }}>
                Document Details
              </h3>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.4)", margin: "0 -22px 16px" }} />
            <div className="doc-grid">
              {documents.map(({ label, key }, i) => (
                <div key={i} style={{
                  ...glassRow,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: "10px",
                      background: "rgba(110,124,248,0.12)",
                      border: "1px solid rgba(110,124,248,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <FaFilePdf size={16} style={{ color: "#6e7cf8" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#2a2118", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 10, color: "#8a7e74", margin: "2px 0 0" }}>.pdf file</p>
                    </div>
                  </div>
                  <button
                    className="dl-btn"
                    onClick={() => handleDownload(key)}
                    style={{
                      width: 32, height: 32, borderRadius: "10px", border: "none", cursor: "pointer",
                      background: "linear-gradient(135deg, rgba(110,124,248,0.85) 0%, rgba(79,195,247,0.8) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "0 3px 10px rgba(110,124,248,0.35)",
                    }}
                  >
                    <HiDownload size={15} style={{ color: "#fff" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}