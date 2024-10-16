import React, { useState } from 'react';
import {
    Box, Button, FormControl, FormLabel, Input, useToast, Modal,
    ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
    Flex, Text, RadioGroup, Radio, HStack, Icon,
    IconButton
} from "@chakra-ui/react";
import { CardElement, ElementsConsumer } from "@stripe/react-stripe-js";
import { FaCreditCard, FaApple, FaBitcoin, FaCross, FaTimes } from 'react-icons/fa';
import useStripePayment from '../../hooks/useStripePayment';
import axiosInstance from '../../services/axios';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';





const PaymentMethodSelect = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => (
    <FormControl w="100%" mt={4}>
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

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, trackDetails }) => {
    const toast = useToast();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const { createPaymentIntent, createPaymentMethod, processPayment } = useStripePayment();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(trackDetails.price_per_share);
    const [showDiscount,setShowDiscount] = useState(false)



    const handleApplyDiscount = async () => {
    
        try {
            const response = await axiosInstance.get(`/coupons/get_coupon_by_code/${discountCode}`);
            const { discount } = response.data;

            let finalDiscout = discount <= trackDetails.price_per_share ? discount : trackDetails.price_per_share;
            
            setDiscountAmount(finalDiscout);
            toast({
                title: "Discount applied",
                description: `Discount of $${finalDiscout} applied successfully!`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setTotalPrice(trackDetails.price_per_share - finalDiscout);
            setShowDiscount(true)
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
    const completeOrder = async () => {

        let params = {
            cart_items: {
                items: [trackDetails]
            },
            total_price: totalPrice * 100, // amount in cents
            payment_method: selectedPaymentMethod,
            buyer_id: user.user_id,
            coupon_code: discountCode || "None",
            type: "purchase"
        }
        console.log(params)

        try {
            const res = await axiosInstance.post("/music/complete_track_listing", params);
            console.log(res.data);

            toast({
                title: "Order placed successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            onPaymentSuccess()
            navigate("/dashboard/artist/tracks");
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

    const handlePayment = async (data, elements) => {
        setLoading(true);
        
        try {
        
            const amount = totalPrice * 100; // amount in cents

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
                        country: 'US',
                    },
                };

                const paymentMethod = await createPaymentMethod(cardElement, billingDetails);
                const paymentIntent = await createPaymentIntent(amount, "usd", paymentMethod.id);
                console.log(paymentIntent);
                if (paymentIntent) {
                    completeOrder();
                }
            } else if (selectedPaymentMethod === 'applePay' || selectedPaymentMethod === 'cryptoPay') {
                throw new Error('Apple Pay and Crypto Pay not implemented');
            } else {
                throw new Error('Invalid payment method selected');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "An error occurred during payment. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Payment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex flexDirection="column" bg="secondary.100" color="dark.900" justifyContent="center" p={3} >
                        <Flex justifyContent="space-between">

                        <h2>{trackDetails.track_name}</h2>
                        <h2>${trackDetails.price_per_share}</h2>
                        </Flex>
                        <Flex justifyContent="space-between" alignItems="center" paddingY={3} display={showDiscount ? "flex" : "none"}>
                     
                                <Text> Applied <Text as="span" mx={3} color="green.400">{discountCode}</Text>  <IconButton
                                    variant="solid"
                                    size={"sm"}
                                    color="red.500"
                                    icon={<FaTimes/>}
                                    onClick={() => {
                                        setDiscountAmount(0);
                                        setTotalPrice(trackDetails.price_per_share);
                                        setShowDiscount(false)
                                    }}
                                /> </Text>
                                <h2>- ${discountAmount}</h2>
                                
                               
                        </Flex>
                       
                        
                        <Text textAlign="right" > Total : ${totalPrice}</Text>
                    </Flex>
                    <FormControl mt={4}>
                        <FormLabel>Discount Code</FormLabel>
                        <Input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Enter discount code"
                            variant="light"
                            color="secondary.100"
                        />
                       
                        <Button mt={2} onClick={handleApplyDiscount}>
                            Apply Discount
                        </Button>
                    </FormControl>
                    <ElementsConsumer>
                        {({ elements }) => (
                            <Box as="form" onSubmit={(e) => { e.preventDefault(); handlePayment({}, elements); }}>
                                <PaymentMethodSelect
                                    selectedPaymentMethod={selectedPaymentMethod}
                                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                                />
                                {selectedPaymentMethod === 'card' && (
                                    <>
                                        <FormControl mt={4}>
                                            <FormLabel>Name on Card</FormLabel>
                                            <Input type="text" name="cardName" variant="light" />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Billing Address</FormLabel>
                                            <Input type="text" name="billingAddress" variant="light" />
                                        </FormControl>
                                        <Flex direction="row" mt={4}>
                                            <FormControl>
                                                <FormLabel>City</FormLabel>
                                                <Input type="text" name="city" variant="light" />
                                            </FormControl>
                                            <FormControl ml={4}>
                                                <FormLabel>State</FormLabel>
                                                <Input type="text" name="state" variant="light" />
                                            </FormControl>
                                        </Flex>
                                        <FormControl mt={4}>
                                            <FormLabel>ZIP/Postal Code</FormLabel>
                                            <Input type="text" name="postalCode" variant="light" />
                                        </FormControl>
                                        <FormControl mt={4}>
                                            <FormLabel>Card Details</FormLabel>
                                            <Box p={2} borderWidth="1px" borderRadius="md">
                                                <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                                            </Box>
                                        </FormControl>
                                    </>
                                )}
                                <Button mt={4} colorScheme="teal" isLoading={loading} type="submit" w="100%">
                                    Pay ${totalPrice}
                                </Button>
                            </Box>
                        )}
                    </ElementsConsumer>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PaymentModal;
