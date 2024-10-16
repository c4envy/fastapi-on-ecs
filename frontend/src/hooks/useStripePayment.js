// hooks/useStripePayment.js
import { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import axiosInstance from '../services/axios';

const useStripePayment = () => {
    const stripe = useStripe();
    const [loading, setLoading] = useState(false);
    const createPaymentIntent = async (amount, currency, payment_method) => {

        try {
            setLoading(true);
            const response = await axiosInstance.post(`/stripe/create_payment_intent_?amount=${amount}&currency=${currency}&payment_method=${payment_method}`, 
      
            );
            setLoading(false);
            console.log(response);
            if (response.data && response.data.client_secret) {
                return response.data.client_secret;
            } else {
                throw new Error('Client secret not found in the response');
            }
        } catch (error) {
            setLoading(false);
            console.error("Error creating payment intent:", error);
            throw error;
        }
    };


    const getPaymentMethods = async () => {
        try {
            const response = await axiosInstance.get(`/stripe/get_all_payment_methods`)
            console.log(response)
            return response.data;
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            throw error;
        }
    }


    const createPaymentMethod = async (cardElement, billingDetails) => {
        try {
            const { paymentMethod, error } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: billingDetails
            });

            if (error) {
                throw error;
            }

            return paymentMethod;
        } catch (error) {
            console.error("Error creating payment method:", error);
            throw error;
        }
    };

    const processPayment = async (paymentMethodId, amount, currency) => {
        try {
            const response = await axiosInstance.post(`/stripe/process_payment`, {
                paymentMethodId, amount, currency
            });
            return response.data.paymentIntent;
        } catch (error) {
            console.error("Error processing payment:", error);
            throw error;
        }
    };

    const completeOrderByArtist = async (paymentMethodId, trackDetails) => {
        try {
            setLoading(true);
            const response = await axiosInstance.post(`/complete-order-artist`, {
                paymentMethodId,
                trackDetails,  // Send necessary track details for order completion
            });
            setLoading(false);
            return response.data;
        } catch (error) {
            setLoading(false);
            console.error("Error completing order:", error);
            throw error;
        }
    };

    return {
        completeOrderByArtist,
        createPaymentIntent,
        getPaymentMethods,
        createPaymentMethod,
        processPayment,
        loading,
        setLoading
    };
};

export default useStripePayment;
