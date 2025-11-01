// src/bookingPages/Foodpage/FoodNav.jsx
import React, { useState, useMemo } from "react";
import { FaSearch, FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

const FoodNav = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { searchTerm, setSearchTerm } = useSearch();
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/food/address", { state: { cart, total: cartTotal } });
  };

  const totalItemsInCart = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('₹', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  }, [cart]);


  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center text-2xl font-bold text-cyan-400 cursor-pointer hover:scale-105 transition-transform duration-300">
          Go Dine 🍽️
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <input type="text" placeholder="Search food..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-900 text-white placeholder-gray-500 rounded-full py-2 pl-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Wishlist */}
          <div className="relative">
            <button onClick={() => setOpenWishlist(!openWishlist)} className="relative text-white hover:text-cyan-400">
              <FaHeart size={24} className="hover:animate-bounce" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>
            {openWishlist && (
              <div className="absolute right-0 mt-3 w-80 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50">
                <h3 className="font-bold text-lg border-b border-gray-700 pb-2 mb-3">Your Wishlist</h3>
                {wishlist.length === 0 ? ( <p className="text-gray-400">No items in wishlist</p> ) : (
                  <div className="space-y-4 max-h-72 overflow-y-auto">
                    {wishlist.map((item, idx) => (
                      <div key={idx} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3 shadow-md hover:shadow-cyan-500/30 transition">
                        <img src={item.image || "https://via.placeholder.com/60"} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-cyan-400">{item.price}</p>
                        </div>
                        <button onClick={() => removeFromWishlist(item.id)} className="bg-red-500 text-white px-3 py-1 rounded-md font-medium hover:bg-red-600 transition">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <button onClick={() => setOpenCart(!openCart)} className="relative bg-cyan-400 text-black font-semibold py-2 px-5 rounded-full flex items-center space-x-2 hover:scale-105 hover:bg-cyan-500 transition-all duration-300">
              <FaShoppingCart size={20} className="hover:animate-spin" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {totalItemsInCart}
                </span>
              )}
            </button>

            {/* Updated Cart Dropdown */}
            {openCart && (
              <div className="absolute right-0 mt-3 w-96 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50">
                <h3 className="font-bold text-lg border-b border-gray-700 pb-2 mb-3">Your Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-400">Your cart is empty.</p>
                ) : (
                  <>
                  <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3 shadow-md hover:shadow-cyan-500/30 transition">
                        <img src={item.image || "https://via.placeholder.com/60"} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-400">{item.quantity} x {item.price}</p>
                        </div>
                        <div className="flex items-center justify-center rounded-full bg-gray-700 text-white font-bold">
                          <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 transition-colors duration-300 rounded-l-full hover:bg-gray-600" aria-label="Remove one item">-</button>
                          <span className="px-3 text-base">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="px-3 py-1 transition-colors duration-300 rounded-r-full hover:bg-gray-600" aria-label="Add one more item">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                    <div className="border-t border-gray-700 mt-4 pt-4">
                      <div className="flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        {/* ✅ FIX: Changed the currency symbol from $ to ₹ to match the item prices */}
                        <span className="text-cyan-400">₹{cartTotal}</span>
                      </div>
                      <button onClick={handleCheckout} className="w-full mt-4 bg-cyan-500 text-black py-2 rounded-lg font-semibold hover:bg-cyan-600 transition">
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-cyan-400" onClick={() => setOpenMenu(!openMenu)}>
          {openMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {openMenu && (
        <div className="md:hidden bg-gray-900 text-white p-4 space-y-4">
          <input type="text" placeholder="Search food..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-800 text-white rounded-full py-2 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
          {/* You would typically add mobile-specific cart/wishlist buttons here */}
        </div>
      )}
    </nav>
  );
};

export default FoodNav;