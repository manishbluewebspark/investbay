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
          transition: background .35s ease, border-color .35s ease, backdrop-filter .35s;
          background: rgba(8,12,18,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-root.scrolled {
          background: rgba(6,9,14,0.9);
          border-bottom-color: rgba(255,255,255,0.09);
          box-shadow: 0 1px 32px rgba(0,0,0,0.45);
        }
        .nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 28px;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { cursor: pointer; display: flex; align-items: center; flex-shrink: 0; }
        .nav-logo img {
          height: 34px; width: auto;
          filter: drop-shadow(0 0 10px rgba(0,230,118,0.3));
          transition: filter .3s;
        }
        .nav-logo:hover img { filter: drop-shadow(0 0 16px rgba(0,230,118,0.55)); }

        .nav-left { display: flex; align-items: center; gap: 36px; }
        .nav-right { display: flex; align-items: center; gap: 12px; }

        /* mobile */
        .nav-hamburger {
          display: none; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09); border-radius: 8px;
          padding: 7px; color: rgba(180,196,216,0.8); cursor: pointer;
          transition: background .2s;
        }
        .nav-hamburger:hover { background: rgba(255,255,255,0.1); }

        .nav-mobile-drawer {
          background: rgba(6,9,14,0.97);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 20px 28px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }

        @media (max-width: 900px) {
          .nav-desktop-left, .nav-desktop-right { display: none !important; }
          .nav-hamburger { display: flex; }
        }
      `}</style>

      <header className={`nav-root ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-left nav-desktop-left">
            <div className="nav-logo" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="InvestBay" draggable="false" />
            </div>
            <HeaderLinks type="nav" />
          </div>

          <div className="nav-right nav-desktop-right">
            <HeaderLinks type="auth" onLoginClick={() => { setShowLogin(true); }} />
          </div>

          {/* mobile logo */}
          <div className="nav-logo" onClick={() => navigate("/")} style={{ display: "none" }}
            ref={el => { if (el) el.style.display = window.innerWidth <= 900 ? "flex" : "none"; }}>
            <img src="/logo.svg" alt="InvestBay" draggable="false" />
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {menuOpen && (
          <div className="nav-mobile-drawer">
            <div className="nav-logo" onClick={() => { navigate("/"); setMenuOpen(false); }}>
              <img src="/logo.svg" alt="InvestBay" draggable="false" />
            </div>
            <HeaderLinks type="all" onClick={() => setMenuOpen(false)} onLoginClick={() => { setShowLogin(true); setMenuOpen(false); }} />
          </div>
        )}
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}