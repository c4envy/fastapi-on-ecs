import React from 'react';
import { Box, Heading, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Box p={5} color="primary.100" textAlign="center"  display="flex" flexDirection="column" alignItems="center">
      <Heading as="h1" size="xl" mb={5} color="dark.900">
        About beatstake
      </Heading>
      <Link to="/">
        <Image
        
          src={`${process.env.PUBLIC_URL}/assets/logo_beatstake/beatstake.gif`}
          w="20%"
          alt="Logo"
          cursor="pointer"
          m="2% auto"
        />
      </Link>
      <Text fontSize={['md', 'lg']} mb={4}>
        beatstake is the Platform Where Fans Become Shareholders in Music they love.
      </Text>
      <Text fontSize={['sm', 'md']}>
        At beatstake, we empower fans to become stakeholders in the music they love, turning passion into ownership and ownership into income. By connecting artists and audiences in unprecedented ways, we pioneer a new era of collaborative music appreciation, ensuring everyone shares in the journey and success of their favorite songs.
      </Text>
    </Box>
  );
}

export default About;
