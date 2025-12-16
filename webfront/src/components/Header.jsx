// import React, { useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { Zap, Menu, X } from "lucide-react";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const closeMenu = () => setMenuOpen(false);

//   return (
//     <header className="bg-white w-full shadow-sm fixed top-0 left-0 z-50">
//       <nav className="container mx-auto flex items-center justify-between py-3 px-6">
//         {/* Logo Section */}
//         <div
//           onClick={() => navigate("/")}
//           className="flex items-center space-x-2 cursor-pointer"
//         >
//           <div className="bg-teal-500 p-2 rounded-full">
//             <Zap className="text-white w-4 h-4" />
//           </div>
//           <h1 className="text-lg font-semibold text-gray-900">InvestBay</h1>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-6 text-md">
//           <NavLink
//             to="/feed"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Feed
//           </NavLink>
//           <NavLink
//             to="/signals"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Signals
//           </NavLink>
//           <NavLink
//             to="/mentors"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Mentors
//           </NavLink>
//           <NavLink
//             to="/subscriptions"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Subscriptions
//           </NavLink>
//           <NavLink
//             to="/learn"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Learn
//           </NavLink>
//           <NavLink
//             to="/course"
//             className={({ isActive }) =>
//               isActive ? "active-text" : "default-text"
//             }
//           >
//             Course
//           </NavLink>
//           <NavLink
//             to="/login"
//             className={({ isActive }) =>
//               isActive
//                 ? "active-text border border-teal-500 px-6 py-2 rounded-full"
//                 : "bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
//             }
//           >
//             Login
//           </NavLink>
//         </div>

//         {/* Hamburger Icon (Mobile) */}
//         <div className="md:hidden flex items-center">
//           <button
//             onClick={toggleMenu}
//             className="text-gray-800 focus:outline-none"
//           >
//             {menuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
//           <div className="flex flex-col items-start px-6 py-4 space-y-4 text-md">
//             <NavLink
//               to="/feed"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Feed
//             </NavLink>
//             <NavLink
//               to="/signals"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Signals
//             </NavLink>
//             <NavLink
//               to="/mentors"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Mentors
//             </NavLink>
//             <NavLink
//               to="/subscriptions"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Subscriptions
//             </NavLink>
//             <NavLink
//               to="/learn"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Learn
//             </NavLink>
//             <NavLink
//               to="/course"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive ? "active-text" : "default-text"
//               }
//             >
//               Course
//             </NavLink>
//             <NavLink
//               to="/login"
//               onClick={closeMenu}
//               className={({ isActive }) =>
//                 isActive
//                   ? "active-text border border-teal-500 px-6 py-2 rounded-full"
//                   : "bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
//               }
//             >
//               Login
//             </NavLink>
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

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white w-full shadow-sm fixed top-0 left-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-3 px-6">
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
        <div className="hidden md:flex items-center space-x-6 text-md">
          <HeaderLinks />
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="flex flex-col items-start px-6 py-4 space-y-4 text-md">
            <HeaderLinks onClick={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
}

