import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import HeaderLinks from "./HeaderLinks.jsx";
import LoginModal from "./LoginModal.jsx";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const openLoginModal = () => {
    setShowLogin(true);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white fixed top-0 left-0 w-full z-50 ">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">

            {/* LEFT — Logo + Nav links together */}
            <div className="hidden md:flex items-center space-x-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center cursor-pointer"
              >
                <img
                  src="/logo.svg"
                  alt="InvestBay Logo"
                  className="h-10 w-auto object-contain"
                  draggable="false"
                />
              </div>
              <HeaderLinks type="nav" />
            </div>

            {/* RIGHT — Auth buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <HeaderLinks type="auth" onLoginClick={openLoginModal} />
            </div>

            {/* Mobile — Logo */}
            <div
              onClick={() => navigate("/")}
              className="flex md:hidden items-center cursor-pointer"
            >
              <img
                src="/logo.svg"
                alt="InvestBay Logo"
                className="h-10 w-auto object-contain"
                draggable="false"
              />
            </div>

            {/* Mobile — Hamburger */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-800 focus:outline-none"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-start space-y-4">
              <HeaderLinks
                type="all"
                onClick={closeMenu}
                onLoginClick={openLoginModal}
              />
            </div>
          </div>
        )}
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}