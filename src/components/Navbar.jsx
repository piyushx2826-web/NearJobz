import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const profileImage = user?.user_metadata?.avatar_url;
  const firstLetter = user?.email?.charAt(0).toUpperCase();

  return (
    <nav className="bg-white text-gray-800 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
     
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight text-gray-800 hover:scale-105 transition-transform duration-200"
        >
          Near<span className="text-gray-500">Jobz</span>
        </Link>

      
        <div className="flex items-center space-x-4 relative">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="font-medium hover:text-gray-600 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/post-job"
                className="font-medium hover:text-gray-600 transition duration-200"
              >
                Post Job
              </Link>

              
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-2 py-1 rounded-full hover:ring-2 ring-gray-300 transition duration-300 focus:outline-none"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-400 shadow-sm"
                    />
                  ) : (
                    <span className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-800 font-bold text-xl rounded-full shadow-sm">
                      {firstLetter}
                    </span>
                  )}
                </button>

                <div
                  className={`absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-md shadow-lg transition-all duration-300 origin-top transform ${
                    dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
                  }`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/terms-and-conditions"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition font-medium"
                  >
                    Terms & Conditions
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-medium transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium hover:text-gray-600 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gray-800 text-white px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-gray-900 transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
