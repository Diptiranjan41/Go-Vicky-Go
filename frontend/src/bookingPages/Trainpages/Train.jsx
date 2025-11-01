import React from "react";
import TrainHero from "./Trainhero";
import TrainNav from "./TrainNav";

import { useWishlist } from "../../context/WishlistContext";

const Train = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const toggleWishlist = (train) => {
    const exists = wishlist.some((item) => item.id === train.id);
    if (exists) {
      removeFromWishlist(train.id);
    } else {
      addToWishlist(train);
    }
  };

  const isInWishlist = (train) =>
    wishlist.some((item) => item.id === train.id);

  return (
    <div className="bg-black min-h-screen text-cyan-100">
      {/* 🔹 Header (transparent / dark) */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md shadow-md">
        <TrainNav />
      </header>

      {/* 🔹 Hero Section */}
      <section className="px-4 md:px-8 lg:px-16 py-8">
        <TrainHero
          toggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
        />
      </section>
    </div>
  );
};

export default Train;
