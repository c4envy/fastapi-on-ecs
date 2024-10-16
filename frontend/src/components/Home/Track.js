import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import {
    Box, Image, Heading, Text, Badge, Flex,
    Divider,
    Stack,
    CardBody,
    Card,
    CardFooter,
    Button,
    useToast,
    LinkBox
} from '@chakra-ui/react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';


const Track = () => {
    const { trackId } = useParams(); // Assuming you're using React Router for routing
    const [trackInfo, setTrackInfo] = useState(null);
    const [track, setTrack] = useState(null)


    const { playTrack } = useMusicPlayer();



    const toast = useToast();

    const fetchPreviewUrl = async () => {
        let track_id = ""
     
        try {

            if (trackInfo.streaming_platforms[0].platform === "spotify") {
                track_id = trackInfo.streaming_platforms[0].id;
                const response = await axiosInstance.get(`/spotify/track/${track_id}`); // Replace with your API endpoint
                setTrack({
                    name: trackInfo.track_name,
                    artist: trackInfo.artist_name,
                    image: trackInfo.image_url, 
                    url: response.data.preview_url     
                });
            }
            else if (trackInfo.streaming_platforms[0].platform === "apple") {
                track_id = trackInfo.streaming_platforms[0].id;
                const response = await axiosInstance.get(`/apple/song/us/${track_id}`); // Replace with your API endpoint
                console.log(response.data)
                setTrack({
                    name: trackInfo.track_name,
                    artist: trackInfo.artist_name,
                    image: trackInfo.image_url, 
                    url: response.data.data[0].attributes.previews[0].url     
                });
            }
    
            else {
                toast({
                    title: 'No preview available',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

        } catch (error) {
            console.error('Error fetching preview url:', error);
            toast({
                title: 'Error fetching preview url',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }


    useEffect(() => {
        const fetchTrackInfo = async () => {
            try {
                const response = await axiosInstance.post(`/music/get_track_by_id/${trackId}`); // Replace with your API endpoint


                setTrackInfo(response.data);

            } catch (error) {
                console.error('Error fetching track info:', error);
            }
        };
        fetchTrackInfo();
    }, [trackId]);





    if (!trackInfo) {
        return <div>Loading...</div>;
    }

    return (
        <><Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            mx={{ base: 5, sm: 10 }}
            bg="dark.900"
            borderColor="dark.900"
            boxShadow="dark-lg"
        >

            {console.log(trackInfo)}
            <Stack w="100%">
                <CardBody >
                    <Heading as="h1" size="xl" color="secondary.100" my={5}>{trackInfo.track_name}</Heading>
                    <Text mt={2}><strong>Artist: </strong>
                        {trackInfo.artist_name}
                    </Text>
                    <Text mt={2}><strong>Album:</strong> {trackInfo.album_name}</Text>

                    <Text mt={4} ><strong>Release Date:</strong> {new Date(trackInfo.release_date).toLocaleDateString()}</Text>
                    <Text mt={2} ><strong>Album Type:</strong> {trackInfo.album_type}</Text>
                    <Text mt={2} ><strong>Price Per Share:</strong> {trackInfo.price_per_share}</Text>
                    <Text mt={2} ><strong>Available Shares:</strong> {trackInfo.available_shares}</Text>
                    <Text mt={2} ><strong>Number of Shares:</strong> {trackInfo.num_of_shares}</Text>
                    <Text mt={2} ><strong>Track Status:</strong> {trackInfo.track_status}</Text>
                    <Text mt={2} ><strong>Publisher:</strong> {trackInfo.publisher.email}</Text>
                    <Text mt={2} ><strong>Disabled:</strong> {trackInfo.disabled ? 'Yes' : 'No'}</Text>

                </CardBody>

                <CardFooter>
                    <Button variant='solid' colorScheme='blue'>
                        Buy
                    </Button>
                    <Button as={Link} to={`/streaming-calculator/${trackInfo.track_id}`}>Earning Predictor</Button>
                </CardFooter>
            </Stack>
            <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '50%' }}
                src={trackInfo.image_url}
                alt='Caffe Latte'

            />


        </Card>
            <Box>
                <Button m={10} onClick={fetchPreviewUrl}>Fetch Preview</Button>
                {track && (
                        <Button onClick={() => playTrack(track)}>
                            Play track
                        </Button>
                )}
            </Box>
        </>



    );
};

export default Track;

