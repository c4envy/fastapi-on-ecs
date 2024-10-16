
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Text,
  Tooltip,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import axiosInstance from '../../../services/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import UpdateTrackModal from './UpdateTrackModal';
import PaymentModal from '../../Music/PaymentModal';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const ArtistTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false)

  const stripePromise = loadStripe("pk_test_51PLQgX2KnKdf1YCEVojH8ER1TVelnSOzUmuNJIJaOadbq1EatVpO2RVndyWTAX0CUmp7fomagqJFkkCQpOJuJB9O00kq1zQolv");


  const toast = useToast();
  const auth = useAuth();


  const handleClick = (track) => {
    setPaymentModalData(track);
    setIsPaymentModalOpen(true);
  };


  const fetchTracks = async () => {
    console.log("fetched")
    try {
      const response = await axiosInstance.post(`/music/search_for_track`, {
        publisher: {
          email: auth.user.email,
        },
      });
      console.log(response)
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
      const response = await axiosInstance.put(`/api/v1/music/update_track/${trackId}`, newDetails);
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
  }, [paymentDone]);

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4} color="dark.900">
        Catalogue
      </Heading>
      <Button variant="glassy" as={Link} to="/create-music" mb={4}>
        Create Music
      </Button>
      <Box p={4} borderRadius="md" color="primary.100">

        <Accordion allowToggle>
          {tracks.length === 0 && <h2>No tracks to show</h2>}
          {tracks.map((track) => (
            <AccordionItem key={track.trackId}>
              <h2>
                <AccordionButton>
                  <Grid templateColumns={{ base: "2fr 1fr 1fr", md: "3fr 1fr 1fr" }} templateRows={{ base: "1fr 1fr 1fr", md: "1fr 1fr" }} alignItems="center" w="100%">
                    <Box display="flex" flexDirection={{base:"column",md:"row"}} alignItems={{base:"flex-start", md:"center"}} gridColumn={{ base: "1/2", md: "1/2" }} gridRow={{ base: "1/2", md: "1/2" }}>
                      <Image justifySelf="flex-start" mr={4} src={track.image_url} alt={track.track_name} borderRadius="lg" width={{ base: "3rem", md: "4rem" }} />
                      <Text my={2} textAlign="left" fontSize="1rem" justifySelf="flex-start" fontWeight="bold">{track.track_name}</Text>
                    </Box>
                    <Box gridColumn={{ base: "1/4", md: "1/3" }} gridRow={{ base: "2/3", md: "2/3" }}>
                      <Text textAlign="left" fontSize="0.8rem" justifySelf="flex-start" fontWeight="bold">Track Status : <Text as="span" color="orange">{track.track_status}</Text></Text>
                      <Text textAlign="left" fontSize="0.8rem" justifySelf="flex-start" fontWeight="bold">Payment Status : <Text as="span" color={track.payment_status === "paid" ? "green.500" : "red.400"}>{track.payment_status}</Text></Text>
                    </Box>
                    <Button onClick={() => handleClick(track)} w="100%" display={track.payment_status === "paid" ? "none" : "block"} bg="green.500" justifySelf="flex-end" gridColumn={{ base: "3/4", md: "3/4" }} gridRow={{ base: "3/4", md: "1/2" }}>Pay</Button>
                    <Box justifySelf="flex-start" display="flex" gridColumn={{ base: "1/2", md: "3/4" }} gridRow={{ base: "3/4", md: "2/3" }} alignItems="center" justifyContent="center">
                      <UpdateTrackModal track={track} onUpdate={handleUpdateTrack} />
                      <Tooltip label="Delete" fontSize="md">
                        <IconButton
                          icon={<FaTrash />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteTrack(track.id)}
                          aria-label={`Delete ${track.track_name}`}
                        />
                      </Tooltip>
                    </Box>
                    <Box justifySelf="flex-end" alignSelf="center" gridColumn={{ base: "3/4", md: "3/4" }} gridRow={{ base: "1/2", md: "2/3" }}>

                      <AccordionIcon />
                    </Box>
                  </Grid>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} color="primary.100">
                <Flex
                  direction="column"
                >
                  <Text>Shares Available : {track.available_shares}</Text>
                  <Text>Price Per Share : ${track.price_per_share}</Text>

                </Flex>

              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>


      {isPaymentModalOpen && (


        <Elements stripe={stripePromise}>


          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={() => {setIsPaymentModalOpen(false); setPaymentDone(true);}}
            trackDetails={paymentModalData}
          />
        </Elements>
      )
      }
    </Box>
  );
};

export default ArtistTracks;

