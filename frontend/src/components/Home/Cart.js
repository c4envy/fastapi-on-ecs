import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import {
  Box,
  Text,
  Button,
  Image,
  Grid,
  GridItem,
  IconButton,
  useToast,

  Flex,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import QuantityInput from "./QuantityInput"
import axiosInstance from "../../services/axios";

const Cart = () => {
  const { cartItems, removeFromCart, decreaseQuantity, clearCart, increaseQuantity, changeQuantity, updateCart } = useCart();
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      await updateCart();
    };
    fetchCart();
  }, []);

  const totalAmount = cartItems.reduce((total, item) => total + item.price_per_share * item.quantity, 0);

  const handleCheckout = () => {
    updateCart()
    let checkAvailability = cartItems.findIndex((item) => item.quantity > item.available_shares);
  
    if(checkAvailability !== -1){
      toast({
        title: "Item quantity is more than available shares",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }



    if (auth.isAuthenticated) {
      if (cartItems.findIndex((it) => it.publisher.email === auth.user.email) !== -1) {
        toast({
          title: "Item cannot be purchased by its publisher",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        navigate("/checkout");
      }
    } else {
      navigate("/login");
    }
  };

  const handleQuantityChange = (index, value) => {
    if (value >= 0) {
      changeQuantity(index, parseInt(value));
    }
  };

  return (
    <Box p={4} borderRadius="md" boxShadow="md">
      <Grid
        templateColumns={{ base: "1fr 3fr", md: "1fr 1fr 1fr 2fr" }}
        gap={0}
        p={5}
        templateRows={{ base: "1fr 1fr", sm: "1fr" }}
        align="center"
        justifyItems={{base:"center"}}
        bg="secondary.900"
        color="primary.100"
        borderRadius="md"
        boxShadow="md"
        display={{ base: "none", md: "grid" }}
      >
        <GridItem >
          <Text fontSize="lg">Item</Text>
        </GridItem>
        <GridItem justifySelf="center" >
          <Text fontSize="lg">Available Shares</Text>
        </GridItem>
        <GridItem >
          <Text fontSize="lg">Price</Text>
        </GridItem>
        <GridItem >
          <Text fontSize="lg">Quantity</Text>
        </GridItem>
      </Grid>
      {cartItems.length === 0 ? (
        <Text color="white">Your cart is empty.</Text>
      ) : (
        <Box>
          {cartItems.map((item, index) => (
            <Grid
              key={index}
              templateColumns={{ base: "1fr 3fr", md: "1fr 1fr 1fr 2fr" }}
              templateRows={{ base: "2fr 1fr 1fr", md: "1fr" }}
              gap={{base:3, md:1}}
              p={{base:4,md:3}}
              align={{base:"left", md:"center"}}
              alignItems="center"
              justifyItems={{base:"flex-start", md:"center"}}
              // bg={auth.isAuthenticated && item.publisher.email === auth.user.email ? "#770737" : "secondary.100"}
              bg="secondary.100"
              borderRadius="md"
              boxShadow="md"
              color="primary.900"
              m={3}

            >

              <GridItem gridColumn={{ base: "1/2", md: "1/2" }} gridRow={{ base: "1/4" , md:"1/2"}} w={{base:"auto"}} display="flex" alignItems="center" >
                <Image src={item.image_url} alt={item.track_name} borderRadius="lg" w="4rem" />
                <Text display={{ base: "none", md: "block" }} ml={{base:4,md:4}}>{item.track_name}</Text>
              </GridItem >
              <GridItem gridColumn="2/3"  display={{ base: "none", md: "block" }} gridRow={{ base: "2/3" , md:"1/2"}}>
                <Text fontSize="lg">{item.available_shares}</Text>
              </GridItem>
              <GridItem gridColumn={{ base: "2/3", md: "3/4" }} gridRow={{ base: "1/4" , md:"1/2"}} >
                <Text display={{ base: "block", md: "none" }} ml={{base:0,md:4}}>{item.track_name}</Text>
                <Text fontSize={{ base: "2xl", md: "lg" }} >${item.price_per_share}</Text>
              </GridItem>

              <GridItem gridColumn={{ base: "1/3", md: "4/5" }} gridRow={{ base: "4/5" , md:"1/2"}} display="flex" alignItems="center" justifyContent="space-between" >

                <QuantityInput
                  value={item.quantity === 0 ? "" : item.quantity}
                  min={0}
                  max={item.available_shares}
                  onIncrease={() => increaseQuantity(index)}
                  onDecrease={() => decreaseQuantity(index)}
                  onChange={(value) => handleQuantityChange(index, value)}
                  color={item.quantity > item.available_shares ? "red" : "primary.100"}
                />
                <IconButton
                  icon={<FaTrash />}
                  colorScheme="red"
                  size="sm"
                  ml={{base:2, md:4}}
                  onClick={() => removeFromCart(index)}
                  aria-label={`Remove ${item.track_name} from cart`}
                />
              </GridItem>
            </Grid>
          ))}
          <Flex justifyContent="space-between" alignItems="center" m={4}>
            <Box>
              <Text fontWeight="bold" color="white">Total: ${totalAmount.toFixed(2)}</Text>
              <Button size="sm" mt={2} onClick={clearCart}>Clear Cart</Button>
            </Box>
            <Button size="lg" colorScheme="green" onClick={handleCheckout}>Checkout</Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
