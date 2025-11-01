// src/context/CartContext.js

import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item or increment quantity
  const addToCart = (itemToAdd) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        // If item exists, map over cart and update its quantity
        return prevCart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // Remove item or decrement quantity
  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemId);

      // If item quantity is 1, filter it out (remove from cart)
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== itemId);
      } else {
        // Otherwise, just decrement the quantity
        return prevCart.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  const value = { cart, addToCart, removeFromCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};