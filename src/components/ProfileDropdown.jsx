import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProfileDropdown({ logout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (!logout) {
      console.error("Logout function not provided");
      return;
    }
    try {
      await logout();
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)} className="focus:outline-none">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-400 shadow-md"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </button>

      <div
        className={`absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl ring-1 ring-black/5 z-50 transform transition-all duration-200 origin-top-right ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="py-2">
          <Link
            to="/profile"
            className="block px-5 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 rounded-t-lg transition-all"
            onClick={() => setOpen(false)}
          >
            👤 Profile
          </Link>
          <Link
            to="/terms-and-conditions"
            className="block px-5 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-all"
            onClick={() => setOpen(false)}
          >
            📜 Terms & Conditions
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-2 text-sm text-red-600 hover:bg-red-50 transition-all rounded-b-lg"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
