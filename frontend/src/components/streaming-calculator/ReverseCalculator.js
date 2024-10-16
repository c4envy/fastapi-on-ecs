import React, { useState } from 'react';
import { Box, Input, Text, Flex } from '@chakra-ui/react';
import streamingPlatformsData from './streamingPlatformsData';

const ReverseCalculator = ({ trackInfo }) => {
    const [price, setPrice] = useState('');

    return (
        <Flex flexDirection="column" alignItems="center">

        <Text>Find quantity of shares you should own to earn the entered price (USD)</Text>
            <Input
                variant="filled"
                placeholder="Enter Price $"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                m={4}
                maxW="300px"
            />
            <Flex flexWrap="wrap" gap={10} justifyContent="center">

            {streamingPlatformsData.map((platform, index) => {
                const streamsRequired = price ? parseInt(parseFloat(price) / platform.payPerStream) : '0';
                return (
                    <Flex flexDirection="column" cursor="pointer" _hover={{bg:"secondary.100"}} flexWrap="wrap" key={index} alignItems="center" bg="dark.500" w="250px" h="100px" borderRadius={5}  my={2} p={3} justifyContent="space-around">
                        <Box display="flex">{platform.icon}  <Text mx={2} color="dark.900">{platform.platform}</Text></Box>
                       
                        <Text>{streamsRequired}</Text>
                    </Flex>
                );
            })}
            </Flex>
        </Flex>
    );
};

export default ReverseCalculator;
