import React, { useState } from 'react';
import { Box, Input, Text, Flex } from '@chakra-ui/react';
import streamingPlatformsData from './streamingPlatformsData';

const EarningsCalculator = ({ trackInfo }) => {
    const [streams, setStreams] = useState("0");

    return (
        <Flex flexDirection="column" alignItems="center">

            <Text>Enter Number of Shares to see their future worth from various platforms</Text>
            <Input
                variant="filled"
                placeholder="Enter shares"
                value={streams === "0" ? "" : streams}
                onChange={(e) => setStreams(e.target.value)}
                m={4}
                maxW="300px"
            />


            <Flex flexWrap="wrap" gap={10} justifyContent="center">

                {streamingPlatformsData.map((platform, index) => {

                    const earnings = (parseInt(streams) * platform.payPerStream).toFixed(2);

                    return (
                        <Flex flexDirection="column" cursor="pointer" _hover={{bg:"secondary.100"}} flexWrap="wrap" key={index} alignItems="center" bg="dark.500" w="250px" h="100px" borderRadius={5}  my={2} p={3} justifyContent="space-around">
                           <Box display="flex">{platform.icon}  <Text mx={2} color="dark.900">{platform.platform}</Text></Box>
                       
                            <Text>${earnings}</Text>
                        </Flex>
                    );
                })}
            </Flex>
        </Flex>
    );
};

export default EarningsCalculator;
