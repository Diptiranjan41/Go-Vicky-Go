// src/bookingPages/Foodpage/Food.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FoodHero from "./foodhero"; // only one import
import Footer from "./Footer";
import Menu from "./menu"; 
import { useWishlist } from "../../context/WishlistContext";
import FoodNav from "./FoodNav"; // agar FoodNav use ho raha hai

const Food = () => {
  const [cart, setCart] = useState([]);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const handleAddToCart = (dish) => {
    setCart((prevCart) => [...prevCart, dish]);
  };

  const toggleWishlist = (dish) => {
    const exists = wishlist.some((item) => item.id === dish.id);
    if (exists) {
      removeFromWishlist(dish.id);
    } else {
      addToWishlist(dish);
    }
  };

  const isInWishlist = (dish) => wishlist.some((item) => item.id === dish.id);

  return (
    <div className="bg-black text-white min-h-screen">
      <header className="sticky top-0 z-50 bg-black shadow-md">
        <FoodNav cartCount={cart.length} />
      </header>

      <section className="px-4 md:px-8 lg:px-16 py-8">
        <FoodHero 
          addToCart={handleAddToCart} 
          toggleWishlist={toggleWishlist} 
          isInWishlist={isInWishlist} 
        />
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-8">
        <Menu 
          addToCart={handleAddToCart} 
          toggleWishlist={toggleWishlist} 
          isInWishlist={isInWishlist} 
        />
      </section>



      <Footer />
    </div>
  );
};

export default Food;
