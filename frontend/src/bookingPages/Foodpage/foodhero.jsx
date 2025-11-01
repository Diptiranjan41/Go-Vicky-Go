import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext"; // ✅ Use global cart

// --- SVG Cart Icon ---
const FaShoppingCart = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 576 512"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.998l-28.662-128H32C14.328 0 0 14.328 0 32s14.328 32 32 32h81.272l112 480h288c17.672 0 32-14.328 32-32s-14.328-32-32-32H243.867l-16.718-72h294.958c15.625 0 29.566-9.281 34.02-23.681zM160 432c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm320 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
  </svg>
);

// --- Data ---
const foodImages = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop",
];
const popularDishes = [
  {
    name: "Zen Garden Bowl",
    price: "$14.50",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Spicy Pepperoni Pizza",
    price: "$18.00",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Dragon Roll Sushi",
    price: "$22.75",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "The Classic Burger",
    price: "$16.25",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop",
  },
];

// --- Hero Section ---
const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () =>
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % foodImages.length
        ),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-4">
              Your Next <span className="text-cyan-400">Favorite Meal</span>,
              Delivered.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
              Discover delicious food from the best local restaurants, delivered
              right to your doorstep. Fast, fresh, and hassle-free.
            </p>
            <a
              href="#"
              className="inline-block bg-cyan-400 text-black font-bold text-lg rounded-full px-10 py-4 hover:bg-cyan-500 transition-transform duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/20"
            >
              Order Now
            </a>
          </div>

          {/* Image Slider */}
          <div className="lg:w-1/2 relative h-96 w-full lg:h-[500px]">
            {foodImages.map((src, index) => (
              <img
                key={src}
                src={src}
                alt="food"
                className={`absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl shadow-cyan-500/10 transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Popular Dishes ---
const PopularDishesSection = () => {
  const { addToCart } = useCart(); // ✅ global cart function

  return (
    <div className="bg-black text-white py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-2">
          Popular Dishes
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Treat yourself to our most-loved creations.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularDishes.map((dish, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{dish.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold text-cyan-400">
                    {dish.price}
                  </p>
                  <button
                    onClick={() => addToCart(dish)} // ✅ uses global addToCart
                    className="bg-cyan-400 text-black p-3 rounded-full hover:bg-cyan-500 transition-colors duration-300 transform group-hover:scale-110"
                  >
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Export ---
const FoodHero = () => {
  return (
    <>
      <HeroSection />
      <PopularDishesSection />
    </>
  );
};

export default FoodHero;
