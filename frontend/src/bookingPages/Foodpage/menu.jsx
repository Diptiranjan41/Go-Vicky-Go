import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSearch } from "../../context/SearchContext";

// --- Helper Icons (No Changes) ---
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
    viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
      a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
      1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
// --- End Helper Icons ---

const FoodHero = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { searchTerm } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const menuCategories = ["Starters", "Main Course", "Desserts", "Drinks"];
  const [foodItems, setFoodItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added for better UX

  // --- Fetch Food Items ---
  useEffect(() => {
    // ✅ FIX 1: Changed filename to 'structured_food_items.json' to match your file.
    fetch("/food_items_large.json")
      .then(res => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then(data => {
        // This logic correctly handles the nested structure of your JSON
        const allItems = Object.values(data).flat();
        const formatted = allItems.map((item, index) => ({
          id: item.id || `item-${index + 1}`,
          name: item.name || "Unknown Item",
          price: `₹${item.price_inr || 0}`,
          // Your JSON file does not contain an 'image' field.
          // The code will use the placeholder URL until image paths are added.
          image: item.image || "https://placehold.co/600x400/333/fff?text=" + (item.name || "Food"),
          category: item.category?.trim() || "Others",
        }));
        setFoodItems(formatted);
      })
      .catch(err => console.error("Error loading or parsing food items:", err))
      .finally(() => setIsLoading(false)); // Stop loading state
  }, []);

  // --- Filtered Items ---
  const filteredItems = foodItems.filter(dish => {
    const selected = selectedCategory.toLowerCase();
    const dishCategory = (dish.category || "").toLowerCase();
    
    // ✅ FIX 2: Correctly matches plural button names (e.g., "Starters")
    // with singular JSON categories (e.g., "Starter").
    return selected.includes(dishCategory) &&
           dish.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Wishlist Helpers ---
  const toggleWishlist = (dish) => {
    const exists = wishlist.some(item => item.id === dish.id);
    exists ? removeFromWishlist(dish.id) : addToWishlist(dish);
  };
  const isInWishlist = (dish) => wishlist.some(item => item.id === dish.id);

  return (
    <div className="min-h-screen w-full bg-black text-white"
      style={{ backgroundImage: "linear-gradient(to bottom right, #000000, #0a192f)" }}>
      <div className="container mx-auto px-4 py-16">

        {/* --- Header --- */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Our <span className="text-cyan-400">Menu</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Explore a wide range of dishes to satisfy your cravings.
          </p>
        </header>

        {/* --- Category Tabs --- */}
        <div className="flex justify-center gap-4 md:gap-6 flex-wrap mb-12">
          {menuCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-base font-semibold cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 ${
                selectedCategory === cat
                  ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20"
                  : "bg-gray-800/60 hover:bg-cyan-400 hover:text-black border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- Food Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <p className="text-gray-400 col-span-full text-center text-xl">Loading menu...</p>
          ) : filteredItems.length > 0 ? filteredItems.map(dish => {
            const cartItem = cart.find(item => item.id === dish.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;

            return (
              <div key={dish.id}
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-2 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-400/10">

                {/* --- Dish Image --- */}
                <div className="relative mb-5 h-48 overflow-hidden rounded-lg">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400/000000/E0E0E0?text=Image+Not+Found";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                </div>

                {/* --- Dish Info --- */}
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white truncate">{dish.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-semibold text-cyan-400">{dish.price}</p>

                    {/* --- Actions --- */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleWishlist(dish)}
                        className={`p-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 ${
                          isInWishlist(dish) ? "bg-red-500/20 text-red-400 hover:bg-red-500/40" : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}>
                        <HeartIcon />
                      </button>

                      {/* --- Cart Control --- */}
                      {quantityInCart === 0 ? (
                        <button onClick={() => addToCart(dish)}
                          className="p-3 rounded-full bg-cyan-400 text-black transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-white">
                          <ShoppingCartIcon />
                        </button>
                      ) : (
                        <div className="flex items-center justify-center rounded-full bg-cyan-400 text-black font-bold h-[40px]">
                          <button onClick={() => removeFromCart(dish.id)}
                            className="px-3 self-stretch transition-colors duration-300 rounded-l-full hover:bg-cyan-300">-</button>
                          <span className="px-3 text-base">{quantityInCart}</span>
                          <button onClick={() => addToCart(dish)}
                            className="px-3 self-stretch transition-colors duration-300 rounded-r-full hover:bg-cyan-300">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <p className="text-gray-400 col-span-full text-center text-xl">
              No dishes found for this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodHero;