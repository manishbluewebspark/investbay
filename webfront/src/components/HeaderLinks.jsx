import React from "react";
import { NavLink } from "react-router-dom";

export default function HeaderLinks({ onClick, onLoginClick }) {
  const linkClass = ({ isActive }) =>
    isActive ? "active-text" : "default-text";

  return (
    <>
      <NavLink to="/signals" onClick={onClick} className={linkClass}>
        Feed
      </NavLink>
      <NavLink to="/feed" onClick={onClick} className={linkClass}>
        Signals
      </NavLink>
      <NavLink to="/mentors" onClick={onClick} className={linkClass}>
        Mentors
      </NavLink>
      <NavLink to="/subscriptions" onClick={onClick} className={linkClass}>
        Subscriptions
      </NavLink>
      <NavLink to="/learn" onClick={onClick} className={linkClass}>
        Learn
      </NavLink>
      <NavLink to="/course" onClick={onClick} className={linkClass}>
        Course
      </NavLink>
      {/* <NavLink
        to="/login"
        onClick={onClick}
        className={({ isActive }) =>
          isActive
            ? "active-text border border-teal-500 px-6 py-2 rounded-full"
            : "bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
        }
      >
        Login
      </NavLink> */}
      <NavLink
        type="button"
        onClick={onLoginClick}
        className="bg-gray-900 text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-gray-800"
      >
        Login
      </NavLink>


    </>
  );
}
