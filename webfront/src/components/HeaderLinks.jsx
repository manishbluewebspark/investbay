// import React, { useState, useRef, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaSignOutAlt, FaUser, FaCog } from "react-icons/fa";

// export default function HeaderLinks({ onClick, onLoginClick }) {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
  
//   const linkClass = ({ isActive }) =>
//     isActive ? "active-text" : "default-text";

//   const user = JSON.parse(localStorage.getItem("user")) || {};
  
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setShowDropdown(false);
//     navigate("/login");
//   };




//   const handleProfileClick = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const handleProfileNavigate = () => {
//     setShowDropdown(false);
//     navigate("/profile");
//     if (onClick) onClick();
//   };

//   return (
//     <>
//       <NavLink to="/feed" onClick={onClick} className={linkClass}>
//         Feed
//       </NavLink>
//       <NavLink to="/signals" onClick={onClick} className={linkClass}>
//         Signals
//       </NavLink>
//       <NavLink to="/mentors" onClick={onClick} className={linkClass}>
//         Mentors
//       </NavLink>
//       <NavLink to="/subscriptions" onClick={onClick} className={linkClass}>
//         Subscriptions
//       </NavLink>
//       {/* <NavLink to="/learn" onClick={onClick} className={linkClass}>
//         Learn
//       </NavLink> */}
//       <NavLink to="/courses" onClick={onClick} className={linkClass}>
//         Course
//       </NavLink>

//       {user?.name ? (
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={handleProfileClick}
//             className="flex items-center space-x-2 focus:outline-none"
//           >
//             {user.profilePicture ? (
//               <img
//                 src={user.profilePicture}
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full object-cover border-2 border-gray-300"
//               />
//             ) : (
//               <FaUserCircle size={28} className="text-gray-700 hover:text-gray-900" />
//             )}
//             <span className="hidden md:inline text-sm font-medium">
//               {user.name?.split(" ")[0]}
//             </span>
//           </button>

//           {showDropdown && (
//             <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
//               <div className="px-4 py-3 border-b border-gray-100">
//                 <p className="text-sm font-semibold text-gray-900">{user.name}</p>
//                 <p className="text-xs text-gray-500 truncate">{user.email}</p>
//               </div>
              
//               <button
//                 onClick={handleProfileNavigate}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 <FaUser className="mr-3" />
//                 My Profile
//               </button>
              
//               <button
//                 onClick={() => {
//                   setShowDropdown(false);
//                   navigate("/settings");
//                 }}
//                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 <FaCog className="mr-3" />
//                 Settings
//               </button>
              
//               <div className="border-t border-gray-100 my-1"></div>
              
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//               >
//                 <FaSignOutAlt className="mr-3" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <NavLink
//           to="/login"
//           type="button"
//           className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
//         >
//           Login
//         </NavLink>
//       )}
//     </>
//   );
// }

import axios from 'axios'; // Add this import at top
import { useCallback, useEffect, useRef, useState } from 'react'; // Add this import
import { FaCog, FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

export default function HeaderLinks({ onClick, onLoginClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const linkClass = ({ isActive }) =>
    isActive ? "active-text" : "default-text";

  const user = JSON.parse(localStorage.getItem("user")) || {};
  
  // 🔥 Updated handleLogout with API call
  const handleLogout = useCallback(async () => {
    try {
      // First call logout API to log in backend
      if (user?.id) {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {
          user_id: user.id,
          ip_address: '', // Backend will handle from req.ip
          user_agent: navigator.userAgent,
          role: user.role
        });
        console.log('✅ Logout log sent to backend!');
      }
    } catch (error) {
      console.error('❌ Logout API failed:', error);
      // Don't block logout even if API fails
    } finally {
      // Always clear storage and navigate
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setShowDropdown(false);
      navigate("/login");
    }
  }, [user?.id, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileNavigate = () => {
    setShowDropdown(false);
    navigate("/profile");
    if (onClick) onClick();
  };

  return (
    <>
      <NavLink to="/feed" onClick={onClick} className={linkClass}>
        Feed
      </NavLink>
      <NavLink to="/signals" onClick={onClick} className={linkClass}>
        Signals
      </NavLink>
      <NavLink to="/mentors" onClick={onClick} className={linkClass}>
        Mentors
      </NavLink>
      <NavLink to="/subscriptions" onClick={onClick} className={linkClass}>
        Subscriptions
      </NavLink>
      <NavLink to="/courses" onClick={onClick} className={linkClass}>
        Course
      </NavLink>

      {user?.name ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center space-x-2 focus:outline-none"
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
            <span className="hidden md:inline text-sm font-medium">
              {user.name?.split(" ")[0]}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              
              <button
                onClick={handleProfileNavigate}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaUser className="mr-3" />
                My Profile
              </button>
              
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/settings");
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaCog className="mr-3" />
                Settings
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <NavLink
          to="/login"
          type="button"
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
        >
          Login
        </NavLink>
      )}
    </>
  );
}



