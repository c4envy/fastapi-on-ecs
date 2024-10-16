
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axios';
import {
    Box, Image, Heading, Text, Badge, Flex,
    Divider,
    Stack,
    CardBody,
    Card,
    CardFooter,
    Button
} from '@chakra-ui/react';

const Artist = () => {
    const { artistId } = useParams(); // Assuming you're using React Router for routing
    const [artistInfo, setArtistInfo] = useState(null);

    useEffect(() => {
        const fetchArtistInfo = async () => {
            try {
                const response = await axiosInstance.get(`/users/get/user/${artistId}`); // Replace with your API endpoint
                setArtistInfo(response.data);
            } catch (error) {
                console.error('Error fetching artist info:', error);
            }
        };
        fetchArtistInfo();
    }, [artistId]);

    if (!artistInfo) {
        return <div>Loading...</div>;
    }

    return (
        <Card
            direction={{ base: 'column', sm: 'row' }}
            overflow='hidden'
            variant='outline'
            mx={{ base: 5, sm: 10 }}
            bg="dark.900"
            borderColor="dark.900"
            boxShadow="dark-lg"
        >
            <Image
                objectFit='cover'
                maxW={{ base: '100%', sm: '50%' }}
                src={artistInfo.account.profile.image_url}
                alt={artistInfo.account.profile.artist_name}
                borderRadius="md"
            />

            <Stack w="100%">
                <CardBody>
                    <Heading as="h1" size="xl" color="secondary.100" my={5}>
                        {artistInfo.account.profile.artist_name}
                    </Heading>
                    <Text mt={2} color="secondary.100">
                        <strong>Genres:</strong> {artistInfo.account.profile.genres.join(', ')}
                    </Text>
                    <Divider mt={4} color="secondary.100" />
                    <Text mt={4} color="secondary.100">
                        <strong>Total Shares Sold:</strong> {artistInfo.account.profile.total_shares_sold}
                    </Text>
                    <Text mt={2} color="secondary.100">
                        <strong>Total Revenue:</strong> $ {artistInfo.account.profile.total_revenue}
                    </Text>
                    <Text mt={2} color="secondary.100">
                        <strong>Featured:</strong> {artistInfo.account.profile.featured ? 'Yes' : 'No'}
                    </Text>
                    <Text mt={2} color="secondary.100">
                        <strong>Disabled:</strong> {artistInfo.disabled ? 'Yes' : 'No'}
                    </Text>
                    <Divider mt={4} />
                    <Box mt={4}>
                        <Text color="primary.100">
                            <strong>Track List:</strong>
                        </Text>
                        <Flex mt={2} flexWrap="wrap">
                            {artistInfo.account.profile.track_list && artistInfo.account.profile.track_list.map((track, index) => (
                                <Badge key={index} colorScheme="primary" mr={2} mb={2}>
                                    {track}
                                </Badge>
                            ))}
                        </Flex>
                    </Box>
                </CardBody>

                <CardFooter>
                    <Button variant='solid' colorScheme='blue'>
                        Follow
                    </Button>
                </CardFooter>
            </Stack>
        </Card>
    );
};

export default Artist;

