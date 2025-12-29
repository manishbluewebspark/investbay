// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import HeaderLinks from "./HeaderLinks.jsx";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <header className="bg-white w-full shadow-sm fixed top-0 left-0 z-50">
//       <nav className=" flex items-center justify-between py-3 px-6 lg:px-30">
//         <div
//           onClick={() => navigate("/")}
//           className="flex items-center cursor-pointer"
//         >
//           <img
//             src="/logo.svg"
//             alt="InvestBay Logo"
//             className="h-10 w-auto object-contain"
//             draggable="false"
//           />
//         </div>
//         <div className="hidden md:flex items-center space-x-6 text-md">
//           <HeaderLinks />
//         </div>
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={toggleMenu}
//             className="text-gray-800 focus:outline-none"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </nav>
//       {menuOpen && (
//         <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
//           <div className="flex flex-col items-start px-6 py-4 space-y-4 text-md">
//             <HeaderLinks onClick={closeMenu} />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

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
      <header className="bg-white w-full shadow-sm fixed top-0 left-0 z-50">
        <nav className="flex items-center justify-between py-3 px-6 lg:px-30">
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

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6 text-md">
            <HeaderLinks onLoginClick={openLoginModal} />
          </div>

          {/* Mobile icon */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
            <div className="flex flex-col items-start px-6 py-4 space-y-4 text-md">
              <HeaderLinks
                onClick={closeMenu}
                onLoginClick={openLoginModal}
              />
            </div>
          </div>
        )}
      </header>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
