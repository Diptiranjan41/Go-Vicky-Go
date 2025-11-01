import React from "react";
import ProductHero from "./ProductHero";     // Ensure all paths are case-correct
import Productnav from "./Productnav";
import ProductFilter from "./Productfilter";

import "./ProductFilter.css";               // Only keep this if it has important styles

const Product = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-black shadow-md">
        <Productnav />
      </header>

      {/* Hero Section */}
      <section className="px-4 md:px-8 lg:px-16 py-8">
        <ProductHero />
      </section>

      {/* Filter Section */}
      <section className="px-4 md:px-8 lg:px-16 py-6">
        <ProductFilter />
      </section>
  

      {/* Shop by Category */}
      <section className="px-4 md:px-8 lg:px-16 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-cyan-400">
          Shop by Category
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Find the best gear for your travel needs.
        </p>
      </section>
    </div>
  );
};

export default Product;

