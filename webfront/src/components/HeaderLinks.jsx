import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCog, FaShieldAlt, FaSignOutAlt, FaUser, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

// Primary nav links (shown directly in header)
const PRIMARY_LINKS = [
  { to: "/feed", label: "Feed" },
  { to: "/signals", label: "Signals" },
  { to: "/courses", label: "Courses" },
  { to: "/mentors", label: "Mentors" },
  { to: "/map", label: "Map" },
 
];

// Secondary links (grouped in "More" dropdown)
const MORE_LINKS = [
  { to: "/loss-protection", label: "Loss Protection" },
  { to: "/subscriptions", label: "Subscriptions" },
  { to: "/capital-lock", label: "Capital Lock" },
  { to: "/coach-support", label: "Coach Support" },
  { to: "/user-kyc", label: "User KYC" },
];

export default function HeaderLinks({ type = "all", onClick, onLoginClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [lossStatus, setLossStatus] = useState(null);
  const dropdownRef = useRef(null);
  const moreMenuRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const navLinkClass = ({ isActive }) => isActive ? "hl-link hl-link--active" : "hl-link";

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

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) setShowMoreMenu(false);
    };
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
          color: #4b5563;
          text-decoration: none;
          padding: 4px 0;
          position: relative;
          transition: color .2s;
          white-space: nowrap;
        }
        .hl-link::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1.5px;
          background: #16a34a;
          border-radius: 2px;
          transition: width .22s ease;
        }
        .hl-link:hover { color: #111827; }
        .hl-link:hover::after { width: 100%; }
        .hl-link--active { color: #16a34a !important; font-weight: 600; }
        .hl-link--active::after { width: 100% !important; }

        .hl-login-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; letter-spacing: .02em;
          padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer;
          background: #16a34a; color: #fff;
          transition: background .15s, transform .15s;
        }
        .hl-login-btn:hover { background: #15803d; transform: translateY(-1px); }

        .hl-avatar-btn {
          display: flex; align-items: center; gap: 8px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 100px; padding: 4px 12px 4px 4px;
          cursor: pointer; transition: background .15s, border-color .15s;
        }
        .hl-avatar-btn:hover { background: #f0fdf4; border-color: #bbf7d0; }
        .hl-avatar-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #374151;
        }

        .hl-dropdown {
          position: absolute; right: 0; top: calc(100% + 8px);
          width: 224px; z-index: 200; overflow: hidden;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 40px rgba(0,0,0,0.10);
        }
        .hl-dd-head {
          padding: 12px 14px 10px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }
        .hl-dd-name { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13.5px; font-weight: 700; color: #111827; }
        .hl-dd-email { font-size: 11.5px; color: #9ca3af; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hl-dd-item {
          display: flex; align-items: center; gap: 9px;
          width: 100%; padding: 9px 14px; background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: #4b5563;
          text-align: left; transition: background .1s, color .1s;
        }
        .hl-dd-item:hover { background: #f3f4f6; color: #111827; }
        .hl-dd-item.danger { color: #ef4444; }
        .hl-dd-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .hl-dd-divider { height: 1px; background: #f3f4f6; margin: 3px 0; }
        .hl-dd-icon { opacity: .5; flex-shrink: 0; }

        .hl-more-btn {
          display: flex; align-items: center; gap: 5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          color: #4b5563;
          background: none; border: none; cursor: pointer;
          padding: 4px 0; white-space: nowrap;
          transition: color .2s;
        }
        .hl-more-btn:hover, .hl-more-btn.open { color: #111827; }

        .hl-more-menu {
          position: absolute; top: calc(100% + 8px);
          min-width: 180px; z-index: 200;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 40px rgba(0,0,0,0.10);
          padding: 4px 0;
        }
        .hl-more-item {
          display: block; width: 100%; padding: 9px 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 500; color: #4b5563;
          text-decoration: none; background: none; border: none; cursor: pointer;
          text-align: left; transition: background .1s, color .1s;
          position: relative;
        }
        .hl-more-item:hover { background: #f3f4f6; color: #111827; }
        .hl-more-item.active { color: #16a34a; font-weight: 600; }
        .hl-more-item.active::before { content: ''; position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 3px; height: 16px; background: #16a34a; border-radius: 2px; }
        
        .hl-loss-warn {
          margin: 4px 10px 6px;
          padding: 9px 11px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }
        .hl-loss-warn p { font-size: 11px; font-weight: 600; color: #dc2626; line-height: 1.5; }
        .hl-loss-warn small { font-size: 10px; color: #ef4444; }
      `}</style>

      {/* Primary links */}
      {PRIMARY_LINKS.map(link => (
        <NavLink key={link.to} to={link.to} onClick={onClick} className={navLinkClass}>{link.label}</NavLink>
      ))}

      {/* Loss Protection — stays primary since it has status indicator */}
      {/* <NavLink
        to="/loss-protection"
        onClick={onClick}
        className={({ isActive }) => isActive ? "hl-link hl-link--active" : "hl-link"}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <FaShieldAlt size={11} style={{ color: lossStatus?.is_triggered ? "#ef4444" : lossStatus?.is_active ? "#16a34a" : "#d1d5db" }} />
          Loss Protection
          {lossStatus?.is_triggered && (
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          )}
        </span>
      </NavLink> */}

      {/* More dropdown */}
      <div style={{ position: "relative" }} ref={moreMenuRef}>
        <button
          className={`hl-more-btn${showMoreMenu ? " open" : ""}`}
          onClick={() => setShowMoreMenu(o => !o)}
          aria-expanded={showMoreMenu}
        >
          Products
          <FaChevronDown
            size={10}
            style={{ transition: "transform .2s", transform: showMoreMenu ? "rotate(180deg)" : "rotate(0)" }}
          />
        </button>
        {showMoreMenu && (
          <div className="hl-more-menu">
            {MORE_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `hl-more-item${isActive ? " active" : ""}`}
                onClick={() => { setShowMoreMenu(false); onClick?.(); }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <NavLink
        to="/contact"
        onClick={onClick}
        className={({ isActive }) => isActive ? "hl-link hl-link--active" : "hl-link"}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {/* <FaShieldAlt size={11} style={{ color: lossStatus?.is_triggered ? "#ef4444" : lossStatus?.is_active ? "#16a34a" : "#d1d5db" }} /> */}
         Contact Us
          {lossStatus?.is_triggered && (
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
          )}
        </span>
      </NavLink>
    </>
  );

  const AuthLinks = user?.name ? (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button className="hl-avatar-btn" onClick={() => setShowDropdown(o => !o)}>
        <div style={{ borderRadius: "50%", outline: lossStatus?.is_triggered ? "2px solid #ef4444" : "none", outlineOffset: 1 }}>
          {user.profilePicture
            ? <img src={user.profilePicture} alt="Profile" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
            : <FaUserCircle size={24} style={{ color: "#9ca3af" }} />
          }
        </div>
        <span className="hl-avatar-name">{user.name?.split(" ")[0]}</span>
        <FaChevronDown size={10} style={{ color: "#9ca3af", transition: "transform .2s", transform: showDropdown ? "rotate(180deg)" : "rotate(0)" }} />
      </button>

      {showDropdown && (
        <div className="hl-dropdown">
          <div className="hl-dd-head">
            <div className="hl-dd-name">{user.name}</div>
            <div className="hl-dd-email">{user.email}</div>
          </div>
          <button className="hl-dd-item" onClick={() => { setShowDropdown(false); navigate("/profile"); onClick?.(); }}>
            <FaUser size={12} className="hl-dd-icon" /> My Profile
          </button>
          <button className="hl-dd-item" onClick={() => { setShowDropdown(false); navigate("/settings"); }}>
            <FaCog size={12} className="hl-dd-icon" /> Settings
          </button>
          {lossStatus?.is_triggered && (
            <div className="hl-loss-warn">
              <p>⚠ Trading blocked — ₹{lossStatus.loss_limit?.toLocaleString()} limit reached</p>
              <small>Resets at midnight</small>
            </div>
          )}
          <div className="hl-dd-divider" />
          <button className="hl-dd-item danger" onClick={handleLogout}>
            <FaSignOutAlt size={12} style={{ opacity: .6 }} /> Logout
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