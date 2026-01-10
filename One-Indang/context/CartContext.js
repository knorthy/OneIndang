import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]); // NEW: Store order history

  // Add Item to Cart
  const addToCart = (item, restaurantName) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1, restaurant: restaurantName }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing?.qty > 1) {
        return prev.map((i) => i.id === itemId ? { ...i, qty: i.qty - 1 } : i);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const clearCart = () => setCartItems([]);

  // NEW: Place Order Function
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now().toString(), // Unique ID based on time
      date: new Date().toLocaleString(),
      status: 'Preparing', // Default status
      items: [...cartItems], // Copy current cart
      ...orderDetails, // Spread address, total, restaurant name
    };

    setOrders((prev) => [newOrder, ...prev]); // Add to top of list
    clearCart(); // Empty the cart
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      orders, // Export orders
      addToCart, 
      removeFromCart, 
      clearCart, 
      placeOrder, // Export action
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);