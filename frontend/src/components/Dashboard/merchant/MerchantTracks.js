import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import axiosInstance from '../../../services/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import UpdateTrackModal from '../artist/UpdateTrackModal';

const MerchantTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [newTrack, setNewTrack] = useState('');
  const toast = useToast();

  const auth = useAuth();

  const fetchTracks = async () => {
    try {
      const response = await axiosInstance.post(`/music/search_for_track`, {
        publisher: {
          email: auth.user.email,
        },
      });
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    try {
      await axiosInstance.delete(`/artists/${auth.user.user_id}/tracks/${trackId}`);
      setTracks(tracks.filter((track) => track.id !== trackId));
      toast({
        title: 'Track Deleted',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting track:', error);
      toast({
        title: 'Error Deleting Track',
        description: 'Failed to delete track. Please try again.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleUpdateTrack = async (trackId, newDetails) => {
    try {
      const response = await axiosInstance.put(`/artists/${auth.user.user_id}/tracks/${trackId}`, {
        ...newDetails,
      });
      const updatedTracks = tracks.map((track) =>
        track.id === trackId ? { ...track, ...response.data } : track
      );
      setTracks(updatedTracks);
      toast({
        title: 'Track Updated',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating track:', error);
      toast({
        title: 'Error Updating Track',
        description: 'Failed to update track. Please try again.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4}>
        Merchant Tracks
      </Heading>
      <Button variant="glassy" as={Link} to="/create-music" mb={4}>
        Create Music
      </Button>
      <Stack spacing={4}>
        {tracks.map((track) => (
          <Flex
            key={track.id}
            align="center"
            justify="space-between"
            bg="primary.500"
            p={4}
            borderRadius="md"
            boxShadow="md"
          >
            <Text fontSize="lg">{track.track_name}</Text>
            <Flex>
              <UpdateTrackModal track={track} onUpdate={handleUpdateTrack} />
              <IconButton
                icon={<FaTrash />}
                colorScheme="red"
                size="sm"
                onClick={() => handleDeleteTrack(track.id)}
                aria-label={`Delete ${track.track_name}`}
              />
            </Flex>
          </Flex>
        ))}
      </Stack>
    </Box>
  );
};

export default MerchantTracks;
