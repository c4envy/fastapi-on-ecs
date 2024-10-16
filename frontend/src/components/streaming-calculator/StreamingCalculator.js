import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Spinner, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import ReverseCalculator from './ReverseCalculator';
import EarningsCalculator from './EarningsCalculator';
import axiosInstance from '../../services/axios';

const StreamingCalculator = () => {
    const { id } = useParams(); // Getting trackId from URL params
    const [trackInfo, setTrackInfo] = useState(null);
    const [toggler, setToggler] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        const fetchTrackInfo = async () => {
            setLoading(true)
            try {
                const response = await axiosInstance.post(`/music/get_track_by_id/${id}`); // Fetch track by ID
                setTrackInfo(response.data);
            } catch (error) {
                console.error('Error fetching track info:', error);
            }
            setLoading(false)
        };
        fetchTrackInfo();
    }, [id]);

   if(loading){
    return <Spinner/>
   }

    return (
        <Box py={5} borderRadius={3} m={4}>

           
            <Flex justifyContent="left" my={2}>
                <Button
                    bg={!toggler ? "dark.900" : "dark.500"}
                    color={!toggler ? "dark.500" : "dark.900"}
                    variant="glassy"
                    onClick={() => setToggler(false)}
                    w={{ base: "50%", lg: "12rem" }}
                    fontSize="0.8rem"
                >
                    Reverse Calculator
                </Button>
                <Button
                    bg={!toggler ? "dark.500" : "dark.900"}
                    color={!toggler ? "dark.900" : "dark.500"}
                    variant="glassy"
                    onClick={() => setToggler(true)}
                    w={{ base: "50%", lg: "12rem" }}
                    fontSize="0.8rem"
                >
                    Earnings Calculator
                </Button>
            </Flex>
            
            <Text my={5}>{trackInfo?.track_name} by {trackInfo?.artist_name}</Text>
            <Image my={5} src={trackInfo?.image_url} alt={trackInfo?.track_name} borderRadius="lg" width="100px" />
            {toggler ? <EarningsCalculator trackInfo={trackInfo} /> : <ReverseCalculator trackInfo={trackInfo} />}
        </Box>
    );
};

export default StreamingCalculator;
