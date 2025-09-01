import React, { useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setQuery("");
      setIsOpen(false);
    }
  };

  const linkClass = ({ isActive }) =>
    isActive ? "text-blue-400 font-bold" : "hover:text-blue-400";

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold tracking-wide">
          Rise of Coding <span className="text-blue-400">Movies & TV</span>
        </h1>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-6 items-center relative"
        >
          <FaSearch className="absolute left-3 text-gray-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies or series..."
            className="w-full pl-10 pr-4 py-2 rounded-lg  bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 text-sm font-medium">
          <li>
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/movies" className={linkClass}>
              Movies
            </NavLink>
          </li>
          <li>
            <NavLink to="/tvSeries" className={linkClass}>
              TV Series
            </NavLink>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-slideDown">
          <form onSubmit={handleSearch} className="p-4 relative">
            <FaSearch
              className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies or series..."
              className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
          <ul className="flex flex-col p-4 gap-4 text-sm font-medium">
            <li>
              <NavLink
                to="/"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tvSeries"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                TV Series
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
