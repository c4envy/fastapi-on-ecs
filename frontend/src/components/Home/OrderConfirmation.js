// components/OrderConfirmation.js
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {

  const navigate = useNavigate();
  const handleContinueShopping = () => {
    navigate('/'); // Navigate to home or shop page
  };
  
  return (
    <Box p={4} textAlign="center">
      <Text fontSize="3xl" mb={4}>Order Confirmation</Text>
      <Text fontSize="xl" mb={4}>Thank you for your purchase! Your order has been placed successfully.</Text>
      <Button colorScheme="teal" onClick={handleContinueShopping}>Continue Shopping</Button>
    </Box>
  );
};

export default OrderConfirmation;
