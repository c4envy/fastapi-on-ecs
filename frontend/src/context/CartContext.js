import React, { createContext, useContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axiosInstance from "../services/axios";

const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// CartProvider component to wrap around components that need access to the cart context
export const CartProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies(["cart"]);
  const [cartItems, setCartItems] = useState(cookies.cart || []);

  // Update the cart cookie whenever cartItems changes
  useEffect(() => {
    setCookie("cart", cartItems, { path: "/" });
  }, [cartItems, setCookie]);

  // Function to add an item to the cart
  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.track_id === item.track_id);
    if (existingItemIndex !== -1) {
      // If item already exists, increase its quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // If item doesn't exist, add it to cart with quantity 1
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  // Function to remove an item from the cart by its index
  const removeFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  // Function to decrease the quantity of an item in the cart
  const decreaseQuantity = (index) => {
    
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1
    } else {
      removeFromCart(index);
      return;
    }
    console.log(updatedCart);
    setCartItems(updatedCart);
  };

  // Function to increase the quantity of an item in the cart
  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };


  const updateCart = async () => {
    try {

      const response = await Promise.all(
        cartItems.map(async (item, index) => {
          const res = await axiosInstance.post("/music/get_track_by_id/" + item.track_id);
    
          return {...res.data, quantity: cartItems[index].quantity};
        })
      );
  
      console.log(response); // This will now log the resolved data from all API calls
      setCartItems(response)
     
  
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  
  // Function to change the quantity of an item in the cart based on input value
  const changeQuantity = (index, newValue) => {
    console.log(newValue);
    const updatedCart = [...cartItems];
    if (newValue > 0) {
      updatedCart[index].quantity = newValue;
    } else {
      updatedCart[index].quantity = 0
    }
    setCartItems(updatedCart);
  };
  

  // Function to clear all items from the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Provide the cart context to children components
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        changeQuantity,
        updateCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};