import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Image, Text, VStack } from '@chakra-ui/react';

const ArtistPage = ({ users }) => {
  const { userId } = useParams();
  const user = users.find(user => user.user_id === userId);

  if (!user) {
    return <div>User not found!</div>;
  }

  const { artist_profile } = user;

  return (
    <Box p={4}>
      <VStack spacing={4} align="center">
        <Image src={artist_profile.image} alt={artist_profile.artist_name} boxSize="300px" />
        <Text fontSize="xl">{artist_profile.artist_name}</Text>
        <Text fontSize="md">Genres: {artist_profile.genres.join(', ')}</Text>
        {artist_profile.artist_id.map(platform => (
          <Text key={platform.id} fontSize="md">{`${platform.platform}: ${platform.id}`}</Text>
        ))}
      </VStack>
    </Box>
  );
};

export default ArtistPage;
