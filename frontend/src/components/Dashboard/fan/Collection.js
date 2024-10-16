import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../services/axios';

const Collection = () => {
  const [collection, setCollection] = useState([]);

  const fetchCollection = async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      console.log(response);
      const collectionData = response.data.account.profile.collection;

      // Fetch track details for each item in the collection
      const updatedCollection = await Promise.all(collectionData.map(async (item) => {
        const trackDetails = await fetchTrackDetails(item.track_id);
        return { ...item, track: trackDetails };
      }));

      setCollection(updatedCollection);
    } catch (error) {
      console.error('Error fetching collection:', error);
    }
  };

  const fetchTrackDetails = async (trackId) => {
    try {
      const response = await axiosInstance.post(`/music/get_track_by_id/${trackId}`);
      return response.data
    } catch (error) {
      console.error(`Error fetching track details for ${trackId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Collected Shares
      </Heading>
      <Button variant="glassy" as={Link} to="/explore-music" mb={4}>
        Explore More Music
      </Button>
      <Stack spacing={4}>
        <Flex
          align="center"
          justify="space-between"
          bg="primary.500"
          p={4}
          borderRadius="md"
          boxShadow="md"
        >
          <Text flex={3} fontSize="lg">Track Details</Text>
          <Text flex={1} fontSize="lg">Available shares</Text>
          <Text flex={1} fontSize="lg">Shares Owned</Text>
          <Text flex={1} fontSize="lg">Date Acquired</Text>
        </Flex>
        {collection.map((item) => {
          const track = item.track;
          return (
            <Link to={`/track/${item.track_id}`} key={item.track_id}>
              <Flex
                align="center"
                justify="space-between"
                bg="primary.500"
                p={4}
                borderRadius="md"
                boxShadow="md"
                _hover={{ bg: "secondary.100", color:"primary.900" }}
              >
                {console.log(collection)}
                <Text flex={3} fontSize="lg" display="flex" alignItems="center">
                  {track && (
                    <>
                      <Image
                        mr={4}
                        src={track.image}
                        alt={track.title}
                        borderRadius='lg'
                        width={{ base: "3rem", md: "4rem" }}
                      />
                      {track.track_name}
                    </>
                  )}
                </Text>
                <Text flex={1} fontSize="lg">{item.track.available_shares} shares</Text>
                <Text flex={1} fontSize="lg">{item.num_of_shares} shares</Text>
                <Text flex={1} fontSize="lg">{new Date(item.date_acquired).toLocaleString()}</Text>
              </Flex>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Collection;
