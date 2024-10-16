import { Box, Container, Heading, Button, Stack, Spinner, Center } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../../services/axios';
import Banner from '../Slider/Banner';
import Trending from './Trending';
import Cardslider from '../Slider/Cardslider';
import MusicCard from '../Spotify/MusicCard';
import ArtistCard from '../Spotify/ArtistCard';

export default function Home() {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [artists, setArtists] = useState([]);


  useEffect(() => {
    if (isMounted.current) return;
    fetchTracks();
    fetchArtists();
    isMounted.current = true;
  }, []);

  useEffect(() => {


      setFilteredTracks(tracks);

  }, [tracks]);

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
    <Container maxW="99%" p={5} overflowX="hidden">
      {/* <Stack direction="row" spacing={{base:10, md:4}} mb={4} overflow="auto" p={2}>
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
        <> */}
          <Banner items={filteredTracks} />

          <Box>
            <Heading size="lg" color="dark.900" p="1rem" borderRadius={3}>
              Trending
            </Heading>
            <Trending />
          </Box>

          <Box>
            <Heading size="lg" color="dark.900" p="1rem" borderRadius={3}>
              Top Music
            </Heading>
            <Cardslider>
              {filteredTracks.map((item, index) => (
                <MusicCard key={index} item={item} len={filteredTracks.length} />
              ))}
            </Cardslider>
          </Box>

          <Box>
            <Heading size="lg" color="dark.900" p="1rem" borderRadius={3}>
              Top Artists
            </Heading>
            <Cardslider>
              {artists.map((item, index) => (
                <ArtistCard key={index} artist={item} />
              ))}
            </Cardslider>
          </Box>
        {/* </>
      )} */}
    </Container>
  );
}
