import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCog, FaShieldAlt, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function HeaderLinks({ type = "all", onClick, onLoginClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [lossStatus, setLossStatus] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "hl-link hl-link--active"
      : "hl-link";

  useEffect(() => {
    if (!showDropdown || !user?.id || !token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/loss-security/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (res.data?.success) setLossStatus(res.data.data); })
      .catch(() => setLossStatus(null));
  }, [showDropdown]);

  const handleLogout = useCallback(async () => {
    try {
      if (user?.id) await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, { user_id: user.id, ip_address: "", user_agent: navigator.userAgent, role: user.role });
    } catch { }
    finally { localStorage.removeItem("user"); localStorage.removeItem("token"); setShowDropdown(false); navigate("/login"); }
  }, [user?.id, navigate]);

  useEffect(() => {
    const fn = e => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const NavLinks = (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .hl-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; font-weight: 500; letter-spacing: .01em;
          color: rgba(180,196,216,0.72);
          text-decoration: none;
          padding: 4px 0;
          position: relative;
          transition: color .2s;
          white-space: nowrap;
        }
        .hl-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1.5px;
          background: #00e676;
          border-radius: 2px;
          transition: width .25s ease;
        }
        .hl-link:hover { color: #eef2f7; }
        .hl-link:hover::after { width: 100%; }
        .hl-link--active { color: #00e676 !important; }
        .hl-link--active::after { width: 100% !important; }

        .hl-login-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: .03em;
          padding: 9px 22px; border-radius: 10px; border: none; cursor: pointer;
          background: #00e676; color: #04100a;
          transition: opacity .2s, transform .2s;
        }
        .hl-login-btn:hover { opacity: .88; transform: translateY(-1px); }

        .hl-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px; padding: 5px 12px 5px 5px;
          cursor: pointer; transition: background .2s, border-color .2s;
        }
        .hl-avatar-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.14); }
        .hl-avatar-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: rgba(180,196,216,0.9);
        }

        .hl-dropdown {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 232px; z-index: 200; overflow: hidden;
          border-radius: 14px;
          background: rgba(10,14,22,0.97);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 20px 60px rgba(0,0,0,0.55);
        }
        .hl-dd-head {
          padding: 14px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .hl-dd-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: #eef2f7; }
        .hl-dd-email { font-size: 11.5px; font-weight: 400; color: rgba(140,158,180,0.55); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hl-dd-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 16px; background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: rgba(180,196,216,0.75);
          text-align: left; transition: background .15s, color .15s;
        }
        .hl-dd-item:hover { background: rgba(255,255,255,0.04); color: #eef2f7; }
        .hl-dd-item.danger { color: rgba(252,129,129,0.8); }
        .hl-dd-item.danger:hover { background: rgba(252,129,129,0.06); color: #fca5a5; }
        .hl-dd-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .hl-dd-icon { opacity: .55; flex-shrink: 0; }

        .hl-loss-warn {
          margin: 4px 12px 6px;
          padding: 10px 12px;
          background: rgba(252,129,129,0.07);
          border: 1px solid rgba(252,129,129,0.15);
          border-radius: 8px;
        }
        .hl-loss-warn p { font-size: 11px; font-weight: 600; color: rgba(252,129,129,0.85); line-height: 1.5; }
        .hl-loss-warn small { font-size: 10.5px; font-weight: 400; color: rgba(252,129,129,0.55); }
      `}</style>
      <NavLink to="/feed" onClick={onClick} className={navLinkClass}>Feed</NavLink>
      <NavLink to="/signals" onClick={onClick} className={navLinkClass}>Signals</NavLink>
      <NavLink to="/mentors" onClick={onClick} className={navLinkClass}>Mentors</NavLink>
      <NavLink to="/subscriptions" onClick={onClick} className={navLinkClass}>Subscriptions</NavLink>
      <NavLink to="/capital-lock" onClick={onClick} className={navLinkClass}>capital lock</NavLink>
      <NavLink to="/loss-protection" onClick={onClick} className={navLinkClass}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaShieldAlt size={11} style={{ color: lossStatus?.is_triggered ? "#fca5a5" : lossStatus?.is_active ? "#00e676" : "rgba(140,158,180,0.4)" }} />
          Loss Protection
          {lossStatus?.is_triggered && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fca5a5", animation: "badge-pulse 2s infinite" }} />}
        </span>
      </NavLink>
      <NavLink to="/coach-support" onClick={onClick} className={navLinkClass}>Coach support</NavLink>
    </>
  );

  const AuthLinks = user?.name ? (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button className="hl-avatar-btn" onClick={() => setShowDropdown(o => !o)}>
        <div style={{ borderRadius: "50%", outline: lossStatus?.is_triggered ? "2px solid #fca5a5" : "none", outlineOffset: 1 }}>
          {user.profilePicture
            ? <img src={user.profilePicture} alt="Profile" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            : <FaUserCircle size={26} style={{ color: "rgba(180,196,216,0.7)" }} />
          }
        </div>
        <span className="hl-avatar-name">{user.name?.split(" ")[0]}</span>
      </button>

      {showDropdown && (
        <div className="hl-dropdown">
          <div className="hl-dd-head">
            <div className="hl-dd-name">{user.name}</div>
            <div className="hl-dd-email">{user.email}</div>
          </div>

          <button className="hl-dd-item" onClick={() => { setShowDropdown(false); navigate("/profile"); onClick?.(); }}>
            <FaUser size={13} className="hl-dd-icon" /> My Profile
          </button>
          <button className="hl-dd-item" onClick={() => { setShowDropdown(false); navigate("/settings"); }}>
            <FaCog size={13} className="hl-dd-icon" /> Settings
          </button>

          {lossStatus?.is_triggered && (
            <div className="hl-loss-warn">
              <p>⚠ Trading blocked — ₹{lossStatus.loss_limit?.toLocaleString()} limit reached</p>
              <small>Resets at midnight</small>
            </div>
          )}

          <div className="hl-dd-divider" />
          <button className="hl-dd-item danger" onClick={handleLogout}>
            <FaSignOutAlt size={13} style={{ opacity: .65 }} /> Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button className="hl-login-btn" onClick={onLoginClick || (() => navigate("/login"))}>
      Get Started
    </button>
  );

  if (type === "nav") return <>{NavLinks}</>;
  if (type === "auth") return <>{AuthLinks}</>;
  return <>{NavLinks}{AuthLinks}</>;
}