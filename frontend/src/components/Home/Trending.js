import React, { useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';

const Trending = () => {
    const [toggler, setToggler] = useState(false);

    return (
        <Box py={5} borderRadius={3} m={4}>
            <Flex justifyContent="left" my={2}>
                <Button
                    bg={!toggler ? "dark.900" : "dark.500"}
                    color={!toggler ? "dark.500" : "dark.900"}
                    variant="glassy"
                    onClick={() => setToggler(false)}
                    w={{base:"50%", lg:"8rem"}}
             
                    
                >
                    Top Tracks
                </Button>
                <Button
                    bg={!toggler ? "dark.500" : "dark.900"}
                    color={!toggler ? "dark.900" : "dark.500"}
                    variant="glassy"
                    onClick={() => setToggler(true)}
                    w={{base:"50%", lg:"8rem"}}
                    
                   
                >
                    Top Artists
                </Button>
            </Flex>
            {toggler ? <TopArtists toggler/> : <TopTracks toggler/>}
        </Box>
    );
};

export default Trending;
