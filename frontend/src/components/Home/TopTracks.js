import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';
import { Box, Image, Button, Text, Flex, IconButton, useBreakpointValue, Grid, GridItem, SimpleGrid, Icon } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useCart } from '../../context/CartContext';
import { FaCartArrowDown, FaPlay } from "react-icons/fa";
import { Link } from 'react-router-dom';

const TopTracks = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchTopTracks();
    }, [currentPage]);

    const fetchTopTracks = () => {
        setLoading(true);

        axiosInstance
            .get("/music/get_top_tracks")
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





    const { addToCart } = useCart();



    return (

        <SimpleGrid maxW="100%" maxH="270px" whiteSpace="nowrap" gridAutoColumns={{ base: "minmax(100%, 1fr)", md: "minmax(50%, 1fr)", lg: "minmax(25%, 1fr)" }} scrollSnapType="x mandatory" gridAutoFlow="column" overflowY="hidden" overflowX="auto" templateRows={{ base: "2fr 2fr 2fr" }}>
            {data.map((item, index) => (
                <Grid minWidth={{ base: "100%", md: "50%", lg: "25%" }} scrollSnapAlign="start" templateRows="1fr 1fr 1fr" templateColumns="1fr 3fr 1fr" p={2} my={1} gap={2} justifyItems="flex-end" boxShadow="lg" bg="secondary.100">
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
                        <Image
                            src={item.image_url}
                            alt={item.track_name}
                            borderRadius="lg"
                            width={{ base: "4rem", md: "4rem" }}
                        />

                        {/* Play Icon, initially hidden and visible on hover */}
                        <Box
                            position="absolute"
                            top="50%"
                            left="50%"
                            transform="translate(-50%, -50%)" // Center the icon
                            opacity={0.5} // Initially hidden
                            transition="opacity 0.3s ease-in-out"
                            _hover={{ opacity: 1 }} // Show icon on hover
                        >
                            <Icon as={FaPlay} boxSize={6} color="white" />
                        </Box>
                    </Box>

                    <Grid gridColumn="2/3" gridRow="1/4" justifySelf="flex-start" >

                        <Text as={Link} to={`/track/${item.track_id}`} w="100%" fontSize="sm" color="primary.100" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap" _hover={{ color: "dark.900" }}>
                            {item.track_name}
                        </Text>

                        <Text fontSize="sm" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{item.artist_name}</Text>
                        <Text fontSize="md">${item.price_per_share}</Text>
                    </Grid>
                    {/* <Text fontSize="lg">{item.available_shares} shares</Text> */}
                    <IconButton
                        gridColumn="3/4"
                        gridRow="1/4"
                        icon={<FaCartArrowDown />}
                        onClick={() => addToCart(item)}
                        variant="ghost"
                        color="dark.900"
                        w="10px"
                        alignSelf="center"
                    />
                </Grid>
            ))}
        </SimpleGrid>






    );
};

export default TopTracks;




