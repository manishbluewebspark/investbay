// import axios from "axios";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { FaCog, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";
// import { NavLink, useNavigate } from "react-router-dom";

// export default function HeaderLinks({ type = "all", onClick, onLoginClick }) {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user")) || {};

//   const navLinkClass = ({ isActive }) =>
//     isActive
//       ? "text-md font-medium text-[#0d9e75] border-b-2 border-[#0d9e75] pb-0.5"
//       : "text-md font-medium  hover:text-[#0a7d5c] transition-colors";

//   const handleLogout = useCallback(async () => {
//     try {
//       if (user?.id) {
//         await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
//           user_id: user.id,
//           ip_address: "",
//           user_agent: navigator.userAgent,
//           role: user.role,
//         });
//       }
//     } catch (error) {
//       console.error("Logout API failed:", error);
//     } finally {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       setShowDropdown(false);
//       navigate("/login");
//     }
//   }, [user?.id, navigate]);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const NavLinks = (
//     <>
//       <NavLink to="/feed" onClick={onClick} className={navLinkClass}>Feed</NavLink>
//       <NavLink to="/signals" onClick={onClick} className={navLinkClass}>Signals</NavLink>
//       <NavLink to="/mentors" onClick={onClick} className={navLinkClass}>Mentors</NavLink>
//       <NavLink to="/subscriptions" onClick={onClick} className={navLinkClass}>Subscriptions</NavLink>
//       {/* <NavLink to="/news" onClick={onClick} className={navLinkClass}>News</NavLink> */}
//     </>
//   );

//   const AuthLinks = user?.name ? (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className="flex items-center space-x-2 focus:outline-none border p-1 rounded-full hover:bg-gray-100 transition-colors"
//       >
//         {user.profilePicture ? (
//           <img
//             src={user.profilePicture}
//             alt="Profile"
//             className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
//           />
//         ) : (
//           <FaUserCircle size={28} className="text-gray-700 hover:text-gray-900" />
//         )}
//         <span className="hidden md:inline text-md font-medium text-gray-800">
//           {user.name?.split(" ")[0]}
//         </span>
//       </button>

//       {showDropdown && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
//           <div className="px-4 py-3 border-b border-gray-100">
//             <p className="text-md font-semibold text-gray-900">{user.name}</p>
//             <p className="text-xs text-gray-500 truncate">{user.email}</p>
//           </div>
//           <button
//             onClick={() => {
//               setShowDropdown(false);
//               navigate("/profile");
//               if (onClick) onClick();
//             }}
//             className="flex items-center w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
//           >
//             <FaUser className="mr-3" />
//             My Profile
//           </button>
//           <button
//             onClick={() => {
//               setShowDropdown(false);
//               navigate("/settings");
//             }}
//             className="flex items-center w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
//           >
//             <FaCog className="mr-3" />
//             Settings
//           </button>
//           <div className="border-t border-gray-100 my-1"></div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center w-full px-4 py-2 text-md text-red-600 hover:bg-gray-100"
//           >
//             <FaSignOutAlt className="mr-3" />
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   ) : (
//     <div className="flex items-center gap-3">
//       <NavLink
//         to="/signup"
//         onClick={onClick}
//         className="bg-gray-900 text-white text-md font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
//       >
//         Sign up
//       </NavLink>
//       <NavLink
//         to="/login"
//         onClick={onClick}
//         className="text-md font-medium text-gray-900 hover:text-gray-600 transition-colors"
//       >
//         Login
//       </NavLink>
//     </div>
//   );

//   if (type === "nav") return <>{NavLinks}</>;
//   if (type === "auth") return <>{AuthLinks}</>;
//   return (
//     <>
//       {NavLinks}
//       {AuthLinks}
//     </>
//   );
// }

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaCog, FaSignOutAlt, FaUser, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function HeaderLinks({ type = "all", onClick, onLoginClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-md font-medium text-[#0d9e75] border-b-2 border-[#0d9e75] pb-0.5"
      : "text-md font-medium hover:text-[#0a7d5c] transition-colors";

  const handleLogout = useCallback(async () => {
    try {
      if (user?.id) {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          user_id: user.id,
          ip_address: "",
          user_agent: navigator.userAgent,
          role: user.role,
        });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowDropdown(false);
      navigate("/login");
    }
  }, [user?.id, navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const NavLinks = (
    <>
      <NavLink to="/feed" onClick={onClick} className={navLinkClass}>Feed</NavLink>
      <NavLink to="/signals" onClick={onClick} className={navLinkClass}>Signals</NavLink>
      <NavLink to="/mentors" onClick={onClick} className={navLinkClass}>Mentors</NavLink>
      <NavLink to="/subscriptions" onClick={onClick} className={navLinkClass}>Subscriptions</NavLink>
    </>
  );

  const AuthLinks = user?.name ? (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 focus:outline-none border p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <FaUserCircle size={28} className="text-gray-700 hover:text-gray-900" />
        )}
        <span className="hidden md:inline text-md font-medium text-gray-800">
          {user.name?.split(" ")[0]}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-md font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setShowDropdown(false);
              navigate("/profile");
              if (onClick) onClick();
            }}
            className="flex items-center w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
          >
            <FaUser className="mr-3" />
            My Profile
          </button>

          <button
            onClick={() => {
              setShowDropdown(false);
              navigate("/settings");
            }}
            className="flex items-center w-full px-4 py-2 text-md text-gray-700 hover:bg-gray-100"
          >
            <FaCog className="mr-3" />
            Settings
          </button>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-md text-red-600 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <NavLink
        to="/login"
        onClick={onClick}
        className="bg-gray-900 text-white text-md font-medium px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
      >
        Login
      </NavLink>
    </div>
  );

  if (type === "nav") return <>{NavLinks}</>;
  if (type === "auth") return <>{AuthLinks}</>;
  return (
    <>
      {NavLinks}
      {AuthLinks}
    </>
  );
}