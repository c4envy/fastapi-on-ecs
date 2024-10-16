import React, { createContext, useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axiosInstance from '../services/axios';
import { useToast } from "@chakra-ui/react";

// Load Stripe using your public key
const stripePromise = loadStripe("pk_test_51PLQgX2KnKdf1YCEVojH8ER1TVelnSOzUmuNJIJaOadbq1EatVpO2RVndyWTAX0CUmp7fomagqJFkkCQpOJuJB9O00kq1zQolv");

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const createPaymentMethod = async (cardElement, billingDetails) => {
    const stripe = await stripePromise;
    return await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });
  };

  const createPaymentIntent = async (amount, currency, paymentMethodId = null) => {
    const res = await axiosInstance.post('/payment/create-intent', {
      amount,
      currency,
      paymentMethodId,
    });
    return res.data;
  };

  const processPayment = async (clientSecret, paymentMethod) => {
    const stripe = await stripePromise;
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    return { paymentIntent, error };
  };

  const handlePaymentError = (error) => {
    toast({
      title: "Payment Error",
      description: error.message || "An error occurred during payment. Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  const completeOrder = async (cartItems, total, paymentMethod, userId) => {
    try {
      const totalShares = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const res = await axiosInstance.post('/music/complete_order', {
        cart_items: cartItems,
        total_price: total,
        payment_method: paymentMethod,
        buyer_id: userId,
        total_shares: totalShares,
        coupon_code: "None",
      });
      return res.data;
    } catch (error) {
      handlePaymentError(error);
    }
  };

  return (
    <PaymentContext.Provider value={{
      createPaymentMethod,
      createPaymentIntent,
      processPayment,
      completeOrder,
      loading,
      setLoading,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
