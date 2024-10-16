import { Box, Container, Heading, Button, Stack, Spinner, Center, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../services/axios';
import Cardslider from '../Slider/Cardslider';
import MusicCard from '../Spotify/MusicCard';
import ArtistCard from '../Spotify/ArtistCard';
import BrowseCard from './BrowseCard';
import { useCart } from '../../context/CartContext';

export default function Browse() {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isFiltering, setIsFiltering] = useState(false); // New state for filtering

  const genres = [
    'All', 'Afrobeat', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 
    'Electronic', 'Reggae', 'R&B', 'Country', 'Classical'
  ];

  const { addToCart } = useCart();

  useEffect(() => {
    if (isMounted.current) return;
    fetchTracks();
    fetchArtists();
    isMounted.current = true;
  }, []);

  useEffect(() => {
    setIsFiltering(true); // Start filtering
    if (selectedGenre === 'All') {
      setFilteredTracks(tracks);
    } else {
      setFilteredTracks(tracks.filter(track => track.genres.includes(selectedGenre)));
    }
    setIsFiltering(false); // End filtering
  }, [selectedGenre, tracks]);

  const fetchArtists = () => {
    setLoading(true);
    axiosInstance
      .get('/users/top/artists')
      .then((res) => {
        setArtists(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTracks = () => {
    setLoading(true);
    axiosInstance
      .post('/music/search_for_track', {
        track_status: 'reviewing',
      })
      .then((res) => {
        setTracks(res.data);
        setFilteredTracks(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container  minW="100%">
      <Stack direction="row" spacing={{base:10, md:4}} mb={4} overflow="auto" p={2}>
        {genres.map((genre, index) => (
          <Button
            key={index}
            color={selectedGenre === genre ? 'dark.100' : 'primary.900'}
            bg={selectedGenre === genre ? 'dark.900' : 'dark.100'}
            _hover={{color: selectedGenre === genre ? 'dark.100' : 'dark.100', bg: selectedGenre === genre ? 'dark.900' : 'dark.900'}}
        
            onClick={() => setSelectedGenre(genre)}
            minW="max-content"
          >
            {genre}
          </Button>
        ))}
      </Stack>

      {isFiltering ? (
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <Box>
            <Heading size="lg" color="dark.900" my={4} borderRadius={3}>
              Browse Music
            </Heading>
    
            <SimpleGrid gridAutoColumns={{base:"minmax(100%, 1fr)", md:"minmax(50%, 1fr)", lg:"minmax(25%, 1fr)"  }} scrollSnapType="x mandatory"  gridAutoFlow="column" overflowX="auto" whiteSpace="nowrap" overflowY="hidden" templateColumns={{base:'repeat(auto-fill, minmax(100%, 1fr))', md:'repeat(auto-fill, minmax(50%, 1fr))', lg:'repeat(auto-fill, minmax(25%, 1fr))'}} templateRows={{base:"2fr", lg:"2fr 2fr"}}>
              {filteredTracks.map((item, index) => (
                <BrowseCard key={index} title={item.track_name} description={"$" + item.price_per_share} imageSrc={item.image_url} btnText="Add to Cart"  len={filteredTracks.length} url={`/track/${item.track_id}`} handleClick={() => addToCart(item)} />
              ))}
            </SimpleGrid>
           
          </Box>

          <Box>
            <Heading size="lg" color="dark.900" my={4} borderRadius={3}>
             Brwose Artists
            </Heading>
           
            <SimpleGrid gridAutoColumns={{base:"minmax(100%, 1fr)", md:"minmax(50%, 1fr)", lg:"minmax(25%, 1fr)"  }} scrollSnapType="x mandatory"  gridAutoFlow="column" overflowX="auto" whiteSpace="nowrap" overflowY="hidden" templateColumns={{base:'repeat(auto-fill, minmax(100%, 1fr))', md:'repeat(auto-fill, minmax(50%, 1fr))', lg:'repeat(auto-fill, minmax(25%, 1fr))'}} templateRows={{base:"2fr", lg:"2fr 2fr"}}>
              {artists.map((item, index) => (
                <BrowseCard key={index} title={item.account.profile.artist_name} description={""} imageSrc={item.account.profile.image_url} btnText="profile" />
              ))}
            </SimpleGrid>
          </Box>
        </>
      )}
    </Container>
  );
}
