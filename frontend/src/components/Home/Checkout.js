import React, { useState, useEffect } from 'react';
import { useCart } from "../../context/CartContext";
import {
    Box, Text, Button, Flex, FormControl, FormLabel,
    FormErrorMessage, useToast, Image, Input, SimpleGrid,
    RadioGroup,
    Radio,
    IconButton
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import useStripePayment from '../../hooks/useStripePayment';
import { loadStripe } from '@stripe/stripe-js';
import { FaCreditCard, FaApple, FaBitcoin, FaTimes } from 'react-icons/fa';
import { HStack, Icon } from "@chakra-ui/react";
import axiosInstance from '../../services/axios';
import { useAuth } from "../../hooks/useAuth";

const stripePromise = loadStripe("pk_test_51PLQgX2KnKdf1YCEVojH8ER1TVelnSOzUmuNJIJaOadbq1EatVpO2RVndyWTAX0CUmp7fomagqJFkkCQpOJuJB9O00kq1zQolv");




const PaymentMethodSelect = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => (
    <FormControl w="100%" mt={4} backgroundColor="secondary.900" p={3}>
        <FormLabel fontSize="lg" fontWeight="bold">Payment Method</FormLabel>
        <RadioGroup onChange={setSelectedPaymentMethod} value={selectedPaymentMethod}>
            <HStack spacing={8}>
                <Box display="flex" alignItems="center" cursor="pointer">
                    <Radio value="card">
                        <HStack>
                            <Icon as={FaCreditCard} boxSize={8} />
                            <Text>Card</Text>
                        </HStack>
                    </Radio>
                </Box>
                <Box display="flex" alignItems="center" cursor="pointer">
                    <Radio value="applePay">
                        <HStack>
                            <Icon as={FaApple} boxSize={8} />
                            <Text>Apple Pay</Text>
                        </HStack>
                    </Radio>
                </Box>
                <Box display="flex" alignItems="center" cursor="pointer">
                    <Radio value="cryptoPay">
                        <HStack>
                            <Icon as={FaBitcoin} boxSize={8} />
                            <Text>Crypto Pay</Text>
                        </HStack>
                    </Radio>
                </Box>
            </HStack>
        </RadioGroup>
    </FormControl>

);


const Checkout = ({ elements }) => {

    const calculateTotal = (cartItems) => {
        const total = cartItems.reduce((total, item) => total + (item.price_per_share * item.quantity), 0);
        return total
    };
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const toast = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [currency] = useState('usd');
    const { user } = useAuth()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const { createPaymentIntent, createPaymentMethod, loading, setLoading, processPayment } = useStripePayment();
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(calculateTotal(cartItems));
    const [showDiscount, setShowDiscount] = useState(false);




    const handleApplyDiscount = async () => {
        try {
            const response = await axiosInstance.get(`/coupons/get_coupon_by_code/${discountCode}`);
            const { discount } = response.data;
            const finalDiscout = totalPrice <= discount ?  calculateTotal(cartItems) : discount
            setDiscountAmount(finalDiscout);
            setTotalPrice(totalPrice - finalDiscout);
            setShowDiscount(true);
            toast({
                title: "Discount applied",
                description: `Discount of $${finalDiscout} applied successfully!`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Invalid coupon",
                description: "The coupon code is invalid or expired.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePayment = async (data) => {
        setLoading(true);

        try {
            const amount = totalPrice * 100; // amount in cents

            console.log(amount)
            if (selectedPaymentMethod === 'card') {
                const cardElement = elements.getElement(CardElement);
                if (!cardElement) throw new Error('Card element not found');

                const billingDetails = {
                    name: data.cardName,
                    address: {
                        line1: data.billingAddress,
                        city: data.city,
                        state: data.state,
                        postal_code: data.postalCode,
                        country: 'US', // Replace with the appropriate country code
                    },
                };

                const paymentMethod = await createPaymentMethod(cardElement, billingDetails);
                const paymentIntent = await createPaymentIntent(amount, currency, paymentMethod.id);


                console.log(paymentIntent)


                if (paymentIntent)
                    completeOrder();
            } else if (selectedPaymentMethod === 'applePay') {
                // Implement Apple Pay logic here
                const clientSecret = await createPaymentIntent(amount, currency);
                const { error: paymentError, paymentIntent } = await processPayment(clientSecret);

                if (paymentError || paymentIntent.status !== 'succeeded') throw paymentError || new Error('Payment failed');
                completeOrder();
            } else if (selectedPaymentMethod === 'cryptoPay') {
                // Implement Crypto Pay logic here
                const clientSecret = await createPaymentIntent(amount, currency);
                const { error: paymentError, paymentIntent } = await processPayment(clientSecret);

                if (paymentError || paymentIntent.status !== 'succeeded') throw paymentError || new Error('Payment failed');
                completeOrder();
            } else {
                const clientSecret = await createPaymentIntent(amount, currency, selectedPaymentMethod);
                const { error: paymentError, paymentIntent } = await processPayment(selectedPaymentMethod, amount, currency);

                if (paymentError || paymentIntent.status !== 'succeeded') throw paymentError || new Error('Payment failed');
                completeOrder();
            }
        } catch (error) {
            handlePaymentError(error);
        } finally {
            setLoading(false);
        }
    };

    const completeOrder = async () => {
        try {
            // await axios.post('/complete-order', { cartItems });  // Send cart items to the endpoint
            let total_shares = 0
            cartItems.forEach(element => {
                total_shares += element.quantity
            });

            console.log(total_shares)
            const res = await axiosInstance.post("/music/complete_order", {


                cart_items: {items: cartItems},
                total_price: totalPrice,
                payment_method: selectedPaymentMethod,
                buyer_id: user.user_id,
                total_shares: total_shares,
                coupon_code: discountCode || "None",
                transaction_type: "shares",

            })

            console.log(res)

            clearCart();
            toast({
                title: "Order placed successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate("/order-confirmation");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to complete order. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handlePaymentError = (error) => {
        toast({
            title: "Error",
            description: error.message || "An error occurred during payment. Please try again later.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    };

    return (
        <Box
            p={4}
            color="primary.100"
            minH="70vh"
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-around"
            alignItems="center"
        >
            <Box maxW="500px" flex={2} p={4} borderRadius="md" mb={{ base: 4, md: 0 }}>
                <Text fontSize="2xl" mb={4}>Checkout</Text>
                {cartItems.map((item, index) => (
                    <Flex key={index} align="center" justify="space-between" p={3}>
                        <Image
                            src={item.image_url}
                            alt={item.track_name}
                            mr={4}
                            borderRadius="lg"
                            width={{ base: "3rem", md: "4rem" }}
                        />
                        <Text>{item.track_name}</Text>
                        <Text>${item.price_per_share} x {item.quantity}</Text>
                    </Flex>
                ))}
                <Flex
                    justifyContent="space-between"
                    borderRadius={3}
                    alignItems="center"
                    mt={4}
                    bg="secondary.100"
                    color="primary.900"
                    display={showDiscount ? "flex" : "none"}
                    p={4}
                >

                    <Text fontSize="lg"> Applied <Text mx={3} color="green.300" as="span">{discountCode} <IconButton
                                    ml={2}
                                    variant="solid"
                                    size={"sm"}
                                    color="red.500"
                                    icon={<FaTimes/>}
                                    onClick={() => {
                                        setDiscountAmount(0);
                                        setTotalPrice(calculateTotal(cartItems));
                                        setShowDiscount(false)
                                    }}
                                /></Text> </Text>
                    <Text fontSize="lg"> -${discountAmount}</Text>
                </Flex>
                <Flex
                    justifyContent="space-between"
                    borderRadius={3}
                    alignItems="center"
                    mt={4}
                    bg="secondary.100"
                    color="primary.900"
                    p={4}
                >

                    <Text fontSize="lg">Total:</Text>
                    <Text fontSize="lg">${totalPrice}</Text>
                </Flex>

                <FormControl mt={4}>
                    <FormLabel>Discount Code</FormLabel>
                    <Flex>
                        <Input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter discount code"
                            variant="filled"
                        />
                        <Button onClick={handleApplyDiscount} ml={2}>Apply</Button>
                    </Flex>
                </FormControl>
            </Box>
            <Box as="form" onSubmit={handleSubmit(handlePayment)} p={4} borderRadius="md" maxW="500px" flex={1}>
                <PaymentMethodSelect
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                />
                {selectedPaymentMethod === 'card' && (
                    <>
                        <FormControl mt={4} isInvalid={errors.cardName}>
                            <FormLabel>Name on Card</FormLabel>
                            <Input
                                type="text"
                                {...register("cardName", { required: "Name on card is required" })}
                                variant="filled"
                            />
                            <FormErrorMessage>{errors.cardName && errors.cardName.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={4} isInvalid={errors.billingAddress}>
                            <FormLabel>Billing Address</FormLabel>
                            <Input
                                type="text"
                                {...register("billingAddress", { required: "Address line 1 is required" })}
                                variant="filled"
                            />
                            <FormErrorMessage>{errors.billingAddress && errors.billingAddress.message}</FormErrorMessage>
                        </FormControl>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={4}>
                            <FormControl isInvalid={errors.city}>
                                <FormLabel>City</FormLabel>
                                <Input
                                    type="text"
                                    {...register("city", { required: "City is required" })}
                                    variant="filled"
                                />
                                <FormErrorMessage>{errors.city && errors.city.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.state}>
                                <FormLabel>State</FormLabel>
                                <Input
                                    type="text"
                                    {...register("state", { required: "State is required" })}
                                    variant="filled"
                                />
                                <FormErrorMessage>{errors.state && errors.state.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.postalCode}>
                                <FormLabel>ZIP/Postal Code</FormLabel>
                                <Input
                                    type="text"
                                    {...register("postalCode", { required: "ZIP/Postal code is required" })}
                                    variant="filled"
                                />
                                <FormErrorMessage>{errors.postalCode && errors.postalCode.message}</FormErrorMessage>
                            </FormControl>
                        </SimpleGrid>
                        <FormControl mt={4}>
                            <FormLabel>Card Details</FormLabel>
                            <Box
                                p={2}
                                borderWidth="1px"
                                borderRadius="md"
                                borderColor={errors.cardDetails ? "red.500" : "gray.200"}
                            >
                                <CardElement options={{ style: { base: { fontSize: '16px', color: "rgb(251,251,251)" } } }} />
                            </Box>
                            {errors.cardDetails && <Text color="red.500" fontSize="sm">{errors.cardDetails.message}</Text>}
                        </FormControl>
                    </>
                )}
                {/* Add respective form elements for Apple Pay and Crypto Pay if needed */}
                <Button mt={4} variant="solid" isLoading={loading} type="submit" w="100%">Pay</Button>
            </Box>
        </Box>
    );
};

const CheckoutWrapper = () => (
    <Elements stripe={stripePromise}>
        <ElementsConsumer>
            {({ elements }) => <Checkout elements={elements} />}
        </ElementsConsumer>
    </Elements>
);

export default CheckoutWrapper;
