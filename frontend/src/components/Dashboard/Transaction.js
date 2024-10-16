import React, { useEffect, useState } from "react";

import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Grid,
  useToast,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axios";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      axiosInstance
        .get("/music/get/user/transactions")
        .then((response) => {
          setTransactions(response.data);
        })
        .catch((error) => {
          toast({
            title: "Error fetching transactions",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      navigate("/login");
    }
  }, [auth, navigate, toast]);

  return (
    <Box p={4} borderRadius="md" boxShadow="md" color="primary.100">
      <Heading as="h3" size="lg" mb={4} color="dark">
        Your Transactions
      </Heading>
      <Box p={4} borderRadius="md" color="primary.100">
        {/* Header row for desktop */}
        <Grid
          templateColumns="3fr 1fr 1fr 0.5fr"
          gap={4}
          p={3}
          display={{ base: "none", md: "grid" }}
          bg="secondary.900"
          color="primary.100"
          borderRadius="md"
          mb={5}
        >
          <Text fontWeight="bold">Transaction ID</Text>
          <Text fontWeight="bold">Purchase Date</Text>
          <Text fontWeight="bold">Total Price</Text>
          <Text></Text>
        </Grid>

        <Accordion allowToggle>
          {transactions.map((transaction) => (

            <AccordionItem key={transaction.transaction_id} border="none">
              <h2>
                {console.log(transaction)}
                <AccordionButton
                  bg="dark.500"
                  _expanded={{
                    bg: "secondary.500",
                    color: "primary.900",
                  }}
                  _hover={{bg:"secondary.100"}}
                  p={4}
                  borderRadius="md"
                  mb={2}
                >
                  <Grid
                    templateColumns={{ base: "2fr 1fr", md: "3fr 1fr 1fr 0.5fr" }}
                    alignItems="center"
                    justifyItems="flex-start"
                    w="100%"
                    gap={4}
                    color="primary.900"
                  >
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      gridColumn={{ base: "1/4", md: "1/2" }}
                      textAlign="left"
                      color="dark.900"
                    >
                      {transaction.transaction_id}
                    </Text>
                    <Text
                      fontSize="sm"
                      gridColumn={{ base: "1/4", md: "2/3" }}
                      textAlign="left"
                    >
                      {new Date(transaction.purchase_date).toLocaleDateString()}
                    </Text>
                    <Text
                      fontSize="sm"
                      gridColumn={{ base: "1/4", md: "3/4" }}
                      textAlign="right"
                    >
                      ${transaction.total_price.toFixed(2)}
                    </Text>
                    <AccordionIcon gridColumn={{ base: "3/4", md: "4/5" }} justifySelf="flex-end" />
                  </Grid>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} bg="secondary.500" borderRadius="md" mb={5}>
                <Flex direction="column" color="primary.100">
                  {transaction.cart_items.items.map((item, idx) => (
                    <Box
                      key={idx}
                  
                      mt={2}
                      
                      borderRadius="md"
                      bg="dark.500"
                      p={3}

                    
                      
                   
                    >
                      <Text as="a" href={`/track/${item.track_id}`}  _hover={{color:"primary.900"}}>
                        <Text as="span" fontSize={18} color="dark.900">Track : </Text > <Text as="span" textDecoration="underline">{item.track_name}</Text>
                      </Text>
                      <Text>
                        <Text as="span" fontSize={18} color="dark.900">Quantity: </Text>{item.quantity}
                      </Text>
                      <Text>
                        <Text as="span" fontSize={18} color="dark.900">Price per share : </Text>${item.price_per_share}
                      </Text>
                      <Text as="a" href={`/track/${item.track_id}`} _hover={{color:"primary.900"}}>
                      <Text as="span" fontSize={18} color="dark.900">Artist : </Text > <Text as="span" textDecoration="underline">{item.artist_name}</Text>
                      </Text>
                   
                      
                    </Box>
                    
                  ))}
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    </Box>
  );
};

export default Transaction;
