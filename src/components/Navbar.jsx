import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SujiLogo from "./SujiLogo";

const navItems = [
  { label: "HOME", path: "/" },
  {
    label: "ABOUT US",
    submenu: [
      { label: "About Us", path: "/about#us" },
      { label: "Our Mission", path: "/about#mission" },
      { label: "Our Team", path: "/about#team" },
    ],
  },
  {
    label: "SERVICES",
    submenu: [],
  },
  {
    label: "CALCULATORS",
    path: "/calculators",
  },
  { label: "CONTACT", path: "/contactus" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hideTopBar, setHideTopBar] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleNavItemClick = (item, index) => {
    if (item.submenu) {
      toggleDropdown(index);
    } else {
      navigate(item.path);
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative z-45">
      {/* Top Contact Bar */}
      <div
        className={`bg-gradient-to-r from-blue-800 to-indigo-900 text-white text-sm px-4 transition-transform duration-500 ${
          hideTopBar ? "-translate-y-full" : "translate-y-0"
        } fixed top-0 left-0 w-full z-[100]`}
      ></div>

      {/* Main Navbar */}
      <nav className="fixed w-full left-0 transition-all duration-300 z-[90] shadow-sm bg-white">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <SujiLogo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 font-medium text-gray-800 relative">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.submenu && setOpenDropdown(index)}
                onMouseLeave={() => item.submenu && setOpenDropdown(null)}
              >
                <button
                  onClick={() => handleNavItemClick(item, index)}
                  className={`hover:text-blue-600 flex items-center gap-1 transition-colors ${
                    openDropdown === index ? "text-blue-600" : ""
                  }`}
                >
                  {item.label}
                  {item.submenu && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Desktop Dropdown */}
                <AnimatePresence>
                  {openDropdown === index && item.submenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-10 left-0 bg-white rounded-lg shadow-xl py-2 px-3 min-w-[220px] z-[120] border border-gray-100"
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <motion.div
                          key={subIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                          onClick={() => {
                            navigate(subItem.path);
                            setOpenDropdown(null);
                          }}
                          className="hover:bg-blue-50 px-3 py-2 rounded text-sm text-gray-700 cursor-pointer transition-colors hover:text-blue-600"
                        >
                          {subItem.label}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-600 pr-5 transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 right-0 w-3/4 max-w-sm h-full bg-white z-[110] shadow-xl p-6 space-y-4 overflow-y-auto"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-gray-800 hover:text-blue-600"
            >
              <X size={28} />
            </button>

            <div className="mt-6 space-y-2">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-4 text-xs"
                >
                  <button
                    onClick={() => handleNavItemClick(item, index)}
                    className={`w-full text-left font-semibold text-xs md:text-lg ${
                      item.submenu
                        ? "text-gray-900"
                        : "text-gray-800 hover:text-blue-600"
                    } py-1 flex justify-between items-center`}
                  >
                    {item.label}
                    {item.submenu && (
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${
                          openDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {/* Mobile Submenu */}
                  {item.submenu && openDropdown === index && (
                    <div className="ml-4 space-y-2 mt-2">
                      {item.submenu.map((sub, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            navigate(sub.path);
                            setIsMenuOpen(false);
                          }}
                          className="pl-3 py-2 text-gray-700 hover:text-blue-600 cursor-pointer flex items-center"
                        >
                          <span className="text-blue-500 mr-2">•</span>
                          {sub.label}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
              <a
                href="mailto:info@sujicareer.com"
                className="text-gray-700 hover:text-blue-600 flex items-center mb-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@sujicareer.com
              </a>
              <a
                href="tel:+919970436533"
                className="text-gray-700 hover:text-blue-600 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 7020295747
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
