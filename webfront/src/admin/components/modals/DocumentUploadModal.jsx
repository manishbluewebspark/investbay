import React, { useState, useEffect } from "react";
import { X, FolderUp, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DocumentUploadModal({ data, parentData, onSubmit, onBack, onClose }) {
  const [panFile, setPanFile] = useState(null);
  const [sebiFile, setSebiFile] = useState(null);
  const [terms, setTerms] = useState("");
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (parentData?.personal?.profileImage) {
      setProfileImage(parentData.personal.profileImage);
    }
  }, [parentData]);

  const validateForm = () => {
    const newErrors = {};
    if (!panFile) newErrors.panFile = "Please upload your PAN / Aadhar file";
    if (!sebiFile) newErrors.sebiFile = "Please upload your SEBI certificate";
    if (!terms.trim()) newErrors.terms = "Please enter terms & declaration";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setPanFile(null);
    setSebiFile(null);
    setTerms("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const p = parentData?.personal || {};
    const prof = parentData?.professional || {};
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", p.name || "");
      formDataToSend.append("email", p.email || "");
      formDataToSend.append("mobile", p.mobile || "");
      formDataToSend.append("pan", p.pan || "");
      formDataToSend.append("gender", p.gender || "");
      formDataToSend.append("dob", p.dob || "");
      formDataToSend.append("city", p.city || "");
      formDataToSend.append("state", p.state || "");
      formDataToSend.append("address", p.address || "");
      formDataToSend.append("aboutUs", p.aboutUs || "");
      if (p.signature) formDataToSend.append("signature", p.signature);
      formDataToSend.append("sebiNumber", prof.sebiNumber || "");
      formDataToSend.append("specialization", prof.specialization || "");
      formDataToSend.append("education", prof.education || "");
      formDataToSend.append("experience", prof.experience || "");
      formDataToSend.append("companyName", prof.companyName || "");
      formDataToSend.append("languages", prof.languages || "");
      formDataToSend.append("segment", prof.segment || "");
      if (prof.selectedFile) formDataToSend.append("professionalDocument", prof.selectedFile);
      if (profileImage) formDataToSend.append("profileImage", profileImage);
      formDataToSend.append("terms", terms);
      formDataToSend.append("panFile", panFile);
      formDataToSend.append("sebiFile", sebiFile);
      const res = await axios.post(`${apiUrl}/research-analyst/create`, formDataToSend, { withCredentials: true });
      toast.success("Form submitted successfully");
      resetForm();
      onSubmit?.({ panFile, sebiFile, terms });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit data ❌");
    } finally {
      setLoading(false);
    }
  };

  const glassCard = {
    background: "rgba(255,255,255,0.18)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1.5px solid rgba(255,255,255,0.38)",
    borderRadius: "20px",
  };

  const UploadZone = ({ label, file, setter, error }) => (
    <div
      style={{
        ...glassCard,
        border: error
          ? "1.5px dashed rgba(239,68,68,0.6)"
          : "1.5px dashed rgba(255,255,255,0.45)",
        borderRadius: "14px",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: "10px", margin: "0 auto 8px",
        background: file ? "rgba(74,197,130,0.18)" : "rgba(110,124,248,0.18)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {file
          ? <CheckCircle2 size={18} style={{ color: "#4ac582" }} />
          : <FolderUp size={18} style={{ color: "#6e7cf8" }} />
        }
      </div>
      <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, color: "#2a2118", marginBottom: 2 }}>
        {label}
      </p>
      {file
        ? <p style={{ fontSize: 11, color: "#4ac582", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{file.name}</p>
        : <p style={{ fontSize: 11, color: "#8a7e74", fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>Drag & drop or browse</p>
      }
      <label style={{ display: "inline-block", cursor: "pointer" }}>
        <input type="file" style={{ display: "none" }} onChange={(e) => setter(e.target.files[0])} />
        <span style={{
          display: "inline-block",
          padding: "4px 16px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.28)",
          border: "1px solid rgba(255,255,255,0.5)",
          fontSize: 11,
          fontFamily: "'DM Sans', sans-serif",
          color: "#2a2118",
          fontWeight: 500,
          backdropFilter: "blur(8px)",
        }}>
          Browse files
        </span>
      </label>
      {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 5, fontFamily: "'DM Sans', sans-serif" }}>{error}</p>}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        // KEY FIX: allow scroll on overlay itself on very small screens
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...glassCard,
          width: "100%",
          maxWidth: 520,
          // KEY FIX: use flex column with max-height + internal scroll
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100dvh - 32px)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 1.5px 0 rgba(255,255,255,0.5) inset",
          // prevent margin collapse on small screens
          margin: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed, never scrolls */}
        <div style={{
          flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.25)",
        }}>
          <div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, color: "#2a2118", margin: 0 }}>
              Document Upload
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8a7e74", margin: "2px 0 0" }}>
              Upload required verification documents
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "9px", border: "none", cursor: "pointer",
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={14} color="#5a4e44" />
          </button>
        </div>

        {/* Body — this part scrolls */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          // Custom scrollbar subtle styling
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.3) transparent",
        }}>
          <UploadZone label="PAN / Aadhar Upload" file={panFile} setter={setPanFile} error={errors.panFile} />
          <UploadZone label="SEBI Certificate Upload" file={sebiFile} setter={setSebiFile} error={errors.sebiFile} />

          <div>
            <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#5a4e44", display: "block", marginBottom: 5 }}>
              Terms & Declaration
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Enter Terms & Declaration"
              style={{
                width: "100%",
                padding: "9px 13px",
                borderRadius: "12px",
                border: errors.terms ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(10px)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#2a2118",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {errors.terms && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4, fontFamily: "'DM Sans', sans-serif" }}>{errors.terms}</p>}
          </div>
        </div>

        {/* Footer — fixed, never scrolls */}
        <div style={{
          flexShrink: 0,
          display: "flex", justifyContent: "flex-end", gap: 10,
          padding: "12px 20px 16px",
          borderTop: "1px solid rgba(255,255,255,0.25)",
        }}>
          <button
            onClick={onBack}
            style={{
              padding: "7px 20px", borderRadius: "20px", cursor: "pointer",
              background: "rgba(255,255,255,0.22)",
              border: "1.5px solid rgba(255,255,255,0.45)",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: "#5a4e44",
              backdropFilter: "blur(8px)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "7px 24px", borderRadius: "20px", cursor: loading ? "not-allowed" : "pointer",
              background: loading
                ? "rgba(110,124,248,0.4)"
                : "linear-gradient(135deg, rgba(110,124,248,0.9) 0%, rgba(79,195,247,0.85) 100%)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13, color: "#fff",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(110,124,248,0.3)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}