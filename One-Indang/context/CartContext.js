import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../services/api';
import { auth } from '../services/supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync user state with Supabase session
  const updateUser = useCallback(async () => {
    try {
      const { user } = await auth.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (error) {
      setCurrentUser(null);
      return null;
    }
  }, []);

  // Get current user on mount
  useEffect(() => {
    updateUser();
  }, [updateUser]);

  // Fetch orders from database when user changes
  const fetchOrders = useCallback(async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    try {
      const response = await ordersAPI.getByUser(currentUser.id);
      if (response.success) {
        const formattedOrders = response.data.map(order => ({
          id: order.id,
          date: new Date(order.order_date).toLocaleString(),
          status: order.status,
          restaurantName: order.restaurant_name,
          total: order.total_amount.toFixed(2),
          address: order.delivery_address,
          paymentMethod: order.payment_method,
          items: order.order_items.map(item => ({
            id: item.id,
            name: item.item_name,
            price: item.item_price,
            qty: item.quantity
          }))
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  // --- FIXED PLACE ORDER LOGIC ---
  const placeOrder = async (orderDetails) => {
    setIsLoading(true);
    
    try {
      // 1. Force a fresh user check to avoid null user_id
      const { user } = await auth.getCurrentUser();
      
      if (!user) {
        throw new Error("User session not found. Please sign in again.");
      }

      // 2. Prepare order data using the guaranteed user ID
      const orderData = {
        user_id: user.id, // Direct from Supabase, not the state
        restaurant_name: orderDetails.restaurantName,
        total_amount: parseFloat(orderDetails.total),
        delivery_address: orderDetails.address,
        payment_method: orderDetails.paymentMethod,
        delivery_note: orderDetails.note || null,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          img: typeof item.img === 'string' ? item.img : null
        }))
      };

      const response = await ordersAPI.create(orderData);
      
      if (response.success) {
        const newOrder = {
          id: response.data.id,
          date: new Date(response.data.order_date).toLocaleString(),
          status: response.data.status,
          restaurantName: response.data.restaurant_name,
          total: response.data.total_amount.toFixed(2),
          address: response.data.delivery_address,
          paymentMethod: response.data.payment_method,
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.qty
          }))
        };
        
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        return { success: true, order: newOrder };
      } else {
        throw new Error(response.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Final Error placing order:', error);
      // Optional: Handle fallback or re-throw
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = () => fetchOrders();

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      orders,
      isLoading,
      addToCart, 
      removeFromCart, 
      clearCart, 
      placeOrder,
      refreshOrders,
      updateUser,
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);