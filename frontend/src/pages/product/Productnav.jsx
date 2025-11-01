import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaUserCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll effect implementation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-black text-white sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'shadow-2xl bg-black/95 backdrop-blur-xl border-b border-cyan-500/20' 
        : 'shadow-lg bg-black/90 backdrop-blur-lg border-b border-cyan-500/10'
    }`}>
      {/* 3D Floating Effect Container */}
      <div className="relative">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-ping" />
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-cyan-400/5 rounded-full blur-xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="flex justify-between items-center">
            
            {/* Brand Logo - 3D Text Effect */}
            <div className="flex-shrink-0">
              <Link to="/" className="group">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500 drop-shadow-2xl">
                  GoVicky Go
                </div>
                <div className="text-xs text-cyan-400/60 font-medium tracking-widest mt-1">
                  TRAVEL GEAR
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links - 3D Hover Effects */}
            <nav className="hidden lg:flex items-center space-x-10 text-base font-semibold mx-12">
              <Link 
                to="/category/backpacks" 
                className="relative group hover:text-cyan-400 transition-all duration-300 whitespace-nowrap py-2"
              >
                <span className="relative z-10">Backpacks</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/category/tents" 
                className="relative group hover:text-cyan-400 transition-all duration-300 whitespace-nowrap py-2"
              >
                <span className="relative z-10">Tents</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/category/sleeping-bags" 
                className="relative group hover:text-cyan-400 transition-all duration-300 whitespace-nowrap py-2"
              >
                <span className="relative z-10">Sleeping Bags</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              
              <Link 
                to="/category/clothing" 
                className="relative group hover:text-cyan-400 transition-all duration-300 whitespace-nowrap py-2"
              >
                <span className="relative z-10">Clothing</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>

              <Link 
                to="/category/accessories" 
                className="relative group hover:text-cyan-400 transition-all duration-300 whitespace-nowrap py-2"
              >
                <span className="relative z-10">Accessories</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            </nav>

            {/* Search Bar - 3D Glass Effect */}
            <div className="hidden md:flex flex-grow max-w-md">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <input
                  type="text"
                  placeholder="Search travel gear..."
                  className="relative w-full bg-black/50 text-white py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200/50 border border-cyan-500/30 backdrop-blur-sm"
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Action Icons - 3D Floating Icons */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              
              {/* Search Icon - Mobile */}
              <button className="md:hidden p-3 hover:text-cyan-400 transition-all duration-300 hover:scale-110 group">
                <div className="relative">
                  <FaSearch className="text-xl" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </button>

              {/* Wishlist - 3D Pulse Effect */}
              <Link to="/wishlist" className="relative p-3 group hover:text-red-400 transition-all duration-300 hover:scale-110">
                <div className="relative">
                  <FaHeart className="text-xl" />
                  <div className="absolute inset-0 bg-red-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-black shadow-lg animate-pulse">
                  2
                </span>
              </Link>

              {/* Cart - 3D Glow Effect */}
              <Link to="/cart" className="relative p-3 group hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                <div className="relative">
                  <FaShoppingCart className="text-xl" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
                <span className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-black font-bold shadow-lg animate-bounce">
                  3
                </span>
              </Link>

              {/* Profile - 3D Rotate Effect */}
              <Link to="/profile" className="p-3 group hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                <div className="relative">
                  <FaUserCircle className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </Link>

              {/* Mobile Menu Button - 3D Transform */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 hover:text-cyan-400 transition-all duration-300 hover:scale-110 group ml-2"
              >
                <div className="relative">
                  {isMenuOpen ? 
                    <FaTimes className="text-xl group-hover:rotate-90 transition-transform duration-300" /> : 
                    <FaBars className="text-xl group-hover:rotate-180 transition-transform duration-300" />
                  }
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - 3D Glass Morphism */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-cyan-500/20 py-6 px-6 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          {/* Mobile Search - Glass Effect */}
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <input
              type="text"
              placeholder="Search travel gear..."
              className="relative w-full bg-black/50 text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-cyan-200/50 border border-cyan-500/30 backdrop-blur-sm"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
          </div>
          
          {/* Mobile Navigation Links - 3D Cards */}
          <nav className="flex flex-col space-y-4 relative z-10">
            <div className="text-cyan-400 text-sm font-semibold mb-3 tracking-widest border-b border-cyan-500/30 pb-2">
              PRODUCT CATEGORIES
            </div>
            
            {[
              { to: "/category/backpacks", label: "Backpacks" },
              { to: "/category/tents", label: "Tents" },
              { to: "/category/sleeping-bags", label: "Sleeping Bags" },
              { to: "/category/clothing", label: "Clothing" },
              { to: "/category/accessories", label: "Accessories" }
            ].map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="group py-3 px-4 hover:text-cyan-400 transition-all duration-300 rounded-lg border border-transparent hover:border-cyan-500/30 hover:bg-cyan-500/5 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.label}</span>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Footer */}
          <div className="relative z-10 mt-8 pt-4 border-t border-cyan-500/20">
            <div className="flex justify-between items-center text-cyan-400/60 text-sm">
              <div>Adventure Awaits</div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150" />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ProductNavbar;