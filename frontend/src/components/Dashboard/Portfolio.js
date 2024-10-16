

import React, { useEffect, useState } from 'react';
import { Box, Heading, Grid, Image, Text, IconButton, Spinner, useToast, Flex, GridItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';

import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../services/axios';




const Portfolio = () => {
    const auth = useAuth();
    const toast = useToast();
    
    const [tracks, setTracks] = useState([]);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch user's portfolio
    const fetchUserPortfolio = async () => {
        try {
            const res = await axiosInstance.get("/users/me");
            setPortfolio(res.data.account.profile.portfolio);
        } catch (error) {
            console.error('Error fetching user:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch portfolio. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Fetch tracks by track IDs in the portfolio
    const fetchTracks = async () => {
  
        if (!portfolio || portfolio.length === 0) {
            setLoading(false);
            return;
        }

        try {
            const trackPromises = portfolio.map((track) =>
                axiosInstance.post(`/music/get_track_by_id/${track.track_id}`)
            );

            const responses = await Promise.all(trackPromises);
            const fetchedTracks = responses.map((response, i) => ({
                track_data: response.data,
                date_acquired: portfolio[i].date_acquired,
                quantity_bought: portfolio[i].num_of_shares
            }));

            setTracks(fetchedTracks);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch tracks. Please try again later.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false); // Stop loading once fetching is complete
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserPortfolio();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (portfolio) {
            fetchTracks();
        }
    }, [portfolio]);

    if(portfolio === null){
        return (
            <Flex color="primary.100"  justify="center" align="center" >
                <Text fontSize="lg">No shares, Lets Buy and Earn from your favorite music</Text>
              
            </Flex> 
        ); 
    } 


    return (
        <Box color="primary.100">
        <Heading as="h3" size="lg" mb={4} color="dark.900">
            {!portfolio ? "No shares, Lets Buy and Earn from your favorite music": "Portfolio"}
            
        </Heading>

        <Grid
            templateColumns={{ base: "1fr 3fr", md: "3fr 1fr 1fr 1fr" }}
            gap={0}
            p={2}
            templateRows={{ base: "1fr 1fr", sm: "1fr" }}
            align="center"
            justifyItems="flex-start"
            bg="secondary.900"
            color="primary.100"
            borderRadius="md"
            boxShadow="md"
            display={{ base: "none", md: "grid" }}
        >
            <GridItem >
                <Text fontSize="lg">Track</Text>
            </GridItem>
            <GridItem >
                <Text fontSize="lg">Shares Owned</Text>
            </GridItem>
            <GridItem >
                <Text fontSize="lg">Price</Text>
            </GridItem>
            <GridItem >
                <Text fontSize="lg">Buy</Text>
            </GridItem>
        </Grid>

        <Box>
            {tracks.map((item, index) => (

                <Grid
                    as={Link}
                    to={`/track/${item.track_data.track_id}`}
                    key={index}
                    templateColumns={{ base: "1fr 3fr", md: "3fr 1fr 1fr 1fr" }}
                    templateRows={{ base: "2fr 1fr 1fr", md: "1fr" }}
                    gap={{ base: 3, md: 1 }}
                    p={{ base: 4, md: 2 }}
                    align={{ base: "left", md: "center" }}
                    alignItems="center"
                    justifyItems={{ base: "space-between", md: "flex-start" }}
                    bg="secondary.100"
                    borderRadius="md"
                    boxShadow="md"
                    color="primary.900"
                    my={3}
                    _hover={{ bg: "secondary.500" }} // Optional hover effect
                >
                    <GridItem gridColumn={{ base: "1/2", md: "1/2" }} gridRow={{ base: "1/4", md: "1/2" }} w={{ base: "100%", md: "100%" }} display="flex" alignItems="center" justifySelf="flex-start" >
                        <Image src={item.track_data.image_url} alt={item.track_data.track_name} borderRadius="lg" w="4rem" />
                        <Text display={{ base: "none", md: "block" }} ml={{ base: 1, md: 4 }}>{item.track_data.track_name}</Text>
                    </GridItem >
                    <GridItem gridColumn="2/3" display={{ base: "none", md: "block" }} gridRow={{ base: "2/3", md: "1/2" }}>
                        <Text fontSize="lg">{item.quantity_bought}</Text>
                    </GridItem>
                    <GridItem gridColumn={{ base: "2/3", md: "3/4" }} gridRow={{ base: "1/4", md: "1/2" }} >
                        <Text display={{ base: "block", md: "none" }} ml={{ base: 0, md: 4 }}>{item.track_data.track_name}</Text>
                        <Text fontSize={{ base: "2xl", md: "lg" }} >${item.track_data.price_per_share}</Text>
                    </GridItem>

                    <GridItem gridColumn={{ base: "1/3", md: "4/5" }} gridRow={{ base: "4/5", md: "1/2" }} display="flex" alignItems="center" justifyContent="space-between" >
                        <Text display={{ base: "block", md: "none" }}>Shares Owned : {item.quantity_bought}</Text>
                        <IconButton
                            icon={<AddIcon />}
                            colorScheme="red"
                            size="sm"
                            pointerEvents="auto"
                            ml={{ base: 2, md: 4 }}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation(); 
                                
                            }}
                        />
                    </GridItem>
                </Grid>
            ))}
        </Box>


    </Box>

    );
};

export default Portfolio;

