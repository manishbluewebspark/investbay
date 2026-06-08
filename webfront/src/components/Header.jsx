import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import HeaderLinks from "./HeaderLinks.jsx";
import LoginModal from "./LoginModal.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .nav-root {
          position: fixed; top: 0; left: 0; width: 100%; z-index: 100;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          transition: background .3s ease, border-color .3s ease, box-shadow .3s;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .nav-root.scrolled {
          background: rgba(255,255,255,0.97);
          border-bottom-color: #e5e7eb;
          box-shadow: 0 1px 20px rgba(0,0,0,0.07);
        }
        .nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 28px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nav-logo { cursor: pointer; display: flex; align-items: center; flex-shrink: 0; }
        .nav-logo img { height: 30px; width: auto; transition: opacity .2s; }
        .nav-logo:hover img { opacity: 0.85; }

        .nav-left { display: flex; align-items: center; gap: 32px; }
        .nav-right { display: flex; align-items: center; gap: 10px; }

        .nav-hamburger {
          display: none;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 7px;
          color: #6b7280;
          cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .nav-hamburger:hover { background: #f3f4f6; border-color: #d1d5db; color: #111827; }

        .nav-mobile-drawer {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 16px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .nav-mobile-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 2px 0;
        }

        @media (max-width: 900px) {
          .nav-desktop-left, .nav-desktop-right { display: none !important; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <header className={`nav-root ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          {/* Left: Logo + Nav */}
          <div className="nav-left nav-desktop-left">
            <div className="nav-logo" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="InvestBay" draggable="false" />
            </div>
            <HeaderLinks type="nav" />
          </div>

          {/* Right: Auth */}
          <div className="nav-right nav-desktop-right">
            <HeaderLinks type="auth" onLoginClick={() => setShowLogin(true)} />
          </div>

          {/* Mobile: Logo center + Hamburger */}
          <div className="nav-logo" onClick={() => navigate("/")} style={{ display: "none" }}
            ref={el => { if (el) el.style.display = window.innerWidth <= 900 ? "flex" : "none"; }}>
            <img src="/logo.svg" alt="InvestBay" draggable="false" />
          </div>

          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="nav-mobile-drawer">
            <div className="nav-logo" onClick={() => { navigate("/"); setMenuOpen(false); }}>
              <img src="/logo.svg" alt="InvestBay" draggable="false" />
            </div>
            <div className="nav-mobile-divider" />
            <HeaderLinks
              type="all"
              onClick={() => setMenuOpen(false)}
              onLoginClick={() => { setShowLogin(true); setMenuOpen(false); }}
            />
          </div>
        )}
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}