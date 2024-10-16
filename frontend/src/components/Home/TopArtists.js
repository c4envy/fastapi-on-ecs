import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';
import { Link } from 'react-router-dom'; // Import Link from React Router
import { Box, Image, Text, Flex, IconButton, useBreakpointValue, Grid, SimpleGrid } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useCart } from '../../context/CartContext';
import { FaUserAlt } from 'react-icons/fa';

const TopArtists = (toggler) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);


    useEffect(() => {
        fetchTopArtists();
    }, [toggler]);

    const fetchTopArtists = () => {
        setLoading(true);
        axiosInstance
            .get("/users/top/artists")
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (

        <SimpleGrid maxW="100%" maxH="270px" whiteSpace="nowrap" gridAutoColumns={{ base: "minmax(100%, 1fr)", md: "minmax(50%, 1fr)", lg: "minmax(25%, 1fr)" }} scrollSnapType="x mandatory" gridAutoFlow="column" overflowY="hidden" overflowX="auto" templateRows={{ base: "2fr 2fr 2fr" }}>
        {data.map((item, index) => (
            <Grid minWidth={{ base: "100%", md: "50%", lg: "25%" }} scrollSnapAlign="start" templateRows="1fr" templateColumns="1fr 3fr 1fr" p={2} my={1} gap={2} justifyItems="flex-start" boxShadow="lg" bg="secondary.100">
                <Box
                        gridColumn="1/2"
                        gridRow="1/4"
                        alignSelf="center"
                        as={Link}
                        to={`/track/${item.track_id}`}
                        position="relative" // Enable relative positioning for the icon overlay
                        transition="transform 0.3s ease-in-out"
                        _hover={{ transform: "scale(1.1)" }}
                    >
                      
                            <Image src={item.account.profile.image_url} alt={item.account.profile.artist_name} borderRadius="lg" width={{ base: "4rem", md: "4rem" }} />


                    </Box>

                      
                        <Grid gridColumn="2/3" gridRow="1/4" justifySelf="flex-start" alignSelf="center">

                            <Link to={`/artist/${item.id}`}><Text fontSize="sm" color="primary.100" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{item.account.profile.artist_name}</Text></Link>

                        </Grid>
                        {/* <Text fontSize="lg">{item.available_shares} shares</Text> */}
                        <Box
                            gridColumn="3/4"
                            gridRow="1/4"
                            alignSelf="center"
                            justifySelf="flex-end"
                            mx={3}
                        >
                            {/* Use a link to the artist's profile page */}
                            <Link to={`/artist/${item.id}`}>
                                <IconButton
                                    icon={<FaUserAlt />}
                                    variant="glassy"
                                    aria-label={`View ${item.account.profile.artist_name}'s Profile`}
                                />
                            </Link>
                        </Box>
                    </Grid>
   
        ))}
    </SimpleGrid>





    );
};

export default TopArtists;
