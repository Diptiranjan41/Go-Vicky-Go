import React, { useState } from "react";

// --- SVG Icon Components ---
// Replaced react-icons with inline SVGs to resolve import errors.
// The 'currentColor' property allows Tailwind's text color classes to style the icons.

const TrainIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2c-5.52 0-10 .89-10 2v11.5c0 1.93 1.57 3.5 3.5 3.5h13c1.93 0 3.5-1.57 3.5-3.5V4c0-1.11-4.48-2-10-2zm0 2c4.42 0 8 .89 8 2H4c0-1.11 3.58-2 8-2zM4 15.5V8h16v7.5c0 .83-.67 1.5-1.5 1.5h-13C4.67 17 4 16.33 4 15.5z" />
    <path d="M6 20c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    <rect x="11" y="9" width="2" height="4" rx="1" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MenuIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);


const TrainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Routes");

  const navLinks = [
    { href: "#", label: "Routes" },
    { href: "#", label: "Deals" },
    { href: "#", label: "Destinations" },
    { href: "#", label: "Support" },
  ];

  return (
    <nav className="bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4 md:space-x-8">
            <a href="#" className="flex-shrink-0 flex items-center space-x-2">
              <TrainIcon className="h-8 w-8 text-cyan-400" />
              {/* Responsive font size for the brand name */}
              <span className="text-xl sm:text-2xl font-bold text-white">GoVicky Trains</span>
            </a>
            {/* Responsive spacing for nav links */}
            <div className="hidden md:flex space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveLink(link.label)}
                  className={`font-medium transition-colors duration-300 ${
                    activeLink === link.label
                      ? "text-cyan-400"
                      : "text-gray-300 hover:text-cyan-400"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          {/* Responsive spacing for icons and button */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors p-1">
              <HeartIcon className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors p-1">
              <UserIcon className="h-6 w-6" />
            </a>
            <a
              href="#"
              className="bg-cyan-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105"
            >
              Book Tickets
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-cyan-400 hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.label);
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  activeLink === link.label
                    ? "bg-gray-800 text-cyan-400"
                    : "text-gray-300 hover:text-cyan-400 hover:bg-gray-800"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5 space-x-4">
               <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  <HeartIcon className="h-6 w-6" />
               </a>
               <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">
                  <UserIcon className="h-6 w-6" />
               </a>
            </div>
             <div className="mt-3 px-2">
                <a
                  href="#"
                  className="block w-full text-center bg-cyan-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-cyan-500"
                >
                  Book Tickets
                </a>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TrainNav;